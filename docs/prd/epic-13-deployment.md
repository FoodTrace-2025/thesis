### Epic 13: Deployment & DevOps

**Priority:** 🔴 Must Have
**Estimated Time:** 6-9 hours
**Assigned:** TaiSheng (Lead), Sam (Support)
**Timeline:** Week 8-9
**Dependencies:** All features complete

#### Epic Description

Deploy application to production environment (Render.com Node.js Server). Smart contracts already on Sepolia testnet. Configure environment variables, database connections, monitoring, backup procedures. Ensure stable demo environment for thesis presentation.

#### Business Value

- **Accessible Demo:** Reviewers can test system from anywhere
- **Thesis Requirement:** Must demonstrate working POC
- **Professional:** Live URL more impressive than "localhost:3000"
- **Reliability:** Production environment more stable than local dev

#### User Stories (High-Level)

- As a **thesis reviewer**, I want to **access live demo URL** so I can test the system
- As a **team member**, I want **automated deployment** when pushing to main branch
- As a **platform admin**, I want **database backup** so we don't lose demo data
- As a **developer**, I want **error logging** so we can debug production issues

#### User Prerequisites (Manual Tasks - Complete First)

**IMPORTANT:** This epic deploys the complete FoodTrace application to production. All features (Epic 1-12) must be complete and tested. Verify:

```bash
# All features complete
npm run build  # Next.js build must succeed without errors
npm run test   # All tests pass (Epic 1 smart contract tests >70% coverage)

# Smart contracts deployed to Sepolia testnet
# Verify contract addresses in .env.local:
# - NEXT_PUBLIC_PRODUCT_REGISTRY_ADDRESS=0x...
# - NEXT_PUBLIC_TRACE_RECORDS_ADDRESS=0x... (if separate contract)

# Database schema migrated
npx prisma migrate status  # All migrations applied

# Environment variables documented
cat .env.example  # All required variables listed with descriptions
```

**Team Setup Required (2 hours together - BEFORE starting Epic 13):**

- ✅ **Create Render.com Account** (Free Tier):
  - Go to https://render.com
  - Sign up with GitHub account (enables auto-deploy from GitHub)
  - Verify email address
  - Explore free tier limits: 750 hours/month (sufficient for MVP demo)
- ✅ **Domain Name Decision** (Optional):
  - **Option A:** Use Render.com subdomain (https://foodtrace.onrender.com) - FREE
  - **Option B:** Purchase custom domain (foodtrace.app, ~$12/year) - Professional
  - **Decision:** Use Render.com subdomain for MVP (Option A), custom domain optional for post-thesis
- ✅ **CI/CD Pipeline Decision**:
  - **Option A:** Render.com Auto-Deploy (connect GitHub main branch, auto-deploy on push) - Recommended
  - **Option B:** Manual deploy via Render.com dashboard - More control, slower
  - **Decision:** Use Render.com Auto-Deploy (Option A) for faster iteration
- ✅ **Database Backup Strategy**:
  - Supabase automatic backups (free tier: daily backups, 7-day retention)
  - Manual backup before thesis defense: Export SQL dump via Supabase dashboard
  - Backup checklist: Products, TraceRecords, SensorReadings, Users, Companies
- ✅ **Error Logging & Monitoring Decision**:
  - **Option A:** Render.com built-in logs (free, basic) - Recommended for MVP
  - **Option B:** Sentry (error tracking, 5k events/month free) - Better debugging
  - **Option C:** No error logging (not recommended) - Risk production issues undetected
  - **Decision:** Start with Render.com logs (Option A), add Sentry if production errors occur
- ✅ **Uptime Monitoring Decision**:
  - **Option A:** UptimeRobot (free tier: 50 monitors, 5-minute intervals) - Recommended
  - **Option B:** No uptime monitoring - Risk demo down during thesis defense
  - **Decision:** Setup UptimeRobot monitor (Option A) for peace of mind
- ✅ **Rollback Procedure Documentation**:
  - Document rollback steps in README.md (Render.com supports rollback to previous deploy)
  - Test rollback procedure before thesis defense (practice rolling back to previous commit)
  - Keep staging environment as backup (Render.com free tier allows 2 services)

**Developer Setup (After Prerequisites):**

- Render.com account created and connected to GitHub
- GitHub repository has main branch with latest code
- Supabase database accessible from internet (connection pooling enabled via pgBouncer)
- All environment variables documented in .env.example
- Smart contracts deployed to Sepolia testnet with verified source code on Etherscan

#### Acceptance Criteria (Epic Level)

**Deployment Configuration (Render.com Setup):**

- ✅ Render.com account created and GitHub connected
- ✅ New Web Service created (type: Node.js, free tier)
- ✅ GitHub repository connected to Render.com service
- ✅ Auto-deploy enabled (deploys automatically on push to main branch)
- ✅ Build command configured: `npm install && npx prisma generate && npm run build`
- ✅ Start command configured: `npm start`
- ✅ Node.js version specified: 18.x LTS (matches local development)
- ✅ Application URL accessible: https://foodtrace.onrender.com (or similar)
- ✅ HTTPS enabled automatically (Render.com provides free SSL certificates)
- ✅ Health check endpoint configured: `/api/health` (returns 200 if app healthy)

**Environment Variables (Render.com Dashboard):**

- ✅ All environment variables set in Render.com dashboard (not committed to GitHub)
- ✅ DATABASE_URL: Supabase PostgreSQL connection string with pgBouncer pooling
- ✅ WALLET_ENCRYPTION_KEY: Same key used in Epic 3 (32-byte hex string)
- ✅ NEXTAUTH_SECRET: Generated secret for NextAuth.js sessions
- ✅ NEXTAUTH_URL: Production URL (https://foodtrace.onrender.com)
- ✅ NEXT_PUBLIC_PRODUCT_REGISTRY_ADDRESS: Deployed Sepolia contract address
- ✅ SEPOLIA_RPC_URL: Alchemy Sepolia RPC URL (from Epic 1)
- ✅ SUPABASE_URL, SUPABASE_ANON_KEY: Supabase credentials (from Epic 1)
- ✅ Email service credentials: SENDGRID_API_KEY or SUPABASE_SERVICE_ROLE_KEY (from Epic 2)
- ✅ .env.example file updated with all variables (descriptions, no actual values)

**Database Migration & Seeding:**

- ✅ Prisma migrations run successfully: `npx prisma migrate deploy`
- ✅ Database connection pooling verified (pgBouncer enabled in Supabase)
- ✅ Test database connection from production: `npx prisma db push --accept-data-loss` (dry run)
- ✅ Optional seed data: Create 1 platform admin user, 3 test companies (producer, distributor, retailer)
- ✅ Database schema matches local development (no migration drift)

**Smart Contract Verification:**

- ✅ Smart contracts deployed to Sepolia testnet (from Epic 1, Week 4)
- ✅ Contract source code verified on Etherscan (green checkmark)
- ✅ Contract ABI accessible via Etherscan API
- ✅ Test blockchain connectivity from production: Call read-only contract function
- ✅ Wallet encryption verified: Platform admin wallet can sign transactions from production

**Production Testing (Smoke Tests):**

- ✅ Platform admin can login (NextAuth.js session works)
- ✅ Company registration workflow works (Epic 2)
- ✅ Product registration works (Epic 5) - QR code generated and saved to Supabase Storage
- ✅ QR code scan works (Epic 11) - Consumer can scan QR and view product page
- ✅ Temperature chart renders (Epic 12) - If sensor data exists
- ✅ Error pages render correctly (404 Not Found, 500 Internal Server Error)
- ✅ Mobile responsive on real device (iPhone Safari, Android Chrome)

**Monitoring & Logging:**

- ✅ Render.com logs accessible via dashboard (last 7 days, free tier)
- ✅ Log level configured: INFO for production (no verbose DEBUG logs)
- ✅ Error logging captures critical errors (database connection failures, blockchain RPC failures)
- ✅ UptimeRobot monitor created (checks https://foodtrace.onrender.com every 5 minutes)
- ✅ UptimeRobot alert configured (email notification if site down >10 minutes)
- ✅ Optional Sentry integration (if production errors occur, add Sentry for better debugging)

**Backup & Disaster Recovery:**

- ✅ Supabase automatic daily backups enabled (free tier: 7-day retention)
- ✅ Manual database backup before thesis defense: Export SQL dump via Supabase dashboard
- ✅ Backup verification: Test restoring from SQL dump to local database
- ✅ GitHub repository tagged with release version: `v1.0.0-thesis-demo`
- ✅ Staging environment created (optional, Render.com free tier allows 2 services)

**Documentation:**

- ✅ Deployment guide documented in README.md or docs/deployment.md
- ✅ Rollback procedure documented (how to rollback to previous Render.com deploy)
- ✅ Environment variables documented in .env.example with descriptions
- ✅ Production URL documented in README.md (for thesis reviewers)
- ✅ Troubleshooting guide (common production issues and solutions)

#### Technical Approach

**Render.com Configuration (render.yaml):**

```yaml
# render.yaml (optional - alternative to manual dashboard configuration)
services:
  - type: web
    name: foodtrace
    env: node
    region: frankfurt  # Closest to Finland for better latency
    plan: free  # Free tier: 750 hours/month
    buildCommand: npm install && npx prisma generate && npm run build
    startCommand: npm start
    healthCheckPath: /api/health
    autoDeploy: true  # Auto-deploy on push to main branch
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false  # Set manually in Render.com dashboard
      - key: WALLET_ENCRYPTION_KEY
        sync: false
      - key: NEXTAUTH_SECRET
        generateValue: true  # Render.com auto-generates on first deploy
      - key: NEXTAUTH_URL
        value: https://foodtrace.onrender.com
      - key: NEXT_PUBLIC_PRODUCT_REGISTRY_ADDRESS
        sync: false
      - key: SEPOLIA_RPC_URL
        sync: false
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_ANON_KEY
        sync: false
```

**Health Check Endpoint (API Route):**

```typescript
// src/pages/api/health.ts (Pages Router)
import type { NextApiRequest, NextApiResponse } from 'next';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check blockchain RPC connection (viem)
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(process.env.SEPOLIA_RPC_URL),
    });
    await publicClient.getBlockNumber();

    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      blockchain: 'connected',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'unhealthy',
      error: (error as Error).message,
    });
  }
}
```

**Deployment Workflow (Step-by-Step):**

```bash
# 1. Verify all tests pass locally
npm run test

# 2. Build locally to catch errors
npm run build

# 3. Verify database migrations are up-to-date
npx prisma migrate status

# 4. Commit and push to GitHub main branch
git add .
git commit -m "feat: ready for production deployment"
git push origin main

# 5. Render.com auto-deploys (if auto-deploy enabled)
# Monitor deployment logs in Render.com dashboard

# 6. After deploy completes, run database migrations on production
# (Render.com Shell or via API)
npx prisma migrate deploy

# 7. Smoke test production URL
curl https://foodtrace.onrender.com/api/health

# 8. Test complete workflow:
# - Login as platform admin
# - Register test product
# - Scan QR code
# - View consumer query page

# 9. Monitor logs for first 24 hours
# Render.com Dashboard → Logs tab
```

**Environment Variables (.env.example):**

```bash
# .env.example (commit to GitHub, NO actual values)
# Copy to .env.local and fill in values for local development
# Set in Render.com dashboard for production

# Database (Supabase PostgreSQL with pgBouncer pooling)
DATABASE_URL="postgresql://user:password@host:6543/dbname?pgbouncer=true&connection_limit=1"

# Wallet Encryption (Epic 3 - 32-byte hex string)
WALLET_ENCRYPTION_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"

# NextAuth.js (Authentication)
NEXTAUTH_SECRET="your-secret-here-use-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"  # Production: https://foodtrace.onrender.com

# Smart Contracts (Sepolia Testnet)
NEXT_PUBLIC_PRODUCT_REGISTRY_ADDRESS="0x..."  # Deployed contract address
SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY"
PRIVATE_KEY="0x..."  # Deployer wallet (for granting roles)

# Supabase (Database & Storage)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_STORAGE_BUCKET="product-images"  # Epic 5

# Email Service (Epic 2 - choose one)
SENDGRID_API_KEY="your-sendgrid-api-key"  # If using SendGrid
# OR
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"  # If using Supabase Email
```

**UptimeRobot Monitor Setup:**

```
1. Go to https://uptimerobot.com
2. Create free account
3. Add New Monitor:
   - Monitor Type: HTTP(s)
   - Friendly Name: FoodTrace Production
   - URL: https://foodtrace.onrender.com/api/health
   - Monitoring Interval: 5 minutes
4. Add Alert Contact:
   - Email: team email address
   - Alert When: Down for 10 minutes
```

**Rollback Procedure:**

```bash
# Via Render.com Dashboard:
1. Go to Render.com Dashboard → FoodTrace service
2. Click "Manual Deploy" tab
3. Select previous deploy from list (shows commit hash, timestamp)
4. Click "Rollback to this deploy"
5. Confirm rollback
6. Monitor logs to verify rollback successful

# Via Git (if Render.com auto-deploy enabled):
git revert HEAD  # Revert last commit
git push origin main  # Trigger auto-deploy with reverted code
```

#### Dependencies

**Requires (ALL Epics Must Be Complete):**
- Epic 1 (Project Setup) - Smart contracts deployed to Sepolia, Alchemy RPC configured
- Epic 2 (Company & User Management) - User authentication, company wallets, email service
- Epic 3 (Security Hardening) - Wallet encryption, tenant isolation
- Epic 4 (Component Library) - UI components for error pages, loading states
- Epic 5 (Product Registration) - Product CRUD, QR code generation, Supabase Storage
- Epic 6 (Product Transfer Workflow) - Email notifications (optional)
- Epic 7 (Supply Chain Tracking) - Trace records, database audit log
- Epic 8 (IoT Simulator) - Sensor data (optional)
- Epic 9 (Consumer Query Interface) - Public-facing consumer query page
- Epic 10 (Multi-Party Verification) - Verification badges (optional)
- Epic 11 (QR Code Functionality) - QR scanner (optional)
- Epic 12 (Data Visualization) - Timeline, Temperature chart (optional)

**Testing Requirements:**
- All smart contract tests pass (>70% coverage)
- All backend API tests pass (if implemented)
- Frontend build succeeds without errors
- Database migrations applied successfully

**Blocks:** None (Epic 13 is final epic before thesis submission)

#### Team Assignment

**TaiSheng (5-7 hours - Deployment Lead):**

- Render.com account setup and configuration (2 hours)
  - Create Render.com account with GitHub connection
  - Create new Web Service (Node.js, free tier)
  - Connect GitHub repository to Render.com
  - Configure build and start commands
  - Configure health check endpoint
  - Enable auto-deploy on push to main branch
- Environment variables setup (1.5 hours)
  - Set all environment variables in Render.com dashboard
  - Update .env.example with all variables and descriptions
  - Document environment variables in deployment guide
  - Verify WALLET_ENCRYPTION_KEY matches Epic 3 key
- Database migration and seeding (1 hour)
  - Run `npx prisma migrate deploy` on production
  - Verify database connection pooling (pgBouncer)
  - Create seed data: 1 platform admin, 3 test companies (producer, distributor, retailer)
  - Test database connection from production
- Health check endpoint implementation (0.5 hours)
  - Create /api/health route
  - Check database connection (Prisma)
  - Check blockchain RPC connection (Alchemy)
  - Return JSON status response
- Production smoke testing (1.5 hours)
  - Test platform admin login
  - Test company registration workflow
  - Test product registration and QR code generation
  - Test QR code scan and consumer query page
  - Test error pages (404, 500)
  - Test mobile responsiveness on real device
- Monitoring and logging setup (1 hour)
  - Setup UptimeRobot monitor (https://foodtrace.onrender.com/api/health)
  - Configure email alerts (down >10 minutes)
  - Review Render.com logs (verify no critical errors)
  - Document rollback procedure in README.md
- Optional: Staging environment setup (1 hour, if time permits)
  - Create second Render.com service for staging
  - Connect to staging GitHub branch
  - Test deployment workflow on staging before production

**Sam (1-2 hours - Smart Contract Verification & Testing):**

- Smart contract verification on Etherscan (0.5 hours, if not done in Epic 1)
  - Verify ProductRegistry.sol source code on Etherscan
  - Verify contract ABI accessible via Etherscan API
  - Green checkmark on Etherscan contract page
- Blockchain connectivity testing from production (0.5 hours)
  - Call read-only contract function from production URL
  - Verify wallet encryption works (platform admin wallet can sign transactions)
  - Test blockchain transaction submission from production
- Optional: Gas cost monitoring (1 hour, if time permits)
  - Monitor gas costs for product registration, trace record addition
  - Document gas costs in thesis (Section 6.3 Cost Analysis)

**YiLing (0.5-1 hour - Documentation & Final Testing):**

- Documentation updates (0.5 hours)
  - Update README.md with production URL
  - Add troubleshooting guide (common production issues)
  - Document rollback procedure for team
- Final mobile testing (0.5 hours)
  - Test QR scanner on production URL (iPhone Safari, Android Chrome)
  - Test consumer query page mobile responsiveness
  - Report any mobile-specific bugs to TaiSheng

#### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Deployment fails (build errors, missing dependencies) | Test `npm run build` locally first, verify all dependencies in package.json, use staging environment before production, document rollback procedure |
| Environment variables missing or incorrect | Create .env.example with all variables and descriptions, triple-check Render.com dashboard matches .env.example, test health check endpoint after deploy |
| Database connection fails (pgBouncer pooling issues) | Test Supabase connection pooling before deploy, set connection_limit=1 in DATABASE_URL, verify pgBouncer enabled in Supabase settings, use health check endpoint to monitor database status |
| Prisma migration fails on production | Run `npx prisma migrate status` before deploy, test migrations on staging environment first, document manual migration rollback procedure |
| WALLET_ENCRYPTION_KEY mismatch (production key different from development) | Use SAME encryption key in production and development (Epic 3), verify key matches before deploy, test wallet decryption on production after deploy |
| Smart contracts not deployed or verified | Verify contracts deployed in Epic 1 Week 4, green checkmark on Etherscan, test blockchain connectivity from production health check endpoint |
| Render.com free tier limits exceeded (750 hours/month) | Monitor usage in Render.com dashboard, free tier auto-sleeps after 15 minutes inactivity (acceptable for demo), upgrade to paid tier if needed ($7/month) |
| Demo breaks before thesis defense (production bug) | Keep staging environment as backup, manual database backup before defense, test complete workflow 24 hours before defense, document rollback procedure |
| Render.com auto-deploy triggers on non-production commits | Use GitHub branch protection (only allow merge to main after PR review), disable auto-deploy if needed (manual deploy via dashboard) |
| Production URL slow to load (cold start after inactivity) | Render.com free tier sleeps after 15 minutes inactivity (30-60 second cold start), acceptable for demo, keep tab open before thesis defense to prevent sleep |
| Database backup missing before thesis defense | Manual backup 24 hours before defense: Supabase Dashboard → Database → Export SQL dump, test restore to local database, store backup in Google Drive |
| UptimeRobot false positives (alerts when site healthy) | Configure UptimeRobot alert threshold: down >10 minutes (not 1 minute), test UptimeRobot monitor manually, verify /api/health endpoint returns 200 |
| Email notifications fail on production (Epic 2 email service) | Test email sending after deploy (transfer product, verify email received), fallback to dashboard notifications only if email fails, document email service as optional feature |
| QR code scanner fails on production URL (HTTPS required) | Verify HTTPS enabled on Render.com (automatic with free tier), test QR scanner on production URL with real mobile device, fallback to manual Product ID entry |
| Git repository accidentally deleted or corrupted | Push code to GitHub (remote backup), tag release: `v1.0.0-thesis-demo`, backup repository to Google Drive before defense |
