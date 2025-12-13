### Epic 13: Deployment & DevOps

**Priority:** Must Have
**Estimated Time:** 4-6 hours
**Assigned:** TaiSheng (Lead)
**Timeline:** Week 8-9
**Dependencies:** Epic 1, 2, 3, 4, 5, 7, 9

#### Epic Description

Deploy application to production environment (Render.com Native Runtime). Smart contracts already on Sepolia testnet. Configure environment variables, database connections, and basic monitoring. Ensure stable demo environment for thesis presentation.

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

#### Prerequisites (Complete Before Starting Epic 13)

**IMPORTANT:** This epic deploys FoodTrace to production. Core features must be complete and tested.

**Required Epics (must be complete):**
- Epic 1 (Project Setup) - Smart contracts deployed to Sepolia, Alchemy RPC configured
- Epic 2 (Company & User Management) - User authentication, company wallets
- Epic 3 (Security Hardening) - Wallet encryption, tenant isolation
- Epic 4 (Component Library) - UI components for error pages, loading states
- Epic 5 (Product Registration) - Product CRUD, QR code generation
- Epic 7 (Supply Chain Tracking) - Trace records, transfer workflow
- Epic 9 (Consumer Query Interface) - Public-facing consumer query page

**Optional/Deferred Epics (NOT required for deployment):**
- Epic 6 (Product Transfer Workflow) - Core workflow in Stories 7.16-7.17; email notifications not implemented
- Epic 8 (IoT Simulator) - Deferred to Future Work
- Epic 10 (Multi-Party Verification) - Optional enhancement, not implemented
- Epic 12 (Data Visualization) - TraceTimeline in Epic 7; Temperature Chart requires Epic 8 (deferred)

**Pre-deployment verification:**

```bash
# All features complete
npm run build  # Next.js build must succeed without errors
npm run test   # All smart contract tests pass (>70% coverage)

# Smart contracts deployed to Sepolia testnet
# Verify contract addresses in .env.local:
# - NEXT_PUBLIC_PRODUCT_REGISTRY_ADDRESS=0x5d56f5a8703d7d545319177042cd91FD3339E2b6

# Database schema synced
npx prisma generate  # Generate Prisma client

# Environment variables documented
cat .env.example  # All required variables listed with descriptions
```

**Critical Pre-deployment Task: bcryptjs Migration**

The project currently uses `bcrypt` (native module with C++ bindings) which can fail during Render.com builds. Before deployment, migrate to `bcryptjs` (pure JavaScript implementation):

```bash
# Replace bcrypt with bcryptjs
npm uninstall bcrypt
npm install bcryptjs
npm install -D @types/bcryptjs
```

**Files to update:**
- `src/pages/api/auth/[...nextauth].ts` - Change import and bcrypt.compare()
- `src/pages/api/admin/users.ts` - Change import and bcrypt.hash()
- `src/pages/api/companies/users.ts` - Change import and bcrypt.hash()

**Team Setup (BEFORE starting Epic 13):**

- **Create Render.com Account** (Free Tier):
  - Go to https://render.com
  - Sign up with GitHub account (enables auto-deploy from GitHub)
  - Verify email address
  - Explore free tier limits: 750 hours/month (sufficient for demo)
- **Domain Name Decision:**
  - Use Render.com subdomain (https://foodtrace.onrender.com) - FREE
  - Custom domain optional for post-thesis
- **CI/CD Pipeline:**
  - Use Render.com Auto-Deploy (connect GitHub main branch, auto-deploy on push)
- **Database Backup Strategy:**
  - Supabase automatic backups (free tier: daily backups, 7-day retention)
  - Manual backup before thesis defense: Export SQL dump via Supabase dashboard
- **Monitoring Decision:**
  - Render.com built-in logs (free, basic) - Sufficient for POC
  - UptimeRobot (optional, free tier: 50 monitors, 5-minute intervals)

#### Acceptance Criteria (Epic Level)

**Deployment Configuration (Render.com Dashboard):**

- Render.com account created and GitHub connected
- New Web Service created (type: Node, region: Frankfurt, free tier)
- GitHub repository connected to Render.com service
- Auto-deploy enabled (deploys automatically on push to main branch)
- Build command configured: `npm install && npx prisma generate && npm run build`
- Start command configured: `npm start`
- Node.js version specified: 18.x LTS (matches local development)
- Application URL accessible: https://foodtrace.onrender.com (or similar)
- HTTPS enabled automatically (Render.com provides free SSL certificates)
- Health check endpoint configured: `/api/health` (returns 200 if app healthy)

**Environment Variables (Render.com Dashboard):**

- All environment variables set in Render.com dashboard (not committed to GitHub)
- DATABASE_URL: Supabase PostgreSQL connection string (direct connection, port 5432)
- DIRECT_URL: Same as DATABASE_URL (required by Prisma)
- WALLET_ENCRYPTION_KEY: Same key used in Epic 3 (32-byte hex string)
- NEXTAUTH_SECRET: Generated secret for NextAuth.js sessions
- NEXTAUTH_URL: Production URL (https://foodtrace.onrender.com)
- NEXT_PUBLIC_PRODUCT_REGISTRY_ADDRESS: Deployed Sepolia contract address
- SEPOLIA_RPC_URL: Alchemy Sepolia RPC URL
- NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY: Supabase credentials
- SUPABASE_SERVICE_ROLE_KEY: For server-side operations
- .env.example file updated with all variables (descriptions, no actual values)

**Database Connection:**

- Prisma client generated successfully: `npx prisma generate`
- Database connection verified from production
- Using direct connection (port 5432) - sufficient for POC traffic levels
- Note: pgBouncer (port 6543) available if needed for high concurrency, but not required

**Smart Contract Verification:**

- Smart contracts deployed to Sepolia testnet (already done in Epic 1)
- Contract source code verified on Etherscan (green checkmark) - VERIFIED
- Contract ABI accessible via Etherscan API
- Test blockchain connectivity from production: Call read-only contract function

**Production Testing (Smoke Tests):**

- Platform admin can login (NextAuth.js session works)
- Company registration workflow works (Epic 2)
- Product registration works (Epic 5) - QR code generated
- Trace record creation works (Epic 7) - Transfer workflow
- Consumer query page works (Epic 9) - QR scan and product detail view
- Error pages render correctly (404 Not Found, 500 Internal Server Error)
- Mobile responsive on real device (iPhone Safari, Android Chrome)

**Monitoring & Logging:**

- Render.com logs accessible via dashboard (last 7 days, free tier)
- Log level configured: INFO for production (no verbose DEBUG logs)
- Error logging captures critical errors (database connection, blockchain RPC failures)
- Optional: UptimeRobot monitor (checks /api/health every 5 minutes)

**Backup & Disaster Recovery:**

- Supabase automatic daily backups enabled (free tier: 7-day retention)
- Manual database backup before thesis defense: Export SQL dump
- GitHub repository tagged with release version: `v1.0.0-thesis-demo`

**Documentation:**

- Deployment guide documented in docs/deployment.md
- Rollback procedure documented (Render.com dashboard rollback)
- Environment variables documented in .env.example with descriptions
- Production URL documented in README.md

#### Technical Approach

**Health Check Endpoint (API Route):**

```typescript
// src/pages/api/health.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check blockchain RPC connection
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
# 1. Complete bcryptjs migration (Story 13.1)
npm uninstall bcrypt
npm install bcryptjs
npm install -D @types/bcryptjs
# Update 3 files, test locally

# 2. Verify all tests pass locally
npm run test

# 3. Build locally to catch errors
npm run build

# 4. Commit and push to GitHub main branch
git add .
git commit -m "feat: ready for production deployment"
git push origin main

# 5. Render.com auto-deploys (if auto-deploy enabled)
# Monitor deployment logs in Render.com dashboard

# 6. Smoke test production URL
curl https://foodtrace.onrender.com/api/health

# 7. Test complete workflow:
# - Login as platform admin
# - Register test product
# - Add trace record
# - View consumer query page

# 8. Monitor logs for first 24 hours
# Render.com Dashboard → Logs tab
```

**Environment Variables Summary:**

The following environment variables are needed for production deployment. See `.env.example` for full documentation.

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | Supabase PostgreSQL connection string | Yes |
| DIRECT_URL | Same as DATABASE_URL (Prisma requirement) | Yes |
| WALLET_ENCRYPTION_KEY | 32-byte hex key for wallet encryption | Yes |
| NEXTAUTH_SECRET | Session encryption secret | Yes |
| NEXTAUTH_URL | Production URL | Yes |
| NEXT_PUBLIC_PRODUCT_REGISTRY_ADDRESS | Sepolia contract address | Yes |
| SEPOLIA_RPC_URL | Alchemy RPC endpoint | Yes |
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL | Yes |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anon key | Yes |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service role key | Yes |
| ETHERSCAN_API_KEY | For contract verification | Optional |
| PRIVATE_KEY | Deployer wallet (for granting roles) | Optional |

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

#### Story Breakdown

**Story 13.1: Prerequisites & bcryptjs Migration (1 hour)**
- Migrate from bcrypt to bcryptjs (3 files)
- Verify build succeeds locally
- Verify authentication still works
- Update package.json dependencies

**Story 13.2: Health Check Endpoint & Render.com Setup (1.5 hours)**
- Create /api/health endpoint (database + blockchain checks)
- Create Render.com account and connect GitHub
- Create Web Service (Node.js, free tier)
- Configure build/start commands

**Story 13.3: Environment Variables & Initial Deploy (1 hour)**
- Set all environment variables in Render.com dashboard
- Trigger initial deployment
- Monitor deployment logs for errors
- Verify health check endpoint responds

**Story 13.4: Smoke Testing (1 hour)**
- Test platform admin login
- Test product registration workflow
- Test trace record creation (transfer workflow)
- Test consumer query page (add after Epic 9 complete)
- Test error pages (404, 500)
- Test mobile responsiveness

**Story 13.5: Documentation & Monitoring (0.5 hours)**
- Update README.md with production URL
- Create docs/deployment.md with deployment guide
- Document rollback procedure
- Optional: Setup UptimeRobot monitor
- Tag release: `v1.0.0-thesis-demo`

#### Dependencies

**Requires (Core Epics - Must Be Complete):**
- Epic 1 (Project Setup) - Smart contracts deployed to Sepolia
- Epic 2 (Company & User Management) - User authentication, company wallets
- Epic 3 (Security Hardening) - Wallet encryption, tenant isolation
- Epic 4 (Component Library) - UI components
- Epic 5 (Product Registration) - Product CRUD, QR code generation
- Epic 7 (Supply Chain Tracking) - Trace records, transfer workflow
- Epic 9 (Consumer Query Interface) - Public consumer page

**Optional (Not required for deployment):**
- Epic 6 (Product Transfer) - Already in Stories 7.16-7.17
- Epic 8 (IoT Simulator) - Deferred
- Epic 10 (Multi-Party Verification) - Optional
- Epic 12 (Data Visualization) - Timeline in Epic 7

**Testing Requirements:**
- All smart contract tests pass (>70% coverage)
- Frontend build succeeds without errors
- Database connection works

**Blocks:** None (Epic 13 is final epic before thesis submission)

#### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| bcrypt native module fails during Render.com build | Migrate to bcryptjs (pure JavaScript) before deployment - Story 13.1 |
| Deployment fails (build errors, missing dependencies) | Test `npm run build` locally first, verify all dependencies in package.json |
| Environment variables missing or incorrect | Create comprehensive .env.example, triple-check Render.com dashboard |
| Database connection fails | Test Supabase connection before deploy, use direct connection (port 5432), verify connection in health check |
| WALLET_ENCRYPTION_KEY mismatch | Use SAME encryption key in production as development, verify key matches before deploy |
| Render.com free tier limits exceeded (750 hours/month) | Free tier auto-sleeps after 15 minutes inactivity (acceptable for demo) |
| Production URL slow to load (cold start) | Render.com free tier has 30-60 second cold start after inactivity, keep tab open before thesis defense |
| Demo breaks before thesis defense | Manual database backup 24 hours before defense, tag release in Git, document rollback procedure |
| QR code scanner fails on production URL | HTTPS enabled by default on Render.com, test with real mobile device |

#### Notes

- **No render.yaml needed:** Dashboard configuration is simpler and more maintainable for POC
- **No staging environment:** Not necessary for thesis demo, production only
- **No Sentry:** Render.com built-in logs sufficient for debugging
- **No seed data script:** Create test data manually via platform UI after deployment
- **pgBouncer optional:** Direct connection (port 5432) sufficient for POC traffic levels
- **UptimeRobot optional:** Nice to have but not critical for thesis demo
