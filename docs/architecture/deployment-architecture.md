# Deployment Architecture (Render.com, CI/CD, Environments)

**Purpose:** Define deployment strategy, CI/CD pipeline, environment configuration, and rollback procedures.

---

## Environment Strategy

| Environment | Purpose | Infrastructure | Database | Blockchain | URL |
|------------|---------|---------------|----------|-----------|-----|
| **Local Development** | Feature development | npm run dev (localhost) | Local PostgreSQL OR Supabase Dev | Hardhat local node OR Sepolia | localhost:3000 |
| **Staging** | Pre-production validation | Render.com Preview Deploy | Supabase (separate schema) | Ethereum Sepolia | foodtrace-staging.onrender.com |
| **Production** | Live POC demo | Render.com Main | Supabase (schema public.*) | Ethereum Sepolia | foodtrace.onrender.com |

**Note:** Staging and production share Sepolia testnet (differentiated by contract addresses to prevent data pollution).

---

## Deployment Infrastructure

### Render.com Configuration

**Service Type:** Web Service (Node.js)
**Plan:** Free Tier
**Resources:**
- 750 hours/month (always-on for single instance)
- 512MB RAM
- Shared CPU
- Cold start after 15 minutes inactivity (30-60s wake-up time)

**Build Configuration:**
```yaml
# render.yaml
services:
  - type: web
    name: foodtrace-production
    env: node
    repo: https://github.com/FoodTrace-2025/foodtrace
    branch: main
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false  # Managed via dashboard
      - key: NEXTAUTH_SECRET
        generateValue: true
      - key: WALLET_ENCRYPTION_KEY
        sync: false
```

**Auto-Deploy Trigger:**
- Git push to `main` branch → Automatic deployment (1-2 minutes)
- Manual deploy via Render.com dashboard

---

## CI/CD Pipeline

### GitHub Actions Workflow

**Test Suite (Pull Request Validation):**

```yaml
# .github/workflows/test.yml
name: Test Suite
on:
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run format:check

  smart-contracts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx hardhat compile
      - run: npx hardhat test
      - run: npx hardhat coverage
      - name: Check coverage threshold
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.statements.pct')
          if (( $(echo "$COVERAGE < 70" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 70% threshold"
            exit 1
          fi

  frontend-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test
      - run: npm run build

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --production
      - run: pip install slither-analyzer
      - run: slither contracts/ --exclude-dependencies
```

**Deployment (Merge to Main):**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Trigger Render Deploy
        run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
      - name: Wait for deployment
        run: sleep 60
      - name: Health check
        run: |
          STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://foodtrace.onrender.com/api/health)
          if [ $STATUS -ne 200 ]; then
            echo "Health check failed with status $STATUS"
            exit 1
          fi
```

---

## Deployment Process

### Week 4: Initial Sepolia Deployment (Smart Contracts)

```bash
# 1. Compile contracts
npx hardhat compile

# 2. Run full test suite
npx hardhat test
npx hardhat coverage  # Verify >70%

# 3. Deploy to Sepolia testnet
npx hardhat run scripts/deploy.ts --network sepolia

# Output:
# ProductRegistry deployed to: 0x8a791620dd6260079bf849dc5567adc3f2fdc318
# TraceRecords deployed to: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

# 4. Verify contracts on Etherscan
npx hardhat verify --network sepolia 0x8a791620dd6260079bf849dc5567adc3f2fdc318

# 5. Update .env files with contract addresses
# Render.com → Environment Variables → NEXT_PUBLIC_CONTRACT_ADDRESS_*
```

### Week 7: Initial Render.com Deployment (Frontend/Backend)

**One-Time Setup (Manual):**
1. Create Render.com Web Service
   - Name: `foodtrace-production`
   - Repository: `github.com/FoodTrace-2025/foodtrace`
   - Branch: `main`
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Environment: Node.js 18

2. Configure Environment Variables (Render.com Dashboard)
   - `DATABASE_URL` (Supabase connection string)
   - `NEXT_PUBLIC_CONTRACT_ADDRESS_*` (from Week 4)
   - `WALLET_ENCRYPTION_KEY` (generate: `openssl rand -hex 32`)
   - `NEXTAUTH_SECRET` (generate: `openssl rand -base64 32`)
   - `ALCHEMY_API_KEY`, `INFURA_API_KEY`

3. Trigger First Deployment
```bash
git add .
git commit -m "feat: initial production deployment"
git push origin main
```

4. Validate Deployment
```bash
# Health check
curl https://foodtrace.onrender.com/api/health
# Expected: {"status":"ok","timestamp":"2025-11-20T10:30:00.000Z"}

# Smoke tests
# - Open https://foodtrace.onrender.com
# - Register test account (Producer role)
# - Register test product
# - Generate QR code → Verify downloadable
# - Scan QR code → Verify consumer query works
```

### Week 8-9: Continuous Deployment (Automated)

**Developer Workflow:**
```bash
# 1. Create feature branch
git checkout -b feature/temperature-alerts

# 2. Implement feature, run tests locally
npm run test
npx hardhat test

# 3. Push to GitHub
git push origin feature/temperature-alerts

# 4. Create Pull Request
# GitHub Actions automatically runs test.yml
# - Lint, TypeScript check, smart contract tests, frontend tests
# - If PASS → Green checkmark, allow merge
# - If FAIL → Red X, must fix before merge

# 5. Merge Pull Request (after approval)
# GitHub Actions automatically runs deploy.yml
# Render.com automatically deploys new version (1-2 minutes)

# 6. Verify deployment
# Check Render.com logs for errors
# Visit production URL, test new feature
```

---

## Rollback Strategy

### Scenario 1: Broken Frontend/Backend Deployment

**Render.com Dashboard Rollback:**
1. Navigate to Render.com Dashboard → Deployments tab
2. Click "Redeploy" on previous working deployment
3. Previous commit SHA becomes active (2-3 minutes rollback)

**Git Revert Alternative:**
```bash
git revert HEAD
git push origin main
# Render auto-deploys reverted commit (3-5 minutes rollback)
```

### Scenario 2: Broken Smart Contract Deployment

**Problem:** Smart contracts are immutable once deployed. Cannot "rollback" a deployed contract.

**Mitigation Strategies:**

**1. Emergency Pause (Implemented):**
```solidity
contract ProductRegistry is AccessControl, Pausable {
  function registerProduct(...) public whenNotPaused {
    // ... registration logic
  }

  function pause() public onlyRole(ADMIN_ROLE) {
    _pause();  // Stops all state-changing functions
  }
}
```

**2. Multi-Contract Versioning (POC Strategy):**
- Deploy new contract version alongside old version
- Update frontend `NEXT_PUBLIC_CONTRACT_ADDRESS` to point to new contract
- Old contract remains on-chain (immutable) but unused

Example:
```
ProductRegistry v1: 0x8a79... (deployed Week 4, deprecated Week 6)
ProductRegistry v2: 0x742d... (deployed Week 6, active)
```

### Scenario 3: Database Migration Failure

```bash
# 1. Rollback migration (Prisma CLI)
npx prisma migrate resolve --rolled-back 20250115123456_add_alerts_table

# 2. Restore from Supabase backup (if data corruption)
# Supabase Dashboard → Database → Backups
# - Select backup from 1-7 days ago
# - Click "Restore" (creates new database instance)
# - Update DATABASE_URL in Render.com
# - Redeploy application

# 3. Fix migration SQL
# Edit migrations/20250115123456_add_alerts_table/migration.sql
# Test locally:
npx prisma migrate reset  # Wipe local DB, replay all migrations
npx prisma migrate deploy  # Apply to local DB

# 4. Re-deploy corrected migration
git add prisma/migrations/
git commit -m "fix: correct alerts table migration"
git push origin main
```

---

## Monitoring & Observability

### Application Logs

**Render.com Built-in Log Viewer:**
- Searchable, filterable logs
- 7-day retention (free tier)
- Export via Render.com dashboard

**Structured Logging (Pino):**
```typescript
logger.info({ productId, txHash }, 'Product registered successfully');
logger.error({ error: error.message, stack: error.stack }, 'Registration failed');
```

### Health Check Endpoint

```typescript
// pages/api/health.ts
export default async function handler(req, res) {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check blockchain RPC
    await publicClient.getBlockNumber();

    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      blockchain: 'connected',
    });
  } catch (error) {
    return res.status(503).json({
      status: 'error',
      error: error.message,
    });
  }
}
```

### Uptime Monitoring (Future Work)

**Out of Scope for POC:**
- Sentry APM (error rate, API latency)
- UptimeRobot (uptime monitoring, alerts)
- Etherscan blockchain monitoring (transaction success rate)

---

## Zero-Downtime Deployment (Future Work)

**POC Limitation:** Render.com free tier does NOT support zero-downtime deployments. During deployment (1-2 minutes), site returns 503 Service Unavailable.

**Acceptable for Thesis:**
- Deployments during low-traffic periods
- 1-2 minute downtime acceptable for academic POC

**Production Improvement (Out of Scope):**
- Blue-green deployment (run two Render.com instances, swap traffic)
- Database migration strategies (expand-contract pattern)
- Feature flags (deploy code disabled, enable via config)

---

**Last Updated:** 2025-11-20 (Week 0 Complete)
