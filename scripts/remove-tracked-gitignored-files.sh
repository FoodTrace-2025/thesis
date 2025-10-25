#!/bin/bash

# =============================================================================
# FoodTrace - Remove Tracked Gitignored Files
# =============================================================================
# Purpose: Safely remove files from git tracking that should be gitignored
# Usage: ./scripts/remove-tracked-gitignored-files.sh
# WARNING: This modifies git index. Review changes before committing!
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "========================================"
echo "🧹 Git Cache Cleanup Script"
echo "========================================"
echo ""
echo -e "${YELLOW}⚠️  WARNING: This will modify your git index${NC}"
echo "This script will remove files from git tracking (but keep local copies)"
echo ""

# Confirm before proceeding
read -p "Do you want to continue? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 0
fi

echo ""
echo "Starting cleanup..."
echo ""

# =============================================================================
# Function to safely remove from git cache
# =============================================================================
safe_remove() {
    local pattern=$1
    local description=$2

    echo -e "${BLUE}Checking: $description${NC}"

    # Find files matching pattern
    files=$(git ls-files | grep -E "$pattern" || true)

    if [ -n "$files" ]; then
        echo -e "${YELLOW}Found files to remove from tracking:${NC}"
        echo "$files"
        echo ""

        # Remove from git cache (keeps local copy)
        echo "$files" | xargs git rm --cached

        echo -e "${GREEN}✅ Removed from git tracking (local files preserved)${NC}"
        echo ""
    else
        echo -e "${GREEN}✅ No files found matching pattern${NC}"
        echo ""
    fi
}

# =============================================================================
# Remove environment files
# =============================================================================
safe_remove "\.env$|\.env\.local$|\.env\..*\.local$" "Environment files (.env*)"

# =============================================================================
# Remove node_modules
# =============================================================================
safe_remove "node_modules/" "Node modules"

# =============================================================================
# Remove build artifacts
# =============================================================================
safe_remove "\.next/|out/|build/|dist/" "Next.js build output"
safe_remove "artifacts/|cache/" "Hardhat artifacts"

# =============================================================================
# Remove IDE/OS files
# =============================================================================
safe_remove "\.vscode/|\.idea/" "IDE settings"
safe_remove "\.DS_Store$|Thumbs\.db$" "OS-specific files"

# =============================================================================
# Remove log files
# =============================================================================
safe_remove "\.log$|npm-debug\.log|yarn-.*\.log" "Log files"

# =============================================================================
# Remove TypeScript build info
# =============================================================================
safe_remove "\.tsbuildinfo$|next-env\.d\.ts$" "TypeScript build files"

# =============================================================================
# Remove test coverage
# =============================================================================
safe_remove "coverage/|\.nyc_output/" "Test coverage"

# =============================================================================
# Remove Vercel deployment
# =============================================================================
safe_remove "\.vercel/" "Vercel deployment files"

# =============================================================================
# Summary
# =============================================================================
echo "========================================"
echo "📊 CLEANUP COMPLETE"
echo "========================================"
echo ""
echo -e "${GREEN}✅ Files removed from git tracking${NC}"
echo -e "${BLUE}ℹ️  Local files were preserved${NC}"
echo ""
echo "Next steps:"
echo "1. Review changes: git status"
echo "2. Verify .gitignore is working: git add ."
echo "3. Commit the cleanup: git commit -m \"chore: remove tracked gitignored files from cache\""
echo "4. Push changes: git push origin main"
echo ""
echo -e "${YELLOW}⚠️  Note: This creates a new commit removing files from tracking.${NC}"
echo -e "${YELLOW}   Files are still in git history. For complete removal, use BFG.${NC}"
echo ""
