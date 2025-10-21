#!/bin/bash
set -e

# Clean public directory
rm -rf public
mkdir -p public

# Create Chrome extension ZIP from dist
cd dist
zip -r ../extension-chrome.zip manifest.json src/ -x '*.DS_Store'
cd ..

# Create Firefox extension ZIP with Firefox manifest
mkdir -p dist-firefox
cp -r dist/* dist-firefox/
cp src/manifest-firefox.json dist-firefox/manifest.json
cp src/CHANGELOG.md dist-firefox/
cd dist-firefox
zip -r ../extension-firefox.zip manifest.json src/ CHANGELOG.md -x '*.DS_Store'
cd ..

# Also add CHANGELOG to Chrome version
cd dist
cp ../src/CHANGELOG.md .
zip -r ../extension-chrome.zip CHANGELOG.md
cd ..
rm -rf dist-firefox

# Move ZIPs to public
mv extension-chrome.zip public/
mv extension-firefox.zip public/

# Copy website files to public
cp index.html public/
cp -r screenshots public/screenshots

echo "Build complete!"
echo "public/ directory:"
ls -lh public/
