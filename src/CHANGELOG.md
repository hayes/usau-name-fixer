# Changelog

All notable changes to the USAU Team Name Fixer extension will be documented in this file.

## [1.0.1] - 2025-10-20

### Fixed
- **Firefox Compatibility**: Fixed `data_collection_permissions` format to use correct array syntax `["none"]`
- **Security**: Removed all `innerHTML` usage, replaced with safe DOM manipulation methods
- **Firefox Manifest**: Added proper `browser_specific_settings.gecko` configuration

## [1.0.0] - 2025-10-20

### Added
- **Name Restoration**: Automatically reverts "Rhino" back to "Rhino Slam!" throughout the USA Ultimate website (play.usaultimate.org)
- **Urban Dictionary Hover Cards**: Hover over any team name to see Urban Dictionary definitions
- **Pagination**: Navigate through up to 20 definitions per team name with arrow buttons
- **Cross-Browser Support**: Works on both Chrome and Firefox
- **Dynamic Content Support**: Uses MutationObserver to handle dynamically loaded content
- **Caching**: API responses are cached to minimize requests and improve performance
- **Persistent Hover Cards**: Hover cards remain visible when moving cursor onto them

### Features
- Zero permissions required (no host_permissions, no storage permissions)
- Clean, modern hover card UI with scrolling for long definitions
- Removes seed/rank numbers from team names before lookup
- Works with all team name selectors on the site
- Security-focused: Uses safe DOM manipulation instead of innerHTML

### Technical
- Built with TypeScript and Vite
- Manifest V3 for both Chrome and Firefox
- Firefox-specific: Includes browser_specific_settings with extension ID
- No data collection permissions
- Content scripts only (no background service worker)

### Browser Compatibility
- Chrome: Manifest V3 (Chrome 88+)
- Firefox: Manifest V3 (Firefox 109+)
