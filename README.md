# FoodTrace - Blockchain Food Traceability System

**Bachelor's Thesis Project | OAMK University of Applied Sciences**

[![Project Status](https://img.shields.io/badge/Status-Planning%20Phase-yellow)]()
[![Timeline](https://img.shields.io/badge/Timeline-12%20Weeks-blue)]()
[![Team Size](https://img.shields.io/badge/Team-3%20Members-green)]()

---

## 🎯 Project Overview

A proof-of-concept blockchain-based food supply chain traceability system that enables transparent tracking of food products from farm to consumer using Ethereum smart contracts and Next.js.

**Key Features:**

- 🔗 Blockchain-based immutable record storage
- 📱 QR code generation and scanning
- 🚚 4-role supply chain tracking (Producer → Distributor → Retailer → Consumer)
- 🌡️ IoT sensor simulation (temperature/humidity monitoring)
- ✅ Multi-party verification
- 🔍 Consumer query interface (wallet-free)

---

## 👥 Team

| Role                         | Name                 | Focus Area                                  | GitHub                                     |
| ---------------------------- | -------------------- | ------------------------------------------- | ------------------------------------------ |
| **Blockchain Lead**          | Sam Chou (FuzzyKala) | Smart Contracts, Solidity, Gas Optimization | [@FuzzyKala](https://github.com/FuzzyKala) |
| **Backend/Integration Lead** | TaiSheng Chen        | Testing, API, Web3 Integration              | TBD                                        |
| **UI/UX Lead**               | YiLing Chen          | Design, Frontend, Components                | TBD                                        |

---

## 📚 Documentation

**👉 [AI Agent Context](./CLAUDE.md)** ← **For AI Agents**
**👉 [Project Brief](./docs/brief.md)** ← **START HERE for Humans!**

### Quick Links

| Document                               | Description                           | Status       |
| -------------------------------------- | ------------------------------------- | ------------ |
| [Project Brief](./docs/brief.md)       | Foundation document, project vision   | ✅ Complete  |
| [PRD](./docs/prd.md)                   | Product requirements, features, epics | ✅ Complete  |
| [Architecture](./docs/architecture.md) | System design, tech stack             | 🔜 Week 2    |
| [Planning Artifacts](./docs/planning/) | Initial planning, team workload       | 📦 Reference |

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 14.2.15 (React 18)
- **Language:** TypeScript 5.8+
- **UI Library:** Chakra UI v2
- **Web3:** Wagmi v2, Viem, RainbowKit
- **QR Codes:** react-qr-code, html5-qrcode

### Smart Contracts

- **Language:** Solidity ^0.8.20
- **Framework:** Hardhat
- **Testing:** Chai + Mocha
- **Libraries:** OpenZeppelin Contracts
- **Network:** Ethereum Sepolia Testnet

### Backend & Database

- **Architecture:** Next.js Monolith (frontend + backend)
- **API:** Next.js API Routes
- **Database:** Supabase (PostgreSQL + connection pooling)
- **ORM:** Prisma

### Hosting

- **Application:** Render (Node.js Server)
- **Database:** Supabase
- **Smart Contract:** Sepolia Testnet (permanent)

---

## 📅 Timeline

| Week                         | Phase            | Focus                              |
| ---------------------------- | ---------------- | ---------------------------------- |
| **1** (Oct 31 - Nov 7)       | Setup & Learning | Environment setup, Solidity basics |
| **2** (Nov 8 - 14)           | Planning         | PRD, Architecture documents        |
| **3-4** (Nov 15 - 28)        | Smart Contracts  | Contract development, testing      |
| **5-7** (Nov 29 - Dec 19)    | Frontend         | UI implementation (4 roles)        |
| **8** (Dec 20 - 26)          | Testing          | Integration testing, bug fixes     |
| **9** (Dec 27 - Jan 2)       | Polish           | Documentation, demo video          |
| **10-12** (Jan 3 - 23, 2026) | Thesis           | Writing, poster, presentation      |

**Kickoff Meeting:** October 31, 2025
**Thesis Submission:** ~January 23, 2026

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- Git
- VS Code (recommended)
- MetaMask wallet

### Quick Start

```bash
# Clone repository
git clone [repo-url]
cd thesis

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev

# Run tests
npm test

# Deploy smart contracts (testnet)
npm run deploy:sepolia
```

### First Time Setup

1. **Read Documentation:**

   - Start with [Project Brief](./docs/brief.md)
   - Review [Team Workload](./docs/planning/team-workload.md)
   - See [CLAUDE.md](./CLAUDE.md) for full documentation map

2. **Install Tools:**

   - VS Code extensions: Solidity, Hardhat Solidity
   - Create MetaMask wallet
   - Get Sepolia test ETH from faucets

3. **Learn Solidity:**
   - Complete [Cyfrin Updraft](https://updraft.cyfrin.io/) (10-15 hours)
   - Practice with simple contracts
   - Deploy "Hello World" to testnet

---

## 🏗️ Project Structure

```
thesis/
├── .bmad-core/          # BMAD methodology configuration
├── CLAUDE.md            # 🤖 AI agent entry point & documentation map
├── docs/                # 📚 Documentation (core documents)
│   ├── brief.md         # Project brief (v1.1)
│   ├── prd.md           # Product requirements (v1.1, Sections 1-6)
│   ├── architecture.md  # System architecture (to be created Week 2)
│   ├── planning/        # Planning artifacts
│   ├── prd/             # Sharded PRD epics (generated)
│   ├── architecture/    # Sharded architecture (generated)
│   ├── stories/         # User stories (generated)
│   └── qa/              # QA reports (generated)
├── contracts/           # 🔗 Smart contracts (Solidity)
├── src/                 # ⚛️ Next.js application
│   ├── app/             # App router pages
│   ├── components/      # React components
│   ├── lib/             # Utilities, Web3 hooks
│   └── styles/          # CSS/Tailwind
├── test/                # 🧪 Smart contract tests
├── public/              # Static assets
└── README.md            # This file
```

---

## 🔧 Development Workflow

This project follows **BMAD (Breakthrough Method of Agile AI-driven Development)** methodology.

### Phase 1: Planning (Weeks 1-2)

1. **Analyst** creates project brief ✅
2. **PM** creates PRD 🔜
3. **Architect** creates architecture 🔜
4. **PO** validates documents 🔜

### Phase 2: Development (Weeks 3-10)

1. **PO** shards documents (PRD → epics)
2. **SM** creates stories from epics
3. **Dev** implements stories
4. **QA** reviews and refactors
5. Repeat until all stories complete

### Tools & Agents

- **IDE:** VS Code with BMAD agents
- **Agents:** SM (story creation), Dev (implementation), QA (review)
- **Workflow:** SM → Dev → QA cycle (one story at a time)

---

## 🧪 Testing Strategy

### Smart Contract Tests

- **Framework:** Hardhat + Chai + Mocha
- **Coverage Target:** >70%
- **Types:** Unit tests, integration tests, gas optimization

### Frontend Tests

- **Manual Testing:** Cross-browser, mobile responsiveness
- **E2E Testing:** Complete supply chain flow (3 wallets)
- **User Acceptance:** QR code scanning, wallet-free query

---

## 📦 Key Features

### 1. Product Registration (Producer)

- Register products on blockchain
- Upload photos and metadata
- Generate QR codes
- Set certification details

### 2. Supply Chain Tracking

- Add trace records (Distributor, Retailer)
- Automatic timestamps
- Location tracking
- Quality notes

### 3. IoT Sensor Simulation

- Admin interface for generating sensor data
- Three scenarios: Normal, Warning, Critical
- Temperature/humidity monitoring
- Alert system for violations

### 4. Consumer Query (Wallet-Free)

- Scan QR code with smartphone
- View complete product journey
- See verification status
- Check temperature logs

### 5. Multi-Party Verification

- Independent verification by multiple parties
- Reputation system
- Trust indicators

---

## 🎓 Academic Context

### Thesis Requirements

- **Institution:** OAMK University of Applied Sciences
- **Pages:** 60+ pages (20 pages per person)
- **Hours:** 400 hours per person (33 hours/week)
- **Deliverables:** Thesis document + Poster + Working prototype

### Research Focus

- **Problem:** Food supply chain traceability challenges
- **Solution:** Blockchain-based transparent tracking
- **Innovation:** IoT simulation + wallet-free consumer access
- **Comparison:** Ethereum vs. Hyperledger Fabric justification

### Related Projects

- **OAMK Ruokajälki:** Food traceability project (local context)
- **Walmart + IBM Food Trust:** Industry case study (7 days → 2.2 seconds)

---

## 📖 Learning Resources

### Blockchain & Solidity

- [Cyfrin Updraft](https://updraft.cyfrin.io/) - Free Solidity course
- [Solidity Docs](https://docs.soliditylang.org/)
- [OpenZeppelin](https://docs.openzeppelin.com/)

### Web3 Frontend

- [Wagmi Documentation](https://wagmi.sh/)
- [RainbowKit](https://www.rainbowkit.com/)
- [Viem](https://viem.sh/)

### Supply Chain Research

- [Walmart Case Study](https://www.lfdecentralizedtrust.org/case-studies/walmart-case-study)
- [IBM Food Trust](https://www.ibm.com/blockchain/solutions/food-trust)

---

## 🤝 Contributing

### Team Workflow

1. Create feature branch from `develop`
2. Implement story (follow coding standards)
3. Write tests (aim for >70% coverage)
4. Submit PR for review
5. Address QA feedback
6. Merge to `develop`

### Commit Messages

```
feat: Add product registration smart contract
fix: Resolve QR code generation bug
docs: Update architecture decision log
test: Add unit tests for trace record function
```

---

## 📞 Support & Contact

- **Project Repository:** [GitHub URL]
- **Thesis Supervisor:** TBD (add after kickoff meeting)
- **BMAD Community:** [discord.gg/gk8jAdXWmj](https://discord.gg/gk8jAdXWmj)
- **Team Communication:** Discord/Telegram

---

## 📜 License

This project is created for academic purposes as part of a Bachelor's thesis at OAMK University of Applied Sciences.

---

## 🙏 Acknowledgments

- **OAMK University of Applied Sciences** - Academic institution
- **BMAD Method** - Development methodology
- **Cyfrin Updraft** - Solidity education
- **OpenZeppelin** - Smart contract libraries

---

**Project Status:** 🟢 Planning Phase
**Last Updated:** 2025-10-24
**Next Milestone:** Kickoff Meeting (October 31, 2025)

---

_Built with ❤️ by Team FoodTrace_

Blockchain: A distributed ledger technology that maintains an immutable record of transactions across
multiple computers.

Smart Contract: Self-executing code on the blockchain that automatically enforces the terms of an
agreement.

Solidity: Programming language for writing Ethereum smart contracts.

Testnet: Test blockchain network (like Sepolia) used for development without real economic costs.

Mainnet: Production blockchain network with real cryptocurrency.

Gas: Transaction fee paid to execute operations on Ethereum blockchain.

Wallet: Software application that manages blockchain accounts and private keys.

QR Code: Quick Response code used to encode Product ID for scanning.

GIGO: "Garbage In, Garbage Out" - the data quality challenge in blockchain systems.

Oracle Problem: Challenge of connecting blockchain to real-world data sources.

MVP: Minimum Viable Product - simplest version that demonstrates core functionality.

Sepolia: Ethereum test network used in this thesis (permanent testnet).

IPFS: InterPlanetary File System - decentralized storage protocol.

POC: Proof-of-Concept - prototype demonstrating technical feasibility.
