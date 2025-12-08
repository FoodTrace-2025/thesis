# FoodTrace Deployment Guide

## Overview

FoodTrace is deployed to Render.com using their Native Runtime (Node.js).

**Production URL:** https://foodtrace.onrender.com

## Prerequisites

- Render.com account (GitHub-connected)
- Supabase database (PostgreSQL)
- Alchemy API key (Sepolia RPC)
- Smart contract deployed to Sepolia testnet

## Environment Variables

All environment variables are configured in the Render.com dashboard (not committed to GitHub).

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | Supabase PostgreSQL connection (port 5432, direct connection) | Yes |
| DIRECT_URL | Same as DATABASE_URL (Prisma requirement) | Yes |
| WALLET_ENCRYPTION_KEY | 32-byte hex string for wallet encryption | Yes |
| NEXTAUTH_SECRET | Session encryption secret (base64) | Yes |
| NEXTAUTH_URL | Production URL (https://foodtrace.onrender.com) | Yes |
| SEPOLIA_RPC_URL | Alchemy Sepolia RPC endpoint | Yes |
| NEXT_PUBLIC_PRODUCT_REGISTRY_ADDRESS | Deployed contract address on Sepolia | Yes |
| NEXT_PUBLIC_BASE_URL | Production URL for QR codes | Yes |
| PRIVATE_KEY | Deployer wallet key for granting blockchain roles | Yes |
| NODE_VERSION | Set to `20` (Prisma 7.x requires Node 20+) | Yes |

**Important Notes:**
- Use direct connection (port 5432), not pgBouncer (port 6543)
- WALLET_ENCRYPTION_KEY must match development key (existing wallets won't decrypt otherwise)
- NODE_VERSION=20 is set in Render.com environment, not package.json

## Render.com Configuration

| Setting | Value |
|---------|-------|
| Service Type | Web Service (Node.js) |
| Region | Frankfurt (EU Central) |
| Plan | Free |
| Branch | main |
| Build Command | `npm install && npx prisma generate && npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |
| Auto-Deploy | Enabled |

## Deployment Steps

### Initial Deployment

1. Create Render.com account and connect GitHub
2. Create new Web Service, select repository
3. Configure build/start commands as above
4. Add all environment variables in Render.com dashboard
5. Deploy (auto-triggered or manual)

### Subsequent Deployments

1. Push changes to `main` branch
2. Render.com auto-deploys (if enabled)
3. Monitor build logs in Render.com dashboard
4. Verify health check: `curl https://foodtrace.onrender.com/api/health`

### Verification Commands

```bash
# Check health endpoint
curl https://foodtrace.onrender.com/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-12-08T19:40:57.679Z",
  "database": "connected",
  "blockchain": "connected"
}
```

## Rollback Procedure

### Via Render.com Dashboard

1. Go to Render.com Dashboard -> foodtrace service
2. Click "Deploys" tab
3. Find previous successful deploy
4. Click "Rollback" button
5. Confirm rollback
6. Monitor logs to verify

### Via Git

```bash
git revert HEAD
git push origin main
# Auto-deploy will trigger with reverted code
```

## Troubleshooting

### Build Fails

- Check for missing environment variables (especially NODE_VERSION=20)
- Verify `npm run build` works locally
- Check Render.com build logs for specific error

### Database Connection Fails

- Verify DATABASE_URL is correct (port 5432, not 6543)
- Check Supabase project is active
- Test health endpoint: returns database status

### Authentication Fails

- Verify NEXTAUTH_URL matches production URL exactly
- Check NEXTAUTH_SECRET is set
- Clear browser cookies and retry

### Blockchain Connection Fails

- Verify SEPOLIA_RPC_URL is correct (Alchemy endpoint)
- Check Alchemy API quota not exceeded
- Health endpoint returns blockchain status

### Cold Start Slow (30-60 seconds)

- Expected behavior for Render.com free tier
- Service sleeps after 15 minutes of inactivity
- Keep tab open before thesis demo/presentation

## Monitoring

### Render.com Dashboard

- **Logs:** Render.com Dashboard -> Logs tab (7-day retention on free tier)
- **Metrics:** Basic CPU/memory usage visible in dashboard
- **Alerts:** Configure email alerts for deploy failures

### Health Check

The `/api/health` endpoint checks:
- Database connectivity (Prisma query)
- Blockchain RPC connectivity (viem getBlockNumber)

Returns 200 if healthy, 500 if any check fails.

### Optional: UptimeRobot

1. Create free account at https://uptimerobot.com
2. Add HTTP(s) monitor for https://foodtrace.onrender.com/api/health
3. Set interval to 5 minutes
4. Configure email alerts

## Security Considerations

- All secrets stored in Render.com dashboard (encrypted at rest)
- PRIVATE_KEY used only for granting blockchain roles on company approval
- WALLET_ENCRYPTION_KEY encrypts company wallets in database
- HTTPS enabled automatically via Render.com (Let's Encrypt)

## Release Management

### Creating a Release Tag

```bash
git tag -a v1.0.0-thesis-demo -m "Initial thesis demo release"
git push origin v1.0.0-thesis-demo
```

### Viewing Tags

```bash
git tag -l
```

---

**Last Updated:** 2025-12-08
**Deployed Version:** v1.0.0-thesis-demo
