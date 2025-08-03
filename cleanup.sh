#!/bin/bash

echo "🧹 Cleaning up Wellness Platform project..."

# Remove any unwanted files and directories
echo "📁 Removing unwanted files..."

# Remove any duplicate or nested directories
find . -name "well-intern" -type d -not -path "./.git/*" -exec rm -rf {} + 2>/dev/null || true
find . -name "deps_temp_*" -type d -exec rm -rf {} + 2>/dev/null || true

# Remove any .vite cache directories outside of node_modules
find . -name ".vite" -type d -not -path "./*/node_modules/*" -exec rm -rf {} + 2>/dev/null || true

# Remove any temp or cache files
find . -name "*.log" -not -path "./*/node_modules/*" -delete 2>/dev/null || true
find . -name ".DS_Store" -delete 2>/dev/null || true
find . -name "Thumbs.db" -delete 2>/dev/null || true

# Clean up any duplicate package files
find . -name "package-lock.json" -not -path "./backend/*" -not -path "./frontend/*" -delete 2>/dev/null || true

echo "✅ Cleanup completed!"

# Show final structure
echo ""
echo "📊 Final Project Structure:"
echo "=================================="

# Show directory structure excluding node_modules and .git
find . -type d \( -name node_modules -o -name .git \) -prune -o -type f -print | head -30

echo ""
echo "🎯 Project is ready for development and deployment!"
