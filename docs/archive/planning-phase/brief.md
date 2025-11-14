# Project Brief: Blockchain-Based Food Supply Chain Traceability System

**Project Name:** FoodTrace
**Team:** OAMK IT Students (3 members)
**Duration:** 12 weeks (9 weeks development + 3 weeks thesis writing)
**Type:** Bachelor's Thesis Project
**Date:** October 2025 - January 2026

---

## Executive Summary

This project aims to develop a proof-of-concept blockchain-based food supply chain traceability system that enables transparent tracking of food products from farm to consumer. The system will demonstrate how blockchain technology can improve food safety, build consumer trust, and enable rapid recall processes through immutable record-keeping and QR code-based product tracking.

---

## 1. Background & Motivation

### Problem Statement

Current food supply chains face critical challenges:

- **Limited Traceability:** Traditional systems take 7+ days to trace product origins (Walmart case study)
- **Data Tampering Risk:** Centralized databases can be modified without detection
- **Consumer Trust Deficit:** Consumers cannot verify product authenticity and journey
- **Slow Recall Response:** Food safety incidents lead to delayed recalls and health risks

### Why Blockchain?

Blockchain technology offers unique advantages:

- **Immutability:** Once recorded, data cannot be altered
- **Transparency:** All stakeholders can access the same trusted information
- **Decentralization:** No single point of failure
- **Rapid Traceability:** Real-time access to product history

### Real-World Relevance

- **Walmart + IBM Food Trust:** Reduced traceability time from 7 days to 2.2 seconds
- **Fraud Reduction:** Studies show 80% reduction in fraud incidents
- **Consumer Demand:** 94% of consumers want supply chain transparency
- **OAMK Connection:** Aligns with OAMK's Ruokajälki (FoodWay) project focusing on food safety and traceability in Oulu region

---

## 2. Project Objectives

### Primary Objectives

1. **Develop a functional MVP** of a blockchain-based food traceability system within 12 weeks (9 weeks development)
2. **Demonstrate technical feasibility** of blockchain for supply chain management
3. **Create an intuitive user interface** accessible to all supply chain participants
4. **Enable consumer transparency** through QR code scanning
5. **Produce comprehensive academic documentation** suitable for thesis requirements (3 weeks writing)

### Secondary Objectives

1. Explore data authenticity challenges and propose mitigation strategies
2. Analyze cost-benefit implications of blockchain implementation
3. Evaluate user experience and adoption barriers
4. Provide recommendations for real-world deployment

---

## 3. Scope Definition

### In Scope (MVP - 10 Weeks)

**Core Features:**

- ✅ Product registration and unique ID generation
- ✅ **4-role supply chain tracking (Producer → Distributor → Retailer → Consumer)**
- ✅ **IoT sensor simulator (admin interface for generating test data)**
- ✅ QR code generation and scanning
- ✅ Consumer query interface (wallet-free)
- ✅ Blockchain-based immutable record storage
- ✅ Basic timestamp validation
- ✅ Multi-party verification mechanism
- ✅ Simple reputation system
- ✅ Photo upload with metadata
- ✅ Supply chain history visualization
- ✅ Temperature/humidity monitoring (simulated data)

**Supply Chain Roles (Simplified):**

1. **Producer** (combines farmer + initial processing) - Creates and registers products
2. **Distributor** (combines transport + quality check) - Handles logistics and verification
3. **Retailer** - Final sales point
4. **Consumer** - End user (wallet-free query access)

**Technical Components:**

- ✅ Smart contracts (Solidity)
- ✅ Web application (Next.js + TypeScript)
- ✅ Wallet integration (MetaMask, RainbowKit)
- ✅ Testnet deployment (Sepolia)
- ✅ QR code functionality
- ✅ PostgreSQL for off-chain data

### Out of Scope (Future Work)

- ❌ Mainnet deployment (cost prohibitive)
- ❌ IoT sensor integration (time/budget constraints)
- ❌ AI-based anomaly detection
- ❌ Mobile native applications
- ❌ IPFS for decentralized storage (optional if time permits)
- ❌ Multiple blockchain networks
- ❌ Real business partnerships

### Use Case Focus

**Primary Use Case:** Oulu Region Organic Blueberries

- From local farm to supermarket
- **4 supply chain participants (3 with wallets, 1 consumer)**
- Simulated environment with realistic data
- Focuses on local, direct-to-retail food supply chains

---

## 4. Technology Stack

### Frontend

```
Framework: Next.js 14.2.15 (React 18)
Language: TypeScript 5.8+
UI Library: Chakra UI v2
Web3 Integration:
  - Wagmi v2 (React Hooks for Ethereum)
  - Viem (TypeScript Ethereum library)
  - RainbowKit (Wallet connection UI)
QR Code: react-qr-code, html5-qrcode
Styling: Tailwind CSS (optional)
```

### Smart Contracts

```
Language: Solidity ^0.8.20
Development Framework: Hardhat
Testing: Hardhat + Chai + Mocha
Libraries: OpenZeppelin Contracts
Network: Ethereum Sepolia Testnet
Gas Token: Test ETH (from faucets)
```

### Backend & Database

```
Architecture: Next.js Monolith (frontend + backend in one app)
API: Next.js API Routes
Database: Supabase (PostgreSQL with built-in connection pooling)
ORM: Prisma
File Storage: Supabase Storage (for images)
IoT Simulation: Custom admin interface (fake sensor data)
```

**Why Supabase?**

- Built-in connection pooling (pgBouncer) prevents connection exhaustion
- PostgreSQL-compatible (no SQL changes needed)
- Free tier generous enough for thesis project (1GB storage, 2GB bandwidth)
- Integrated storage with CDN and image resizing capabilities

### Development Tools

```
Version Control: Git + GitHub
IDE: VS Code
Package Manager: npm / pnpm
Browser Wallet: MetaMask
Testing ETH: Sepolia Faucets
Block Explorer: Etherscan (Sepolia)
CI/CD: GitHub Actions (optional)
```

### Hosting

```
Application: Render (Node.js Server, free tier 750 hours/month)
Database: Supabase (PostgreSQL with connection pooling)
Smart Contract: Sepolia Testnet (permanent)
```

---

## 5. System Architecture

### High-Level Architecture

```
┌───────────────────────────────────────────────────────────────────────┐
│                   User Interface Layer                                │
├────────────────┬────────────────┬──────────────┬────────────┬─────────┤
│   Producer     │  Distributor   │   Retailer   │  Consumer  │  IoT    │
│   Portal       │   Portal       │   Portal     │   Query    │Simulator│
│ (Wallet Req.)  │ (Wallet Req.)  │(Wallet Req.) │(No Wallet) │(Admin)  │
└────────┬───────┴────────┬───────┴──────┬───────┴──────┬─────┴────┬────┘
         │                │              │              │          │
         └────────────────┴──────────────┴──────────────┴──────────┘
                                  │
         ┌────────────────────────▼──────────────────────────┐
         │     Next.js Monolith (Frontend + Backend)         │
         │  ┌──────────────────┐  ┌──────────────────────┐   │
         │  │   Web3 Layer     │  │   API Routes         │   │
         │  │ • Wagmi Hooks    │  │ • /api/products      │   │
         │  │ • RainbowKit     │  │ • /api/iot/simulate  │   │
         │  │ • Contract calls │  │ • /api/qrcode        │   │
         │  └──────────────────┘  └──────────────────────┘   │
         │  • QR Code Generation/Scanning                    │
         │  • Role-Based Access Control                      │
         └──────┬────────────────────┬───────────────────────┘
                │                    │
      ┌─────────▼──────────┐   ┌────▼─────────────────┐
      │ Ethereum Sepolia   │   │  Supabase            │
      │  (Smart Contract)  │   │  (PostgreSQL)        │
      │                    │   │                      │
      │ • Product Registry │   │ • Images             │
      │ • Trace History    │   │ • Descriptions       │
      │ • Sensor Readings  │   │ • Sensor metadata    │
      │ • Verifications    │   │ • Metadata           │
      │ • Reputation       │   │ • Search Index       │
      │ • Timestamps       │   │ • Cache              │
      └────────────────────┘   └──────────────────────┘
```

**Key Architectural Decisions:**

1. **Monolithic Structure**: Next.js handles both frontend and backend (simpler deployment)
2. **Serverless API**: Next.js API Routes for backend logic (no separate Node.js server)
3. **Supabase for Database**: Built-in connection pooling prevents serverless issues
4. **IoT Simulator**: Admin interface generates fake sensor data for testing
5. **Hybrid Storage**: Critical data on-chain, metadata off-chain

### Data Storage Strategy

**On-Chain (Blockchain):**

- Product ID and hash
- Creator address
- Timestamps
- Verification status
- Reputation scores
- Critical supply chain events

**Off-Chain (PostgreSQL):**

- Product descriptions
- High-resolution images
- Detailed metadata
- Search indexes
- Analytics data

**Benefits:**

- Lower gas costs
- Faster queries
- Rich media support
- Blockchain security for critical data

---

## 6. Core Features

### Feature 1: Product Registration (Farmer)

**User Story:** As a farmer, I want to register my harvested products on the blockchain so that consumers can verify their origin.

**Functionality:**

- Connect wallet (MetaMask)
- Fill product form:
  - Product name (e.g., "Organic Blueberries")
  - Origin location (GPS coordinates optional)
  - Harvest date
  - Weight/quantity
  - Certification (e.g., "EU Organic")
  - Upload photo
- Submit transaction to blockchain
- Receive unique Product ID
- Generate QR code for printing

**Acceptance Criteria:**

- Transaction completes successfully on testnet
- QR code is generated and downloadable
- Product appears in farmer's dashboard
- Timestamp validation prevents future dates

---

### Feature 2: Supply Chain Tracking (All Roles)

**User Story:** As a supply chain participant, I want to add my processing step to the product history so the complete journey is documented.

**Functionality:**

- Scan product QR code or enter Product ID
- View current product status
- Add trace record:
  - Role (Processor/Distributor/Retailer)
  - Action (Processed/Shipped/Received/Stocked)
  - Location
  - Timestamp (automatic)
  - Quality notes
  - Photo (optional)
- Submit to blockchain
- View updated product history

**Acceptance Criteria:**

- Only authorized roles can add records
- Each record has unique timestamp
- Gas fees are reasonable (<$0.01 on testnet)
- Records appear immediately on frontend

---

### Feature 3: Multi-Party Verification

**User Story:** As a quality inspector, I want to verify product information to increase trust in the system.

**Functionality:**

- Independent parties can verify product data
- Verification requires different wallet address than creator
- Product marked as "Verified" after 2+ verifications
- Verification increases creator's reputation score

**Acceptance Criteria:**

- Creator cannot verify own products
- Each address can verify once per product
- Verification count is visible to consumers
- Verified products show green badge

---

### Feature 4: Consumer Query (Wallet-Free)

**User Story:** As a consumer, I want to scan a product's QR code and see its complete journey without needing a cryptocurrency wallet.

**Functionality:**

- Scan QR code with smartphone camera
- View product information:
  - Product name and photo
  - Origin (farm location)
  - Harvest date
  - Complete supply chain timeline
  - Verification status
  - Temperature logs (if available)
  - Creator reputation score
- No wallet required (read-only)
- Link to blockchain explorer for verification

**Acceptance Criteria:**

- Works on mobile browsers
- Loads in <3 seconds
- Shows all supply chain events
- Displays warnings for suspicious data
- Responsive design

---

### Feature 5: IoT Sensor Simulator

**User Story:** As a system administrator, I want to simulate IoT sensor data to test the blockchain traceability system without requiring physical hardware.

**Functionality:**

- Admin-only interface (not public-facing)
- Select product to attach sensor data
- Generate realistic sensor readings:
  - Temperature (2-15°C range)
  - Humidity (70-90% range)
  - GPS coordinates (simulated movement)
  - Sensor ID (auto-generated)
  - Battery level and signal strength
- Three scenario presets:
  - ✅ Normal Conditions (2-4°C, safe)
  - ⚠️ Warning (8-10°C, approaching threshold)
  - 🚨 Critical (>10°C, spoilage risk)
- Auto-mode: Generate data every N seconds (simulate continuous monitoring)
- Data recorded to both blockchain and database
- Trigger alerts for out-of-range conditions

**Acceptance Criteria:**

- Simulated data has same structure as real IoT sensors
- Data is recorded on blockchain with immutable timestamp
- Alerts trigger when temperature exceeds thresholds
- Simulator UI is intuitive and responsive
- Can simulate multiple sensors simultaneously

**Academic Justification:**

- Enables reproducible testing without hardware costs (€150+ saved)
- Focuses thesis on blockchain innovation, not IoT engineering
- Standard practice in POC development (IBM Food Trust uses test harnesses)
- Architecture supports future migration to real MQTT sensors

---

### Feature 6: Data Authenticity Safeguards

**Addressing the GIGO Problem:**

**Implemented Safeguards:**

1. **Timestamp Validation**

   - Production date cannot be in future
   - Upload time must be after production date
   - Warning if upload delay >7 days

2. **Multi-Party Verification**

   - Requires 2+ independent confirmations
   - Unverified products show warning

3. **Reputation System**

   - Accumulate trust score over time
   - Low reputation triggers warnings
   - Fraud reports permanently recorded

4. **Photo Metadata**
   - EXIF data extraction (optional)
   - Timestamp and GPS comparison

**Future Enhancements (Discussed in Thesis):**

- IoT sensor automation
- AI anomaly detection
- Third-party auditing integration

---

## 7. Development Timeline (10 Weeks)

### Week 1: Foundation & Learning

**Focus:** Environment setup and role-specific learning

**Person 1 (Blockchain Lead - Sam):**

- [ ] Complete Solidity fundamentals (Cyfrin Updraft, 10-15 hours) **HEAVY**
- [ ] Setup Hardhat development environment
- [ ] Setup MetaMask with testnet wallets
- [ ] Research Walmart + IBM Food Trust case study
- [ ] Experiment with OpenZeppelin contracts

**Person 2 (Backend Lead):**

- [ ] Complete Solidity basics (Cyfrin Updraft, 5-8 hours) **MEDIUM**
- [ ] Learn Hardhat testing framework in depth
- [ ] Setup PostgreSQL + Prisma
- [ ] Map supply chain business processes
- [ ] Plan database schema

**Person 3 (UI/UX Lead):**

- [ ] Research Web3 UI/UX best practices **PRIMARY FOCUS**
- [ ] Study blockchain wallet UX patterns (MetaMask, Rainbow)
- [ ] Analyze competitor interfaces (IBM Food Trust UI)
- [ ] Create user personas (4 roles)
- [ ] Map user flows for all interfaces
- [ ] Learn basic Web3 concepts (wallets, gas, transactions)

**Team Deliverables:**

- [ ] GitHub repository created and configured
- [ ] Next-Web3-Boilerplate cloned and running
- [ ] **3 test wallets created** (Producer, Distributor, Retailer)
- [ ] All wallets funded with testnet ETH
- [ ] Project structure defined
- [ ] Communication channels setup (Discord/Telegram)

---

### Week 2: Design & Prototyping

**Focus:** System design and architecture (CRITICAL WEEK FOR PERSON 3)

**Person 1 (Blockchain Lead):**

- [ ] Design smart contract structure
- [ ] Define contract functions and events
- [ ] Write simple "Hello World" contract
- [ ] Deploy first contract to Sepolia testnet
- [ ] Collaborate on system architecture diagram

**Person 2 (Backend Lead):**

- [ ] Finalize database schema (PostgreSQL)
- [ ] Create Prisma schema file
- [ ] Define API endpoints (REST)
- [ ] Plan data flow (on-chain vs off-chain)
- [ ] Setup Supabase (database + storage)

**Person 3 (UI/UX Lead - HEAVY WEEK):**

- [ ] **Create wireframes for all 4 interfaces** (Figma/Sketch)
  - Producer dashboard and product registration
  - Distributor interface
  - Retailer interface
  - Consumer query page
- [ ] **Design system creation:**
  - Color palette (brand colors)
  - Typography scale
  - Icon set
  - Button styles and states
  - Form components
  - Card layouts
- [ ] **High-fidelity mockups** (at least key screens)
- [ ] **Present designs to team for feedback**
- [ ] Iterate based on feedback

**Team Deliverables:**

- [ ] **Complete UI/UX designs approved by team** ✅
- [ ] System architecture diagram
- [ ] Smart contract specification document
- [ ] Database schema finalized
- [ ] First successful testnet deployment
- [ ] API endpoint documentation

---

### Week 3-4: Smart Contract Development

**Focus:** Core blockchain logic (HEAVY WEEK FOR PERSON 1 & 2)

**Person 1 (Blockchain Lead - HEAVY):**

- [ ] **Implement FoodTraceability contract** (Solidity)
  - Product registration function
  - Trace record addition function
  - Multi-party verification logic
  - Reputation system (basic)
  - Role-based access control
  - Events for all state changes
- [ ] Gas optimization
- [ ] Code documentation (NatSpec comments)
- [ ] Deploy to Sepolia testnet
- [ ] Verify contract on Etherscan
- [ ] Support Person 2 with test debugging

**Person 2 (Backend Lead - HEAVY):**

- [ ] **Write comprehensive smart contract tests**
  - Unit tests for each function (Chai + Mocha)
  - Integration tests for workflows
  - Edge case testing (invalid inputs, unauthorized access)
  - Event emission testing
  - **Target: >70% code coverage**
- [ ] Security review and audit
- [ ] **Setup Supabase PostgreSQL database**
  - Create project at supabase.com
  - Configure connection pooling (pgBouncer)
  - Get DATABASE_URL and DIRECT_URL
- [ ] **Create Prisma schema and migrations**
  - Product model
  - SensorReading model (for IoT data)
  - Alert model (for temperature violations)
- [ ] **Build initial Next.js API routes:**
  - `/api/products` (CRUD)
  - `/api/traces` (add trace records)
  - `/api/images` (upload)
  - **`/api/iot/simulate` (IoT simulator endpoint)**
    - Accept sensor data from simulator page
    - Save to Supabase database
    - Record on blockchain (if critical data)
    - Trigger alerts for out-of-range temps
- [ ] Deploy database schema to Supabase

**Person 3 (UI/UX Lead):**

- [ ] Setup Next.js project with TypeScript
- [ ] Install and configure Chakra UI v2 / Tailwind CSS
- [ ] **Create reusable component library:**
  - Button components (primary, secondary, outline)
  - Input fields (text, number, date, file upload)
  - Form containers
  - Card layouts
  - Modal dialogs
  - Loading states and spinners
  - Error/success messages
  - Navigation bar
- [ ] Setup design tokens (colors, spacing, typography)
- [ ] Create layout components (responsive grid)
- [ ] Basic routing structure
- [ ] **Build IoT Simulator page (4-6 hours):**
  - Admin interface design
  - Product selector dropdown
  - Scenario buttons (Normal/Warning/Critical)
  - Real-time data preview
  - Connect to Person 2's `/api/iot/simulate` endpoint

**Milestone:** ✅ Smart contract complete and deployed to Sepolia

**Deliverables:**

- [ ] **Audited and deployed smart contract**
- [ ] Test coverage >70%
- [ ] Deployment documentation
- [ ] Contract address on Sepolia (verified)
- [ ] Database schema deployed
- [ ] API routes functional
- [ ] Component library ready

---

### Week 5-7: Frontend Development & Integration

**Focus:** User interfaces and Web3 integration (HEAVY FOR PERSON 2 & 3)

**Person 1 (Blockchain Lead - SUPPORT ROLE):**

- [ ] Support Person 2 with Web3 integration questions
- [ ] Debug contract interaction issues
- [ ] Optimize gas costs if needed
- [ ] Review and approve PR's
- [ ] Handle smart contract bug fixes
- [ ] Document contract usage patterns

**Person 2 (Backend Lead - HEAVY):**

- [ ] **Setup RainbowKit wallet connection**
- [ ] **Integrate Wagmi v2 hooks:**
  - `useAccount` (wallet connection)
  - `useContractWrite` (transactions)
  - `useContractRead` (queries)
  - `useWaitForTransaction` (transaction status)
  - `useContractEvent` (event listening)
- [ ] **Handle transaction states:**
  - Loading/pending UI
  - Success confirmations
  - Error handling and retry logic
  - Gas estimation
- [ ] **Build all API endpoints:**
  - Product metadata CRUD
  - Image upload/storage
  - Consumer query (wallet-free)
  - Search and filtering
- [ ] Transaction error handling
- [ ] User feedback mechanisms

**Person 3 (UI/UX Lead - VERY HEAVY):**

**Week 5: Producer Interface**

- [ ] **Product registration form:**
  - All input fields (name, location, date, weight, cert)
  - Form validation (client-side)
  - Image upload with preview
  - Connect to Person 2's API
- [ ] **Producer dashboard:**
  - List of created products
  - Product details view
  - QR code display and download
- [ ] **Integration with wallet** (RainbowKit)

**Week 6: Distributor & Retailer Interfaces**

- [ ] **Distributor interface:**
  - Product lookup (scan/search)
  - Trace record addition form
  - Current product status view
- [ ] **Retailer interface:**
  - Similar to distributor (shared components)
  - Retailer-specific fields
  - Stock management view
- [ ] **Shared components optimization**

**Week 7: Consumer Interface & Polish**

- [ ] **Consumer query page (NO WALLET REQUIRED):**
  - QR code scanner (html5-qrcode)
  - Product search by ID
  - Product history timeline
  - Verification badges
  - Trust indicators (reputation, verification count)
  - Link to Etherscan for transparency
- [ ] **Mobile optimization** (all pages)
- [ ] **Accessibility improvements** (WCAG basics)
- [ ] **Responsive design testing**

**Milestone:** ✅ Fully functional web application

**Deliverables:**

- [ ] **All 4 interfaces complete and functional**
- [ ] Web3 wallet integration working
- [ ] Consumer query page (wallet-free)
- [ ] Mobile-responsive on all pages
- [ ] Application deployed to Render
- [ ] End-to-end workflow tested

---

### Week 8: Integration Testing & Optimization

**Focus:** End-to-end testing and bug fixes

**Activities:**

- [ ] Full supply chain simulation with test data
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile device testing
- [ ] Performance optimization
- [ ] Gas cost analysis
- [ ] Security audit
- [ ] UX improvements
- [ ] Bug fixing

**Test Scenarios:**

1. **Complete product journey (3 wallets):**
   - Producer creates product
   - Distributor adds trace record
   - Retailer adds final record
   - Consumer queries (wallet-free)
2. **IoT Simulator Testing:**
   - Generate normal sensor data (2-4°C)
   - Generate warning scenario (8-10°C)
   - Generate critical scenario (>10°C)
   - Verify alerts trigger correctly
   - Test auto-mode continuous data generation
3. Multi-party verification flow
4. Consumer query from different devices
5. Suspicious data detection (timestamp validation)
6. Reputation system (if implemented)
7. Mobile responsiveness
8. Accessibility compliance

**Deliverables:**

- [ ] Test report document
- [ ] Bug fix log
- [ ] Performance benchmarks
- [ ] 5-10 sample products with complete histories

---

### Week 9: Documentation & Demo Preparation

**Focus:** Polish and presentation materials

**Activities:**

- [ ] Record demo video (3-5 minutes)
- [ ] Prepare presentation slides
- [ ] Write user manual
- [ ] Write technical documentation
- [ ] Prepare realistic test data
- [ ] Code cleanup and comments
- [ ] README documentation
- [ ] Prepare backup demo screenshots

**Deliverables:**

- [ ] Demo video
- [ ] Presentation deck
- [ ] User guide
- [ ] Technical documentation
- [ ] GitHub README

---

### Week 10: Thesis Writing

**Focus:** Academic documentation

**Activities:**

- [ ] Complete thesis first draft
- [ ] Generate system diagrams and charts
- [ ] Analyze results
- [ ] Literature review finalization
- [ ] Prepare defense presentation
- [ ] Peer review
- [ ] Final revisions

**Deliverables:**

- [ ] Complete thesis document
- [ ] Defense presentation
- [ ] All supporting materials

---

## 8. Team Roles & Responsibilities

**📖 See [TEAM_WORKLOAD_RECOMMENDATIONS.md](./TEAM_WORKLOAD_RECOMMENDATIONS.md) for detailed breakdown**

### Team Structure Overview

```
Person 1 (Sam)          Person 2                Person 3
Blockchain Lead    +    Backend/Integration  +  UI/UX Lead
     70%                      70%                   85%
  Solidity                Testing               Design
  Contracts              Backend API           Frontend
  Gas Optimization       Web3 Connect          Components
     30%                      30%                   15%
  Architecture           Frontend Help         Basic Web3
  Code Review            DevOps                Testing
```

---

### Person 1: Blockchain & Smart Contract Lead (Sam/FuzzyKala)

**Primary Focus (70%):** Smart contracts, Solidity, gas optimization

**Key Responsibilities:**

- **Weeks 1-2:** Learn Solidity (Cyfrin Updraft 10-15 hours)
- **Weeks 3-4:** Develop FoodTraceability smart contract
  - Product registration logic
  - Trace record system
  - Multi-party verification
  - Reputation system
  - Access control
- **Weeks 5-7:** Integration support for Person 2
- **Week 8:** Security audit, gas optimization
- **Weeks 9-10:** Documentation + Thesis blockchain chapter

**Secondary Focus (30%):**

- System architecture design
- Git repository management
- Code reviews
- Help Person 3 understand Web3 concepts

**Skills to Leverage:**

- ✅ TypeScript/JavaScript expertise
- ✅ Next.js knowledge
- ✅ Problem-solving skills

**Skills to Acquire:**

- 🎯 Solidity syntax and patterns (Week 1-2)
- 🎯 Smart contract security (Week 3-4)
- 🎯 Gas optimization techniques (Week 5-6)

**Estimated Time:** ~400 hours over 12 weeks (33 hours/week: Weeks 1-9 development, Weeks 10-12 thesis writing)

---

### Person 2: Backend & Integration Lead

**Primary Focus (70%):** Testing, backend API, Web3 integration

**Key Responsibilities:**

- **Weeks 1-2:** Learn Solidity basics + Hardhat testing + Database setup
- **Weeks 3-4:** Smart contract testing + Backend development
  - Write comprehensive tests (Chai + Mocha)
  - Achieve >70% code coverage
  - Setup PostgreSQL + Prisma
  - Build Next.js API routes
- **Weeks 5-7:** Web3 Integration + Backend
  - Integrate Wagmi v2 hooks
  - Setup RainbowKit
  - Transaction state handling
  - API endpoints for all features
- **Week 8:** Integration testing, QA, bug fixes
- **Weeks 9-10:** DevOps + Documentation + Thesis backend chapter

**Secondary Focus (30%):**

- Support Person 1 with Solidity (code review)
- Help Person 3 with component integration
- Database optimization

**Skills to Leverage:**

- ✅ Full-stack development experience
- ✅ Backend architecture knowledge
- ✅ Database design skills

**Skills to Acquire:**

- 🎯 Hardhat testing framework (Week 1-2)
- 🎯 Wagmi hooks usage (Week 5-6)
- 🎯 Web3 transaction handling (Week 5-7)

**Estimated Time:** ~400 hours over 12 weeks (30-40 hours/week: Weeks 1-9 development, Weeks 10-12 thesis writing)

---

### Person 3: UI/UX & Frontend Lead

**Primary Focus (85%):** Design, user experience, frontend development

**Key Responsibilities:**

- **Week 1:** Research Web3 UX, user flow mapping, persona creation
- **Week 2:** Complete design phase
  - Wireframes for all 4 roles (Figma/Sketch)
  - Design system (colors, typography, components)
  - High-fidelity mockups
  - Present to team for feedback
- **Weeks 3-4:** Component library setup
  - Reusable React components
  - Chakra UI / Tailwind CSS
  - Design tokens
- **Weeks 5-7:** Frontend development (HEAVY)
  - Week 5: Producer interface
  - Week 6: Distributor & Retailer interfaces
  - Week 7: Consumer query page + QR scanner
- **Week 8:** Testing, mobile optimization, accessibility
- **Week 9:** Polish, user manual, demo video
- **Week 10:** Thesis UI/UX chapter + Design documentation

**Secondary Focus (15%):**

- Basic Web3 understanding (wallet flow)
- QR code integration
- User testing facilitation

**Skills to Leverage:**

- ✅ UI/UX design principles
- ✅ Frontend development
- ✅ Component-based thinking

**Skills to Acquire:**

- 🎯 Blockchain UI/UX patterns (Week 1)
- 🎯 Chakra UI / Tailwind (Week 3-4)
- 🎯 Next.js App Router (Week 5-7)
- 🎯 Basic Web3 concepts (Week 5-6)

**Estimated Time:** ~400 hours over 12 weeks (30-40 hours/week: Weeks 1-9 development, Weeks 10-12 thesis writing)

---

### Shared Responsibilities (All Team Members)

**Weekly (Required):**

- Monday standup meetings (14:00-15:00, 1 hour)
- Demo progress to team
- Discuss blockers
- Plan next week's tasks

**As Needed:**

- Code reviews for all pull requests
- Pair programming sessions
- Design reviews
- Integration troubleshooting

**Final Weeks:**

- Week 8: Team testing session
- Week 9: Demo preparation and dry-run
- Week 10: Thesis peer review

---

### Role Simulation for Testing

**Person 1:** Producer role (Wallet A) + Consumer testing
**Person 2:** Distributor role (Wallet B)
**Person 3:** Retailer role (Wallet C)

**Total Wallets Needed:** 3 (vs. 4 in 5-role system) ✅ Simplified!

---

## 9. Risk Management

### Technical Risks

| Risk                          | Probability | Impact | Mitigation                                                 |
| ----------------------------- | ----------- | ------ | ---------------------------------------------------------- |
| Steep Solidity learning curve | Medium      | High   | Use OpenZeppelin templates; allocate 2 weeks learning time |
| Smart contract bugs           | Medium      | High   | Extensive testing; code review; stick to simple logic      |
| Gas fees too high             | Low         | Medium | Deploy to testnet only; optimize contract                  |
| Web3 integration complexity   | Medium      | Medium | Use Next-Web3-Boilerplate; follow Wagmi docs               |
| Time overrun                  | Medium      | High   | Strict scope control; MVP focus; weekly checkpoints        |
| Blockchain transaction delays | Low         | Low    | Use testnet with fast block times; show pending states     |

### Mitigation Strategies

**If Solidity proves too difficult:**

- Simplify contract logic
- Use more OpenZeppelin pre-built contracts
- Focus on frontend, basic contract functions only

**If time runs short:**

- Remove optional features (reputation system, EXIF validation)
- Use pre-built UI components
- Reduce number of products in demo (3 instead of 10)

**If testing reveals major bugs:**

- Redeploy contract to new address
- Focus on core features only
- Document known issues in thesis limitations section

---

## 10. Success Criteria

### Technical Success

- ✅ Smart contract deployed to Sepolia testnet
- ✅ Frontend application accessible online (Render)
- ✅ Complete supply chain workflow functions end-to-end
- ✅ QR code generation and scanning works on mobile
- ✅ Consumer can view product history without wallet
- ✅ No critical security vulnerabilities
- ✅ Test coverage >70%
- ✅ Gas costs <0.01 ETH per transaction (testnet)

### Academic Success

- ✅ Thesis demonstrates understanding of blockchain technology
- ✅ Clear problem statement and solution
- ✅ Proper literature review (15+ academic sources)
- ✅ Methodology clearly explained
- ✅ Results analyzed objectively
- ✅ Limitations discussed honestly (GIGO problem)
- ✅ Meets OAMK thesis formatting requirements
- ✅ Successful thesis defense

### Learning Objectives

- ✅ Team understands blockchain fundamentals
- ✅ Proficiency in Solidity and smart contract development
- ✅ Experience with Web3 frontend integration
- ✅ Understanding of supply chain management
- ✅ Academic research and writing skills
- ✅ Portfolio-worthy project for all team members

---

## 11. Deliverables Checklist

### Code & Application

- [ ] Smart contract source code (Solidity)
- [ ] Frontend application (Next.js)
- [ ] Database schema and migrations (Prisma)
- [ ] Deployment scripts
- [ ] Test suite (unit + integration)
- [ ] GitHub repository with clear README
- [ ] Deployed application (Render)
- [ ] Contract verified on Etherscan

### Documentation

- [ ] Technical documentation (architecture, API, contracts)
- [ ] User manual (how to use the system)
- [ ] Deployment guide
- [ ] Test report
- [ ] Demo video (3-5 minutes)
- [ ] Code comments (inline documentation)

### Academic

- [ ] Complete thesis (40-60 pages)
- [ ] Defense presentation slides
- [ ] Literature review bibliography
- [ ] System diagrams and flowcharts
- [ ] Test results and analysis
- [ ] Screenshots and figures

---

## 12. Testing Strategy

### Smart Contract Testing

**Unit Tests:**

- Test each function independently
- Test access control (only authorized roles)
- Test edge cases (invalid dates, empty strings)
- Test event emissions

**Integration Tests:**

- Test complete product lifecycle
- Test multi-party verification flow
- Test reputation system updates

**Tools:** Hardhat + Chai + Mocha

**Target:** >80% code coverage

---

### Frontend Testing

**Manual Testing:**

- Cross-browser compatibility
- Mobile responsiveness
- Wallet connection flow
- Transaction success/failure handling
- Error messages clarity

**User Acceptance Testing:**

- Complete supply chain simulation
- QR code scanning on various devices
- Performance on slow connections

---

### Security Testing

**Checklist:**

- [ ] No private keys in code
- [ ] Input validation on all forms
- [ ] SQL injection prevention (Prisma handles this)
- [ ] Access control on API routes
- [ ] Smart contract reentrancy protection
- [ ] Integer overflow protection (Solidity 0.8+)

---

## 13. Budget (Zero-Cost Approach)

### Required (Free)

| Item               | Cost | Source                                          |
| ------------------ | ---- | ----------------------------------------------- |
| Development tools  | €0   | Open source (VS Code, Git, Hardhat)             |
| Test ETH           | €0   | Sepolia faucets                                 |
| Hosting            | €0   | Render free tier (750 hours/month)              |
| Database           | €0   | Supabase free tier (1GB storage, 2GB bandwidth) |
| Domain (optional)  | €0   | Render subdomain                                |
| Learning resources | €0   | Free tutorials (Cyfrin, docs)                   |

### Optional (If Budget Available)

| Item            | Cost        | Purpose                 |
| --------------- | ----------- | ----------------------- |
| Custom domain   | €10/year    | Professional appearance |
| Cloudinary/IPFS | €0-20/month | Image hosting           |
| Premium hosting | €20/month   | Better performance      |

### Cost Savings from Architectural Decisions

| Decision                               | Cost Saved  | Rationale                               |
| -------------------------------------- | ----------- | --------------------------------------- |
| IoT Simulator (no real hardware)       | €150-200    | Raspberry Pi + sensors + accessories    |
| Next.js Monolith (no separate backend) | €0-15/month | No need for separate server hosting     |
| Supabase Free Tier                     | €25/month   | vs. paid PostgreSQL hosting             |
| Testnet (no mainnet)                   | €100-1000+  | Gas fees for real Ethereum transactions |

**Total Required: €0**
**Total Optional: €0-50**
**Total Saved: €275-1240+ through smart architecture choices**

---

## 14. Communication Plan

### Weekly Meetings

**Day:** Every Monday, 14:00-15:00
**Format:** In-person or Discord

**Agenda:**

1. Review previous week progress
2. Discuss blockers and challenges
3. Plan current week tasks
4. Assign responsibilities
5. Q&A and knowledge sharing

---

### Communication Channels

**GitHub:**

- Issue tracking
- Pull request reviews
- Project board (Kanban)

**Discord/Telegram:**

- Daily updates
- Quick questions
- Screen sharing for debugging

**Google Drive/OneDrive:**

- Shared documents
- Thesis drafts
- Meeting notes

---

### Progress Tracking

**GitHub Projects Board:**

```
To Do → In Progress → Review → Done
```

**Weekly Progress Reports:**
Each member submits:

- What I completed
- What I'm working on
- Blockers/challenges
- Time spent

---

## 15. Contact & Resources

### Team Contact

**Person 1 (Sam):**

- GitHub: [FuzzyKala](https://github.com/FuzzyKala)
- Email: [Your email]

**Person 2:**

- GitHub: [Username]
- Email: [Email]

**Person 3:**

- GitHub: [Username]
- Email: [Email]

---

### Key Resources

**Blockchain & Solidity:**

- Cyfrin Updraft: https://updraft.cyfrin.io/
- Solidity Docs: https://docs.soliditylang.org/
- OpenZeppelin: https://docs.openzeppelin.com/

**Web3 Frontend:**

- Wagmi: https://wagmi.sh/
- RainbowKit: https://www.rainbowkit.com/
- Viem: https://viem.sh/

**Supply Chain References:**

- Walmart Case Study: https://www.lfdecentralizedtrust.org/case-studies/walmart-case-study
- IBM Food Trust: https://www.ibm.com/blockchain/solutions/food-trust

**Academic:**

- MIT Thesis: https://dspace.mit.edu/handle/1721.1/118559
- OAMK Ruokajälki: https://www.oamk.fi/en/partnership/rdi-projects/ruokajalki

---

## 16. Next Steps

### Immediate Actions (This Week)

**Day 1-2:**

- [ ] All team members read this brief
- [ ] Schedule first team meeting
- [ ] Create GitHub repository
- [ ] Setup communication channels

**Day 3-4:**

- [ ] Clone Next-Web3-Boilerplate
- [ ] Install all development tools
- [ ] Create 4 test wallets
- [ ] Get test ETH from faucets
- [ ] Start Solidity learning (Cyfrin Updraft)

**Day 5-7:**

- [ ] Complete environment setup
- [ ] Deploy first "Hello World" contract to testnet
- [ ] Experiment with wallet connection
- [ ] Finalize project scope and timeline

---

### Week 1 Kickoff Meeting Agenda

1. Introduction and role assignments (15 min)
2. Review project brief together (30 min)
3. Setup development environments together (45 min)
4. Deploy first test contract (30 min)
5. Plan Week 2 activities (15 min)
6. Q&A (15 min)

**Total: 2.5 hours**

---

## 17. Questions & Answers

### Can we change the tech stack?

**A:** Minor changes are OK (e.g., Tailwind instead of Chakra UI), but major changes (e.g., different blockchain) should be discussed as a team and may impact timeline.

### What if we don't finish development in 9 weeks?

**A:** The MVP is designed to be achievable in 9 weeks (Weeks 1-9). If delays occur:

1. Remove optional features first (reputation, EXIF)
2. Simplify the demo (fewer products, fewer roles)
3. Focus on thesis writing (Weeks 10-12) with current implementation

### Do we need real business partners?

**A:** No! Simulated testing is completely acceptable for academic projects. You will act as all roles using different wallets.

### What if smart contracts are too difficult?

**A:** We've designed a simple contract structure. If needed:

- Use more OpenZeppelin pre-built code
- Simplify the data structure
- Focus more on frontend and less on complex contract logic

### How much will this cost?

**A:** €0 if you stick to free tiers and testnet. All tools and services we've chosen have free plans sufficient for this project.

### Why use an IoT simulator instead of real sensors?

**A:** Our IoT simulator approach is:

- **Academically valid**: Standard practice in POC development (IBM Food Trust uses test harnesses)
- **Cost-effective**: Saves €150-200 on hardware
- **More reliable**: No sensor failures during thesis presentation
- **Reproducible**: Reviewers can test without hardware
- **Focused**: Keeps thesis focus on blockchain innovation, not IoT engineering
- **Extensible**: Architecture supports future migration to real MQTT sensors

The simulator generates data identical to real sensors, demonstrating the same blockchain traceability concepts.

### Should we use Next.js monolith or separate Node.js backend?

**A:** Use **Next.js monolith** (frontend + backend together) because:

- **Simpler deployment**: One Render deployment instead of two services
- **No CORS issues**: Frontend and API in same app
- **Team efficiency**: Everyone knows Next.js already
- **Cost**: Free hosting on Render (750 hours/month free tier)
- **Perfect for MVP**: Suitable for 10-week POC project
- **Render advantage**: Runs as traditional Node.js server (not serverless), no cold starts

Only consider separate Node.js backend if you need WebSockets, MQTT, or background jobs (not needed for this thesis).

### Why Supabase instead of vanilla PostgreSQL?

**A:** Supabase provides:

- **Built-in connection pooling** (pgBouncer) - critical for serverless
- **Prevents database exhaustion** - Next.js serverless functions create many connections
- **PostgreSQL-compatible** - no SQL changes needed
- **Free tier** - generous enough for thesis
- **Easy setup** - 15 minutes vs. 2 hours for self-hosted PostgreSQL

---

## 18. Glossary

**Blockchain:** Distributed ledger technology providing immutable record-keeping
**Smart Contract:** Self-executing code on the blockchain
**Solidity:** Programming language for Ethereum smart contracts
**Testnet:** Test blockchain network (Sepolia) with no real value
**Mainnet:** Production blockchain with real cryptocurrency
**Gas:** Transaction fee paid to execute blockchain operations
**Wallet:** Software for managing blockchain accounts (MetaMask)
**Wagmi:** React hooks library for Ethereum
**GIGO:** "Garbage In, Garbage Out" - data quality problem
**Oracle Problem:** Challenge of connecting blockchain to real-world data
**MVP:** Minimum Viable Product - simplest version that works
**Sepolia:** Ethereum test network
**IPFS:** InterPlanetary File System - decentralized storage
**QR Code:** Quick Response code for product identification

---

## Approval & Sign-off

**Project Brief Version:** 1.1
**Date:** October 2025 - January 2026
**Last Updated:** October 24, 2025
**Status:** Ready for BMAD PM Agent (PRD creation)

**Reviewed by:**

- [ ] Person 1 (Sam)
- [ ] Person 2
- [ ] Person 3

**Comments/Changes:**
[To be filled after team review]

---

**Once approved, this document becomes the source of truth for the project. Any major changes should be documented and agreed upon by all team members.**

---

## Appendix A: Sample Product Data Structure

```json
{
  "productId": "OUL-BLU-2025-001",
  "name": "Oulu Organic Wild Blueberries",
  "category": "Fresh Produce",
  "origin": {
    "farm": "Hirsimäki Farm",
    "location": "Yli-Ii, Oulu Region, Finland",
    "coordinates": { "lat": 65.3, "lon": 26.0 }
  },
  "production": {
    "harvestDate": "2025-07-15T06:00:00Z",
    "variety": "Vaccinium myrtillus",
    "certifications": ["EU Organic FI-EKO-201-45678"],
    "weight": "5.2 kg",
    "quantity": "10 containers x 520g"
  },
  "blockchain": {
    "contractAddress": "0x1234...5678",
    "creatorAddress": "0xabcd...ef01",
    "blockNumber": 12345678,
    "transactionHash": "0x9876...5432",
    "verified": true,
    "verificationCount": 3
  },
  "traceHistory": [
    {
      "stage": "Harvest",
      "timestamp": "2025-07-15T06:00:00Z",
      "actor": "0xabcd...ef01",
      "location": "Yli-Ii Farm",
      "notes": "Hand-picked, Grade A quality"
    },
    {
      "stage": "Processing",
      "timestamp": "2025-07-15T14:00:00Z",
      "actor": "0x2345...6789",
      "location": "Oulu Processing Facility",
      "notes": "Quality checked, packaged"
    },
    {
      "stage": "Distribution",
      "timestamp": "2025-07-16T08:00:00Z",
      "actor": "0x3456...789a",
      "location": "En route to Helsinki",
      "temperature": "2-4°C"
    },
    {
      "stage": "Retail",
      "timestamp": "2025-07-17T15:00:00Z",
      "actor": "0x4567...89ab",
      "location": "K-Market Helsinki",
      "notes": "Stocked in refrigerated section"
    }
  ]
}
```

---

## Appendix B: IoT Simulator Data Structure

### Simulated Sensor Reading Format

```json
{
  "productId": "OUL-BLU-2025-001",
  "scenario": "normal",
  "temperature": 3.2,
  "humidity": 85.4,
  "gps": {
    "lat": 65.0121,
    "lng": 25.4651
  },
  "location": "Oulu Distribution Center",
  "timestamp": "2025-07-16T14:23:45.123Z",
  "sensorId": "SENSOR_042",
  "source": "simulated",
  "metadata": {
    "batteryLevel": 94.2,
    "signalStrength": 87.5,
    "firmwareVersion": "v1.0.0-simulated"
  }
}
```

### Database Schema (Prisma)

```prisma
model SensorReading {
  id          String   @id @default(cuid())
  productId   String
  temperature Float    // Celsius
  humidity    Float    // Percentage
  gps         Json     // { lat: number, lng: number }
  location    String
  timestamp   DateTime @default(now())
  sensorId    String
  source      String   @default("simulated") // "simulated" | "iot" | "manual"
  scenario    String?  // "normal" | "warning" | "critical"
  metadata    Json?    // Battery, signal strength, etc.

  product     Product  @relation(fields: [productId], references: [id])
  alerts      Alert[]

  @@index([productId, timestamp])
}

model Alert {
  id              String   @id @default(cuid())
  productId       String
  type            String   // "TEMPERATURE_VIOLATION", "GPS_OUT_OF_RANGE"
  severity        String   // "WARNING", "CRITICAL"
  message         String
  resolved        Boolean  @default(false)
  createdAt       DateTime @default(now())
  sensorReadingId String?

  sensorReading   SensorReading? @relation(fields: [sensorReadingId], references: [id])
}
```

### API Endpoint: `/api/iot/simulate`

**Request:**

```typescript
POST /api/iot/simulate
Content-Type: application/json

{
  "productId": "OUL-BLU-2025-001",
  "scenario": "critical", // "normal" | "warning" | "critical"
  "temperature": 12.5,
  "humidity": 78.2,
  "gps": { "lat": 65.0121, "lng": 25.4651 },
  "location": "Oulu Distribution Center"
}
```

**Response:**

```typescript
{
  "success": true,
  "readingId": "clxy123abc456",
  "blockchainTxHash": "0x1234...5678",
  "alert": "TEMPERATURE_VIOLATION" // or null
}
```

### Smart Contract Function

```solidity
function addSensorReading(
    string memory productId,
    int256 temperature,      // Stored as int (3.2°C = 320)
    uint256 humidity,        // Stored as uint (85% = 8500)
    string memory location,
    string memory sensorId
) public onlyAuthorized returns (uint256) {
    require(bytes(productId).length > 0, "Invalid product ID");

    uint256 readingId = sensorReadingCount++;

    sensorReadings[readingId] = SensorReading({
        productId: productId,
        temperature: temperature,
        humidity: humidity,
        location: location,
        sensorId: sensorId,
        timestamp: block.timestamp,
        recorder: msg.sender
    });

    emit SensorDataRecorded(
        readingId,
        productId,
        temperature,
        sensorId,
        block.timestamp
    );

    return readingId;
}
```

---

## Appendix C: Weekly Checkpoint Questions

**Use these questions at each weekly meeting:**

1. Are we on track with the timeline?
2. Are there any blockers preventing progress?
3. Do we need to adjust the scope?
4. Is everyone clear on their tasks for next week?
5. Do we need external help or resources?
6. Are we documenting our progress?
7. Is the team morale good?

---

**END OF PROJECT BRIEF**

_This document should be reviewed and updated as the project progresses. Major changes require team consensus._
