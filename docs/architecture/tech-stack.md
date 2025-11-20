# Technology Stack

**Purpose:** Central reference for all technologies, versions, frameworks, and licenses used in FoodTrace.

---

## Stack Overview

| Layer | Technology | Version | Purpose | License |
|-------|-----------|---------|---------|---------|
| **Frontend Framework** | Next.js | 14.2.15 | SSR, routing, API routes | MIT |
| | React | 18.x | UI library | MIT |
| | TypeScript | 5.8+ | Type safety | Apache 2.0 |
| | Chakra UI | v2 | Component library | MIT |
| **Web3 Integration** | Wagmi | v2 | React hooks for Ethereum | MIT |
| | Viem | Latest | TypeScript Ethereum client | MIT |
| | RainbowKit | Latest | Wallet connection UI | MIT |
| **Backend Runtime** | Node.js | 18.x LTS | JavaScript runtime | MIT |
| | Next.js API Routes | 14.2.15 | RESTful endpoints | MIT |
| | NextAuth.js | v4 | Authentication | ISC |
| **Database** | PostgreSQL | 15.x | Relational database | PostgreSQL License |
| | Prisma | 5.x | ORM, migrations | Apache 2.0 |
| | pgBouncer | Latest | Connection pooling | ISC |
| **Blockchain** | Ethereum Sepolia | Testnet | Public blockchain | N/A (protocol) |
| | Solidity | ^0.8.20 | Smart contract language | GPL-3.0 |
| | Hardhat | Latest | Development framework | MIT |
| | OpenZeppelin | 5.x | Secure contract library | MIT |
| **Utilities** | react-qr-code | Latest | QR generation | MIT |
| | html5-qrcode | Latest | QR scanning | Apache 2.0 |
| | crypto-js | Latest | AES-256 encryption | MIT |
| **Deployment** | Render.com | N/A | Application hosting | N/A (service) |
| | Supabase | N/A | Database hosting | N/A (service) |
| | Alchemy | N/A | Ethereum RPC provider | N/A (service) |

---

## Frontend Stack

**Framework:** Next.js 14.2.15 (Pages Router)
- Server-side rendering (SSR) and static generation
- File-based routing
- API routes for backend endpoints
- Built-in image optimization

**UI Library:** React 18
- Component-based architecture
- Hooks for state management
- Concurrent rendering

**Type Safety:** TypeScript 5.8+
- Strict mode enabled
- Type checking at compile time
- Enhanced IDE support

**Component Library:** Chakra UI v2
- Accessible components (WCAG 2.1 AA)
- Responsive design utilities
- Theme customization

---

## Backend Stack

**Runtime:** Node.js 18.x LTS
- Long-term support release
- Built-in ES modules support
- Performance optimizations

**API Framework:** Next.js API Routes
- RESTful endpoint creation
- Middleware support
- Server-side rendering integration

**Authentication:** NextAuth.js v4
- JWT session management
- Prisma adapter
- Role-based access control

---

## Web3 Stack

**Smart Contract Language:** Solidity ^0.8.20
- Built-in overflow protection
- Gas optimization features
- OpenZeppelin library integration

**Development Framework:** Hardhat
- Smart contract compilation
- Testing with Chai/Mocha
- Deployment scripts
- Gas reporting

**Frontend Integration:** Wagmi v2 + Viem
- React hooks for blockchain queries
- TypeScript-first design
- Read-only consumer access

**Security Library:** OpenZeppelin Contracts 5.x
- AccessControl (role management)
- Pausable (emergency stop)
- ReentrancyGuard (attack prevention)

---

## Database Stack

**Database Engine:** PostgreSQL 15.x (Supabase managed)
- ACID compliance
- Row-level security (RLS)
- Full-text search
- JSON/JSONB support

**ORM:** Prisma 5.x
- Type-safe queries
- Automated migrations
- Connection pooling
- Schema introspection

**Connection Pooling:** pgBouncer
- Transaction mode pooling
- 60 concurrent connections (Supabase free tier)
- 78× faster connection acquisition (234ms → 3ms)

---

## Deployment Stack

**Application Hosting:** Render.com Free Tier
- 750 hours/month (always-on for single instance)
- 512MB RAM
- Automatic SSL/TLS certificates
- Git-based deployment

**Database Hosting:** Supabase Free Tier
- 500MB storage
- 2GB bandwidth/month
- Automatic daily backups (7-day retention)
- Built-in file storage

**Blockchain Network:** Ethereum Sepolia Testnet
- Free testnet ETH via faucets
- 12-15 second block time
- Public block explorer (Etherscan)
- Compatible with Ethereum mainnet

**RPC Provider:** Alchemy (Free Tier)
- 300 requests/second
- 99.9% uptime SLA
- Automatic retry logic
- Fallback to Infura/Public RPC

---

## Utility Libraries

**QR Code Generation:** react-qr-code
- SVG/PNG output
- Customizable size/colors
- Error correction Level H (30% damage tolerance)

**QR Code Scanning:** html5-qrcode
- Camera access via WebRTC
- Mobile back camera support
- 10 FPS scanning rate

**Encryption:** crypto-js
- AES-256-GCM encryption
- Secure key derivation
- HMAC support

**Date/Time:** Native JavaScript Date
- No external library (reduces bundle size)
- ISO 8601 timestamp formatting
- Unix timestamp conversion

---

## Testing Stack

**Smart Contract Testing:** Hardhat + Chai + Mocha
- Unit tests for contract functions
- Gas cost reporting
- Coverage analysis (target >70%)

**Frontend Testing:** Jest + React Testing Library
- Component isolation tests
- Integration tests
- E2E tests with Playwright

**Static Analysis:** Slither (smart contracts)
- Automated vulnerability scanning
- Gas optimization suggestions
- Best practice checks

**Dependency Scanning:** npm audit
- Weekly vulnerability checks
- GitHub Actions integration
- Zero high/critical vulnerabilities target

---

## Version Management

**Node.js Version:** Managed via `.nvmrc` file
```
18.18.0
```

**Package Manager:** npm (v9+)
- Lockfile: `package-lock.json` (committed to Git)
- Exact versions (no `^` prefix for production dependencies)

**Smart Contract Compiler:** Solidity 0.8.20
- Specified in `hardhat.config.ts`
- Consistent across all contracts

---

## License Compliance

**All Dependencies:** MIT or Apache 2.0 licenses
- No GPL dependencies (except Solidity compiler, development-only)
- No proprietary licenses
- Open-source permissive licenses

**Commercial Use:** Allowed for all dependencies
- No attribution requirements in production
- Safe for academic and commercial deployment

---

## Technology Selection Rationale

**Why Next.js?** Monolithic architecture simplifies deployment, combines frontend/backend in single codebase (ADR 001)

**Why Ethereum Sepolia?** Free testnet, public verification, superior learning resources vs Hyperledger Fabric (ADR 007)

**Why Supabase?** Built-in pgBouncer connection pooling critical for serverless functions, 78× faster than vanilla PostgreSQL (ADR 002)

**Why Custodial Wallets?** 2-minute onboarding vs 15-20 minutes MetaMask, 67% abandonment prevention (ADR 003)

**Why Hardhat?** JavaScript-based, matches team skills, Cyfrin Updraft uses Hardhat, better beginner docs vs Foundry

---

**Last Updated:** 2025-11-20 (Week 0 Complete)
