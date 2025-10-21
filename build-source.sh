#!/bin/bash
set -e

# Build source code package for Firefox Add-ons submission
# This creates a ZIP of all source files needed to reproduce the build

echo "Creating source code package for Firefox Add-ons submission..."

# Create temporary directory for source package
TEMP_DIR=$(mktemp -d)
SOURCE_DIR="$TEMP_DIR/usau-name-fixer-source"
mkdir -p "$SOURCE_DIR"

# Copy source files (TypeScript, not compiled JS)
echo "Copying source files..."
mkdir -p "$SOURCE_DIR/src"
cp src/*.ts "$SOURCE_DIR/src/" 2>/dev/null || true
cp src/*.md "$SOURCE_DIR/src/" 2>/dev/null || true
cp src/manifest.json "$SOURCE_DIR/src/"
cp src/manifest-firefox.json "$SOURCE_DIR/src/"
cp src/styles.css "$SOURCE_DIR/src/"
cp -r src/icons "$SOURCE_DIR/src/"

# Copy build configuration
cp package.json "$SOURCE_DIR/"
cp pnpm-lock.yaml "$SOURCE_DIR/"
cp tsconfig.json "$SOURCE_DIR/"
cp vite.config.ts "$SOURCE_DIR/"
cp build-web.sh "$SOURCE_DIR/"
cp build-source.sh "$SOURCE_DIR/"

# Copy documentation
cp BUILD.md "$SOURCE_DIR/"
cp README.md "$SOURCE_DIR/"
cp .gitignore "$SOURCE_DIR/" 2>/dev/null || true

# Copy screenshots (for reference, not needed for build)
mkdir -p "$SOURCE_DIR/screenshots"
cp screenshots/*.png "$SOURCE_DIR/screenshots/" 2>/dev/null || true
cp screenshots/*.jpg "$SOURCE_DIR/screenshots/" 2>/dev/null || true

# Create source ZIP
cd "$TEMP_DIR"
zip -r usau-name-fixer-source.zip usau-name-fixer-source/ -x "*.DS_Store"

# Move to public directory
mkdir -p "$OLDPWD/public"
mv usau-name-fixer-source.zip "$OLDPWD/public/"

# Cleanup
cd "$OLDPWD"
rm -rf "$TEMP_DIR"

echo "Source package created: public/usau-name-fixer-source.zip"
echo ""
echo "Package size:"
ls -lh public/usau-name-fixer-source.zip
echo ""
echo "Package contents:"
unzip -l public/usau-name-fixer-source.zip | grep -E "(\.ts|\.json|\.md|\.sh|\.yaml|\.css)$" | tail -20
