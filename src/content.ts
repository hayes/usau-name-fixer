import type { UrbanDictionaryResult, UrbanDictionaryResponse } from './types';

// Cache for Urban Dictionary results
const udCache = new Map<string, UrbanDictionaryResult | null>();

// How many definitions to fetch
const DEFINITION_LIMIT = 20;

// Find and replace "Rhino" with "Rhino Slam!" for Portland's team
function restoreRhinoSlam(): void {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null
  );

  const nodesToReplace: Text[] = [];
  let node: Node | null;

  while ((node = walker.nextNode())) {
    if (node.nodeValue && /\bRhino\s*(\(\d+\))?(?!\s*Slam!)/.test(node.nodeValue)) {
      nodesToReplace.push(node as Text);
    }
  }

  nodesToReplace.forEach((node) => {
    if (!node.nodeValue) return;

    // Replace "Rhino" or "Rhino (seed)" with "Rhino Slam!" or "Rhino Slam! (seed)"
    // but only if not already followed by "Slam!"
    node.nodeValue = node.nodeValue.replace(/\bRhino\s*(\(\d+\))?(?!\s*Slam!)/g, (_match, seed) => {
      return seed ? `Rhino Slam! ${seed}` : 'Rhino Slam!';
    });
  });
}

// Fetch Urban Dictionary definition
async function fetchUrbanDictionary(term: string): Promise<UrbanDictionaryResult | null> {
  if (udCache.has(term)) {
    return udCache.get(term) ?? null;
  }

  try {
    const response = await fetch(
      `https://unofficialurbandictionaryapi.com/api/search?term=${encodeURIComponent(term)}&limit=${DEFINITION_LIMIT}`
    );
    const data: UrbanDictionaryResponse = await response.json();

    if (data && data.found && data.data && data.data.length > 0) {
      const result: UrbanDictionaryResult = {
        term: data.term,
        definitions: data.data.map(item => ({
          definition: item.meaning,
          example: item.example,
          author: item.contributor,
        })),
      };
      udCache.set(term, result);
      return result;
    }
  } catch (error) {
    console.error('Error fetching Urban Dictionary:', error);
  }

  udCache.set(term, null);
  return null;
}

// Create hover card element
function createHoverCard(data: UrbanDictionaryResult): HTMLDivElement {
  const card = document.createElement('div');
  card.className = 'ud-hover-card';

  let currentIndex = 0;

  // Clean up the definition and example (remove [brackets])
  const cleanText = (text: string): string => text.replace(/\[([^\]]+)\]/g, '$1');

  const renderDefinition = () => {
    const def = data.definitions[currentIndex];
    if (!def) return; // Safety check

    const definitionContainer = card.querySelector('.ud-definition-container');
    if (!definitionContainer) return;

    // Clear existing content
    while (definitionContainer.firstChild) {
      definitionContainer.removeChild(definitionContainer.firstChild);
    }

    // Create definition element
    const definitionDiv = document.createElement('div');
    definitionDiv.className = 'ud-definition';
    definitionDiv.textContent = cleanText(def.definition || '');
    definitionContainer.appendChild(definitionDiv);

    // Add example if exists
    if (def.example) {
      const exampleDiv = document.createElement('div');
      exampleDiv.className = 'ud-example';
      const em = document.createElement('em');
      em.textContent = 'Example: ';
      exampleDiv.appendChild(em);
      exampleDiv.appendChild(document.createTextNode(cleanText(def.example)));
      definitionContainer.appendChild(exampleDiv);
    }

    // Add author
    const authorDiv = document.createElement('div');
    authorDiv.className = 'ud-author';
    authorDiv.textContent = `by ${def.author || 'Unknown'}`;
    definitionContainer.appendChild(authorDiv);
  };

  // Create header
  const header = document.createElement('div');
  header.className = 'ud-header';

  const headerLeft = document.createElement('div');
  headerLeft.className = 'ud-header-left';

  const strong = document.createElement('strong');
  strong.textContent = 'Urban Dictionary';
  headerLeft.appendChild(strong);

  const termSpan = document.createElement('span');
  termSpan.className = 'ud-term';
  termSpan.textContent = data.term;
  headerLeft.appendChild(termSpan);

  header.appendChild(headerLeft);

  // Add pagination if multiple definitions
  if (data.definitions.length > 1) {
    const pagination = document.createElement('div');
    pagination.className = 'ud-pagination';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'ud-prev';
    prevBtn.textContent = '←';
    prevBtn.disabled = true;
    pagination.appendChild(prevBtn);

    const pageInfo = document.createElement('span');
    pageInfo.className = 'ud-page-info';
    pageInfo.textContent = `1 / ${data.definitions.length}`;
    pagination.appendChild(pageInfo);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'ud-next';
    nextBtn.textContent = '→';
    pagination.appendChild(nextBtn);

    header.appendChild(pagination);
  }

  card.appendChild(header);

  // Create definition container
  const definitionContainer = document.createElement('div');
  definitionContainer.className = 'ud-definition-container';
  card.appendChild(definitionContainer);

  renderDefinition();

  if (data.definitions.length > 1) {
    const prevBtn = card.querySelector('.ud-prev') as HTMLButtonElement;
    const nextBtn = card.querySelector('.ud-next') as HTMLButtonElement;
    const pageInfo = card.querySelector('.ud-page-info') as HTMLSpanElement;

    const updateButtons = () => {
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === data.definitions.length - 1;
      pageInfo.textContent = `${currentIndex + 1} / ${data.definitions.length}`;
    };

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        renderDefinition();
        updateButtons();
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentIndex < data.definitions.length - 1) {
        currentIndex++;
        renderDefinition();
        updateButtons();
      }
    });
  }

  return card;
}

// Global variable to track the currently active hover card
let activeHoverCard: HTMLDivElement | null = null;

// Add hover functionality to team names
function addHoverCards(): void {
  // Find all team name elements
  const selectors = [
    '.team_name a',
    '.team_name',
    '.profile_area h4',
    '.game_team a',
    '.game_team',
    'a[href*="EventTeamId"]',
  ];

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      if (!(el instanceof HTMLElement)) return;

      // Skip if already processed
      if (el.dataset.udProcessed) return;

      el.dataset.udProcessed = 'true';
      el.style.cursor = 'help';

      let hoverCard: HTMLDivElement | null = null;
      let hoverTimeout: number | null = null;

      el.addEventListener('mouseenter', async () => {
        // Clear any existing timeout
        if (hoverTimeout !== null) {
          clearTimeout(hoverTimeout);
        }

        hoverTimeout = window.setTimeout(async () => {
          let teamName = el.textContent?.trim();
          if (!teamName) return;

          // Remove seed/rank numbers in parentheses (e.g., "Revolver (1)" -> "Revolver")
          teamName = teamName.replace(/\s*\(\d+\)\s*$/, '').trim();

          const data = await fetchUrbanDictionary(teamName);
          if (!data) return;

          // Remove any existing active hover card
          if (activeHoverCard) {
            activeHoverCard.remove();
            activeHoverCard = null;
          }

          hoverCard = createHoverCard(data);
          activeHoverCard = hoverCard;

          // Add mouseleave listener to card itself
          hoverCard.addEventListener('mouseleave', () => {
            removeCard();
          });

          document.body.appendChild(hoverCard);

          // Position the card
          const rect = el.getBoundingClientRect();
          hoverCard.style.top = `${rect.bottom + window.scrollY + 5}px`;
          hoverCard.style.left = `${rect.left + window.scrollX}px`;

          // Ensure card stays on screen
          setTimeout(() => {
            if (!hoverCard) return;
            const cardRect = hoverCard.getBoundingClientRect();
            if (cardRect.right > window.innerWidth) {
              hoverCard.style.left = `${window.innerWidth - cardRect.width - 10}px`;
            }
            if (cardRect.bottom > window.innerHeight) {
              hoverCard.style.top = `${rect.top + window.scrollY - cardRect.height - 5}px`;
            }
          }, 10);
        }, 300); // 300ms delay before showing
      });

      const removeCard = () => {
        if (hoverTimeout !== null) {
          clearTimeout(hoverTimeout);
          hoverTimeout = null;
        }
        if (hoverCard) {
          hoverCard.remove();
          if (activeHoverCard === hoverCard) {
            activeHoverCard = null;
          }
          hoverCard = null;
        }
      };

      el.addEventListener('mouseleave', (e) => {
        // Check if mouse is moving to the hover card
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (relatedTarget && hoverCard && hoverCard.contains(relatedTarget)) {
          return; // Don't remove if moving to card
        }

        // Delay removal to allow moving to card
        setTimeout(() => {
          if (hoverCard && !hoverCard.matches(':hover')) {
            removeCard();
          }
        }, 100);
      });
    });
  });
}

// Main initialization
function init(): void {
  restoreRhinoSlam();
  addHoverCards();
}

// Run on page load
init();

// Watch for dynamic content changes
const observer = new MutationObserver((mutations) => {
  let shouldUpdate = false;

  for (const mutation of mutations) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      shouldUpdate = true;
      break;
    }
  }

  if (shouldUpdate) {
    restoreRhinoSlam();
    addHoverCards();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
