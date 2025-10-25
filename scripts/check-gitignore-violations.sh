#!/bin/bash

# =============================================================================
# FoodTrace - Gitignore Violations Checker
# =============================================================================
# Purpose: Detect files that are tracked by git but should be gitignored
# Usage: ./scripts/check-gitignore-violations.sh
# =============================================================================

set -e

echo "========================================"
echo "🔍 Gitignore Violations Checker"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
violations=0

echo "Checking for tracked files that should be gitignored..."
echo ""

# =============================================================================
# Check for environment files
# =============================================================================
echo "📝 Checking environment files..."
env_files=$(git ls-files | grep -E "\.env$|\.env\.local$|\.env\.development\.local$|\.env\.test\.local$|\.env\.production\.local$" || true)

if [ -n "$env_files" ]; then
    echo -e "${RED}❌ CRITICAL: Environment files are tracked!${NC}"
    echo "$env_files"
    violations=$((violations + 1))
else
    echo -e "${GREEN}✅ No environment files tracked${NC}"
fi
echo ""

# =============================================================================
# Check for node_modules
# =============================================================================
echo "📦 Checking node_modules..."
node_modules=$(git ls-files | grep "node_modules/" || true)

if [ -n "$node_modules" ]; then
    echo -e "${RED}❌ WARNING: node_modules is tracked!${NC}"
    echo "First 10 files:"
    echo "$node_modules" | head -10
    violations=$((violations + 1))
else
    echo -e "${GREEN}✅ node_modules not tracked${NC}"
fi
echo ""

# =============================================================================
# Check for build artifacts
# =============================================================================
echo "🏗️ Checking build artifacts..."
build_artifacts=$(git ls-files | grep -E "\.next/|out/|build/|dist/|artifacts/|cache/" || true)

if [ -n "$build_artifacts" ]; then
    echo -e "${YELLOW}⚠️  WARNING: Build artifacts are tracked!${NC}"
    echo "$build_artifacts"
    violations=$((violations + 1))
else
    echo -e "${GREEN}✅ No build artifacts tracked${NC}"
fi
echo ""

# =============================================================================
# Check for IDE/OS files
# =============================================================================
echo "💻 Checking IDE/OS specific files..."
ide_files=$(git ls-files | grep -E "\.vscode/|\.idea/|\.DS_Store$|Thumbs\.db$|\.eslintcache$" || true)

if [ -n "$ide_files" ]; then
    echo -e "${YELLOW}⚠️  WARNING: IDE/OS files are tracked!${NC}"
    echo "$ide_files"
    violations=$((violations + 1))
else
    echo -e "${GREEN}✅ No IDE/OS files tracked${NC}"
fi
echo ""

# =============================================================================
# Check for log files
# =============================================================================
echo "📄 Checking log files..."
log_files=$(git ls-files | grep -E "\.log$|npm-debug\.log|yarn-debug\.log|yarn-error\.log" || true)

if [ -n "$log_files" ]; then
    echo -e "${YELLOW}⚠️  WARNING: Log files are tracked!${NC}"
    echo "$log_files"
    violations=$((violations + 1))
else
    echo -e "${GREEN}✅ No log files tracked${NC}"
fi
echo ""

# =============================================================================
# Check for TypeScript build info
# =============================================================================
echo "📘 Checking TypeScript build info..."
ts_build=$(git ls-files | grep -E "\.tsbuildinfo$|next-env\.d\.ts$" || true)

if [ -n "$ts_build" ]; then
    echo -e "${YELLOW}⚠️  WARNING: TypeScript build files are tracked!${NC}"
    echo "$ts_build"
    violations=$((violations + 1))
else
    echo -e "${GREEN}✅ No TypeScript build files tracked${NC}"
fi
echo ""

# =============================================================================
# Check for test coverage
# =============================================================================
echo "🧪 Checking test coverage files..."
coverage=$(git ls-files | grep -E "coverage/|\.nyc_output/|\.lcov$" || true)

if [ -n "$coverage" ]; then
    echo -e "${YELLOW}⚠️  WARNING: Test coverage files are tracked!${NC}"
    echo "$coverage"
    violations=$((violations + 1))
else
    echo -e "${GREEN}✅ No coverage files tracked${NC}"
fi
echo ""

# =============================================================================
# Check for Vercel deployment
# =============================================================================
echo "🚀 Checking Vercel deployment files..."
vercel=$(git ls-files | grep -E "\.vercel/" || true)

if [ -n "$vercel" ]; then
    echo -e "${YELLOW}⚠️  WARNING: Vercel deployment files are tracked!${NC}"
    echo "$vercel"
    violations=$((violations + 1))
else
    echo -e "${GREEN}✅ No Vercel files tracked${NC}"
fi
echo ""

# =============================================================================
# Summary
# =============================================================================
echo "========================================"
echo "📊 SUMMARY"
echo "========================================"
echo "Total tracked files: $(git ls-files | wc -l)"
echo "Repository size: $(du -sh .git | cut -f1)"
echo "Violations found: $violations"
echo ""

if [ $violations -eq 0 ]; then
    echo -e "${GREEN}✅ All clear! No gitignore violations detected.${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Found $violations category(s) with gitignore violations!${NC}"
    echo ""
    echo "To fix, see: scripts/remove-tracked-gitignored-files.sh"
    echo ""
    exit 1
fi
