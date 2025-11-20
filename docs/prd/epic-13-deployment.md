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

#### Acceptance Criteria (Epic Level)

**Deployment:**

- ✅ Application deployed to Render.com (free tier Node.js Server)
- ✅ Custom domain (optional): foodtrace.app or similar
- ✅ HTTPS enabled (automatic with Render.com)
- ✅ Environment variables configured securely
- ✅ Database migrations run successfully

**Monitoring:**

- ✅ Error logging (Sentry or Render.com logs)
- ✅ Uptime monitoring (UptimeRobot free tier)
- ✅ Database backup schedule (Supabase automatic backups)

**Documentation:**

- ✅ Deployment guide (how to redeploy if needed)
- ✅ Environment variables documented (.env.example)
- ✅ Rollback procedure documented

#### Technical Approach

**Render.com Configuration:**

```yaml
# render.yaml
services:
  - type: web
    name: foodtrace
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: WALLET_ENCRYPTION_KEY
        sync: false
      - key: NEXTAUTH_SECRET
        generateValue: true
```

**Deployment Checklist:**

1. ✅ Environment variables set in Render.com dashboard
2. ✅ Database migrations run: `npx prisma migrate deploy`
3. ✅ Smart contracts verified on Etherscan
4. ✅ Test live URL: Register product, scan QR
5. ✅ Monitor logs for first 24 hours

#### Dependencies

**Requires:** All epics complete, testing passed (Week 8)

#### Team Assignment

**TaiSheng (4-5 hours):**

- Render.com deployment configuration (2 hours)
- Environment variables setup (1 hour)
- Database migration (1 hour)
- Monitoring setup (1 hour)

**Sam (1 hour):**

- Verify smart contracts on Etherscan (if not done)
- Test blockchain connectivity from production

#### Risks & Mitigations

| Risk                              | Mitigation                                       |
| --------------------------------- | ------------------------------------------------ |
| Deployment fails                  | Test on staging branch first, rollback procedure |
| Environment variables wrong       | Triple-check .env.example matches production     |
| Database connection fails         | Test Supabase connection pooling before deploy   |
| Demo breaks before thesis defense | Keep staging environment as backup               |
