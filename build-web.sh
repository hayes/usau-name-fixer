#!/bin/bash
set -e

# Clean public directory
rm -rf public
mkdir -p public

# Create extension ZIP from dist (only the extension files)
cd dist
zip -r ../extension.zip manifest.json src/ -x '*.DS_Store'
cd ..

# Move ZIP to public
mv extension.zip public/

# Copy website files to public
cp index.html public/
cp -r screenshots public/screenshots

echo "Build complete!"
echo "public/ directory:"
ls -lh public/
