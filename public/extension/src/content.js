(function(){"use strict";const c=new Map,p=20;function f(){const n=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),i=[];let e;for(;e=n.nextNode();)e.nodeValue&&/\bRhino\s*(\(\d+\))?(?!\s*Slam!)/.test(e.nodeValue)&&i.push(e);i.forEach(t=>{t.nodeValue&&(t.nodeValue=t.nodeValue.replace(/\bRhino\s*(\(\d+\))?(?!\s*Slam!)/g,(r,o)=>o?`Rhino Slam! ${o}`:"Rhino Slam!"))})}async function v(n){if(c.has(n))return c.get(n)??null;try{const e=await(await fetch(`https://unofficialurbandictionaryapi.com/api/search?term=${encodeURIComponent(n)}&limit=${p}`)).json();if(e&&e.found&&e.data&&e.data.length>0){const t={term:e.term,definitions:e.data.map(r=>({definition:r.meaning,example:r.example,author:r.contributor}))};return c.set(n,t),t}}catch(i){console.error("Error fetching Urban Dictionary:",i)}return c.set(n,null),null}function g(n){const i=document.createElement("div");i.className="ud-hover-card";let e=0;const t=o=>o.replace(/\[([^\]]+)\]/g,"$1"),r=()=>{const o=n.definitions[e];if(!o)return;const a=i.querySelector(".ud-definition-container");a&&(a.innerHTML=`
      <div class="ud-definition">${t(o.definition||"")}</div>
      ${o.example?`<div class="ud-example"><em>Example:</em> ${t(o.example)}</div>`:""}
      <div class="ud-author">by ${o.author||"Unknown"}</div>
    `)};if(i.innerHTML=`
    <div class="ud-header">
      <div class="ud-header-left">
        <strong>Urban Dictionary</strong>
        <span class="ud-term">${n.term}</span>
      </div>
      ${n.definitions.length>1?`
        <div class="ud-pagination">
          <button class="ud-prev" disabled>←</button>
          <span class="ud-page-info">1 / ${n.definitions.length}</span>
          <button class="ud-next">→</button>
        </div>
      `:""}
    </div>
    <div class="ud-definition-container"></div>
  `,r(),n.definitions.length>1){const o=i.querySelector(".ud-prev"),a=i.querySelector(".ud-next"),s=i.querySelector(".ud-page-info"),l=()=>{o.disabled=e===0,a.disabled=e===n.definitions.length-1,s.textContent=`${e+1} / ${n.definitions.length}`};o.addEventListener("click",()=>{e>0&&(e--,r(),l())}),a.addEventListener("click",()=>{e<n.definitions.length-1&&(e++,r(),l())})}return i}let d=null;function m(){[".team_name a",".team_name",".profile_area h4",".game_team a",".game_team",'a[href*="EventTeamId"]'].forEach(i=>{document.querySelectorAll(i).forEach(e=>{if(!(e instanceof HTMLElement)||e.dataset.udProcessed)return;e.dataset.udProcessed="true",e.style.cursor="help";let t=null,r=null;e.addEventListener("mouseenter",async()=>{r!==null&&clearTimeout(r),r=window.setTimeout(async()=>{var h;let a=(h=e.textContent)==null?void 0:h.trim();if(!a)return;a=a.replace(/\s*\(\d+\)\s*$/,"").trim();const s=await v(a);if(!s)return;d&&(d.remove(),d=null),t=g(s),d=t,t.addEventListener("mouseleave",()=>{o()}),document.body.appendChild(t);const l=e.getBoundingClientRect();t.style.top=`${l.bottom+window.scrollY+5}px`,t.style.left=`${l.left+window.scrollX}px`,setTimeout(()=>{if(!t)return;const u=t.getBoundingClientRect();u.right>window.innerWidth&&(t.style.left=`${window.innerWidth-u.width-10}px`),u.bottom>window.innerHeight&&(t.style.top=`${l.top+window.scrollY-u.height-5}px`)},10)},300)});const o=()=>{r!==null&&(clearTimeout(r),r=null),t&&(t.remove(),d===t&&(d=null),t=null)};e.addEventListener("mouseleave",a=>{const s=a.relatedTarget;s&&t&&t.contains(s)||setTimeout(()=>{t&&!t.matches(":hover")&&o()},100)})})})}function b(){f(),m()}b(),new MutationObserver(n=>{let i=!1;for(const e of n)if(e.type==="childList"&&e.addedNodes.length>0){i=!0;break}i&&(f(),m())}).observe(document.body,{childList:!0,subtree:!0})})();
