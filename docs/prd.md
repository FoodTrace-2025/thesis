# Product Requirements Document (PRD)

## FoodTrace - Blockchain-Based Food Supply Chain Traceability System

**Version:** 1.3\
**Date:** November 20, 2025\
**Status:** Ready for Epic Sharding\
**Project Type:** Bachelor's Thesis (OAMK University of Applied Sciences)\
**Team:** Sam Chou (Blockchain Lead), TaiSheng Chen (Backend/Integration Lead), YiLing Chen (UI/UX Lead)\
**Timeline:** 12 weeks (9 weeks development + 3 weeks thesis writing)\

---

## Document Control

| Version | Date       | Author   | Changes                                                                                                                                                                                                                                |
| ------- | ---------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.1     | 2025-10-30 | PM Agent | Initial draft created from brief.md                                                                                                                                                                                                    |
| 1.0     | 2025-10-30 | PM Agent | Architecture finalized, security hardening added                                                                                                                                                                                       |
| 1.1     | 2025-11-14 | Team     | Session 12: Added Section 7 (High-Level Architecture), Next.js Pages Router corrections, contract address placeholders, timeline updated to End of Week 0                                                                              |
| 1.2     | 2025-11-14 | Team     | Session 12: Added Executive Summary (9 sections, ~230 lines) for quick supervisor review - addresses document length concern                                                                                                           |
| 1.3     | 2025-11-20 | Team     | Session 19A: Epic renumbering (0/0.5/0.6/0.7/1/1.5/2-7/9 → 1-13 sequential), removed Epic 8 Multi-Language (OUT OF SCOPE), standardized epic count to 13, deleted duplicate metadata section (~60 lines), updated all cross-references |

**Review Status:**

- [ ] PO Agent Validation (Target: >90% alignment with brief.md)
- [ ] Team Review (All 3 members)
- [ ] Supervisor Approval (After kickoff meeting Oct 31)

---

## 📖 READING GUIDE FOR ACADEMIC SUPERVISORS

This PRD uses BMAD rapid prototyping methodology with product development terminology (epics, user stories, MoSCoW prioritization). Key sections for thesis evaluation:

- **Section 1.3**: Research Objectives (aligns with thesis RQ1-RQ5, SO1-SO6)
- **Section 1.6**: Academic Contribution (research gaps addressed)
- **Section 4**: 12-Week Development Timeline (major milestones)
- **Section 5**: Success Criteria + Total Hours (1,200h breakdown)
- **Section 7**: System Architecture (technical approach)

**Optional reading**: Section 2 (User Personas), Section 6 (Detailed Epic Breakdown) provide development context but can be skipped for initial academic review.

---

## Executive Summary

> **For Quick Review:** This executive summary provides a 5-10 minute overview of the FoodTrace thesis project. For comprehensive details, see Sections 1-7 (42 pages).

---

### 1. Problem Statement

Traditional food supply chains lack transparency and rapid traceability. Walmart's 2016 case study demonstrated that tracing product origins required **7 days using paper records**, enabling contamination spread and delayed recalls. Current systems suffer from data silos (no shared source of truth), manual verification (easily forged certificates), and centralized databases (vulnerable to tampering). The WHO estimates 600 million people fall ill annually from contaminated food, costing the global economy $110 billion.

**Core Challenge:** How can blockchain technology enable transparent, immutable food traceability while solving the critical UX barrier (research shows 80% of users abandon wallet setup due to complexity)?

---

### 2. Proposed Solution

**FoodTrace** is a proof-of-concept blockchain-based food traceability platform enabling transparent tracking from Producer → Distributor → Retailer → Consumer using Ethereum smart contracts and a wallet-free consumer interface.

**Key Innovations:**

1. **Custodial Wallets:** Email/password login for business users (no MetaMask required) - solves 80% abandonment rate
2. **Wallet-Free Consumer Access:** QR code scanning without wallet installation - zero friction verification
3. **Hybrid Storage:** Critical data on-chain (immutable), metadata off-chain (cost optimized) - 96% gas savings
4. **IoT Simulation:** Software-based sensor data generation - saves €150-200 hardware costs, 3 weeks development time
5. **Multi-Tenant Security:** AES-256 encrypted wallets, company-scoped data isolation

**Academic Contribution:** Demonstrates Ethereum public blockchain viability for small-producer scenarios (addresses research gap: while 88.3% of blockchain food supply chain frameworks address traceability/transparency, only 3-5% address small producer financing and donation systems - Ellahi et al., 2024).

---

### 3. Technical Approach

**Architecture:** 3-tier system optimized for 12-week academic timeline and zero-cost infrastructure

```
USER INTERFACE LAYER
├─ Producer Portal (register products, generate QR codes)
├─ Distributor Portal (receive, trace, quality checks)
├─ Retailer Portal (stock, sell, inventory management)
├─ Consumer Query (wallet-free QR scanning)
└─ IoT Simulator (admin interface, 3 scenarios)

NEXT.JS MONOLITH (Frontend + Backend)
├─ Web3 Layer: Wagmi v2 + RainbowKit + Viem
├─ API Routes: /products, /traces, /sensors, /auth
├─ Custodial Wallets: AES-256 encrypted keys
└─ Multi-Tenant Isolation: Company-scoped queries

DATA LAYER
├─ Ethereum Sepolia: Smart contracts (Product Registry, Trace Records, Sensor Data)
└─ Supabase PostgreSQL: Metadata, images, search indexes, encrypted wallets
```

**Key Technology Decisions:**

- **Next.js Monolith** (vs separate backend): Simpler deployment, no CORS issues, single Render.com instance
- **Supabase PostgreSQL** (vs vanilla): Built-in pgBouncer prevents connection exhaustion (critical for serverless)
- **Custodial Wallets** (vs MetaMask): Matches IBM Food Trust pattern, solves UX barrier for Finnish farmers
- **IoT Simulator** (vs real hardware): Academic validity, reproducible demos, €150-200 savings
- **Ethereum Sepolia** (vs Hyperledger): Public transparency, educational value, testnet = €0 cost

**Tech Stack:**

- Frontend: Next.js 14 (Pages Router) + React 18 + TypeScript 5.8+ + Chakra UI v2
- Smart Contracts: Solidity ^0.8.20 + Hardhat + OpenZeppelin (>70% test coverage)
- Backend: Node.js 18.x LTS + Prisma ORM + NextAuth.js
- Blockchain: Ethereum Sepolia testnet (test ETH from faucets)
- Database: Supabase PostgreSQL with pgBouncer connection pooling
- Deployment: Render.com (Node.js server mode, 750h/month free tier)

---

### 4. Timeline & Key Milestones

**12-Week Schedule (9 weeks development + 3 weeks thesis writing)**

| Week      | Phase            | Critical Deliverables                       | Risk Level   |
| --------- | ---------------- | ------------------------------------------- | ------------ |
| **0**     | Pre-Kickoff      | Documentation ready ✅                      | ✅ Complete  |
| **1**     | Setup & Learning | Environments, 3 wallets, Solidity basics    | Low          |
| **2**     | Planning         | **PRD + Architecture (NON-NEGOTIABLE)**     | **CRITICAL** |
| **3-4**   | Smart Contracts  | Deployed to Sepolia, >70% test coverage     | High         |
| **5-7**   | Frontend Dev     | 4-role UIs, Web3 integration, IoT simulator | Medium       |
| **8**     | Testing          | E2E tests, bug fixes, deployment to Render  | Medium       |
| **9**     | Polish           | Demo video, documentation, production-ready | Low          |
| **10-12** | Thesis Writing   | 60+ pages, poster, defense preparation      | Low          |

**Critical Success Gates:**

- 🟡 **Week 0:** PRD + Architecture approved by supervisor (>90% alignment)
- 🔴 **Week 4:** Smart contracts deployed to Sepolia testnet (if missed, thesis fails)
- 🟡 **Week 9:** Complete POC deployed and demo-ready (buffer = Week 10 for fixes)

**Current Status:** End of Week 0, Ready for Week 2 Workflow (10% complete)

---

### 5. Risk Assessment

| Risk Category                 | Level           | Mitigation Strategy                                                        | Contingency Plan                                            |
| ----------------------------- | --------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Smart Contract Complexity** | 🟡 Medium       | Use OpenZeppelin templates; allocate 2 weeks learning; >70% test coverage  | Simplify contract logic; remove reputation system if behind |
| **Wallet UX Barrier**         | 🟢 Low (Solved) | Custodial wallets with email/password login                                | IBM Food Trust pattern validated in production              |
| **Timeline Pressure**         | 🟡 Medium       | Strict MoSCoW prioritization; cut COULD HAVE features at Week 6 checkpoint | Drop Epic 12 (Visualization), optional features             |
| **Gas Cost Uncertainty**      | 🟢 Low          | Testnet deployment only (€0 cost); struct packing optimization             | Document in thesis as "mainnet limitation"                  |
| **Team Skill Gaps**           | 🟡 Medium       | Cyfrin Updraft Solidity course (Week 1); Web3 documentation                | Person 1 focuses 70% on Solidity; Person 2 owns testing     |

**Overall Risk:** 🟡 **Medium** - Manageable with proactive scope control and MUST HAVE focus

---

### 6. Success Criteria

**Technical Success (Minimum Viable Thesis):**

- ✅ Smart contracts deployed to Sepolia testnet (verified on Etherscan)
- ✅ Frontend application accessible online (Render.com hosting)
- ✅ Complete supply chain workflow: Producer → Distributor → Retailer → Consumer
- ✅ QR code generation and scanning works on mobile devices
- ✅ Consumer query interface functions wallet-free (no MetaMask)
- ✅ Test coverage >70% for smart contracts (Hardhat + Chai + Mocha)
- ✅ Gas costs <100,000 per transaction (Sepolia testnet equivalent)
- ✅ Multi-tenant data isolation verified (Company A ≠ Company B)

**Academic Success (Thesis Quality):**

- ✅ Demonstrates understanding of blockchain fundamentals and enterprise patterns
- ✅ Clear problem statement with real-world context (Walmart 7-day → 2.2s case study)
- ✅ Proper literature review (20+ academic sources, Zhao et al. 2019 + Ellahi et al. 2024 systematic reviews)
- ✅ Methodology clearly explained (BMAD + Agile, justification for testnet/simulator)
- ✅ Results analyzed objectively (gas costs, performance metrics, user testing)
- ✅ **Honest limitations discussion** (custodial wallet trade-offs, oracle problem, GDPR conflicts)
- ✅ Meets OAMK thesis formatting requirements (60+ pages, IEEE references)
- ✅ Successful thesis defense with demo

**Business Value (Portfolio Quality):**

- ✅ Demonstrates production-grade architecture patterns (IBM Food Trust comparison)
- ✅ Solves real UX problem (custodial wallets for non-crypto users)
- ✅ Portfolio-worthy implementation for all 3 team members
- ✅ Potential startup evolution post-thesis (optional, not required)

---

### 7. Feature Prioritization (MoSCoW)

**🔴 MUST HAVE (Non-Negotiable - Core Features):**

- Epic 1: Project Setup & Foundation
- Epic 2: Company & User Management (Multi-tenant, Custodial wallets)
- Epic 3: Security Hardening (AES-256 encryption, audit logging)
- Epic 4: Component Library (Reusable React components, design system)
- Epic 5: Product Registration (Producer interface, blockchain integration)
- Epic 7: Supply Chain Tracking (Distributor/Retailer trace records)
- Epic 9: Consumer Query (Wallet-free QR scanning, public RPC queries)
- Epic 11: QR Codes (Generation + scanning, mobile-responsive)
- Epic 13: Deployment & DevOps (Supabase + Render.com)

**🟡 SHOULD HAVE (Enhancements - High Value):**

- Epic 6: Product Transfer Workflow (Email notifications, status updates)
- Epic 8: IoT Sensor Simulator (Temperature/humidity monitoring)
- Epic 10: Multi-Party Verification (Optional - reputation system)
- Epic 12: Data Visualization (Product journey timeline, charts)

**🟢 COULD HAVE (Nice-to-Have - 5% effort, cut at Week 6 if behind):**

- Advanced search/filtering
- Batch product registration
- Real-time WebSocket updates

**⚪ WON'T HAVE (Out of Scope):**

- Mainnet deployment (gas costs prohibitive)
- Real IoT hardware (€150-200 + 3 weeks)
- AI anomaly detection (complex ML integration)
- Mobile native apps (PWA sufficient)
- IPFS decentralized storage (standard cloud acceptable)

---

### 8. Resource Allocation

**Team Capacity:**

- Sam (Blockchain Lead): 165-185 hours (39-44% of 420h capacity)
- TaiSheng (Backend/Integration): 180-205 hours (43-49% capacity)
- YiLing (UI/UX Lead): 190-226 hours (45-54% capacity)
- **Total:** 535-616 hours across 3 people (42-49% team capacity utilization)

**Budget:** €0 (all free-tier services)

- Development tools: Free (VS Code, Git, Hardhat)
- Test ETH: Free (Sepolia faucets)
- Hosting: Free (Render 750h/month, Supabase 1GB)
- Learning: Free (Cyfrin Updraft, official documentation)

**Cost Savings Through Architectural Decisions:**

- IoT Simulator (vs hardware): €150-200 saved
- Next.js Monolith (vs separate backend): €15/month saved
- Supabase Free Tier (vs paid PostgreSQL): €25/month saved
- Testnet (vs mainnet): €100-1,000+ gas fees saved
- **Total Saved:** €290-1,240+ through smart architecture choices

---

### 9. Recommendation

**✅ APPROVE FOR THESIS EXECUTION**

**Rationale:**

1. **Technically Feasible:** Architecture validated against IBM Food Trust and Walmart case studies
2. **Timeline Realistic:** 535-616 hours estimated vs 1,260 hours available (42-49% utilization)
3. **Academic Merit:** Addresses research gap (95% of blockchain food frameworks focus on enterprise traceability, only 3-5% on small producer financing/donation - Ellahi et al., 2024)
4. **Risk Mitigated:** MoSCoW prioritization enables scope cuts if behind schedule
5. **Zero Cost:** All free-tier infrastructure, no budget required
6. **Production Patterns:** Custodial wallets + hybrid storage match enterprise best practices
7. **Learning Value:** Team gains Solidity, Web3, blockchain architecture expertise

**Conditions for Approval:**

- Week 2 milestone (PRD + Architecture) must complete by Nov 14 ✅ (Completed)
- Week 4 milestone (Smart contracts deployed to Sepolia) is non-negotiable
- If behind at Week 6 checkpoint, cut COULD HAVE features
- Thesis honestly documents limitations (oracle problem, custodial trade-offs, testnet constraints)

**Expected Thesis Grade:** 4-5/5 (Strong implementation + honest limitations discussion)

---

**For Comprehensive Details:**

- Section 1: Product Vision & Goals (3 pages)
- Section 2: User Personas (5 detailed personas, 8 pages)
- Section 3: Feature Prioritization (MoSCoW + dependency map, 4 pages)
- Section 4: Development Timeline (12-week schedule, epic breakdown, 10 pages)
- Section 5: Success Metrics (technical, academic, business, 3 pages)
- Section 6: Epic Breakdown (9 epics with user stories, acceptance criteria, 22 pages)
- Section 7: High-Level System Architecture (detailed decisions, data flows, 7 pages)

**Total Document:** ~2,900 lines (~48 pages) - Comprehensive thesis planning document

---

## Table of Contents

**Executive Summary** (Start Here - 5-10 min read)

**Detailed Sections** (42 pages)

1. [Product Vision & Goals](#1-product-vision--goals)
2. [User Personas](#2-user-personas)
3. [Feature Prioritization](#3-feature-prioritization)
4. [Development Timeline](#4-development-timeline)
5. [Success Metrics](#5-success-metrics)
6. [Epic Breakdown](#6-epic-breakdown)
7. [High-Level System Architecture](#7-high-level-system-architecture)

**Supporting Documents** (See Document References section) 8. Team Roles & Responsibilities 9. Technical Constraints 10. Definition of Done Checklist 11. Next Steps 12. Change Management

---

## 1. Product Vision & Goals

### 1.1 Vision Statement

> **"Make food supply chains transparent and trustworthy through blockchain technology, enabling consumers to trace their food from farm to table in seconds - not days."**

FoodTrace is a proof-of-concept blockchain-based food traceability platform that demonstrates how Ethereum smart contracts can solve critical transparency challenges in modern food supply chains.

---

### 1.2 Problem Statement

#### The Problem

**Current State:** Traditional food supply chains suffer from:

- **Slow traceability**: Walmart took 7 days to trace mangoes back to source (2016)
- **Limited transparency**: Consumers cannot verify product authenticity or journey
- **Data tampering risk**: Centralized databases can be modified without detection
- **Multi-stakeholder coordination**: No shared source of truth across producers, distributors, retailers
- **Food safety incidents**: Delayed recalls lead to health risks and economic losses

**Impact:**

- WHO (2022) estimates 600 million people fall ill from contaminated food annually
- Food fraud costs $30-40 billion annually (PwC, 2017, cited in European Review of Agricultural Economics, 2022)
- 94% of consumers want supply chain transparency (Label Insight, 2016)
- Traditional systems rely on trust, not cryptographic proof

---

#### Why Blockchain?

**Blockchain Advantages:**

1. **Immutability**: Once recorded, data cannot be altered or deleted
2. **Transparency**: All authorized participants can verify the same information
3. **Decentralization**: No single point of failure or control
4. **Speed**: Real-time traceability (seconds vs days)
5. **Cryptographic proof**: Mathematical certainty instead of trust

**Real-World Validation:**

- **Walmart + IBM Food Trust**: Reduced traceability from 7 days → 2.2 seconds
- **Carrefour**: Blockchain tracking increased sales by 20% (consumer trust)
- **Nestlé**: Tracks milk from New Zealand farms to Middle East consumers

---

### 1.3 Project Goals

#### Primary Goals (MUST Achieve)

1. **Demonstrate Technical Feasibility**

   - Deploy functional smart contracts to Ethereum Sepolia testnet
   - Implement complete product journey tracking (Producer → Distributor → Retailer → Consumer)
   - Achieve >70% smart contract test coverage
   - Create wallet-free consumer query interface

2. **Academic Excellence**

   - Produce 60+ page thesis meeting OAMK standards
   - Demonstrate understanding of enterprise blockchain architecture
   - Compare Ethereum vs Hyperledger Fabric (justify platform choice)
   - Document limitations honestly (GIGO problem, scalability challenges)

3. **User Experience Innovation**

   - Solve "crypto wallet barrier" with custodial wallet architecture
   - Enable email/password login for business users (no MetaMask required)
   - Automated product transfer workflow with notifications
   - Mobile-responsive QR code scanning

4. **Production-Grade Security**
   - Implement AES-256 encryption for private keys
   - Multi-tenant data isolation (companies cannot access each other's data)
   - Audit logging for wallet operations
   - Follow enterprise blockchain security patterns (IBM Food Trust model)

---

#### Secondary Goals (SHOULD Achieve)

5. **Realistic Enterprise Architecture**

   - Multi-tenant SaaS platform operator model
   - Company invitation-only onboarding (prevent spam)
   - Admin approval workflow for company registration
   - Automated email notifications for supply chain events

6. **IoT Integration Simulation**

   - Temperature/humidity monitoring simulator
   - Three scenarios: Normal (2-4°C), Warning (8-10°C), Critical (>10°C)
   - Alert system for out-of-range conditions
   - Demonstrate blockchain + IoT integration potential

7. **Multi-Party Verification** (Optional)
   - Independent verification by quality inspectors
   - Reputation system for producers
   - Trust indicators for consumers

---

### 1.4 Success Criteria

#### Technical Success

- ✅ Smart contracts deployed to Sepolia testnet (verified on Etherscan)
- ✅ Frontend application accessible online (Render.com hosting)
- ✅ Complete supply chain workflow functions end-to-end (Producer → Consumer)
- ✅ QR code generation and scanning works on mobile devices
- ✅ Consumer can view product history without wallet or registration
- ✅ Test coverage >70% for smart contracts
- ✅ Gas costs <0.01 ETH per transaction (testnet equivalent)
- ✅ Cross-tenant data isolation verified (Company A cannot see Company B)

---

#### Academic Success

- ✅ Thesis demonstrates understanding of blockchain fundamentals
- ✅ Clear problem statement with real-world context (Walmart case study)
- ✅ Proper literature review (20+ academic sources, Springer 2025 review cited)
- ✅ Methodology clearly explained (BMAD + Agile)
- ✅ Results analyzed objectively (performance, costs, limitations)
- ✅ Honest discussion of limitations (custodial wallet trade-offs, GIGO problem)
- ✅ Meets OAMK thesis formatting requirements
- ✅ Successful thesis defense

---

#### Business Value (Proof-of-Concept)

- ✅ Demonstrates enterprise blockchain feasibility for food traceability
- ✅ Solves real UX barrier (custodial wallets instead of MetaMask)
- ✅ Portfolio-worthy project for all 3 team members
- ✅ Could evolve into real startup post-thesis (optional)

---

### 1.5 Out of Scope

**Explicitly NOT Included:**

❌ **Mainnet Deployment** - Too expensive (gas costs), testnet sufficient for thesis
❌ **Real IoT Hardware** - Raspberry Pi + sensors adds 3 weeks, simulator sufficient
❌ **AI Anomaly Detection** - Complex ML integration, out of timeline
❌ **Mobile Native Apps** - Progressive Web App (PWA) sufficient
❌ **IPFS Decentralized Storage** - Nice-to-have, standard cloud storage acceptable
❌ **Multiple Blockchain Networks** - Sepolia testnet only
❌ **Real Business Partnerships** - Simulated testing with 3 team wallets
❌ **Regulatory Compliance** - GDPR, FDA validation beyond thesis scope
❌ **Production-Scale Testing** - Load testing, thousands of concurrent users

**Why Out of Scope:**

- Limited to 12-week timeline (9 weeks development)
- Focus on proof-of-concept, not production deployment
- Academic thesis, not commercial product launch
- Zero-cost requirement (all tools free tier)

---

### 1.6 Academic Contribution

#### Research Gaps Addressed

This thesis addresses two critical gaps identified in systematic literature reviews:

**1. UX Accessibility Barrier (Voskobojnikov et al., 2021)**

Empirical research analyzing mobile cryptocurrency wallet usage documents that wallet complexity—including seed phrase management, network configuration, and irrecoverable key storage—presents significant adoption barriers for both novice and experienced users, leading to frustration and irreversible monetary losses. Industry data shows 80% user abandonment during wallet setup for blockchain applications.

**FoodTrace Contribution:** Demonstrates custodial wallet pattern enabling email/password authentication for supply chain participants (Producer, Distributor, Retailer) while maintaining blockchain transparency benefits. Consumer interface implements wallet-free verification via public RPC queries, eliminating MetaMask requirement entirely for product authenticity verification.

**2. Small Producer Underrepresentation (Ellahi et al., 2024)**

Systematic review of 60 blockchain food supply chain frameworks reveals 88.3% focus on large-scale enterprise traceability; only 3-5% address small producer financing, food donation systems, and humanitarian applications. The 570 million small farms globally (FAO, 2023) producing 70% of food for 3 billion people remain largely excluded from blockchain traceability benefits due to cost barriers and technical complexity.

**FoodTrace Contribution:** Targets small-scale producers through zero-cost Ethereum Sepolia testnet deployment, simplified onboarding (custodial wallets), and QR code-based product verification accessible to non-technical consumers. Thesis Chapter 7 provides Layer 2 migration analysis (Polygon, zkSync) demonstrating $0.01-$0.26 per-product economics viable for $15-50 retail products.

#### Methodological Contribution

**BMAD Rapid Prototyping for Academic Blockchain Projects:**

This thesis demonstrates that BMAD (Build-Measure-Assess-Decide) methodology enables functional blockchain POC delivery within 12-week bachelor thesis timeline while maintaining academic rigor through:

- Systematic literature review (100+ papers analyzed, Session 13 citation verification)
- Validated enterprise architecture patterns (IBM Food Trust, Walmart case study)
- Comparative platform analysis (Ethereum vs Hyperledger Fabric trade-offs)
- MoSCoW prioritization enabling scope flexibility without compromising core research objectives

#### Platform Selection Justification

**Ethereum Sepolia vs Hyperledger Fabric Decision Matrix:**

Literature review (Springer, 2025; Zhao et al., 2019) documents equal academic adoption of Ethereum (24 papers) and Hyperledger Fabric (24 papers) for food supply chain traceability, suggesting platform-agnostic validity of blockchain approach.

**Selection Criteria Prioritization:**

1. Educational feasibility (12-week constraint, zero prior blockchain experience)
2. Zero-cost infrastructure (testnet availability, no cloud hosting fees)
3. Public verifiability (thesis reviewers can independently verify transactions via Etherscan)
4. Abundant learning resources (Cyfrin Updraft, Ethereum.org, 10+ years community support)

**Ethereum Advantages for Academic POC:**

- Setup time: <30 minutes (Sepolia testnet) vs 40+ hours (Hyperledger multi-node consortium)
- Cost: €0 (free test ETH) vs €50-100/month (AWS/Azure cloud infrastructure)
- Transparency: Public blockchain enables consumer trust verification without consortium membership
- Learning curve: Extensive beginner documentation, stack overflow coverage, video tutorials

**Hyperledger Fabric Advantages (Acknowledged for Production):**

Thesis Discussion (Chapter 6) critically evaluates Ethereum limitations and recommends Hyperledger Fabric for production B2B scenarios:

- Throughput: 2,000-3,500 TPS (Fabric) vs 30-50 TPS (Ethereum L1)
- Transaction costs: Zero fees (consortium) vs $5-13 per transaction (Ethereum mainnet)
- GDPR compliance: Data deletion capability (Fabric) vs immutability conflict (Ethereum)
- Business confidentiality: Private channels (Fabric) vs public transparency (Ethereum)

**Academic Outcome:** Thesis provides evidence-based platform selection framework for future blockchain food traceability research, acknowledging trade-offs honestly rather than evangelizing single platform.

#### Expected Learning Outcomes

Upon completing this thesis, students will demonstrate:

1. **Blockchain Fundamentals**: Design and deploy smart contracts (Solidity ^0.8.20) with role-based access control (OpenZeppelin AccessControl), event emission, gas optimization patterns, and security hardening (reentrancy protection, input validation).

2. **Enterprise Architecture Patterns**: Implement production-grade patterns validated against industry case studies:

   - Custodial wallet management (AES-256 encryption, server-side transaction signing)
   - Multi-tenant data isolation (Supabase row-level security)
   - Hybrid data architecture (on-chain: 87KB critical data, off-chain: 2.3MB metadata, SHA-256 cryptographic linking)

3. **Web3 Integration**: Build wallet-free consumer interfaces using public RPC endpoints (Alchemy), demonstrating understanding of accessibility-decentralization trade-offs in blockchain applications.

4. **Research Methodology**: Conduct systematic literature review (103 verified citations from IEEE, ACM, Springer, Nature), critically evaluate platform trade-offs (Ethereum vs Hyperledger), document limitations honestly (oracle problem, GDPR conflicts, economic viability constraints).

5. **Agile Development**: Execute BMAD rapid prototyping within 12-week constraint, demonstrating MoSCoW prioritization, scope management, and realistic assessment of bachelor thesis feasibility vs enterprise production requirements.

---

## 2. User Personas

### Persona 1: Platform Administrator

**Name:** Laura Virtanen
**Role:** FoodTrace Platform Administrator
**Age:** 28
**Location:** Oulu, Finland
**Tech Savvy:** High (IT background)

#### Background

Laura manages the FoodTrace platform on behalf of the thesis team. She is responsible for onboarding companies, monitoring system health, and ensuring data integrity.

#### Goals

- Approve/reject company registration applications
- Monitor platform usage and blockchain activity
- Generate reports for thesis documentation
- Handle support requests from companies

#### Pain Points

- Manual company approval process (no automated fraud detection)
- Need to monitor multiple dashboards (Supabase, Etherscan, Render logs)
- Responsible for security (wallet encryption, tenant isolation)

#### User Stories

- As a platform admin, I want to **review company applications** so that I can prevent spam/fraud
- As a platform admin, I want to **generate wallet addresses for approved companies** so they can use blockchain
- As a platform admin, I want to **view audit logs** so I can detect suspicious activity
- As a platform admin, I want to **see all companies' data** so I can provide support

#### Tech Profile

- Uses: Supabase dashboard, GitHub, Render.com console
- Comfortable with: SQL queries, blockchain explorers, API testing
- Needs: Admin portal with approval workflow, audit trail viewer

---

### Persona 2: Producer (Farmer)

**Name:** Matti Virtanen
**Role:** Organic Blueberry Producer
**Company:** Hirsimäki Farm (Northern Finland)
**Age:** 52
**Tech Savvy:** Medium (uses smartphone, online banking, WhatsApp)

#### Background

Matti runs a small organic farm producing wild blueberries. He wants to prove his products are authentic Finnish organic berries (not imported fakes). He has smartphone but no crypto wallet experience.

#### Goals

- Register harvested products on blockchain (prove authenticity)
- Generate QR codes to attach to product packaging
- Track which products were sold to which distributors
- Build reputation through verified quality records

#### Pain Points

- **Does NOT have MetaMask or crypto wallet** (major barrier!)
- Does NOT understand "gas fees" or "blockchain confirmations"
- Limited time (busy during harvest season)
- Needs simple, familiar interface (like online banking)

#### User Stories

- As a producer, I want to **register products with email login** (not MetaMask) so I can use the system easily
- As a producer, I want to **upload product photos** so consumers can see what I harvest
- As a producer, I want to **generate QR codes** so I can print and attach to packaging
- As a producer, I want to **transfer products to distributors** so they know shipment is coming
- As a producer, I want to **see my product history** so I can track sales

#### Tech Profile

- Uses: Smartphone (Android), email, online banking, WhatsApp
- Does NOT use: Crypto wallets, blockchain explorers, DeFi apps
- Needs: Email login, simple forms, auto-generated QR codes, email notifications

---

### Persona 3: Distributor (Logistics Company)

**Name:** Liisa Korhonen
**Role:** Quality Assurance Specialist
**Company:** Oulu Logistics Oy
**Age:** 35
**Tech Savvy:** Medium-High (uses inventory management software)

#### Background

Liisa works for a regional food distributor. She receives products from multiple farms, checks quality, and ships to retailers. She needs to maintain cold chain integrity and document quality checks.

#### Goals

- Receive notifications when farmers ship products
- Record temperature during transport (via IoT simulator)
- Add quality inspection notes to blockchain
- Transfer products to retailers with full history

#### Pain Points

- Multiple suppliers use different systems (no standardization)
- Paper-based quality checks (easy to lose/fake)
- Need to prove cold chain maintained (temperature logs)
- Manual email coordination with farmers and retailers

#### User Stories

- As a distributor, I want to **receive email notifications** when products arrive so I can schedule quality checks
- As a distributor, I want to **scan QR codes** to quickly look up product details
- As a distributor, I want to **record temperature readings** so cold chain is documented
- As a distributor, I want to **add quality inspection notes** so retailers know product condition
- As a distributor, I want to **transfer products to retailers** with one click

#### Tech Profile

- Uses: Inventory management software, barcode scanners, email, smartphone
- Comfortable with: QR scanning, forms, dashboards
- Needs: Mobile-responsive interface, QR scanner, automated notifications

---

### Persona 4: Retailer (Supermarket)

**Name:** Tommi Mäkinen
**Role:** Store Manager
**Company:** K-Market Oulu Center
**Age:** 40
**Tech Savvy:** Medium (uses POS system, inventory software)

#### Background

Tommi manages a medium-sized supermarket in Oulu. He wants to stock locally-sourced organic products but needs to verify authenticity (customers demand proof). He's responsible for inventory and product traceability for recalls.

#### Goals

- Verify product authenticity before stocking (check blockchain records)
- Receive products from distributors with full history
- Update product status to "Stocked" and "Sold"
- Quickly trace products if recall needed

#### Pain Points

- Customers demand proof of organic certification (verbal claims not enough)
- Need rapid recall capability (Finnish food authority requirement)
- Multiple suppliers, no unified traceability system
- Staff turnover (need simple system, not complex training)

#### User Stories

- As a retailer, I want to **scan QR codes** to verify product journey before stocking
- As a retailer, I want to **see temperature history** so I know cold chain was maintained
- As a retailer, I want to **update product status** when received/stocked/sold
- As a retailer, I want to **generate consumer-facing QR codes** to display on shelf
- As a retailer, I want to **trace products quickly** if recall happens

#### Tech Profile

- Uses: POS system, inventory software, smartphone, email
- Comfortable with: Barcode scanning, simple forms
- Needs: Quick QR verification, status updates, email notifications

---

### Persona 5: Consumer (End Customer)

**Name:** Sanna Laaksonen
**Role:** Health-Conscious Consumer
**Age:** 29
**Location:** Helsinki, Finland
**Tech Savvy:** High (uses smartphone for everything)

#### Background

Sanna is a young professional who cares about food sustainability and authenticity. She's willing to pay premium for verified organic local products. She wants transparency but has zero interest in crypto/blockchain technology.

#### Goals

- Verify product is actually from Finnish farm (not imported fake)
- See complete product journey (farm → store)
- Check organic certification is real
- View temperature history (was cold chain maintained?)

#### Pain Points

- Skeptical of marketing claims ("organic", "local", "sustainable")
- No way to verify authenticity currently
- **Does NOT want to create account or download app** (major friction!)
- **Does NOT understand blockchain** (and doesn't care to learn)

#### User Stories

- As a consumer, I want to **scan QR code with phone camera** (no app needed) so I can see product journey
- As a consumer, I want to **view product origin** so I can verify it's local
- As a consumer, I want to **see certification details** so I can trust organic claims
- As a consumer, I want to **check temperature logs** so I know cold chain was OK
- As a consumer, I want to **do this WITHOUT registration** so there's no friction

#### Tech Profile

- Uses: Smartphone (iOS/Android), Instagram, online shopping, banking apps
- Does NOT use: Crypto wallets, blockchain apps
- Needs: **Zero-friction access** - scan QR → see info immediately (no login, no account, no app download)

---

### Persona Summary Table

| Persona            | Tech Savvy  | Blockchain Knowledge | Login Required?         | Primary Device       |
| ------------------ | ----------- | -------------------- | ----------------------- | -------------------- |
| **Platform Admin** | High        | Medium               | ✅ Yes (Email + MFA)    | Desktop/Laptop       |
| **Producer**       | Medium      | None                 | ✅ Yes (Email/Password) | Smartphone + Desktop |
| **Distributor**    | Medium-High | None                 | ✅ Yes (Email/Password) | Smartphone + Tablet  |
| **Retailer**       | Medium      | None                 | ✅ Yes (Email/Password) | Smartphone + POS     |
| **Consumer**       | High        | None                 | ❌ **NO** (Wallet-free) | Smartphone           |

**Key Insight:** Only consumers should have zero-friction access. Business users (Producer/Distributor/Retailer) need accounts for audit trail, but should NOT need crypto wallets.

---

## 3. Feature Prioritization

### 3.1 MoSCoW Method

Features prioritized using **MoSCoW framework** (Must Have, Should Have, Could Have, Won't Have):

---

#### 🔴 MUST HAVE (Critical for MVP)

**These features are non-negotiable. Without them, thesis fails.**

| Feature                          | Description                                            | Rationale                                |
| -------------------------------- | ------------------------------------------------------ | ---------------------------------------- |
| **Smart Contract Core**          | Product registration, trace records, blockchain events | Core blockchain functionality            |
| **Custodial Wallets**            | Email/password login, server-side key management       | Solves UX barrier (no MetaMask required) |
| **Multi-Tenant Security**        | Tenant isolation, encryption, audit logs               | Production-grade security                |
| **Product Registration**         | Producers register products with photos, metadata      | Start of supply chain                    |
| **QR Code Generation**           | Auto-generate QR codes on product registration         | Essential for consumer access            |
| **Supply Chain Tracking**        | Distributor/Retailer add trace records                 | Complete supply chain journey            |
| **Consumer Query (Wallet-Free)** | Scan QR → see product journey (no login)               | Core value proposition                   |
| **Database (Supabase)**          | PostgreSQL for metadata, Prisma ORM                    | Off-chain data storage                   |
| **Deployment**                   | Render.com hosting, Sepolia testnet                    | Accessible demo                          |

**Total MUST HAVE Epics:** 1, 2, 3, 4, 5, 7, 9, 11, 13
**Estimated Time:** 65-75 hours
**Risk if cut:** Thesis is incomplete, cannot defend

---

#### 🟡 SHOULD HAVE (High Value)

**These features significantly improve the system but aren't absolutely critical.**

| Feature                       | Description                                       | Rationale                                 |
| ----------------------------- | ------------------------------------------------- | ----------------------------------------- |
| **Product Transfer Workflow** | Automated notifications when products transferred | Professional UX, saves manual emails      |
| **IoT Sensor Simulator**      | Temperature/humidity monitoring (3 scenarios)     | Demonstrates blockchain + IoT integration |
| **Data Visualization**        | Product journey timeline, trace record history    | Better UX, easier to understand           |
| **Multi-Party Verification**  | Independent verification, reputation system       | Trust-building feature                    |

**Total SHOULD HAVE Epics:** 6, 8, 10, 12
**Estimated Time:** 26-34 hours
**Risk if cut:** System works but less impressive, thesis discussion limited

---

#### 🟢 COULD HAVE (Nice to Have)

**These features are valuable but can be cut if timeline pressure.**

| Feature                        | Description                                     | Rationale                      |
| ------------------------------ | ----------------------------------------------- | ------------------------------ |
| **Advanced Search**            | Filter products by company, date, certification | Convenience feature            |
| **Batch Product Registration** | Upload CSV, register multiple products          | Saves time for large producers |
| **Real-Time Updates**          | WebSocket notifications instead of polling      | Professional but not essential |

**Estimated Time:** 10-15 hours
**Cut Strategy:** Drop if behind schedule at Week 6 checkpoint

---

#### ⚪ WON'T HAVE (Out of Scope)

**Explicitly excluded from this thesis.**

| Feature                  | Reason for Exclusion                             |
| ------------------------ | ------------------------------------------------ |
| **Mainnet Deployment**   | Gas costs prohibitive, testnet sufficient        |
| **Real IoT Hardware**    | Adds 3 weeks, simulator demonstrates concept     |
| **Mobile Native App**    | Progressive Web App sufficient, 8-12 hours saved |
| **AI Anomaly Detection** | Complex ML integration, out of timeline          |
| **IPFS Storage**         | Decentralized storage nice-to-have, not critical |
| **Multiple Blockchains** | Cross-chain complexity unnecessary for POC       |
| **Payment Integration**  | Commercial feature, not needed for thesis        |
| **Advanced Reporting**   | Data export sufficient for thesis                |

---

### 3.2 Priority Matrix

**Updated: 2025-12-04 (Session 61)** - Fixed to reflect actual dependencies

```
MUST HAVE (Critical Path)       HIGH VALUE (Do After Critical Path)
┌─────────────────────┐        ┌─────────────────────┐
│ Epic 7: Tracking ✅ │        │ Epic 6: Transfer    │
│ Epic 9: Consumer    │        │ Epic 8: IoT Sim     │
│ Epic 13: Deployment │        │                     │
└─────────────────────┘        └─────────────────────┘
    CRITICAL PATH                  HIGH VALUE ADD-ONS
    (Do in order: 7→9→13)          (Do if time permits)

Note: Epic 11 (QR Scanning) merged into Epic 9 on 2025-12-06

OPTIONAL (Nice to Have)         DON'T DO (Out of Scope)
┌─────────────────────┐        ┌─────────────────────┐
│ Epic 10: Verify     │        │ Real IoT Hardware   │
│ Epic 12: Viz Charts │        │ Mainnet Deployment  │
│ Batch Registration  │        │ AI Anomaly Detection│
└─────────────────────┘        └─────────────────────┘
    CUT IF BEHIND                  OUT OF SCOPE

COMPLETED (Epics 1-5)
┌─────────────────────────────────────────────────────┐
│ Epic 1: Setup ✅  Epic 2: Users ✅  Epic 3: Security ✅ │
│ Epic 4: Components ✅  Epic 5: Registration ✅          │
└─────────────────────────────────────────────────────┘
```

**Key Insight:** Epic 9 (Consumer Query) depends on Epic 7 (Tracking). You cannot
"DO FIRST" Epic 9 without completing Epic 7. The critical path is: **7 → 9 → 13**

---

### 3.3 Dependency Map

**Updated: 2025-12-04 (Session 61)** - Shows current status

```
COMPLETED FOUNDATION (Epics 1-5)
═══════════════════════════════════════════════════════════════
Epic 1: Project Setup ✅ DONE
    ↓
Epic 2: Company/User Management ✅ DONE (11 stories)
    ↓
Epic 3: Security Hardening ✅ DONE (3 stories)
    ↓
Epic 4: Component Library ✅ DONE (2 stories, scoped to theme + layout)
    ↓
Epic 5: Product Registration ✅ DONE (6 stories)
    │   ProductRegistry.sol deployed: 0x7e18dE7ce4B7C8A985BC03E192469BDf192a1646
═══════════════════════════════════════════════════════════════

REMAINING WORK (from Epic 5)
───────────────────────────────────────────────────────────────
    ├─→ Epic 7: Supply Chain Tracking ✅ DONE (17 stories)
    │       ↓ (BLOCKS Epic 9)
    │   Epic 9: Consumer Query 🔴 MUST HAVE (6-9h)
    │       ↓   (Epic 11 merged into Epic 9 on 2025-12-06)
    │   Epic 13: Deployment 🔴 MUST HAVE (6-9h)
    │
    ├─→ Epic 6: Transfer Workflow 🟡 SHOULD HAVE (4-6h)
    │       (Can do after Epic 7, uses same patterns)
    │
    └─→ Epic 8: IoT Simulator 🟡 SHOULD HAVE (6-8h)
            (Enhances thesis demo, not blocking)

OPTIONAL (if time permits)
    Epic 10: Multi-Party Verification 🟢 OPTIONAL (4-6h)
    Epic 12: Data Visualization 🟢 OPTIONAL (6-8h)
```

**Critical Path:** Epic 5 ✅ → Epic 7 ✅ → **Epic 9** → **Epic 13** (~15h remaining)

**Recommended Order:**
1. Epic 7 ✅ DONE (17 stories) - Core traceability complete
2. Epic 9 (6-9h) - Consumer query, thesis value proposition (Epic 11 merged)
3. Epic 13 (6-9h) - Deployment for thesis demo
4. Epic 6 (4-6h) - Transfer workflow, if time permits

**Cut if behind schedule:** Epic 8, 10, 12 (in that order)
Note: Epic 11 merged into Epic 9 on 2025-12-06

---

## 4. Development Timeline

### 4.1 Overall Schedule

| Week      | Dates          | Phase            | Focus                                  |
| --------- | -------------- | ---------------- | -------------------------------------- |
| **0**     | Oct 24-30      | Pre-Kickoff      | Documentation ready, kickoff prep      |
| **1**     | Oct 31 - Nov 7 | Setup & Learning | Environment setup, Solidity basics     |
| **2**     | Nov 8-14       | Planning         | PRD, Architecture documents (CRITICAL) |
| **3**     | Nov 15-21      | Foundation       | Smart contracts start, security setup  |
| **4**     | Nov 22-28      | Smart Contracts  | Contract completion, testing           |
| **5**     | Nov 29 - Dec 5 | Frontend Start   | Producer UI, IoT simulator             |
| **6**     | Dec 6-12       | Frontend Cont.   | Distributor/Retailer UIs               |
| **7**     | Dec 13-19      | Frontend Finish  | Consumer query, polish                 |
| **8**     | Dec 20-26      | Testing          | Integration tests, bug fixes           |
| **9**     | Dec 27 - Jan 2 | Polish           | Documentation, demo video              |
| **10-12** | Jan 3-23, 2026 | Thesis Writing   | 60+ pages, poster, presentation        |

**Key Milestones:**

- ✅ Week 2: PRD + Architecture approved by PO agent (>90%)
- 🎯 Week 4: Smart contracts deployed to Sepolia (verified on Etherscan)
- 🎯 Week 7: Frontend complete (all 4 role UIs working)
- 🎯 Week 9: Complete POC deployed and documented
- 🎯 Week 12: Thesis submitted (~January 23, 2026)

---

### 4.2 Week-by-Week Breakdown

#### Week 1 (Oct 31 - Nov 7): Setup & Learning

**Team Focus:** Foundation skills, environment setup

**Sam (Blockchain Lead - 15-20 hours):**

- Complete Cyfrin Updraft "Simple Storage" (3 hours)
- Complete Cyfrin Updraft "Fund Me" (4 hours)
- Read OpenZeppelin AccessControl docs (2 hours)
- Setup Hardhat + deploy "Hello World" to Sepolia (2 hours)
- Research Walmart case study (1 hour)
- Create 3 test wallets, get Sepolia ETH (1 hour)

**TaiSheng (Backend/Integration - 15-20 hours):**

- Learn Solidity basics (Cyfrin Updraft, 5 hours)
- Learn Hardhat testing (3 hours)
- Setup Supabase account + project (2 hours)
- Design Prisma schema draft (3 hours)
- Read Wagmi v2 documentation (2 hours)
- Plan API endpoints (2 hours)

**YiLing (UI/UX Lead - 12-15 hours):**

- Research Web3 UX best practices (2 hours)
- Read "Intro to Ethereum" (ethereum.org) (2 hours)
- Study Chakra UI v2 components (3 hours)
- Create user personas (2 hours)
- User flow mapping (4 roles) (3 hours)

**Deliverables:**

- ✅ All team members can run Hardhat locally
- ✅ 3 MetaMask wallets funded with Sepolia ETH
- ✅ GitHub organization created (FoodTrace-2025)
- ✅ Supabase project initialized

---

#### Week 2 (Nov 8-14): Planning (CRITICAL WEEK)

**Team Focus:** PRD, Architecture, Design

**All Team Members:**

- **Monday**: Kickoff meeting with supervisor (2 hours)
- **Tuesday-Thursday**: Create PRD + Architecture using BMAD (Web UI)
  - Sam: Input blockchain requirements (3 hours)
  - TaiSheng: Input backend architecture (3 hours)
  - YiLing: Input UX requirements (3 hours)
- **Friday**: PO validation, team review (2 hours)

**YiLing (HEAVY WEEK - 20-25 hours):**

- **Design Phase (CRITICAL):**
  - Create wireframes for all 4 interfaces (Figma) (8 hours)
  - Design system creation (colors, typography, icons) (6 hours)
  - High-fidelity mockups (key screens) (6 hours)
  - Present designs to team for feedback (2 hours)
  - Iterate based on feedback (3 hours)

**Sam:**

- Design smart contract structure (4 hours)
- Define contract functions and events (3 hours)
- Collaborate on architecture diagram (2 hours)

**TaiSheng:**

- Finalize Prisma schema (3 hours)
- Define API endpoints (REST) (2 hours)
- Plan data flow (on-chain vs off-chain) (2 hours)

**Deliverables:**

- ✅ PRD approved by PO agent (>90% alignment)
- ✅ Architecture document complete
- ✅ UI/UX designs approved by team
- ✅ Smart contract specification documented
- ✅ Database schema finalized

**🔴 NON-NEGOTIABLE:** This week MUST produce PRD + Architecture. Without these, development in Week 3+ will be chaotic.

---

#### Week 3 (Nov 15-21): Foundation

**Team Focus:** Smart contracts begin, security setup, component library

**Sam (20-25 hours - HEAVY):**

- **Epic 5: Product Registration (Smart Contract)**
  - Implement `ProductRegistry.sol` (6 hours)
  - Product struct, registration function, events (4 hours)
  - AccessControl integration (OpenZeppelin) (3 hours)
  - NatSpec documentation (1 hour)
  - Deploy to local Hardhat network (1 hour)

**TaiSheng (20-25 hours - HEAVY):**

- **Epic 3: Security Hardening (Tier 1 - CRITICAL)**
  - Wallet encryption library (1 hour)
  - Environment variable security (0.5 hours)
  - Prisma tenant middleware (3 hours)
- **Epic 2: Company Management**
  - Company registration API (2 hours)
  - Admin approval workflow (2 hours)
  - Wallet generation on approval (2 hours)
- **Smart Contract Testing (Epic 1)**
  - Write unit tests for ProductRegistry (4 hours)
  - Achieve >70% coverage (2 hours)

**YiLing (15-20 hours):**

- **Epic 4: Component Library (50% complete)**
  - Button, Input, Card components (4 hours)
  - Modal, Toast components (3 hours)
  - Loading states, Error messages (2 hours)
  - Design tokens setup (2 hours)
  - Storybook documentation (2 hours)

**Deliverables:**

- ✅ ProductRegistry.sol deployed to local Hardhat
- ✅ Security Tier 1 complete (4.5 hours)
- ✅ Company registration API working
- ✅ 50% component library ready

---

#### Week 4 (Nov 22-28): Smart Contracts Complete

**Team Focus:** Complete all smart contracts, security hardening, testing

**Sam (20-25 hours - HEAVY):**

- **Epic 7: Supply Chain Tracking**
  - TraceRecord struct and functions (4 hours)
  - Role-based trace record addition (3 hours)
  - Integration with ProductRegistry (2 hours)
- **Epic 8: IoT Simulator (Smart Contract)**
  - SensorReading struct (2 hours)
  - addSensorData function (2 hours)
- **Epic 10: Multi-Party Verification (Optional)**
  - Verification logic (3 hours)
  - Reputation system (basic) (3 hours)
- **Gas Optimization** (2 hours)
- **Deploy to Sepolia testnet** (2 hours)
- **Verify on Etherscan** (1 hour)

**TaiSheng (20-25 hours):**

- **Epic 3: Security Tier 2**
  - Database RLS + audit logs (2 hours)
  - Integration tests (2 hours)
  - Input validation + ESLint rules (1 hour)
- **Epic 6: Transfer Workflow API**
  - Product transfer endpoint (3 hours)
  - Email notification service (2 hours)
  - Dashboard notification system (2 hours)
- **Smart Contract Testing**
  - Integration tests for all contracts (4 hours)
  - Security testing (reentrancy, overflow) (2 hours)
  - Coverage report >70% (1 hour)

**YiLing (15-20 hours):**

- **Component Library (100% complete)**
  - Complete remaining components (7 hours)
  - Responsive layout system (3 hours)
  - Form validation components (3 hours)
  - Component documentation (2 hours)

**Sam + TaiSheng (4 hours):**

- **Epic 3: Team Component Contributions**
  - Sam: Button variants, Input fields (2 hours)
  - TaiSheng: Form validation wrappers (2 hours)

**Deliverables:**

- ✅ **CRITICAL:** All smart contracts deployed to Sepolia (verified on Etherscan)
- ✅ Security Tier 2 complete (13.5 hours total Epic 0.6)
- ✅ Component library 100% ready
- ✅ Test coverage >70%

**🎯 Checkpoint:** End of Week 4 = Smart contracts DONE. If not, simplify Epic 10 (multi-party verification).

---

#### Week 5 (Nov 29 - Dec 5): Frontend Start

**Team Focus:** Producer UI, IoT simulator, wallet integration

**Sam (15-20 hours - SUPPORT ROLE):**

- **Support TaiSheng with Web3 integration** (4 hours)
- **Code review for backend PRs** (2 hours)
- **Bug fixes in smart contracts** (2 hours)
- **IoT Simulator (Smart Contract Integration)** (2 hours)
- **Pair programming with YiLing** (Tuesday/Thursday 2+2 hours)

**TaiSheng (20-25 hours - HEAVY):**

- **Epic 5: Web3 Integration**
  - RainbowKit wallet connection (optional for admins) (2 hours)
  - Wagmi hooks setup (3 hours)
  - Transaction state handling (pending/success/error) (3 hours)
- **Epic 5: Product Registration API**
  - Product metadata CRUD (3 hours)
  - Image upload to Supabase Storage (2 hours)
  - Blockchain transaction signing (server-side) (3 hours)
- **Epic 11: QR Code Generation API** (2 hours)
- **Pair programming with YiLing** (Tuesday/Thursday 2+2 hours)

**YiLing (25-30 hours - VERY HEAVY):**

- **Epic 5: Producer Dashboard**
  - Product registration form (6 hours)
  - Form validation (client-side) (2 hours)
  - Image upload component (3 hours)
  - Product list view (3 hours)
  - QR code display and download (2 hours)
- **Epic 8: IoT Simulator Page**
  - Admin interface design (2 hours)
  - Scenario buttons (Normal/Warning/Critical) (2 hours)
  - Real-time data preview (2 hours)
  - API integration (1 hour)
- **Pair programming sessions** (Tuesday/Thursday 2+2 hours)

**Deliverables:**

- ✅ Producer can register products via email login
- ✅ QR codes auto-generated
- ✅ IoT simulator working (3 scenarios)
- ✅ Product list dashboard functional

**🎯 Checkpoint:** End of Week 5 = Producer UI DONE. If falling behind, simplify IoT simulator (skip auto-mode).

---

#### Week 6 (Dec 6-12): Frontend Continued

**Team Focus:** Distributor and Retailer interfaces

**Sam (15-20 hours - SUPPORT):**

- **Support integrations** (4 hours)
- **Code review** (2 hours)
- **Contract bug fixes** (2 hours)
- **Pair programming with YiLing** (Tuesday/Thursday 2+2 hours)
- **Documentation** (2 hours)

**TaiSheng (20-25 hours):**

- **Epic 6: Transfer Workflow Backend**
  - Complete transfer API (2 hours)
  - Email notification templates (2 hours)
  - Pending shipments query (2 hours)
- **Epic 2: Trace Record API**
  - Add trace record endpoint (3 hours)
  - Blockchain transaction integration (3 hours)
  - Query trace history (2 hours)
- **API optimization** (2 hours)
- **Pair programming with YiLing** (Tuesday/Thursday 2+2 hours)

**YiLing (25-30 hours - VERY HEAVY):**

- **Epic 2: Distributor Interface**
  - Pending shipments dashboard (4 hours)
  - Receive product action (3 hours)
  - Add trace record form (4 hours)
  - QR scanner integration (3 hours)
- **Epic 2: Retailer Interface**
  - Similar to distributor (shared components) (6 hours)
  - Retailer-specific fields (2 hours)
  - Stock management view (3 hours)
- **Pair programming sessions** (Tuesday/Thursday 2+2 hours)

**Deliverables:**

- ✅ Distributor can receive products, add trace records
- ✅ Retailer can stock products, update status
- ✅ Product transfer workflow automated (email notifications)
- ✅ QR scanner works on mobile

**🎯 Checkpoint:** End of Week 6 = Distributor + Retailer UIs DONE. If behind, skip Epic 12 (data visualization) advanced features.

---

#### Week 7 (Dec 13-19): Frontend Finish

**Team Focus:** Consumer interface, polish, data visualization

**Sam (15 hours):**

- **Documentation** (4 hours)
- **Code review** (3 hours)
- **Bug fixes** (3 hours)
- **Pair programming with YiLing** (Tuesday 2 hours)
- **Prepare demo data** (3 hours)

**TaiSheng (15-20 hours):**

- **Epic 9: Consumer Query API**
  - Wallet-free product query (2 hours)
  - Trace history endpoint (2 hours)
  - Optimization (caching) (2 hours)
- **Epic 12: Data Visualization Backend**
  - Timeline data formatting (2 hours)
- **Testing** (3 hours)
- **Bug fixes** (3 hours)
- **Pair programming with YiLing** (Tuesday 2 hours)

**YiLing (25-30 hours - VERY HEAVY):**

- **Epic 9: Consumer Query Page (CRITICAL)**
  - QR code scanner (html5-qrcode) (4 hours)
  - Product search by ID (2 hours)
  - Product journey timeline (6 hours)
  - Verification badges (2 hours)
  - Temperature history chart (3 hours)
  - Link to Etherscan (1 hour)
- **Epic 12: Data Visualization**
  - Product journey timeline (4 hours)
  - Trace record history view (3 hours)
- **Mobile optimization (ALL pages)** (4 hours)
- **Accessibility improvements** (2 hours)

**Deliverables:**

- ✅ **CRITICAL:** Consumer can scan QR → see product journey (NO LOGIN)
- ✅ Mobile-responsive on all pages
- ✅ Data visualization working
- ✅ Accessibility WCAG Level A compliant

**🎯 Checkpoint:** End of Week 7 = Frontend 100% DONE. If behind, cut optional features.

---

#### Week 8 (Dec 20-26): Testing & Optimization

**Team Focus:** Integration testing, bug fixes, deployment prep

**All Team Members (18-24 hours each):**

**Testing Scenarios:**

1. **Complete Product Journey (3 wallets)**

   - Sam: Producer creates product (1 hour)
   - TaiSheng: Distributor adds trace record (1 hour)
   - YiLing: Retailer stocks product (1 hour)
   - All: Consumer queries (wallet-free) (1 hour)

2. **IoT Simulator Testing**

   - Generate Normal scenario (15 minutes)
   - Generate Warning scenario (15 minutes)
   - Generate Critical scenario (15 minutes)
   - Verify alerts trigger (30 minutes)

3. **Cross-Tenant Isolation**

   - Create 2 companies (15 minutes)
   - Verify Company A cannot access Company B data (1 hour)

4. **Security Testing**

   - Verify wallet encryption working (30 minutes)
   - Check audit logs populated (30 minutes)
   - Test tenant middleware (1 hour)

5. **Cross-Browser Testing**

   - Chrome, Firefox, Safari (2 hours)
   - Mobile (Android + iOS) (2 hours)

6. **Performance Testing**
   - Page load times <3 seconds (1 hour)
   - Blockchain transaction speed (1 hour)

**Bug Fixing:**

- Critical bugs: 6-8 hours
- Minor bugs: 4-6 hours

**Optional (if time permits):**

- Epic 10: Multi-Party Verification completion (if not done Week 4)

**Deliverables:**

- ✅ Test report document
- ✅ Bug fix log
- ✅ Performance benchmarks
- ✅ 5-10 sample products with complete histories

**🎯 Checkpoint:** End of Week 8 = System 100% functional. If major bugs, extend testing into Week 9.

---

#### Week 9 (Dec 27 - Jan 2): Polish & Documentation

**Team Focus:** Demo preparation, documentation, deployment

**All Team Members (12-15 hours each):**

**Sam:**

- Record demo video (product registration) (2 hours)
- Write smart contract technical docs (3 hours)
- Prepare blockchain chapter outline (thesis) (3 hours)
- Code cleanup and comments (2 hours)
- Deployment support (2 hours)

**TaiSheng:**

- Deploy to Render.com (3 hours)
- API documentation (2 hours)
- Database backup/restore procedure (1 hour)
- Write backend architecture docs (3 hours)
- Demo video (backend flow) (2 hours)

**YiLing:**

- Record demo video (consumer query) (2 hours)
- User manual with screenshots (4 hours)
- Prepare presentation slides (3 hours)
- UI/UX chapter outline (thesis) (2 hours)
- Backup demo screenshots (1 hour)

**Deliverables:**

- ✅ Demo video (3-5 minutes, all roles)
- ✅ Presentation deck (for thesis defense)
- ✅ User guide with screenshots
- ✅ Technical documentation
- ✅ GitHub README updated
- ✅ Deployed application (Render.com)

---

#### Week 10-12 (Jan 3-23, 2026): Thesis Writing

**Team Focus:** Academic documentation (60+ pages)

**Week 10 (Jan 3-9):**

- **Sam**: Chapter 1 (Introduction), Chapter 2.1-2.2 (Supply chain + Blockchain)
- **TaiSheng**: Chapter 2.3 (Blockchain food systems), Chapter 3 (Methodology)
- **YiLing**: Chapter 2.4-2.5 (IoT + Web3), Chapter 4.3 (Frontend implementation)
- **Team Meeting (Friday)**: Review progress, adjust plan

**Week 11 (Jan 10-16):**

- **Sam**: Chapter 4.1 (Smart contract implementation), Chapter 6 (Discussion)
- **TaiSheng**: Chapter 4.2 (Backend), Chapter 5 (Results & Testing)
- **YiLing**: Chapter 5.3 (User acceptance testing), Format all figures/tables
- **Team (Friday)**: Draft abstract together

**Week 12 (Jan 17-23):**

- **Monday**: Chapter 7 (Conclusion) - collaborative
- **Tuesday**: Compile references, check citations
- **Wednesday**: Format appendices
- **Thursday**: Full thesis review (each reads entire document)
- **Friday**: Final edits, formatting fixes, generate PDF
- **Weekend**: Poster creation

**Submission:** ~January 23, 2026

---

### 4.3 Critical Milestones

| Milestone                    | Date             | Gate Criteria                        | Risk if Missed        |
| ---------------------------- | ---------------- | ------------------------------------ | --------------------- |
| **PRD + Architecture**       | Nov 14 (Week 2)  | PO validation >90%                   | Chaos in Week 3+      |
| **Smart Contracts Deployed** | Nov 28 (Week 4)  | Verified on Etherscan, >70% coverage | Cannot build frontend |
| **Producer UI Working**      | Dec 5 (Week 5)   | Can register products                | Behind schedule       |
| **Frontend Complete**        | Dec 19 (Week 7)  | All 4 UIs functional                 | Cannot test E2E       |
| **System Deployed**          | Jan 2 (Week 9)   | Render.com live, demo ready          | No thesis demo        |
| **Thesis Submitted**         | Jan 23 (Week 12) | 60+ pages, OAMK format               | Failed graduation     |

---

## 5. Success Metrics

### 5.1 Technical Metrics

#### Smart Contract Performance

| Metric                      | Target               | Measurement Method      | Rationale                         |
| --------------------------- | -------------------- | ----------------------- | --------------------------------- |
| **Gas Cost (Registration)** | <100k gas            | Hardhat gas reporter    | Reasonable mainnet cost           |
| **Gas Cost (Trace Record)** | <80k gas             | Hardhat gas reporter    | Frequent operation, must be cheap |
| **Gas Cost (Sensor Data)**  | <60k gas             | Hardhat gas reporter    | High volume, optimize heavily     |
| **Test Coverage**           | >70%                 | `npx hardhat coverage`  | Industry standard for production  |
| **Security Score**          | Zero critical issues | Slither static analysis | Production-grade security         |
| **Contract Size**           | <24 KB               | Hardhat compilation     | Ethereum contract size limit      |

---

#### Application Performance

| Metric                    | Target       | Measurement Method     | Rationale                      |
| ------------------------- | ------------ | ---------------------- | ------------------------------ |
| **Page Load Time**        | <3 seconds   | Chrome DevTools        | User retention standard        |
| **API Response Time**     | <500ms (p95) | Server logs            | Acceptable UX                  |
| **Blockchain Query Time** | <2 seconds   | Frontend timer         | Consumer patience limit        |
| **First Load JS**         | <250 KB      | Next.js build analyzer | Mobile performance             |
| **QR Scan Success Rate**  | >95%         | User testing           | Critical for consumer adoption |
| **Mobile Responsiveness** | 100% pages   | Manual testing         | 60%+ mobile usage              |

---

#### Security Metrics

| Metric                     | Target          | Measurement Method     | Rationale                |
| -------------------------- | --------------- | ---------------------- | ------------------------ |
| **Cross-Tenant Leaks**     | Zero            | Integration tests      | Multi-tenant requirement |
| **Private Keys in Git**    | Zero            | `git log -S` grep      | Critical security        |
| **Audit Log Coverage**     | 100% wallet ops | Database query         | Accountability           |
| **SQL Injection Attempts** | Zero successful | Input validation tests | Standard web security    |

---

### 5.2 Functional Metrics

#### Core Features

| Feature                   | Success Criteria                               | Measurement         |
| ------------------------- | ---------------------------------------------- | ------------------- |
| **Product Registration**  | Producer can register product in <2 minutes    | User testing        |
| **QR Code Generation**    | Auto-generated, downloadable PNG               | Manual verification |
| **Supply Chain Tracking** | Complete journey (Producer → Consumer) visible | E2E test            |
| **Consumer Query**        | Wallet-free access, <10 seconds to see history | User testing        |
| **IoT Simulator**         | 3 scenarios generate data correctly            | Manual testing      |
| **Email Notifications**   | 100% delivery rate (SendGrid)                  | Email logs          |

---

### 5.3 User Experience Metrics

#### Producer Experience

| Metric                    | Target                  | Measurement      |
| ------------------------- | ----------------------- | ---------------- |
| **Registration Time**     | <5 minutes first time   | User testing     |
| **Repeat Registration**   | <2 minutes              | User testing     |
| **Error Rate**            | <5% failed transactions | Analytics        |
| **Perceived Ease of Use** | >4/5 rating             | Post-demo survey |

#### Distributor/Retailer Experience

| Metric                | Target         | Measurement      |
| --------------------- | -------------- | ---------------- |
| **QR Scan Success**   | >95% first try | User testing     |
| **Trace Record Time** | <3 minutes     | User testing     |
| **Mobile Usability**  | >4/5 rating    | Post-demo survey |

#### Consumer Experience (CRITICAL)

| Metric                   | Target                     | Measurement          |
| ------------------------ | -------------------------- | -------------------- |
| **Zero-Friction Access** | No login required          | Manual verification  |
| **Information Clarity**  | Understand product journey | User survey          |
| **Trust Indicator**      | Feel more confident buying | Qualitative feedback |

---

### 5.4 Academic Metrics

#### Thesis Quality

| Metric                       | Target                   | Evaluation         |
| ---------------------------- | ------------------------ | ------------------ |
| **Page Count**               | 60-80 pages              | Word count         |
| **References**               | 20-30 sources            | Bibliography       |
| **Test Coverage Documented** | >70% with screenshots    | Thesis Chapter 5   |
| **Limitations Discussed**    | Honest assessment        | Thesis Chapter 6   |
| **Future Work**              | Concrete recommendations | Thesis Chapter 7   |
| **OAMK Format Compliance**   | 100%                     | Template adherence |

#### Defense Preparation

| Item                    | Target                    | Status  |
| ----------------------- | ------------------------- | ------- |
| **Demo Video**          | 3-5 minutes, all features | Week 9  |
| **Presentation Slides** | 15-20 slides              | Week 9  |
| **Backup Screenshots**  | 20+ screenshots           | Week 9  |
| **Code Repository**     | Clean, documented         | Week 9  |
| **Poster**              | A1 size, OAMK style       | Week 12 |

---

### 5.5 Team Metrics

#### Development Efficiency

| Metric                | Target                 | Measurement          |
| --------------------- | ---------------------- | -------------------- |
| **Code Review Time**  | <24 hours              | GitHub PR timestamps |
| **Bug Fix Time**      | <48 hours for critical | Issue tracker        |
| **Sprint Completion** | >80% story points      | Weekly review        |
| **Test Automation**   | >70% coverage          | CI/CD                |

#### Collaboration

| Metric                        | Target                        | Measurement   |
| ----------------------------- | ----------------------------- | ------------- |
| **Weekly Meetings**           | 100% attendance               | Meeting notes |
| **Pair Programming**          | 4+ sessions (Week 5-7)        | Calendar      |
| **Code Review Participation** | All PRs reviewed by 2+ people | GitHub        |
| **Knowledge Sharing**         | Documented in session notes   | Git commits   |

---

### 5.6 Business Value Metrics (Post-Thesis)

**Optional tracking if project continues:**

| Metric                | Potential Value    | Notes                      |
| --------------------- | ------------------ | -------------------------- |
| **GitHub Stars**      | Track interest     | Community validation       |
| **Fork Count**        | Reusability        | Other students/researchers |
| **Blog Posts**        | Thought leadership | Career benefit             |
| **Job Offers**        | Portfolio value    | Career outcome             |
| **Startup Potential** | Feasibility        | Post-thesis decision       |

---

## 6. Epic Breakdown

This section provides high-level descriptions of all 12 epics. Detailed stories will be created by Story Manager (SM) agent during Week 3+ using BMAD methodology.

**Epic Summary:**

| Epic | Name                      | Priority       | Hours  | Owner                   | Week   |
| ---- | ------------------------- | -------------- | ------ | ----------------------- | ------ |
| 1    | Project Setup             | 🔴 Must Have   | 4-6h   | All                     | 1-2    |
| 2    | Company & User Management | 🔴 Must Have   | 8-10h  | TaiSheng                | 3      |
| 3    | Security Hardening        | 🔴 Must Have   | 16.5h  | TaiSheng + Sam          | 3-4    |
| 4    | Component Library         | 🔴 Must Have   | 10-15h | YiLing + Sam + TaiSheng | 3-4    |
| 5    | Product Registration      | 🔴 Must Have   | 12-15h | Sam + TaiSheng + YiLing | 3-5    |
| 6    | Product Transfer Workflow | 🟡 Should Have | 4-6h   | TaiSheng + YiLing       | 4-6    |
| 7    | Supply Chain Tracking     | 🔴 Must Have   | 12-15h | Sam + TaiSheng + YiLing | 4-6    |
| 8    | IoT Simulator             | 🟡 Should Have | 6-8h   | Sam + YiLing            | 4-5    |
| 9    | Consumer Query            | 🔴 Must Have   | 8-10h  | TaiSheng + YiLing       | 6-7    |
| 10   | Multi-Party Verification  | 🟢 Could Have  | 6-8h   | Sam                     | 4 or 7 |
| 11   | QR Functionality          | 🔴 Must Have   | 4-6h   | TaiSheng + YiLing       | 5-6    |
| 12   | Data Visualization        | 🟡 Should Have | 6-8h   | TaiSheng + YiLing       | 7      |
| 13   | Deployment                | 🔴 Must Have   | 6-9h   | TaiSheng                | 8-9    |

**Total:** 121.5-145.5 hours (23-28% of team capacity)

**Changes from initial estimates (Session 14):**

- Epic 2: +2h (multi-tenant complexity)
- Epic 4: NEW +10-15h (component library work previously embedded in timeline)
- Epic 1: +4-5h (first Web3 integration learning curve)
- Epic 2: +2-3h (three separate UIs + timeline complexity)
- Epic 9: +2-3h (deployment always harder than expected)
- **Total increase:** +20-30h reflecting realistic bachelor student timeline with zero blockchain experience

---

### Epic 1: Project Setup & Foundation

**Priority:** 🔴 Must Have
**Estimated Time:** 4-6 hours
**Assigned:** All team members
**Timeline:** Week 1-2
**Dependencies:** None (foundation epic)

#### Epic Description

Establish development environment, tooling, and foundational infrastructure for the FoodTrace project. This includes repository setup, development tools configuration, blockchain tooling, database initialization, and deployment scaffolding.

#### Business Value

- **Foundation for Development:** Without proper setup, Week 3+ development will be blocked
- **Team Onboarding:** Ensures all 3 members can contribute from Day 1
- **Quality Gates:** CI/CD, linting, testing infrastructure prevents bugs
- **Documentation:** README, contribution guidelines establish standards

#### User Stories (High-Level)

- As a developer, I want to **clone the repository and run `npm install`** so I can start development
- As a developer, I want to **compile and test smart contracts locally** so I can develop offline
- As a developer, I want to **run the Next.js dev server** so I can see changes live
- As a developer, I want to **connect to Supabase** so I can test database operations
- As a team, we want to **deploy "Hello World"** to testnet so we verify deployment works

#### Acceptance Criteria (Epic Level)

- ✅ GitHub organization created (FoodTrace-2025)
- ✅ Repository initialized with Next.js 14.2.15 + TypeScript
- ✅ Hardhat configured for Solidity ^0.8.20
- ✅ Supabase project created, connection working
- ✅ Prisma ORM configured
- ✅ ESLint + Prettier configured
- ✅ `.gitignore` comprehensive (secrets, build artifacts)
- ✅ `.env.example` template created
- ✅ Simple "Hello World" contract deployed to Sepolia
- ✅ All 3 team members can run `npm run dev` successfully

#### Technical Approach

**Repository Structure:**

```
thesis/
├── .bmad-core/          # BMAD methodology configuration
├── .github/workflows/   # CI/CD (optional)
├── contracts/           # Solidity smart contracts
├── test/                # Smart contract tests
├── src/                 # Next.js application
│   ├── app/             # App router pages
│   ├── components/      # React components
│   ├── lib/             # Utilities, Web3 hooks
│   └── styles/          # CSS/Tailwind
├── public/              # Static assets
├── docs/                # Documentation
├── hardhat.config.ts    # Hardhat configuration
├── prisma/              # Database schema
└── package.json         # Dependencies
```

**Key Configuration Files:**

- `hardhat.config.ts` - Sepolia network, Etherscan verification
- `tsconfig.json` - TypeScript strict mode
- `.eslintrc.js` - Linting rules (no raw SQL, no MetaMask prompts in business UIs)
- `next.config.js` - Webpack config for Wagmi
- `prisma/schema.prisma` - Database models

#### Dependencies

**Blocks:** All other epics (foundation must be complete first)

#### Team Assignment

**Sam (2 hours):**

- Setup Hardhat project
- Configure OpenZeppelin contracts
- Deploy "Hello World" to Sepolia
- Document wallet creation process

**TaiSheng (2 hours):**

- Setup Next.js project structure
- Configure Prisma + Supabase
- Create initial database schema
- Setup API route scaffolding

**YiLing (1 hour):**

- Setup Chakra UI
- Create basic page templates
- Configure responsive layout system

**All Together (1 hour):**

- Review setup checklist
- Ensure everyone can run project locally
- Document common issues

#### Risks & Mitigations

| Risk                                     | Mitigation                                        |
| ---------------------------------------- | ------------------------------------------------- |
| Team members use different Node versions | Use `.nvmrc` file (Node 18+)                      |
| Supabase connection fails                | Use connection pooling, test with `prisma studio` |
| Hardhat compilation errors               | Pin Solidity version, use OpenZeppelin 5.0+       |
| Git merge conflicts                      | Establish branching strategy early                |

---

### Epic 2: Company & User Management

**Priority:** 🔴 Must Have
**Estimated Time:** 8-10 hours
**Assigned:** TaiSheng (Lead)
**Timeline:** Week 3
**Dependencies:** Epic 1 (Project Setup)

#### Epic Description

Implement multi-tenant company registration and user management system. Platform admins can approve/reject company applications. Approved companies get custodial Ethereum wallets automatically generated. Company admins can create user accounts for employees (producers, distributors, retailers).

#### Business Value

- **Multi-Tenant Foundation:** Enables multiple companies to use platform (realistic enterprise model)
- **Onboarding Workflow:** Invitation-only prevents spam, manual approval ensures quality
- **Audit Trail:** Know which user (within company) performed which action
- **Scalability:** Architecture supports 10, 100, 1000+ companies

#### User Stories (High-Level)

- As a **company representative**, I want to **apply to join FoodTrace** so I can use blockchain traceability
- As a **platform admin**, I want to **review company applications** so I can prevent fraud
- As a **platform admin**, I want to **approve companies** so they get blockchain wallets automatically
- As a **company admin**, I want to **create user accounts for employees** so my team can use the system
- As a **company admin**, I want to **restrict users to company email domain** so only real employees get access

#### Acceptance Criteria (Epic Level)

- ✅ Company registration form (name, email, domain, type: Producer/Distributor/Retailer)
- ✅ Platform admin portal shows pending company applications
- ✅ Admin can approve/reject companies with notes
- ✅ Approved companies automatically get encrypted Ethereum wallet generated
- ✅ Company admin can create users (email must match company domain)
- ✅ Users login with email + password (NextAuth.js)
- ✅ Role-based access control (PLATFORM_ADMIN, COMPANY_ADMIN, PRODUCER, DISTRIBUTOR, RETAILER)
- ✅ Audit log shows which user performed actions

#### Technical Approach

**Database Schema (Prisma):**

```prisma
model Company {
  id                  String   @id @default(cuid())
  name                String
  email               String   @unique
  domain              String   // "hirsimakifarm.fi"
  status              String   // "PENDING" | "APPROVED" | "REJECTED"
  type                String   // "PRODUCER" | "DISTRIBUTOR" | "RETAILER"

  encryptedPrivateKey String?  // One wallet per company
  walletAddress       String?  // Ethereum address

  createdAt           DateTime @default(now())
  approvedAt          DateTime?
  users               User[]
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  role         String   // "COMPANY_ADMIN" | "PRODUCER" | etc.
  companyId    String?
  company      Company? @relation(fields: [companyId], references: [id])
}
```

**API Endpoints:**

- `POST /api/companies/apply` - Company registration
- `GET /api/admin/companies/pending` - List pending applications
- `POST /api/admin/companies/:id/approve` - Approve company (generates wallet)
- `POST /api/companies/users` - Company admin creates user
- `POST /api/auth/login` - Email/password authentication

**Wallet Generation Flow:**

```typescript
async function approveCompany(companyId) {
  const wallet = ethers.Wallet.createRandom();
  const encryptedKey = encrypt(wallet.privateKey, process.env.ENCRYPTION_KEY);

  await db.company.update({
    where: { id: companyId },
    data: {
      status: "APPROVED",
      encryptedPrivateKey: encryptedKey,
      walletAddress: wallet.address,
    },
  });
}
```

#### Dependencies

**Requires:** Epic 1 (Supabase + Prisma setup)
**Blocks:** Epic 5 (Product Registration - need company wallets)

#### Team Assignment

**TaiSheng (6-8 hours):**

- Company registration form + API (2 hours)
- Admin approval workflow (2 hours)
- Wallet generation on approval (2 hours)
- User creation by company admin (2 hours)
- Email domain validation (1 hour)

#### Risks & Mitigations

| Risk                                        | Mitigation                                 |
| ------------------------------------------- | ------------------------------------------ |
| Fake company registrations                  | Manual admin approval required             |
| User creates account with non-company email | Email domain validation enforced           |
| Wallet generation fails                     | Retry logic, fallback to manual generation |

---

### Epic 3: Security Hardening

**Priority:** 🔴 Must Have (Tier 1) + 🟡 Should Have (Tier 2)
**Estimated Time:** 4.5 hours (Tier 1) + 9 hours (Tier 2) + 3 hours (Tier 3) = 16.5 hours total
**Assigned:** TaiSheng (Lead, 10-13 hours), Sam (Support, 2-3 hours), YiLing (Process, 0 hours)
**Timeline:** Week 3-4 (parallel with Epic 1)
**Dependencies:** Epic 1 (Project Setup), Epic 0.5 (Company Management)

**Note:** This epic was created in Session 4 based on architecture risk assessment. See full specification earlier in this document (Epic 3: Security Hardening section with 3 tiers).

#### Epic Description (Summary)

Implement production-grade security controls to protect custodial wallets, prevent cross-tenant data leaks, and establish security best practices. Addresses three critical concerns: custodial wallet security, multi-tenant data isolation, and development process security.

#### Three-Tier Approach

**Tier 1: MUST HAVE (4.5 hours - CRITICAL):**

- Proven encryption library (AES-256-CBC) for wallet private keys
- Environment variable security (.env.local in .gitignore)
- Prisma tenant middleware (automatic companyId filtering)
- Component library early start (timing shift)
- Pair programming schedule (process change)

**Tier 2: SHOULD HAVE (9 hours - High Value):**

- Database RLS + audit logging
- Cross-tenant integration tests
- Input validation + SQL injection prevention
- Team component contributions (Sam/TaiSheng help YiLing)

**Tier 3: NICE TO HAVE (3 hours - Optional):**

- Key rotation strategy documentation
- Supabase Row Level Security policies
- Code review security checklist
- Chakra UI Pro ($49 option)

#### Acceptance Criteria (Epic Level)

- ✅ **Tier 1 Complete** - All MUST HAVE requirements implemented and tested
- ✅ **Wallet Security Verified** - Can encrypt/decrypt private keys, no keys in git
- ✅ **Tenant Isolation Verified** - Integration tests pass, Company A cannot see Company B data
- ✅ **Security Audit Passed** - Sam reviews TaiSheng's implementation
- ✅ **Documentation Complete** - docs/architecture/security.md exists
- ⚠️ **Tier 2 Recommended** - SHOULD HAVE items provide significant value
- ⚪ **Tier 3 Optional** - Only if time permits

#### Dependencies

**Requires:** Epic 1, Epic 2
**Blocks:** Epic 5 (Product Registration - cannot register products until wallet encryption working)

**For full details:** See earlier Epic 3 specification with code examples, mitigation strategies, and risk assessment.

---

### Epic 4: Component Library

**Priority:** 🔴 Must Have
**Estimated Time:** 10-15 hours
**Assigned:** YiLing (Lead, 10-12h), Sam + TaiSheng (Support, 2-3h each)
**Timeline:** Week 3-4 (parallel with Epic 0.6 and Epic 1)
**Dependencies:** Epic 1 (Chakra UI setup)

#### Epic Description

Build reusable React component library using Chakra UI v2 to accelerate frontend development across all 4 user roles (Producer, Distributor, Retailer, Consumer). Component library must be 100% complete before Week 5 when intensive UI development begins, preventing duplicate work and ensuring consistent design system.

#### Business Value

- **Development Speed:** Reusable components save 20-30 hours in Weeks 5-7 (no rebuilding forms for each role)
- **Consistent UX:** Same look/feel across all interfaces builds user trust
- **Mobile-First:** Responsive components work on desktop, tablet, phone without rework
- **Accessibility:** WCAG-compliant components prevent late-stage accessibility fixes
- **Team Efficiency:** Sam/TaiSheng can integrate UI faster with ready-made components

#### User Stories (High-Level)

- As a **frontend developer**, I want **reusable form components** so I don't rebuild inputs for each page
- As a **frontend developer**, I want **responsive layout system** so mobile works without extra CSS
- As a **frontend developer**, I want **validation components** so forms have consistent error handling
- As a **team member**, I want **component documentation** so I know which components exist and how to use them

#### Acceptance Criteria (Epic Level)

**Core Components (Week 3):**

- ✅ Button variants (Primary, Secondary, Danger, Ghost)
- ✅ Input fields (Text, Number, Date, TextArea, Select)
- ✅ Form validation wrappers (client-side validation, error messages)
- ✅ Card layouts (Product card, Company card, Trace record card)
- ✅ Navigation components (Header, Sidebar, Breadcrumbs)
- ✅ Loading states (Spinner, Skeleton, Progress bar)
- ✅ Toast notifications (Success, Error, Warning, Info)

**Advanced Components (Week 4):**

- ✅ Modal dialogs (Confirmation, Form modal, Info modal)
- ✅ Table components (Sortable, Filterable, Pagination)
- ✅ Timeline component (for product journey visualization)
- ✅ Chart wrappers (Temperature chart, Activity chart)
- ✅ QR code display component (react-qr-code integration)
- ✅ File upload component (Image upload with preview, drag-and-drop)

**Responsive Layout System:**

- ✅ Mobile-first breakpoints (sm: 480px, md: 768px, lg: 1024px, xl: 1280px)
- ✅ Grid system (1-12 columns, auto-responsive)
- ✅ Flexbox utilities (justify, align, gap, wrap)
- ✅ Container components (Page container, Section container, Content container)

**Documentation:**

- ✅ Component storybook or docs/components.md with usage examples
- ✅ Code snippets showing how to import and use each component
- ✅ Props documentation (what props each component accepts)

#### Technical Approach

**Component Structure:**

```
src/components/
├── ui/                    # Core UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   └── ...
├── forms/                 # Form-specific components
│   ├── ProductForm.tsx
│   ├── TraceRecordForm.tsx
│   ├── ValidationWrapper.tsx
│   └── ...
├── layout/                # Layout components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Container.tsx
│   └── ...
└── visualization/         # Charts and timeline
    ├── Timeline.tsx
    ├── TemperatureChart.tsx
    └── ...
```

**Example Component (Button):**

```typescript
import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";

export const Button = ({ variant = "primary", ...props }: ButtonProps) => {
  const variantStyles = {
    primary: { bg: "green.500", color: "white", _hover: { bg: "green.600" } },
    secondary: {
      bg: "gray.200",
      color: "gray.800",
      _hover: { bg: "gray.300" },
    },
    danger: { bg: "red.500", color: "white", _hover: { bg: "red.600" } },
  };

  return <ChakraButton {...variantStyles[variant]} {...props} />;
};
```

**Form Validation Wrapper:**

```typescript
export const ValidatedInput = ({ name, label, validation, ...props }) => {
  const [error, setError] = useState("");

  const handleBlur = (e) => {
    const value = e.target.value;
    if (validation.required && !value) {
      setError(`${label} is required`);
    } else if (validation.pattern && !validation.pattern.test(value)) {
      setError(validation.message || "Invalid format");
    } else {
      setError("");
    }
  };

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Input {...props} onBlur={handleBlur} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
```

#### Dependencies

**Requires:** Epic 1 (Chakra UI installed)
**Blocks:** Epic 5, 7, 8, 9 (all frontend epics depend on component library)

#### Team Assignment

**YiLing (10-12 hours - Lead):**

- Core components (Button, Input, Card, Navigation) (4 hours)
- Responsive layout system (Grid, Flexbox, Containers) (3 hours)
- Form validation components (ValidationWrapper, error handling) (3 hours)
- Component documentation (usage examples, props) (2 hours)

**Sam (2 hours - Support, Epic 0.6 coordination):**

- Button variants (Primary, Secondary, Danger) (1 hour)
- Input field component (text, number, date) (1 hour)

**TaiSheng (2-3 hours - Support, Epic 0.6 coordination):**

- Form validation wrappers (client-side validation) (2 hours)
- Toast notification wrapper (success/error states) (1 hour)

**Note:** Sam and TaiSheng contributions are part of Epic 3 Tier 2 "Team Component Contributions" but create outputs used in Epic 4 component library.

#### Risks & Mitigations

| Risk                                  | Mitigation                                                           |
| ------------------------------------- | -------------------------------------------------------------------- |
| Component library not ready by Week 5 | Start Week 3 (not Week 4), prioritize core components first          |
| YiLing overwhelmed with 15h workload  | Sam/TaiSheng contribute 2h each (Week 3-4) reducing YiLing to 10-12h |
| Components not reusable enough        | Code review by Sam/TaiSheng before Week 5 starts                     |
| Missing components discovered late    | Create "component backlog" in Week 4, add as needed in Week 5-7      |

---

### Epic 5: Product Registration

**Priority:** 🔴 Must Have
**Estimated Time:** 12-15 hours (Smart Contract 4h + Backend 4-5h + Frontend 4-6h)
**Assigned:** Sam (Smart Contract), TaiSheng (Backend), YiLing (Frontend)
**Timeline:** Week 3-5
**Dependencies:** Epic 2 (Company Management), Epic 3 Tier 1 (Security)

#### Epic Description

Enable producers to register harvested products on the blockchain with metadata (name, origin, harvest date, certification, photos). System automatically generates unique Product ID and QR code. Uses company's custodial wallet to sign blockchain transactions server-side (no MetaMask required).

#### Business Value

- **Start of Supply Chain:** First step in food traceability journey
- **Proof of Authenticity:** Blockchain timestamp + immutable record
- **Producer Trust:** Build reputation through verified products
- **Consumer Value:** Foundation for consumer query interface

#### User Stories (High-Level)

- As a **producer**, I want to **register harvested products** with name, origin, harvest date
- As a **producer**, I want to **upload product photos** so consumers can see what I harvested
- As a **producer**, I want to **specify organic certification** so consumers trust my claims
- As a **producer**, I want to **get unique Product ID** automatically assigned
- As a **producer**, I want to **download QR code** to print and attach to packaging
- As a **producer**, I want to **see blockchain confirmation** so I know it's permanent

#### Acceptance Criteria (Epic Level)

**Smart Contract:**

- ✅ `ProductRegistry.sol` contract deployed to Sepolia
- ✅ `registerProduct()` function accepts (name, origin, harvestDate, certification)
- ✅ ProductRegistered event emitted with productId, producer address, timestamp
- ✅ Role-based access control (only PRODUCER role can register)
- ✅ Product struct stores blockchain data
- ✅ Unit tests >70% coverage
- ✅ Gas cost <100k gas per registration

**Backend API:**

- ✅ `POST /api/products/register` endpoint
- ✅ Server-side wallet decryption and transaction signing
- ✅ Product metadata saved to Supabase (off-chain)
- ✅ Image upload to Supabase Storage
- ✅ QR code auto-generated (Epic 11 integration)
- ✅ Transaction hash returned to frontend

**Frontend:**

- ✅ Product registration form (simple, mobile-responsive)
- ✅ Form validation (harvest date cannot be future, name required)
- ✅ Image upload component with preview
- ✅ Loading states (transaction pending)
- ✅ Success confirmation with Product ID
- ✅ Error handling (wallet decryption failure, blockchain rejection)

#### Technical Approach

**Smart Contract (`contracts/ProductRegistry.sol`):**

```solidity
contract ProductRegistry is AccessControl {
  struct Product {
    uint256 id;
    string name;
    string origin;
    uint256 harvestDate;
    address producer;
    uint256 timestamp;
    bool exists;
  }

  uint256 public productCount;
  mapping(uint256 => Product) public products;

  event ProductRegistered(
    uint256 indexed productId,
    address indexed producer,
    string name,
    uint256 timestamp
  );

  function registerProduct(
    string memory name,
    string memory origin,
    uint256 harvestDate
  ) public onlyRole(PRODUCER_ROLE) returns (uint256) {
    require(bytes(name).length > 0, "Name required");
    require(harvestDate <= block.timestamp, "Future date not allowed");

    productCount++;
    products[productCount] = Product({
      id: productCount,
      name: name,
      origin: origin,
      harvestDate: harvestDate,
      producer: msg.sender,
      timestamp: block.timestamp,
      exists: true
    });

    emit ProductRegistered(productCount, msg.sender, name, block.timestamp);
    return productCount;
  }
}
```

**Backend API (`src/app/api/products/register/route.ts`):**

```typescript
export async function POST(req: Request) {
  const session = await getServerSession();
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: { company: true },
  });

  // Decrypt company wallet (custodial)
  const privateKey = decrypt(
    user.company.encryptedPrivateKey,
    process.env.ENCRYPTION_KEY
  );
  const wallet = new ethers.Wallet(privateKey, provider);

  // Sign transaction server-side
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);
  const tx = await contract.registerProduct(
    productData.name,
    productData.origin,
    Math.floor(new Date(productData.harvestDate).getTime() / 1000)
  );

  const receipt = await tx.wait();
  const productId = receipt.events.ProductRegistered.productId;

  // Save metadata to database
  await db.product.create({
    data: {
      blockchainId: productId,
      name: productData.name,
      imageUrl: uploadedImageUrl,
      companyId: user.companyId,
      createdByUserId: user.id,
      transactionHash: receipt.transactionHash,
    },
  });

  return Response.json({ success: true, productId });
}
```

**Frontend Form (`src/app/producer/register/page.tsx`):**

```typescript
<form onSubmit={handleRegisterProduct}>
  <Input name="name" label="Product Name" required />
  <Input name="origin" label="Origin Location" required />
  <Input
    type="date"
    name="harvestDate"
    label="Harvest Date"
    max={today}
    required
  />
  <Textarea name="certification" label="Organic Certification" />
  <ImageUpload name="photo" label="Product Photo" />
  <Button type="submit" loading={isPending}>
    Register Product
  </Button>
</form>
```

#### Dependencies

**Requires:** Epic 3 Tier 1 (wallet encryption), Epic 2 (company wallets exist)
**Blocks:** Epic 6, 7, 8, 11 (all depend on products existing)

#### Team Assignment

**Sam (4 hours):**

- ProductRegistry.sol contract (3 hours)
- Unit tests with Hardhat (1 hour)

**TaiSheng (3 hours):**

- Product registration API (2 hours)
- Wallet decryption + transaction signing (1 hour)

**YiLing (2-3 hours):**

- Producer dashboard page (1 hour)
- Product registration form (1-2 hours)

#### Risks & Mitigations

| Risk                            | Mitigation                                           |
| ------------------------------- | ---------------------------------------------------- |
| Wallet decryption fails         | Error handling, retry logic, log to audit trail      |
| Blockchain transaction rejected | Gas estimation, nonce management, show error to user |
| Image upload fails              | Optional field, show warning, allow retry            |
| Form validation bypassed        | Server-side validation in API route                  |

---

### Epic 6: Product Transfer Workflow

**Priority:** 🟡 Should Have
**Estimated Time:** 4-6 hours (Backend 2-3h + Frontend 2-3h)
**Assigned:** TaiSheng (Backend), YiLing (Frontend)
**Timeline:** Week 4-6
**Dependencies:** Epic 5 (Product Registration)

#### Epic Description

Automate product handoff workflow between supply chain participants. Producer transfers product to distributor, system sends email notification + dashboard alert. Distributor receives product, updates status. Same flow repeats for distributor → retailer transfer. Eliminates manual email coordination.

#### Business Value

- **Professional UX:** Matches modern supply chain platforms (SAP, Microsoft Dynamics)
- **Time Savings:** Automatic notifications vs manual emails
- **Reduced Errors:** Clear pending shipments dashboard, no products forgotten
- **Audit Trail:** Blockchain + database track who transferred to whom, when

#### User Stories (High-Level)

- As a **producer**, I want to **select distributor from list** and transfer product
- As a **producer**, I want **distributor automatically notified via email** so they expect shipment
- As a **distributor**, I want to **see pending shipments dashboard** so I know what's arriving
- As a **distributor**, I want to **click "Receive Product"** to confirm receipt
- As a **distributor**, I want to **transfer to retailer** with same workflow
- As a **retailer**, I want **same workflow** for receiving from distributor

#### Acceptance Criteria (Epic Level)

**Backend:**

- ✅ `POST /api/products/:id/transfer` endpoint
- ✅ Transfer specifies target company + user
- ✅ Email notification sent to recipient (SendGrid or Supabase Email)
- ✅ Dashboard notification created in database
- ✅ Product status updated (Draft → In Transit → Received)
- ✅ Audit log records transfer (from/to/when)

**Frontend:**

- ✅ Producer dashboard shows "Transfer Product" button
- ✅ Transfer modal: Select distributor company, select user
- ✅ Loading state during transfer
- ✅ Distributor dashboard shows "Pending Shipments" section
- ✅ "Receive Product" button confirms receipt
- ✅ Email notification template clear and actionable

#### Technical Approach

**Transfer API:**

```typescript
// POST /api/products/:id/transfer
export async function POST(req, { params }) {
  const { toCompanyId, toUserId, notes } = req.body;

  // 1. Update product status
  await db.product.update({
    where: { id: params.id },
    data: {
      status: "IN_TRANSIT",
      currentHolderId: toCompanyId,
    },
  });

  // 2. Create notification
  await db.notification.create({
    data: {
      userId: toUserId,
      type: "INCOMING_SHIPMENT",
      productId: params.id,
      message: `New shipment from ${session.user.company.name}`,
      read: false,
    },
  });

  // 3. Send email
  await sendEmail({
    to: toUser.email,
    subject: `New shipment: ${product.name}`,
    body: `Login to FoodTrace to receive it. Product ID: ${params.id}`,
  });

  return Response.json({ success: true });
}
```

**Dashboard Pending Shipments:**

```typescript
<DashboardSection title="Pending Shipments" count={pendingCount}>
  {pendingShipments.map((product) => (
    <ProductCard key={product.id}>
      <Text>{product.name}</Text>
      <Text>From: {product.company.name}</Text>
      <Button onClick={() => receiveProduct(product.id)}>
        Receive Product
      </Button>
    </ProductCard>
  ))}
</DashboardSection>
```

#### Dependencies

**Requires:** Epic 5 (products must exist), Epic 2 (company/user system)
**Blocks:** None (enhancement to Epic 7 workflow)

#### Team Assignment

**TaiSheng (2-3 hours):**

- Transfer API endpoint (1 hour)
- Email notification service (1 hour)
- Dashboard notification system (1 hour)

**YiLing (2-3 hours):**

- Transfer modal UI (1 hour)
- Pending shipments dashboard (1-2 hours)

#### Risks & Mitigations

| Risk                         | Mitigation                                           |
| ---------------------------- | ---------------------------------------------------- |
| Email not delivered          | Use reliable service (SendGrid), log delivery status |
| User doesn't check dashboard | Email notification as primary method                 |
| Transfer to wrong company    | Confirmation modal, show company name clearly        |

---

### Epic 7: Supply Chain Tracking

**Priority:** 🔴 Must Have
**Estimated Time:** 12-15 hours (Smart Contract 4h + Backend 3-4h + Frontend 5-7h)
**Assigned:** Sam (Smart Contract), TaiSheng (Backend), YiLing (Frontend)
**Timeline:** Week 4-6
**Dependencies:** Epic 5 (Product Registration)

#### Epic Description

Distributors and retailers add trace records to products as they move through supply chain. Each trace record captures: actor (who), action (what), location (where), timestamp (when), quality notes. Blockchain ensures immutable audit trail. Forms timeline of product journey visible to consumers.

#### Business Value

- **Complete Traceability:** Full product journey from farm to retail shelf
- **Rapid Recalls:** Identify affected products in seconds (vs 7 days)
- **Quality Assurance:** Document quality checks, temperature monitoring
- **Consumer Trust:** Transparent journey builds confidence in product

#### User Stories (High-Level)

- As a **distributor**, I want to **add trace record when receiving product** with location and quality notes
- As a **distributor**, I want to **record temperature during transport** so cold chain is documented
- As a **retailer**, I want to **add trace record when stocking product** with receiving date
- As a **retailer**, I want to **update status to "Sold"** when consumer purchases
- As any **supply chain participant**, I want to **see complete trace history** for a product

#### Acceptance Criteria (Epic Level)

**Smart Contract:**

- ✅ `TraceRecords.sol` contract (or integrated into ProductRegistry)
- ✅ `addTraceRecord()` function accepts (productId, action, location, notes)
- ✅ TraceRecordAdded event emitted
- ✅ Only authorized roles can add records (not consumers)
- ✅ Automatic timestamp (block.timestamp)
- ✅ Cannot modify past trace records (immutable)
- ✅ Gas cost <80k gas per trace record

**Backend:**

- ✅ `POST /api/products/:id/trace` endpoint
- ✅ Blockchain transaction + database save
- ✅ `GET /api/products/:id/trace-history` returns complete journey
- ✅ Caching for frequently queried products

**Frontend:**

- ✅ "Add Trace Record" form (distributor/retailer dashboards)
- ✅ Action dropdown (Received, Quality Check, Shipped, Stocked, Sold)
- ✅ Location input (GPS optional, text required)
- ✅ Quality notes textarea
- ✅ Product trace history timeline view
- ✅ Mobile-responsive forms

#### Technical Approach

**Smart Contract:**

```solidity
struct TraceRecord {
  uint256 productId;
  address actor;
  string action; // "RECEIVED", "QUALITY_CHECK", "SHIPPED", "STOCKED", "SOLD"
  string location;
  string notes;
  uint256 timestamp;
}

mapping(uint256 => TraceRecord[]) public productTraceHistory;

function addTraceRecord(
  uint256 productId,
  string memory action,
  string memory location,
  string memory notes
) public {
  // Updated Session 61: Allow PRODUCER, DISTRIBUTOR, or RETAILER roles
  require(
    hasRole(PRODUCER_ROLE, msg.sender) ||
    hasRole(DISTRIBUTOR_ROLE, msg.sender) ||
    hasRole(RETAILER_ROLE, msg.sender),
    "Caller must be producer, distributor, or retailer"
  );
  require(products[productId].exists, "Product not found");

  productTraceHistory[productId].push(TraceRecord({
    productId: productId,
    actor: msg.sender,
    action: action,
    location: location,
    notes: notes,
    timestamp: block.timestamp
  }));

  emit TraceRecordAdded(productId, msg.sender, action, block.timestamp);
}
```

#### Dependencies

**Requires:** Epic 5 (products must exist)
**Optional:** Epic 6 (transfer workflow enhances UX)

#### Team Assignment

**Sam (4 hours):**

- TraceRecord struct and functions (3 hours)
- Unit tests (1 hour)

**TaiSheng (3 hours):**

- Trace record API (2 hours)
- Trace history query optimization (1 hour)

**YiLing (4-5 hours):**

- Distributor trace form (2 hours)
- Retailer trace form (2 hours)
- Timeline view component (1 hour)

#### Risks & Mitigations

| Risk                                    | Mitigation                                        |
| --------------------------------------- | ------------------------------------------------- |
| Gas costs too high (many trace records) | Optimize struct, consider off-chain option        |
| Missing trace records (user forgets)    | Dashboard reminders, pending actions              |
| Fake location data                      | GPS integration (future), manual entry OK for POC |

---

### Epic 8: IoT Sensor Simulator

**Priority:** 🟡 Should Have
**Estimated Time:** 6-8 hours (Smart Contract 2h + Backend 2h + Frontend 3-4h)
**Assigned:** Sam (Smart Contract), TaiSheng (Backend), YiLing (Frontend)
**Timeline:** Week 4-5
**Dependencies:** Epic 5 (Product Registration)

#### Epic Description

Admin interface to simulate IoT sensor data (temperature, humidity, GPS) for products during transport. Three preset scenarios: Normal (2-4°C), Warning (8-10°C), Critical (>10°C). Demonstrates blockchain + IoT integration without requiring real hardware. Data recorded to blockchain with immutable timestamps.

#### Business Value

- **Cost Savings:** €150-200 saved vs buying Raspberry Pi + sensors
- **Reliable Demo:** No sensor failures during thesis presentation
- **Reproducible Testing:** Can test edge cases (extreme temps) easily
- **Academic Validity:** Standard practice in POC development (IBM Food Trust uses test harnesses)
- **Future-Ready:** Same data structure as real IoT sensors

#### User Stories (High-Level)

- As an **admin**, I want to **select a product** to attach sensor data
- As an **admin**, I want to **click "Normal" scenario button** to generate safe temperature data (2-4°C)
- As an **admin**, I want to **click "Warning" scenario** to simulate approaching threshold (8-10°C)
- As an **admin**, I want to **click "Critical" scenario** to simulate spoilage risk (>10°C)
- As an **admin**, I want to **see real-time data preview** before submitting to blockchain
- As an **admin**, I want **alerts triggered automatically** when temperature exceeds threshold

#### Acceptance Criteria (Epic Level)

**Smart Contract:**

- ✅ `addSensorData()` function accepts (productId, temperature, humidity, location)
- ✅ SensorDataRecorded event emitted
- ✅ Temperature stored as int256 \* 100 (gas optimization: 3.2°C = 320)
- ✅ Gas cost <60k gas per reading

**Backend:**

- ✅ `POST /api/iot/simulate` endpoint
- ✅ Saves to database + blockchain
- ✅ Alert triggered if temperature > 8°C (Warning) or > 10°C (Critical)
- ✅ Alert notification sent to product owner

**Frontend:**

- ✅ IoT Simulator admin page (only platform admin access)
- ✅ Product selector dropdown
- ✅ Three scenario buttons with icons: ✅ Normal, ⚠️ Warning, 🚨 Critical
- ✅ Real-time data preview (temperature, humidity, GPS)
- ✅ Submit button records to blockchain
- ✅ Optional: Auto-mode checkbox (generate data every N seconds)

#### Technical Approach

**Scenario Presets:**

```typescript
const scenarios = {
  normal: {
    temperature: () => 2 + Math.random() * 2, // 2-4°C
    humidity: () => 70 + Math.random() * 5, // 70-75%
    status: "SAFE",
  },
  warning: {
    temperature: () => 8 + Math.random() * 2, // 8-10°C
    humidity: () => 75 + Math.random() * 10, // 75-85%
    status: "WARNING",
  },
  critical: {
    temperature: () => 10 + Math.random() * 5, // 10-15°C
    humidity: () => 85 + Math.random() * 10, // 85-95%
    status: "CRITICAL",
  },
};
```

**UI Simulator Page:**

```typescript
<SimulatorPage>
  <ProductSelect value={selectedProduct} onChange={setSelectedProduct} />

  <ScenarioButtons>
    <Button colorScheme="green" onClick={() => generate('normal')}>
      ✅ Normal (2-4°C)
    </Button>
    <Button colorScheme="orange" onClick={() => generate('warning')}>
      ⚠️ Warning (8-10°C)
    </Button>
    <Button colorScheme="red" onClick={() => generate('critical')}>
      🚨 Critical (>10°C)
    </Button>
  </ScenarioButtons>

  <DataPreview>
    <Text>Temperature: {data.temperature}°C</Text>
    <Text>Humidity: {data.humidity}%</Text>
    <Text>GPS: {data.gps.lat}, {data.gps.lng}</Text>
  </DataPreview>

  <Button onClick={submitToBlockchain} loading={isPending}>
    Record to Blockchain
  </Button>
</SimulatorPage>
```

#### Dependencies

**Requires:** Epic 1 (products must exist to attach sensor data)

#### Team Assignment

**Sam (2 hours):**

- Smart contract sensor data function (1.5 hours)
- Unit tests (0.5 hours)

**TaiSheng (2 hours):**

- IoT simulate API (1 hour)
- Alert triggering logic (1 hour)

**YiLing (3-4 hours):**

- Simulator admin page UI (2 hours)
- Scenario buttons and data preview (1-2 hours)

#### Risks & Mitigations

| Risk                              | Mitigation                                                  |
| --------------------------------- | ----------------------------------------------------------- |
| Data looks fake to reviewers      | Use realistic ranges, mention "simulator" clearly in thesis |
| Auto-mode generates too much data | Rate limiting, max 10 readings per product                  |
| Alerts spam users                 | Rate limit alerts (max 1 per hour per product)              |

---

### Epic 9: Consumer Query Interface (Wallet-Free)

**Priority:** 🔴 Must Have
**Estimated Time:** 8-10 hours (Backend 3h + Frontend 5-7h)
**Assigned:** TaiSheng (Backend), YiLing (Frontend)
**Timeline:** Week 6-7
**Dependencies:** Epic 1, 2, 6 (Product Registration, Trace Records, QR Codes)

#### Epic Description

Public-facing interface where consumers scan QR code (or enter Product ID) to view complete product journey WITHOUT creating account or connecting wallet. Shows: product details, supply chain timeline, temperature logs, verification status, link to Etherscan for blockchain proof.

#### Business Value

- **Core Value Proposition:** Zero-friction consumer access is main selling point
- **Adoption:** No wallet/account requirement = 100x more consumers will use it
- **Trust Building:** Transparent journey increases willingness to pay premium
- **Viral Potential:** Consumers share impressive traceability with friends

#### User Stories (High-Level)

- As a **consumer**, I want to **scan QR code with phone camera** (no app download) so I can see product journey
- As a **consumer**, I want to **view product origin and harvest date** so I verify it's local
- As a **consumer**, I want to **see complete supply chain timeline** with all participants
- As a **consumer**, I want to **check temperature history** so I know cold chain was maintained
- As a **consumer**, I want to **see organic certification** so I trust marketing claims
- As a **consumer**, I want to **link to Etherscan** if I want blockchain proof (advanced users)
- As a **consumer**, I want **zero friction** - no login, no account, no wallet, no app

#### Acceptance Criteria (Epic Level)

**Backend:**

- ✅ `GET /api/products/:id/public` endpoint (no authentication required)
- ✅ Returns: product details, trace history, sensor readings, verification status
- ✅ Caching for popular products (Redis or Supabase caching)
- ✅ Rate limiting to prevent abuse (100 requests/minute per IP)

**Frontend:**

- ✅ `/products/:id` public page (no login required)
- ✅ QR code scanner (html5-qrcode library)
- ✅ Product search by ID (alternative to QR scan)
- ✅ Product journey timeline (visual, mobile-optimized)
- ✅ Temperature history chart (if sensor data exists)
- ✅ Verification badges (✅ Verified, ⚠️ Unverified)
- ✅ Link to Etherscan transaction
- ✅ "Share" button (copy link to product page)
- ✅ Works on iOS and Android browsers
- ✅ Page load time <3 seconds

#### Technical Approach

**Consumer Query Page:**

```typescript
// src/app/products/[id]/page.tsx (public route, no auth)
export default async function ProductPage({ params }) {
  const product = await db.product.findUnique({
    where: { id: params.id },
    include: {
      company: true,
      traceRecords: true,
      sensorReadings: true,
    },
  });

  return (
    <ConsumerLayout>
      <ProductHeader
        name={product.name}
        origin={product.origin}
        image={product.imageUrl}
      />

      <VerificationBadge verified={product.verificationCount > 2} />

      <SupplyChainTimeline traces={product.traceRecords} />

      {product.sensorReadings.length > 0 && (
        <TemperatureChart data={product.sensorReadings} />
      )}

      <BlockchainProof
        etherscanUrl={`https://sepolia.etherscan.io/tx/${product.transactionHash}`}
      />

      <ShareButton url={`https://foodtrace.app/products/${params.id}`} />
    </ConsumerLayout>
  );
}
```

**QR Scanner Component:**

```typescript
<QRScanner
  onScan={(productId) => router.push(`/products/${productId}`)}
  onError={(error) => toast.error("QR code not recognized")}
/>
```

#### Dependencies

**Requires:** Epic 1 (products exist), Epic 2 (trace records exist), Epic 6 (QR codes exist)

#### Team Assignment

**TaiSheng (3 hours):**

- Public product API endpoint (1 hour)
- Query optimization + caching (1 hour)
- Rate limiting (1 hour)

**YiLing (5-7 hours):**

- Consumer query page layout (2 hours)
- QR scanner integration (2 hours)
- Supply chain timeline component (2 hours)
- Temperature chart (1 hour) [optional]
- Mobile optimization (1 hour)

#### Risks & Mitigations

| Risk                             | Mitigation                                               |
| -------------------------------- | -------------------------------------------------------- |
| QR scan fails on some phones     | Fallback to manual Product ID entry                      |
| Page load too slow               | Caching, optimize images, lazy load charts               |
| Abuse (spam requests)            | Rate limiting per IP, Cloudflare DDoS protection         |
| Confusing for non-tech consumers | Simple language, visual timeline, hide blockchain jargon |

---

### Epic 10: Multi-Party Verification (Optional)

**Implementation Status**: Optional enhancement. Thesis Chapter 1.3.2 does not list multi-party verification as core objective. Recommended for future work if time permits after Week 6 checkpoint.

**Priority:** 🟢 Could Have
**Estimated Time:** 6-8 hours
**Assigned:** Sam
**Timeline:** Week 4 (if time permits) or Week 7
**Dependencies:** Epic 5 (Product Registration)

#### Epic Description

Allow independent third parties (quality inspectors, certification bodies) to verify product information. Products marked "Verified" after 2+ independent verifications. Builds trust through multi-party consensus. Optional reputation system tracks verifier history.

#### Business Value

- **Trust Amplification:** Independent verification more credible than self-reported data
- **Reputation System:** Producers build trust score over time
- **Fraud Detection:** Fake products unlikely to get verifications
- **Premium Pricing:** Verified products command higher prices

**Note:** This epic is OPTIONAL. If falling behind schedule at Week 4, skip and focus on core features. Can be added post-thesis if project continues.

#### User Stories (High-Level)

- As a **quality inspector**, I want to **verify a product's information** after inspection
- As a **producer**, I want **verified badge** on my products to build trust
- As a **consumer**, I want to **see verification count** (3 verifiers = high trust)
- As a **platform**, I want to **prevent self-verification** (producer cannot verify own products)

#### Acceptance Criteria (Epic Level)

- ✅ `verifyProduct()` smart contract function
- ✅ Verifier must have VERIFIER role
- ✅ Cannot verify own products
- ✅ Each address can verify once per product
- ✅ Verification count visible on consumer query page
- ✅ "Verified" badge if count > 2
- ⚠️ Optional: Reputation system (verifier trust score)

#### Team Assignment

**Sam (6-8 hours):**

- Smart contract verification logic (3 hours)
- Reputation system (basic) (3 hours)
- Unit tests (1-2 hours)

**Cut if behind schedule:** Drop reputation system, keep basic verification.

---

### Epic 11: QR Code Functionality

**Priority:** 🔴 Must Have
**Estimated Time:** 4-6 hours (Backend 2h + Frontend 2-4h)
**Assigned:** TaiSheng (Backend), YiLing (Frontend)
**Timeline:** Week 5-6
**Dependencies:** Epic 5 (Product Registration)

#### Epic Description

Automatic QR code generation when products registered. QR code encodes Product ID, links to consumer query page. Producers download QR code PNG, print, and attach to packaging. Consumers scan with phone camera (no app) to instantly view product journey.

#### Business Value

- **Consumer Access:** QR scanning is familiar, works on all smartphones
- **No App Required:** Camera app scans QR → opens browser → sees product info
- **Physical-Digital Bridge:** Connects physical product to blockchain data
- **Marketing Tool:** "Scan to verify authenticity" builds premium brand

#### User Stories (High-Level)

- As a **producer**, I want **QR code auto-generated** after product registration
- As a **producer**, I want to **download QR code as PNG** for printing
- As a **producer**, I want **high-resolution QR** (300 DPI) for professional packaging
- As a **consumer**, I want to **scan QR with phone camera** (iOS/Android native camera)
- As a **consumer**, I want **QR link to open consumer query page** immediately

#### Acceptance Criteria (Epic Level)

**Backend:**

- ✅ QR code generated server-side after product registration
- ✅ QR encodes: `https://foodtrace.app/products/{productId}`
- ✅ PNG file saved to Supabase Storage
- ✅ High resolution (300x300 px minimum, scalable SVG)
- ✅ QR download endpoint: `GET /api/products/:id/qr`

**Frontend:**

- ✅ Producer dashboard shows QR code thumbnail
- ✅ "Download QR Code" button (downloads PNG)
- ✅ QR preview modal (before download)
- ✅ Consumer query page QR scanner (html5-qrcode)
- ✅ QR scan success rate >95% (test on multiple phones)

#### Technical Approach

**QR Generation (server-side):**

```typescript
import QRCode from "qrcode";

async function generateQR(productId: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/products/${productId}`;

  const qrDataUrl = await QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    width: 300,
    margin: 2,
  });

  // Upload to Supabase Storage
  const { data } = await supabase.storage
    .from("qr-codes")
    .upload(`${productId}.png`, qrDataUrl);

  return data.publicUrl;
}
```

**Producer Dashboard:**

```typescript
<ProductCard>
  <Image src={product.qrCodeUrl} alt="QR Code" width={100} />
  <Button onClick={() => downloadQR(product.id)}>Download QR Code</Button>
</ProductCard>
```

**Consumer QR Scanner:**

```typescript
<QRScanner
  fps={10}
  qrbox={250}
  onScanSuccess={(decodedText) => {
    const productId = extractProductId(decodedText);
    router.push(`/products/${productId}`);
  }}
/>
```

#### Dependencies

**Requires:** Epic 5 (products must exist)
**Blocks:** Epic 4 (consumer query needs QR codes)

#### Team Assignment

**TaiSheng (2 hours):**

- QR generation on product registration (1 hour)
- QR download API (1 hour)

**YiLing (2-4 hours):**

- QR display in producer dashboard (1 hour)
- QR scanner in consumer page (2-3 hours, includes testing on multiple devices)

#### Risks & Mitigations

| Risk                           | Mitigation                                      |
| ------------------------------ | ----------------------------------------------- |
| QR doesn't scan on some phones | Use standard QR format, test on iOS + Android   |
| QR print quality poor          | Generate high-res (300 DPI), provide SVG option |
| QR damaged/unreadable          | Include Product ID text below QR as backup      |

---

### Epic 12: Data Visualization

**Priority:** 🟡 Should Have
**Estimated Time:** 6-8 hours
**Assigned:** TaiSheng (Backend 2h), YiLing (Frontend 4-6h)
**Timeline:** Week 7
**Dependencies:** Epic 2 (Trace Records), Epic 3 (Sensor Data)

#### Epic Description

Visual representation of product journey through supply chain. Timeline view shows all trace records chronologically. Temperature chart displays cold chain integrity. Makes complex blockchain data understandable for non-technical users.

#### Business Value

- **User Experience:** Visual timeline easier to understand than raw data
- **Trust Building:** Seeing complete journey builds confidence
- **Demo Impact:** Impressive visuals for thesis presentation
- **Accessibility:** Makes blockchain data accessible to everyone

**Note:** Can be simplified if behind schedule (simple list view instead of fancy timeline).

#### User Stories (High-Level)

- As a **consumer**, I want to **see visual timeline** of product journey
- As a **consumer**, I want to **see temperature chart** showing cold chain maintained
- As a **business user**, I want to **see dashboard analytics** (products registered, trace records added)
- As a **platform admin**, I want to **see platform statistics** (total companies, products, transactions)

#### Acceptance Criteria (Epic Level)

**Consumer View:**

- ✅ Product journey timeline (vertical, mobile-optimized)
- ✅ Each trace record shows: date, actor, location, notes
- ✅ Icons for different actions (✅ Received, 📦 Shipped, 🏪 Stocked)
- ✅ Temperature chart (line chart, red zone >8°C)
- ⚠️ Optional: Map view showing product movement

**Business User Dashboard:**

- ✅ Total products registered (count)
- ✅ Recent activity feed
- ✅ Pending actions (products to transfer, shipments to receive)

**Platform Admin Dashboard:**

- ✅ Total companies, users, products
- ✅ Recent blockchain transactions
- ✅ System health metrics

#### Technical Approach

**Timeline Component:**

```typescript
<Timeline>
  {traceRecords.map((record) => (
    <TimelineItem key={record.id}>
      <TimelineIcon action={record.action} />
      <TimelineContent>
        <Text fontWeight="bold">{record.action}</Text>
        <Text fontSize="sm">{record.company.name}</Text>
        <Text fontSize="sm">{record.location}</Text>
        <Text fontSize="xs" color="gray">
          {formatDate(record.timestamp)}
        </Text>
      </TimelineContent>
    </TimelineItem>
  ))}
</Timeline>
```

**Temperature Chart:**

```typescript
import { LineChart, Line, XAxis, YAxis, ReferenceLine } from "recharts";

<LineChart data={sensorReadings}>
  <XAxis dataKey="timestamp" />
  <YAxis domain={[0, 15]} label="Temperature (°C)" />
  <ReferenceLine y={8} stroke="orange" label="Warning" />
  <ReferenceLine y={10} stroke="red" label="Critical" />
  <Line dataKey="temperature" stroke="blue" />
</LineChart>;
```

#### Dependencies

**Requires:** Epic 2 (trace records), Epic 3 (sensor data)

#### Team Assignment

**TaiSheng (2 hours):**

- Dashboard analytics API (1 hour)
- Data aggregation queries (1 hour)

**YiLing (4-6 hours):**

- Timeline component (2 hours)
- Temperature chart (2 hours)
- Dashboard widgets (2 hours if time permits)

#### Risks & Mitigations

| Risk                      | Mitigation                                        |
| ------------------------- | ------------------------------------------------- |
| Chart library too complex | Use simple Chakra UI charts or Chart.js           |
| Mobile performance poor   | Lazy load charts, simplify for mobile             |
| Behind schedule           | Cut to simple list view instead of fancy timeline |

---

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

---

---

## 7. High-Level System Architecture

> **Note:** This section provides a high-level architecture overview for PRD context and supervisor review.
> Detailed architecture specification (component diagrams, API contracts, database schema, security tiers)
> will be documented in `docs/architecture/architecture.md` as a Week 2 deliverable per BMAD workflow.

### 7.1 Architecture Overview

The FoodTrace system follows a **3-tier architecture** optimized for academic POC requirements: 12-week timeline, zero-cost infrastructure (free tier services), and production-grade security patterns (custodial wallets, multi-tenant isolation).

The architecture balances thesis constraints with real-world enterprise patterns demonstrated by IBM Food Trust and similar blockchain traceability platforms.

---

### 7.2 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   USER INTERFACE LAYER                                  │
├────────────────┬────────────────┬──────────────┬────────────┬───────────┤
│   Producer     │  Distributor   │   Retailer   │  Consumer  │  IoT      │
│   Portal       │   Portal       │   Portal     │   Query    │Simulator  │
│ (Wallet Req.)  │ (Wallet Req.)  │(Wallet Req.) │(No Wallet) │(Admin)    │
│                │                │              │            │           │
│ • Register     │ • Receive      │ • Stock      │ • Scan QR  │ • Normal  │
│   Products     │   Products     │   Products   │ • View     │ • Warning │
│ • Upload       │ • Add Trace    │ • Mark Sold  │   Journey  │ • Critical│
│   Photos       │   Records      │ • Update     │ • Verify   │ • Manual  │
│ • Generate QR  │ • Record Temp  │   Status     │   Organic  │   Entry   │
│ • Transfer     │ • Quality      │ • Trace      │ • Check    │           │
│   to Dist.     │   Check        │   History    │   Alerts   │           │
└────────┬───────┴────────┬───────┴──────┬───────┴──────┬─────┴────┬──────┘
         │                │              │              │          │
         └────────────────┴──────────────┴──────────────┴──────────┘
                                  │
         ┌────────────────────────▼──────────────────────────┐
         │     NEXT.JS MONOLITH (Frontend + Backend)         │
         │  ┌──────────────────┐  ┌───────────────────────┐  │
         │  │   Web3 Layer     │  │   API Routes          │  │
         │  │ • Wagmi Hooks    │  │ • /api/products       │  │
         │  │ • RainbowKit     │  │ • /api/traces         │  │
         │  │ • Viem (Ethereum)│  │ • /api/iot/simulate   │  │
         │  │ • Contract calls │  │ • /api/qrcode         │  │
         │  │ • Transaction    │  │ • /api/auth (NextAuth)│  │
         │  │   signing        │  │ • /api/transfer       │  │
         │  └──────────────────┘  └───────────────────────┘  │
         │                                                   │
         │  • QR Code Generation/Scanning (html5-qrcode)     │
         │  • Role-Based Access Control (4 roles + admin)    │
         │  • Custodial Wallet Management (AES-256)          │
         │  • Multi-Tenant Data Isolation (Company-scoped)   │
         │  • Email Notifications (Transfer alerts)          │
         └──────┬────────────────────┬───────────────────────┘
                │                    │
      ┌─────────▼──────────┐   ┌────▼─────────────────┐
      │ Ethereum Sepolia   │   │  Supabase            │
      │  (Smart Contract)  │   │  (PostgreSQL)        │
      │                    │   │                      │
      │ • Product Registry │   │ • Images             │
      │ • Trace History    │   │ • Descriptions       │
      │ • Sensor Readings  │   │ • Sensor metadata    │
      │ • Verifications    │   │ • User accounts      │
      │ • Reputation       │   │ • Company data       │
      │ • Timestamps       │   │ • Search indexes     │
      │ • Events           │   │ • Audit logs         │
      │                    │   │ • Encrypted wallets  │
      │ (Immutable)        │   │ (Mutable, GDPR-ok)   │
      └────────────────────┘   └──────────────────────┘
```

---

### 7.3 Key Architectural Decisions

#### Decision 1: Next.js Monolith (vs Separate Backend)

**Choice:** Single Next.js application handles both frontend (React) and backend (API Routes)

**Rationale:**

- **Simpler deployment**: One Render.com service instead of two (frontend + backend)
- **No CORS issues**: API Routes and frontend share same origin
- **Team efficiency**: All 3 members already know Next.js
- **Cost savings**: Single free tier instance (750 hours/month)
- **Perfect for POC**: Production systems might split these, but acceptable for 12-week thesis

**Trade-off:** Harder to scale independently (acceptable for academic POC)

---

#### Decision 2: Supabase PostgreSQL (vs Vanilla PostgreSQL)

**Choice:** Supabase-hosted PostgreSQL with built-in pgBouncer connection pooling

**Rationale:**

- **Critical feature**: pgBouncer prevents connection exhaustion (Next.js serverless functions create many connections)
- **PostgreSQL-compatible**: No SQL changes needed, standard Prisma ORM works
- **Free tier generous**: 1GB storage, 2GB bandwidth sufficient for thesis
- **15-minute setup**: vs 2-3 hours for self-hosted PostgreSQL configuration
- **Integrated storage**: Built-in file storage with CDN for product images

**Alternative considered**: AWS RDS PostgreSQL (rejected: costs $15-50/month, complex setup)

---

#### Decision 3: Custodial Wallets (vs MetaMask Required)

**Choice:** Email/password login, server-side wallet generation, encrypted private key storage

**Rationale:**

- **Solves UX barrier**: 80% user abandonment due to wallet setup complexity (ACM CHI 2024)
- **Target user reality**: Finnish farmers don't have MetaMask (Persona 2: Matti Virtanen, age 52)
- **Enterprise pattern**: IBM Food Trust uses custodial wallets for business users
- **Academic justification**: Demonstrates understanding of production blockchain UX challenges

**Security implementation:**

- Private keys encrypted with AES-256
- Encryption key stored as Render.com environment variable (not in database)
- Audit logging for all wallet operations
- Multi-tenant isolation (Company A cannot access Company B wallets)

**Trade-off:** Centralization (platform controls keys) - acceptable for business-to-business supply chain use case

---

#### Decision 4: Hybrid Data Storage (On-Chain + Off-Chain)

**Choice:** Critical data on blockchain, metadata in PostgreSQL, cryptographically linked

**On-Chain (Ethereum Sepolia):**

- Product ID and hash
- Ownership transfers (Producer → Distributor → Retailer)
- Timestamps (immutable audit trail)
- Critical sensor alerts (temperature violations)
- Verification records

**Off-Chain (Supabase PostgreSQL):**

- Product descriptions (changeable without gas costs)
- High-resolution images (too expensive on-chain)
- Detailed sensor logs (thousands of readings)
- Search indexes (fast queries)
- User authentication data

**Cryptographic Linking:** SHA-256 hashes of off-chain data stored on-chain for integrity verification

**Rationale:**

- **Gas optimization**: Full on-chain storage costs ~$50 per product (Ethereum mainnet), hybrid approach ~$5
- **Performance**: PostgreSQL queries 100× faster than blockchain reads for complex filters
- **GDPR compliance**: Off-chain personal data can be deleted (blockchain immutability prevents deletion)

**Trade-off:** Trust boundary (must trust database hasn't changed data) - mitigated with hash verification

---

#### Decision 5: IoT Simulator (vs Real Hardware)

**Choice:** Software-based sensor simulator with 3 scenarios (Normal/Warning/Critical)

**Rationale:**

- **Cost savings**: €150-200 (Raspberry Pi + DHT22 sensors + GPS module)
- **Academic validity**: Standard practice in POC development (IBM Food Trust uses test harnesses)
- **Reproducible demos**: No hardware failures during thesis defense presentation
- **Timeline savings**: 3 weeks of IoT integration work avoided
- **Focus maintained**: Thesis demonstrates blockchain innovation, not IoT engineering

**Architecture compatibility:** Database + blockchain dual recording pattern identical to real MQTT sensors

**Future migration path:** API endpoint `/api/iot/simulate` can be replaced with `/api/iot/mqtt` without smart contract changes

---

### 7.4 Data Flow Example: Product Registration

**Scenario:** Producer Matti registers harvested blueberries

```
1. Producer Portal (Frontend)
   ├─ User fills form (name, origin, harvest date, photo)
   ├─ Upload photo → Supabase Storage
   └─ Submit → POST /api/products/register

2. Next.js API Route (Backend)
   ├─ Validate inputs (Zod schema)
   ├─ Retrieve company's custodial wallet (decrypt AES-256)
   ├─ Create database record (Prisma ORM → PostgreSQL)
   ├─ Calculate SHA-256 hash of metadata
   └─ Call smart contract: registerProduct(id, hash, timestamp)

3. Ethereum Sepolia (Blockchain)
   ├─ Smart contract verifies caller = authorized producer
   ├─ Store: productId, creator address, hash, timestamp
   ├─ Emit event: ProductRegistered(id, creator, timestamp)
   └─ Return transaction hash

4. Next.js API Route (Confirmation)
   ├─ Wait for blockchain confirmation (12-15 seconds)
   ├─ Generate QR code (product ID encoded)
   └─ Return: { productId, qrCode, txHash }

5. Producer Portal (Display)
   ├─ Show success message
   ├─ Display QR code (downloadable PNG)
   └─ Add product to "My Products" list
```

**Gas Cost:** ~87,000 gas (~$0.01 on Sepolia testnet, ~$13 on Ethereum mainnet)

**Total Time:** 15-20 seconds (12s blockchain confirmation + 3-8s API/database)

---

### 7.5 Security Architecture

**Multi-Tenant Isolation:**

- Database-level: Prisma queries scoped by `companyId` (prevent cross-company data access)
- Wallet isolation: Each company has unique Ethereum address, encrypted separately
- Row-level security: Supabase RLS policies enforce tenant boundaries

**Wallet Security (Tier 1 - Academic POC):**

- Private keys encrypted with AES-256 (crypto-js library)
- Encryption key stored as environment variable (Render.com secret)
- Keys never logged or exposed to frontend
- Audit trail: All wallet operations logged with timestamp, user, action

**Authentication:**

- NextAuth.js with email/password (Prisma adapter)
- Session cookies (httpOnly, secure, sameSite)
- Company-scoped access (users can only access their company's data)

**Future hardening (out of scope for Week 0):**

- Tier 2: Hardware Security Modules (HSM) for key storage
- Tier 3: Multi-sig wallets (2-of-3 approval for large operations)

Full security specification: See Epic 0.6 (Security Hardening) and future `docs/architecture/security.md`

---

### 7.6 Alignment with PRD Epics

This architecture directly supports the following MUST HAVE epics:

| Epic                              | Architecture Component                                               |
| --------------------------------- | -------------------------------------------------------------------- |
| **Epic 1: Project Setup**         | Development environment, Git, Hardhat, Next.js scaffolding           |
| **Epic 2: Company Management**    | Multi-tenant database schema, user authentication (NextAuth.js)      |
| **Epic 3: Security**              | AES-256 encryption, audit logging, row-level security (Supabase RLS) |
| **Epic 4: Component Library**     | Chakra UI components, design system, reusable React components       |
| **Epic 5: Product Registration**  | Frontend forms + API routes + smart contract integration             |
| **Epic 7: Supply Chain Tracking** | Trace record flow (Distributor/Retailer trace additions)             |
| **Epic 9: Consumer Query**        | Wallet-free read-only queries via public RPC (Alchemy)               |
| **Epic 11: QR Codes**             | QR generation (react-qr-code) + scanning (html5-qrcode)              |
| **Epic 13: Deployment**           | Render.com hosting + Supabase PostgreSQL + Sepolia testnet           |

---

### 7.7 Technology Stack Summary

**Layer 1: User Interface**

- Next.js 14.2.15 (React 18, Pages Router)
- TypeScript 5.8+
- Chakra UI v2 (component library)
- react-qr-code (QR generation)
- html5-qrcode (QR scanning)

**Layer 2: Application (Next.js Monolith)**

- Backend: Next.js API Routes + Node.js 18.x LTS
- Web3: Wagmi v2 + Viem + RainbowKit
- Authentication: NextAuth.js (Prisma adapter)
- ORM: Prisma (PostgreSQL client)
- Encryption: crypto-js (AES-256)

**Layer 3: Data**

- Blockchain: Ethereum Sepolia Testnet
- Smart Contracts: Solidity ^0.8.20 + Hardhat + OpenZeppelin
- Database: Supabase PostgreSQL + pgBouncer
- File Storage: Supabase Storage (product images)
- RPC Provider: Alchemy (public blockchain access)

**Deployment:**

- Application: Render.com (Node.js server, 750h/month free)
- Database: Supabase (1GB storage, 2GB bandwidth free)
- Blockchain: Sepolia (permanent, no hosting cost)

---

### 7.8 Scalability Considerations

**Current Design (Academic POC):**

- Target: 3-5 companies, 100-500 products, 10-20 concurrent users
- Database: Single Supabase instance (1GB sufficient)
- Blockchain: Sepolia testnet (2,000-3,500 TPS shared across all users)

**Production Evolution (Out of Scope, Discussed in Thesis):**

- Database: Connection pooling (pgBouncer) allows 100+ concurrent users
- Blockchain: Migrate to Hyperledger Fabric consortium (2,000-3,500 TPS dedicated)
- Caching: Redis for frequently accessed product queries
- CDN: Cloudflare for static assets (QR codes, images)
- Monitoring: Sentry for error tracking, Datadog for performance

**Thesis Discussion Points:**

- Ethereum Layer 1 limitations (30-50 TPS) vs Hyperledger Fabric (2,000-3,500 TPS)
- Gas cost economics for low-margin products (lettuce vs specialty items)
- Public blockchain transparency vs business confidentiality needs

---

### 7.9 Architecture Validation

**Design Validated Against:**

- ✅ IBM Food Trust architecture (custodial wallets, hybrid storage)
- ✅ Walmart blockchain case study (testnet → production migration pattern)
- ✅ OAMK Ruokajälki project requirements (Finnish market needs)
- ✅ Zhao et al. (2019) systematic review (Ethereum vs Hyperledger comparison, 71 papers reviewed)
- ✅ BMAD methodology (rapid prototyping, MUST/SHOULD/COULD prioritization)

**Peer-Reviewed:**

- Session 4: Architecture risk assessment (added Epic 0.6 Security)
- Session 11: Thesis chapter verification (alignment with implementation reality)
- Session 12: PRD architecture documentation (this section)

---

**Total Word Count:** ~1,200 words (~4 pages)

**Detailed Architecture Document:** `docs/architecture/architecture.md` (Week 2 deliverable, ~3,000 words, component diagrams, API contracts, database schema)

---

## Document References

**Note:** Sections 8-12 have been extracted to separate documents for easier team review and future maintenance. Section 7 (High-Level System Architecture) has been added to PRD for supervisor review context.

### Section 8: Team Roles & Responsibilities

**Location:** `docs/planning/team-workload.md` (existing document, 724 lines)
**Content:** Complete breakdown of Sam, TaiSheng, and YiLing's roles, epic assignments, weekly focus areas, time estimates

### Section 9: Technical Constraints

**Location:** `docs/planning/technical-constraints.md` (new document)
**Content:** Technology limitations, development environment requirements, timeline pressures, academic constraints, risk mitigations

### Section 10: Definition of Done

**Location:** `docs/development-guide.md` (appended to existing document)
**Content:** Epic-level, story-level, week-level, and project-level completion checklists

### Section 11: Next Steps

**Location:** `docs/planning/action-plan.md` (new document)
**Content:** Week 0-3 action items, kickoff meeting agenda, communication setup, BMAD workflow instructions

### Section 12: Change Management

**Location:** `docs/planning/change-management.md` (new document)
**Content:** Scope change process, decision trees, escalation procedures, emergency contingency plans

**Why Extracted:**

- Original PRD was 3,939 lines (~83 pages) - too long for team review
- Modern PRD best practice: 1-6 pages (2024-2025 industry standard)
- Sections 8-12 are process/planning documents, not product requirements
- Current PRD (Sections 1-7): ~2,800 lines (~47 pages) - focused on product vision + epic requirements + high-level architecture

**For Team Review:**

- Start with Sections 1-7 (this document) - product requirements, epic breakdown, and high-level architecture
- Reference supporting documents as needed during Week 2-3 planning

---

**END OF PRODUCT REQUIREMENTS DOCUMENT**

**Next Steps:**

1. Epic Sharding: Use PO agent to shard PRD into 13 individual epic files (Week 2)
2. Architecture Document: Create detailed architecture specification at docs/architecture/architecture.md (Week 2 deliverable)
3. PO Validation: Achieve >90% alignment with brief.md (Week 2 checkpoint)
4. Begin BMAD Development Workflow: Week 3+ (SM → Dev → QA cycle)
