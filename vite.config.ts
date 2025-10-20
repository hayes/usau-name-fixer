import { defineConfig } from 'vite';
import webExtension from 'vite-plugin-web-extension';
import { copyFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    webExtension({
      manifest: './src/manifest.json',
      watchFilePaths: ['src/**/*'],
      disableAutoLaunch: false,
    }),
    {
      name: 'copy-icons',
      buildStart() {
        const iconsDir = resolve(__dirname, 'dist/src/icons');
        mkdirSync(iconsDir, { recursive: true });
        ['icon16.png', 'icon48.png', 'icon128.png'].forEach(icon => {
          copyFileSync(
            resolve(__dirname, `src/icons/${icon}`),
            resolve(__dirname, `dist/src/icons/${icon}`)
          );
        });
      },
    },
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
