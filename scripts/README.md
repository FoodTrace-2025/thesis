# 🛠️ FoodTrace Utility Scripts

This directory contains maintenance and verification scripts for the FoodTrace thesis project.

---

## 📋 Available Scripts

### 1. `check-gitignore-violations.sh`

**Purpose:** Detect files that are tracked by git but should be gitignored

**Usage:**
```bash
./scripts/check-gitignore-violations.sh
```

**What it checks:**
- ✅ Environment files (.env, .env.local, etc.)
- ✅ Node modules (node_modules/)
- ✅ Build artifacts (.next/, artifacts/, cache/)
- ✅ IDE/OS files (.vscode/, .DS_Store, Thumbs.db)
- ✅ Log files (*.log)
- ✅ TypeScript build info (*.tsbuildinfo)
- ✅ Test coverage (coverage/)
- ✅ Vercel deployment (.vercel/)

**Output:**
- Green ✅ if category is clean
- Yellow ⚠️ for warnings
- Red ❌ for critical issues (environment files)
- Exit code 0 if clean, 1 if violations found

**When to run:**
- Before major commits
- After team members add new files
- Weekly as part of code review
- Before thesis submission

---

### 2. `remove-tracked-gitignored-files.sh`

**Purpose:** Remove files from git tracking that should be gitignored

**Usage:**
```bash
./scripts/remove-tracked-gitignored-files.sh
```

**⚠️ WARNING:** This script modifies your git index!

**What it does:**
1. Identifies files matching gitignore patterns
2. Removes them from git tracking using `git rm --cached`
3. **Keeps local copies** (files remain on disk)
4. Requires confirmation before proceeding

**When to run:**
- If `check-gitignore-violations.sh` finds violations
- After accidentally tracking sensitive files
- When cleaning up repository

**After running:**
```bash
# Review changes
git status

# Commit the cleanup
git commit -m "chore: remove tracked gitignored files from cache"

# Push changes
git push origin main
```

**Important Notes:**
- Files are removed from tracking, not deleted locally
- Files remain in git history (use BFG for complete removal)
- Always review changes before committing

---

## 🚀 Quick Start

### First Time Setup

```bash
# Make scripts executable (already done)
chmod +x scripts/*.sh

# Run verification
./scripts/check-gitignore-violations.sh
```

### Regular Usage

```bash
# Before committing major changes
./scripts/check-gitignore-violations.sh

# If violations found, run cleanup
./scripts/remove-tracked-gitignored-files.sh
```

---

## 📊 Current Status

**Last Checked:** 2025-10-25

**Verification Results:**
- ✅ 0 violations found
- ✅ 120 legitimate files tracked
- ✅ 1.4MB repository size (healthy)
- ✅ No cleanup needed

---

## 🔧 Troubleshooting

### Script not executable
```bash
chmod +x scripts/check-gitignore-violations.sh
```

### False positives
If a file is legitimately tracked but matches gitignore pattern:
1. Add exception to `.gitignore` using `!` prefix
2. Update script to exclude from checks

Example:
```gitignore
# Ignore all .env files
.env*

# But keep template
!.env.example
```

### Permission denied
```bash
# Run with bash explicitly
bash scripts/check-gitignore-violations.sh
```

---

## 📚 Best Practices

### When to Check
- ✅ Before PR reviews
- ✅ After adding new dependencies
- ✅ Weekly team maintenance
- ✅ Before major milestones

### When NOT to Cleanup
- ❌ During active development (staged changes)
- ❌ If git history rewrite is unacceptable
- ❌ Without team notification

### Safe Cleanup Process
1. Run verification script
2. Review violations list
3. Notify team of cleanup
4. Run cleanup script
5. Review `git status` output
6. Test build/development
7. Commit and push

---

## 🔗 Related Documentation

- [.gitignore](../.gitignore) - Main gitignore configuration
- [.env.example](../.env.example) - Environment template
- [Development Guide](../docs/development-guide.md) - Setup instructions

---

## 🆘 Emergency: Secrets Committed

If you accidentally committed secrets (private keys, passwords):

### Immediate Actions

1. **Rotate credentials IMMEDIATELY**
   - Generate new private key
   - Change database passwords
   - Regenerate API keys

2. **Remove from current tracking**
   ```bash
   ./scripts/remove-tracked-gitignored-files.sh
   ```

3. **Remove from git history** (use BFG)
   ```bash
   # Install BFG Repo-Cleaner
   # https://rtyley.github.io/bfg-repo-cleaner/

   # Remove sensitive file
   bfg --delete-files .env.local

   # Clean up
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive

   # Force push (coordinate with team!)
   git push origin --force --all
   ```

4. **Notify team immediately**

---

## 📝 Maintenance

### Adding New Checks

Edit `check-gitignore-violations.sh`:

```bash
# Add new pattern check
echo "🆕 Checking custom pattern..."
custom=$(git ls-files | grep -E "your-pattern-here" || true)

if [ -n "$custom" ]; then
    echo -e "${YELLOW}⚠️  WARNING: Custom files tracked!${NC}"
    echo "$custom"
    violations=$((violations + 1))
else
    echo -e "${GREEN}✅ No custom files tracked${NC}"
fi
echo ""
```

### Updating Cleanup Script

Edit `remove-tracked-gitignored-files.sh`:

```bash
# Add new pattern cleanup
safe_remove "your-pattern-here" "Description of files"
```

---

**Created:** 2025-10-25
**Last Updated:** 2025-10-25
**Maintained By:** FoodTrace Team
