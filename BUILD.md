# Build Instructions for USAU Team Name Fixer Extension

This document provides step-by-step instructions to build the extension from source code.

## Requirements

### Operating System
- macOS, Linux, or Windows with WSL2
- Tested on macOS 14.6 (Sonoma)

### Required Software

1. **Node.js**: Version 20.x or later
   - Download: https://nodejs.org/
   - Verify: `node --version` should show v20.0.0 or higher

2. **pnpm**: Version 9.x or later
   - Install: `npm install -g pnpm`
   - Verify: `pnpm --version` should show 9.0.0 or higher

3. **TypeScript**: Installed automatically via pnpm
   - Version: 5.4.5 (specified in package.json)

4. **Vite**: Installed automatically via pnpm
   - Version: 5.2.10 (specified in package.json)

## Build Process

### Step 1: Install Dependencies

```bash
pnpm install
```

This will install all required dependencies:
- TypeScript compiler (tsc)
- Vite build tool
- vite-plugin-web-extension
- Type definitions for Chrome APIs

### Step 2: Build the Extension

```bash
pnpm build
```

This command executes the following steps:
1. Cleans the `dist/` directory
2. Compiles TypeScript (`src/content.ts`) to JavaScript
3. Runs Vite build to bundle and optimize the extension
4. Creates browser-specific packages (Chrome and Firefox)

### Step 3: Locate Build Outputs

After successful build, you will find:

- `public/extension-chrome.zip` - Chrome extension package
- `public/extension-firefox.zip` - Firefox extension package
- `public/index.html` - Landing page
- `public/screenshots/` - Marketing screenshots

The Firefox extension specifically includes:
- `manifest.json` with Firefox-specific `browser_specific_settings`
- Compiled JavaScript (no source maps in production)
- CSS styles
- Icons
- CHANGELOG.md

## Build Script Breakdown

The build process is controlled by `package.json` scripts:

### Main Build Script
```json
"build": "rm -rf dist/* && tsc && vite build && pnpm build:web"
```

This executes:
1. **Clean**: `rm -rf dist/*` - Removes previous build artifacts
2. **Compile**: `tsc` - TypeScript compilation (uses tsconfig.json)
3. **Bundle**: `vite build` - Vite bundling (uses vite.config.ts)
4. **Package**: `pnpm build:web` - Creates browser-specific ZIPs

### Web Build Script
The `build:web` script (`bash build-web.sh`) creates:
- Chrome ZIP with standard manifest
- Firefox ZIP with Firefox-specific manifest and CHANGELOG

## Development Mode

To run the extension in development mode with hot reloading:

```bash
pnpm dev
```

This starts:
- Vite dev server on http://localhost:5173/
- File watcher for automatic recompilation
- Browser with extension loaded (Chrome/Firefox)

## Verifying the Build

### Check File Integrity

Chrome extension:
```bash
unzip -l public/extension-chrome.zip
```

Firefox extension:
```bash
unzip -l public/extension-firefox.zip
```

Both should contain:
- `manifest.json`
- `src/content.js` (compiled from TypeScript)
- `src/styles.css`
- `src/icons/` (icon16.png, icon48.png, icon128.png)
- `CHANGELOG.md` (Firefox only)

### Verify No Source Maps

Production builds should NOT include source maps:
```bash
unzip -l public/extension-firefox.zip | grep -i "map"
```
(Should return no results)

### Check Manifest Version

```bash
unzip -p public/extension-firefox.zip manifest.json | grep version
```
Should show: `"version": "1.0.1"`

## Build Configuration Files

### tsconfig.json
TypeScript compiler configuration:
- Target: ES2020
- Module: ESNext
- Strict type checking enabled
- Output directory: dist/

### vite.config.ts
Vite bundler configuration:
- Plugin: vite-plugin-web-extension
- Manifest source: src/manifest.json
- Output directory: dist/
- Production: minified, no source maps

### build-web.sh
Shell script that:
1. Creates Chrome ZIP from dist/
2. Creates Firefox-specific dist with Firefox manifest
3. Packages both versions with CHANGELOG
4. Moves ZIPs to public/

## Troubleshooting

### Issue: `pnpm: command not found`
**Solution**: Install pnpm globally: `npm install -g pnpm`

### Issue: TypeScript compilation errors
**Solution**: Ensure TypeScript is installed: `pnpm install typescript`

### Issue: Vite build fails
**Solution**: Clear node_modules and reinstall:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: Icons not copied
**Solution**: Icons are automatically copied by vite.config.ts plugin during build

## Clean Build

For a completely clean build from scratch:

```bash
rm -rf node_modules pnpm-lock.yaml dist/ public/
pnpm install
pnpm build
```

## File Sizes

Expected output sizes:
- extension-chrome.zip: ~31 KB
- extension-firefox.zip: ~31 KB

## Security Notes

- No `innerHTML` used in production code
- All user content sanitized via `textContent`
- Zero external permissions required
- No data collection

## Contact

For build issues, please file an issue at:
https://github.com/hayes/usau-name-fixer/issues
