# Thesis Outline & Writing Guide
**Project:** FoodTrace - Blockchain Food Traceability System
**Institution:** OAMK University of Applied Sciences
**Type:** Bachelor's Thesis
**Team:** Sam Chou, TaiSheng Chen, YiLing Chen
**Target:** 60+ pages (20 pages per person minimum)
**Timeline:** Weeks 10-12 (Writing Phase)

---

## 📋 OAMK Thesis Structure (Standard Format)

Based on OAMK thesis template `/home/kala/Downloads/Thesis-template-110625-Word.docx`

### Required Components

| Section | Page Count | Owner | Status |
|---------|------------|-------|--------|
| **Cover Page** | 1 page | Team | 🔜 Week 10 |
| **Abstract** | 1 page max | Team (collaborative) | 🔜 Week 11 |
| **Contents** (Table of Contents) | 1-2 pages | Auto-generated | 🔜 Week 11 |
| **1. Introduction** | 4-6 pages | Sam | 🔜 Week 10 |
| **2. Literature Review** | 10-15 pages | All (divide topics) | 🔜 Week 10 |
| **3. Methodology** | 6-8 pages | TaiSheng | 🔜 Week 10 |
| **4. Implementation** | 15-20 pages | All (by role) | 🔜 Week 10-11 |
| **5. Results & Testing** | 8-12 pages | TaiSheng + YiLing | 🔜 Week 11 |
| **6. Discussion** | 6-8 pages | Sam | 🔜 Week 11 |
| **7. Conclusion** | 3-5 pages | Team (collaborative) | 🔜 Week 12 |
| **References** | 2-4 pages | All | 🔜 Throughout |
| **Appendices** (Optional) | Variable | All | 🔜 Week 12 |

**Total Target:** 60-80 pages

---

## 📖 Detailed Chapter Breakdown

### Cover Page
**Content:**
- OAMK University logo
- Thesis title: "Blockchain-Based Food Supply Chain Traceability System"
- Subtitle: "A Proof-of-Concept Using Ethereum Smart Contracts and Next.js"
- Authors: Sam Chou, TaiSheng Chen, YiLing Chen
- Degree Programme: Information Technology
- Option: Software Development (or applicable)
- Term: Fall 2025
- Date: January 2026

---

### Abstract (1 page maximum)
**Purpose:** Short summary (200-300 words) providing overall idea of the work

**Structure:**
1. **Background** (2-3 sentences)
   - Food supply chain traceability challenges
   - Need for transparent, immutable tracking systems

2. **Objectives** (2-3 sentences)
   - Develop proof-of-concept blockchain traceability system
   - Demonstrate 4-role supply chain tracking (Producer → Distributor → Retailer → Consumer)
   - Implement IoT sensor simulation and wallet-free consumer access

3. **Theoretical Background** (2-3 sentences)
   - Ethereum blockchain technology
   - Smart contracts for data immutability
   - Next.js for full-stack development

4. **Research Methods** (2-3 sentences)
   - BMAD (Breakthrough Method of Agile AI-driven Development) methodology
   - Agile development with 12-week sprint
   - Iterative design and testing approach

5. **Results** (3-4 sentences)
   - Successfully deployed smart contracts to Sepolia testnet
   - Implemented 4-role UI system with QR code tracking
   - Achieved [X]% test coverage, [Y] second average query time
   - Demonstrated complete product journey tracking from farm to consumer

6. **Conclusions** (2-3 sentences)
   - Blockchain viable for food traceability POC
   - Ethereum suitable for transparent supply chain tracking
   - Future work: Production deployment with Hyperledger Fabric

**Writing Style:**
- Use **past simple tense** for objectives, methods, results
- Use **present tense** for general information
- Use **passive voice** (recommended by OAMK)
- Write in complete sentences
- **Line spacing: 1.0**

**Keywords** (Select in Theseus system, not in abstract text):
- Blockchain
- Food Traceability
- Supply Chain Management
- Smart Contracts
- Ethereum
- Next.js

---

## Chapter 1: INTRODUCTION (4-6 pages)

**Owner:** Sam
**Purpose:** Introduce the problem, context, and thesis objectives

### 1.1 Background (1.5-2 pages)

**Content:**
- Food supply chain complexity (global nature, multiple stakeholders)
- Current traceability challenges:
  - Paper-based systems (slow, error-prone)
  - Centralized databases (single point of failure, trust issues)
  - Lack of transparency for consumers
  - Food safety incidents (e.g., Walmart taking 7 days to trace mangoes)
- Need for modern solution (blockchain's value proposition)

**Sources to Reference:**
- Walmart + IBM Food Trust case study
- WHO food safety statistics
- Recent food recall incidents
- OAMK Ruokajälki project context (local connection)

### 1.2 Problem Statement (1 page)

**Content:**
- **The Problem:** "How can we create a transparent, immutable, and efficient food traceability system?"
- **Key Challenges:**
  - Data immutability requirements
  - Multi-stakeholder coordination
  - Consumer accessibility (wallet-free access)
  - Real-time monitoring (temperature, humidity)
  - Cost-effectiveness for small producers

### 1.3 Objectives & Research Questions (1 page)

**Main Objective:**
"To design and implement a proof-of-concept blockchain-based food traceability system using Ethereum smart contracts"

**Specific Objectives:**
1. Develop smart contracts for immutable product registration and tracking
2. Implement 4-role supply chain UI (Producer, Distributor, Retailer, Consumer)
3. Create IoT sensor simulation for temperature/humidity monitoring
4. Build wallet-free consumer query interface via QR codes
5. Deploy and test on Ethereum Sepolia testnet

**Research Questions:**
1. How suitable is Ethereum blockchain for food supply chain traceability?
2. What are the advantages and limitations of blockchain compared to traditional systems?
3. How can we balance transparency (public blockchain) with privacy (business data)?
4. What is the feasibility of deploying blockchain traceability for small-scale producers?

### 1.4 Scope & Limitations (1-1.5 pages)

**Scope:**
- Proof-of-concept (POC) implementation
- 4-role simplified supply chain
- Sepolia testnet deployment (not mainnet)
- IoT simulator (not real hardware)
- Single product type focus (e.g., organic vegetables)

**Limitations:**
- Not production-ready (scalability not tested)
- Testnet only (no real economic costs)
- Simulated IoT data (not real sensors)
- Limited to 3-wallet testing scenario
- No regulatory compliance validation

### 1.5 Thesis Structure (0.5 page)

Brief overview of each chapter (one paragraph per chapter).

---

## Chapter 2: LITERATURE REVIEW (10-15 pages)

**Owner:** All (divide topics)
**Purpose:** Review existing research on blockchain, food traceability, and related technologies

### 2.1 Food Supply Chain Traceability (Sam - 3 pages)

**Topics:**
- Traditional traceability systems (barcodes, RFID, centralized databases)
- Current challenges in food supply chains
- Food safety regulations (EU, FDA requirements)
- Case studies: Walmart + IBM Food Trust, Nestlé, Carrefour

**Key Sources:**
- Academic papers on food safety
- Industry reports (McKinsey, Deloitte)
- Government regulations

### 2.2 Blockchain Technology (Sam - 3-4 pages)

**Topics:**
- Blockchain fundamentals (distributed ledger, consensus, immutability)
- Types of blockchains: Public vs Private (Ethereum vs Hyperledger Fabric)
- Smart contracts (definition, use cases, benefits)
- Ethereum architecture (accounts, transactions, gas, EVM)
- Consensus mechanisms (Proof of Work, Proof of Stake)

**Key Sources:**
- Ethereum whitepaper
- Academic papers on blockchain (Springer, IEEE)
- Technical documentation

### 2.3 Blockchain in Food Supply Chains (TaiSheng - 3-4 pages)

**Topics:**
- Literature review: Blockchain food traceability research (2020-2025)
- **Critical:** Ethereum vs Hyperledger Fabric comparison
  - Springer 2025 systematic review (24 papers each)
  - Use cases for each platform
  - Performance comparisons
  - Decision factors (transparency vs privacy)
- Existing implementations:
  - IBM Food Trust (Hyperledger Fabric)
  - VeChain (food tracking)
  - OriginTrail (supply chain)
- Research gaps (what hasn't been solved yet)

**Key Sources:**
- Springer 2025: "Digital Transformation of Food Supply Chain Management Using Blockchain"
- IEEE papers on Hyperledger Fabric food traceability
- ScienceDirect optimization studies

### 2.4 IoT Integration with Blockchain (YiLing - 2-3 pages)

**Topics:**
- IoT in supply chain monitoring
- Temperature and humidity sensors
- IoT + Blockchain integration patterns
- MQTT protocol for data transmission
- Case studies: IoT-enabled food tracking systems

**Key Sources:**
- Academic papers on IoT + blockchain integration
- MQTT documentation
- Industry IoT case studies

### 2.5 Web3 Technologies & User Interfaces (YiLing - 1-2 pages)

**Topics:**
- Web3 wallets (MetaMask, Rainbow Wallet)
- Web3 libraries (Wagmi, Viem, Ethers.js)
- User experience challenges in blockchain apps
- Wallet-free access patterns (for consumers)

**Key Sources:**
- Web3 documentation
- UX research papers on blockchain interfaces
- Accessibility studies

---

## Chapter 3: METHODOLOGY (6-8 pages)

**Owner:** TaiSheng
**Purpose:** Explain how the project was executed

### 3.1 Development Approach (1.5 pages)

**Content:**
- **BMAD Methodology** (Breakthrough Method of Agile AI-driven Development)
  - Why chosen (AI-assisted development, structured workflow)
  - Planning phase (brief → PRD → architecture)
  - Development phase (SM → Dev → QA cycle)
  - Benefits for thesis timeline (12 weeks)
- Agile principles applied
- AI-assisted development (Claude Code, GitHub Copilot)

**Include diagram:** BMAD workflow (from user-guide.md)

### 3.2 Project Planning (1 page)

**Content:**
- Team structure (3 members, role division)
- Timeline (12 weeks, breakdown by phase)
- Tools & technologies selected
- Risk assessment & mitigation strategies

### 3.3 Blockchain Platform Selection (2 pages) ⭐ **CRITICAL**

**Content:**
**Decision: Ethereum (Sepolia Testnet)**

**Justification (use the justification I provided earlier!):**

1. **Educational Accessibility**
   - Extensive free learning resources (Cyfrin Updraft, Ethereum.org)
   - Larger student/developer community
   - JavaScript-based tooling (Hardhat) matches team skillset
   - No consortium setup required

2. **Transparency Alignment**
   - Thesis focuses on consumer trust through transparency
   - Public blockchain better demonstrates immutability
   - Testnet provides same transparency (cost-free)
   - Etherscan for visual demonstration

3. **Technical Feasibility**
   - Sepolia testnet = €0 cost
   - Well-documented Web3 libraries
   - Faster POC development
   - Simpler deployment

4. **Academic Precedent**
   - Equal representation in literature (50/50 split - cite Springer 2025)
   - Universities use Ethereum for thesis projects
   - Demonstrates decentralized systems understanding

**Alternatives Considered:**
- **Hyperledger Fabric:** Better for enterprise B2B, but requires consortium setup, steeper learning curve, less transparent for consumers
- **Other public chains (Polygon, BSC):** Less academic recognition, similar functionality

**Future Work Consideration:**
"For production deployment, Hyperledger Fabric may be more suitable for B2B consortiums, privacy requirements, and regulatory compliance. However, for academic POC within 12-week timeline, Ethereum provides optimal balance."

**Include comparison table:**
| Criterion | Ethereum | Hyperledger Fabric |
|-----------|----------|-------------------|
| Learning Resources | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐ Good |
| Setup Complexity | ⭐⭐⭐⭐⭐ Simple | ⭐⭐ Complex |
| Transparency | ⭐⭐⭐⭐⭐ Public | ⭐⭐ Private |
| Cost (Testnet) | €0 | Infrastructure needed |
| Academic Use | 50% (Springer 2025) | 50% (Springer 2025) |
| For POC | ✅ Excellent | ❌ Overkill |

### 3.4 Technical Architecture Design (1.5 pages)

**Content:**
- System architecture overview
- Technology stack decisions:
  - Frontend: Next.js 14.2.15 + React 18 (why monolith vs microservices, why v14 vs v15)
  - Smart contracts: Solidity + Hardhat (why Hardhat vs Foundry)
  - Database: Supabase (why connection pooling critical)
  - Hosting: Render (Node.js Server) + Sepolia
- Architecture patterns (separation of on-chain/off-chain data)

**Include diagram:** System architecture (from architecture.md after it's created)

### 3.5 Development Process (1 page)

**Content:**
- Iterative development cycles
- Version control (GitHub, branching strategy)
- Testing strategy (unit tests, integration tests, E2E)
- Documentation practices
- Code review process

### 3.6 Data Collection & Testing Methods (1 page)

**Content:**
- Test scenarios designed
- Performance metrics to measure:
  - Transaction speed (block confirmation time)
  - Query response time
  - Gas costs
  - User experience metrics
- IoT simulator testing approach
- User acceptance testing plan

---

## Chapter 4: IMPLEMENTATION (15-20 pages)

**Owner:** All (divide by role)
**Purpose:** Describe what was built and how

### 4.1 Smart Contract Development (Sam - 6-7 pages)

#### 4.1.1 Contract Architecture (2 pages)
- Contract structure overview
- Main contracts:
  - `FoodTraceRegistry.sol` - Core registration
  - `TraceRecords.sol` - Supply chain tracking
  - `IOTSensorData.sol` - Sensor data storage
  - `AccessControl.sol` - Role-based permissions
- Data structures (structs, mappings, arrays)
- Events for frontend listening

**Include code snippets** (key functions with explanations)

#### 4.1.2 Role-Based Access Control (1.5 pages)
- OpenZeppelin AccessControl implementation
- Four roles: Producer, Distributor, Retailer, Consumer (read-only)
- Permission matrix (who can do what)
- Security considerations

**Include code snippet:** Role assignment logic

#### 4.1.3 Product Registration & Tracking (1.5 pages)
- `registerProduct()` function implementation
- Unique product ID generation (hashing strategy)
- Metadata storage (on-chain vs off-chain decision)
- QR code linkage

**Include code snippet:** Product registration function

#### 4.1.4 Trace Record Management (1 page)
- `addTraceRecord()` function
- Timestamping strategy
- Location tracking
- Actor verification

**Include code snippet:** Add trace record function

#### 4.1.5 IoT Sensor Data Integration (1 page)
- Sensor data structure
- Data validation (temperature/humidity ranges)
- Alert thresholds
- Historical data queries

#### 4.1.6 Testing & Deployment (1 page)
- Hardhat testing framework
- Test coverage achieved ([X]%)
- Gas optimization techniques used
- Sepolia testnet deployment process
- Contract verification on Etherscan

**Include:** Contract addresses, transaction hashes

### 4.2 Backend Development (TaiSheng - 3-4 pages)

#### 4.2.1 Next.js API Routes (1 page)
- API architecture (serverless functions)
- Endpoints designed:
  - `/api/products` - Product queries
  - `/api/trace` - Trace history
  - `/api/sensors` - IoT data
  - `/api/verify` - Verification status
- Request/response formats (JSON schemas)

**Include code snippet:** API route example

#### 4.2.2 Database Schema (1 page)
- Supabase (PostgreSQL) tables:
  - `products` - Off-chain metadata
  - `trace_records` - Cached blockchain data
  - `sensor_readings` - IoT simulator data
  - `users` - Authentication (if implemented)
- Relationships (foreign keys)
- Indexing strategy for query performance

**Include diagram:** Database ER diagram

#### 4.2.3 Web3 Integration (1.5 pages)
- Wagmi v2 hooks configuration
- RainbowKit wallet connection
- Contract interaction patterns
- Event listening and caching
- Error handling (transaction failures, network issues)

**Include code snippet:** Wagmi hook usage

#### 4.2.4 Caching & Performance (0.5 page)
- Blockchain query caching strategy
- Supabase connection pooling (pgBouncer)
- Response time optimization

### 4.3 Frontend Development (YiLing - 5-6 pages)

#### 4.3.1 UI Architecture (1 page)
- Next.js App Router structure
- Component hierarchy
- State management approach
- Routing strategy (4 role dashboards + consumer query)

**Include diagram:** Component tree

#### 4.3.2 Producer Dashboard (1 page)
- Product registration form
- Photo upload (client-side or server-side?)
- QR code generation (using react-qr-code)
- Product listing view

**Include screenshots:** Producer UI

#### 4.3.3 Distributor & Retailer Dashboards (1 page)
- Receiving products (scan QR or manual entry)
- Adding trace records
- Updating location and status
- Notes and quality checks

**Include screenshots:** Trace record UI

#### 4.3.4 Consumer Query Interface (1 page)
- Wallet-free access (how implemented)
- QR code scanning (using html5-qrcode)
- Product journey visualization
- Temperature history charts
- Verification indicators

**Include screenshots:** Consumer view

#### 4.3.5 IoT Simulator Admin Interface (1 page)
- Three scenario buttons (Normal, Warning, Critical)
- Manual data entry mode
- Auto-generation mode
- Real-time data display
- Alert notifications

**Include screenshots:** IoT simulator UI

#### 4.3.6 Responsive Design & Accessibility (0.5 page)
- Mobile-first approach (why important - consumers use phones)
- Chakra UI component usage
- Accessibility features (ARIA labels, keyboard navigation)
- Browser compatibility testing

### 4.4 Integration & Deployment (All - 1 page)

- Integration testing approach
- CI/CD pipeline (if implemented)
- Render deployment process (Node.js server)
- Environment variables management
- Monitoring and logging

---

## Chapter 5: RESULTS & TESTING (8-12 pages)

**Owner:** TaiSheng + YiLing
**Purpose:** Present findings, test results, performance analysis

### 5.1 Test Coverage & Results (TaiSheng - 2-3 pages)

#### 5.1.1 Smart Contract Testing
- Unit test results (coverage %, pass/fail)
- Integration test scenarios
- Edge cases tested
- Security testing (re-entrancy, overflow, access control)

**Include table:** Test results summary

#### 5.1.2 Frontend Testing
- Manual testing matrix (browsers, devices)
- User flow testing (end-to-end scenarios)
- Bugs found and fixed

**Include table:** Test matrix

### 5.2 Performance Analysis (TaiSheng - 2-3 pages)

#### 5.2.1 Transaction Performance
- Average block confirmation time: [X] seconds
- Gas costs per function:
  - `registerProduct()`: [X] gas
  - `addTraceRecord()`: [Y] gas
  - `addSensorData()`: [Z] gas
- Total cost per product journey: ~€[X] (on mainnet estimation)

**Include charts:** Gas costs comparison

#### 5.2.2 Query Performance
- Average API response times
- Database query performance
- Caching effectiveness
- Concurrent user handling

**Include charts:** Response time graphs

### 5.3 User Acceptance Testing (YiLing - 2 pages)

- Test scenarios with 3 wallets (simulating supply chain)
- Complete product journey walkthrough
- QR code scanning reliability
- IoT simulator usability
- Consumer query experience

**Include:** Step-by-step screenshots of complete flow

### 5.4 Comparative Analysis (TaiSheng - 1-2 pages)

**Blockchain vs Traditional System:**
| Criterion | Blockchain (FoodTrace) | Traditional (Paper/Database) |
|-----------|----------------------|--------------------------|
| Data Immutability | ✅ Guaranteed | ❌ Can be altered |
| Traceability Speed | ✅ ~[X] seconds | ❌ ~7 days (Walmart case) |
| Transparency | ✅ Public verification | ❌ Closed system |
| Trust Model | ✅ Decentralized | ❌ Single authority |
| Setup Cost | ⚠️ Higher initial | ✅ Lower |
| Running Cost | ⚠️ Gas fees | ✅ Lower |
| Technical Complexity | ⚠️ High | ✅ Low |

### 5.5 Findings Summary (Both - 1 page)

- Key achievements
- Performance benchmarks met/not met
- User experience insights
- Technical challenges encountered

---

## Chapter 6: DISCUSSION (6-8 pages)

**Owner:** Sam
**Purpose:** Interpret results, analyze implications, critical reflection

### 6.1 Interpretation of Results (2 pages)

- What do the results mean?
- How do they answer research questions?
- Comparison to initial objectives (met/not met, why?)
- Unexpected findings

### 6.2 Advantages of Blockchain Approach (2 pages)

- **Immutability:** Data cannot be altered (how this helps food safety)
- **Transparency:** All stakeholders can verify (builds trust)
- **Decentralization:** No single point of failure
- **Speed:** Traceability in seconds vs days (cite Walmart case)
- **Automation:** Smart contracts reduce manual work

### 6.3 Limitations & Challenges (2-3 pages)

#### 6.3.1 Technical Limitations
- **Scalability:** Gas costs prohibitive for high-volume products
- **Testnet vs Mainnet:** Real costs not experienced
- **IoT Simulation:** Not real-world conditions
- **Oracle Problem:** How to ensure off-chain data accuracy?

#### 6.3.2 Practical Limitations
- **Adoption Barriers:** Farmers need wallets, training
- **Cost:** Gas fees may be too high for small producers
- **Privacy:** Public blockchain exposes business data
- **Regulations:** GDPR compliance challenges (right to be forgotten vs immutability)

#### 6.3.3 User Experience Challenges
- Wallet complexity for non-tech users
- Transaction confirmation delays
- Error handling (failed transactions)

### 6.4 Critical Reflection (1 page)

- What would you do differently?
- What worked well?
- Lessons learned
- Team collaboration reflections

### 6.5 Recommendations for Implementation (1 page)

If deploying in production:
- Use Hyperledger Fabric for B2B consortium
- Implement Layer 2 solutions for gas cost reduction
- Hybrid model: Public + Private blockchain
- Subsidize gas costs for small producers
- Provide extensive user training

---

## Chapter 7: CONCLUSION (3-5 pages)

**Owner:** Team (collaborative)
**Purpose:** Summarize work, answer research questions, suggest future work

### 7.1 Summary of Work (1 page)

- Brief recap of what was built
- Main achievements
- Key technical contributions

### 7.2 Research Questions Answered (1.5 pages)

**For each research question, provide clear answer:**

**Q1: How suitable is Ethereum blockchain for food supply chain traceability?**
Answer: Ethereum is technically suitable for POC and demonstrates transparency benefits, but gas costs and scalability challenges make it less practical for production without Layer 2 solutions...

**Q2: What are advantages and limitations compared to traditional systems?**
Answer: Blockchain provides immutability and transparency (major advantages), but has higher cost and complexity (limitations). For high-value products (organic, specialty), benefits outweigh costs...

**Q3: How to balance transparency with privacy?**
Answer: Hybrid approach recommended - public hashes for verification, private details off-chain. Hyperledger Fabric better for B2B scenarios requiring privacy...

**Q4: What is feasibility for small-scale producers?**
Answer: Current gas costs prohibitive without subsidies. However, IoT integration and QR codes accessible. Future: L2 solutions or permissioned chains more feasible...

### 7.3 Contributions (0.5 page)

- Proof-of-concept demonstrates technical feasibility
- IoT simulation approach validated
- Wallet-free consumer access pattern implemented
- Comparative analysis Ethereum vs traditional systems

### 7.4 Future Work (1.5 pages)

**Short-term (3-6 months):**
- Deploy to mainnet with real products
- Integrate real IoT sensors (ESP32, DHT22)
- Implement Layer 2 solution (Polygon, Optimism)
- Add multi-language support

**Medium-term (6-12 months):**
- Migrate to Hyperledger Fabric for production
- Build producer consortium (OAMK Ruokajälki project)
- Mobile app development (React Native)
- Integration with existing systems (ERP, inventory)

**Long-term (1-2 years):**
- AI-powered quality prediction
- Automated compliance reporting
- Cross-chain interoperability
- Carbon footprint tracking

### 7.5 Final Remarks (0.5 page)

- Closing thoughts
- Significance of work
- Vision for blockchain in food industry

---

## REFERENCES

**Style:** IEEE or APA (check OAMK requirements)
**Target:** 20-30 sources minimum

### Required Source Types:

**Academic Papers (10-15 sources):**
- Springer 2025 systematic review (MUST CITE)
- IEEE papers on Hyperledger Fabric
- Blockchain food traceability research
- IoT + blockchain integration studies
- UX research on Web3 interfaces

**Technical Documentation (5-7 sources):**
- Ethereum documentation
- Solidity documentation
- Hardhat documentation
- Next.js documentation
- OpenZeppelin guides

**Industry Reports (3-5 sources):**
- Walmart + IBM Food Trust case study (MUST CITE)
- Blockchain in agriculture market reports
- Food safety statistics (WHO, FDA)

**Books (2-3 sources):**
- "Mastering Ethereum" by Andreas Antonopoulos
- Blockchain textbooks

**Web Sources (2-3 sources):**
- OAMK Ruokajälki project website
- Ethereum blog posts
- Industry articles (use sparingly)

---

## APPENDICES (Optional)

### Appendix A: Smart Contract Source Code
- Full Solidity code (commented)
- Contract addresses and ABIs

### Appendix B: API Documentation
- Endpoint specifications
- Request/response examples
- Error codes

### Appendix C: User Manual
- How to use the system
- Setup instructions
- Troubleshooting guide

### Appendix D: Test Results (Detailed)
- Full test logs
- Performance benchmarks
- Error reports

### Appendix E: Glossary
- Technical terms defined
- Acronyms explained

---

## 📅 WRITING TIMELINE (Weeks 10-12)

### Week 10 (Jan 3-9, 2026)

**Sam:**
- Chapter 1: Introduction (4-6 pages) - **Mon-Tue**
- Chapter 2.1-2.2: Supply chain + Blockchain (6-7 pages) - **Wed-Fri**

**TaiSheng:**
- Chapter 2.3: Blockchain food systems (3-4 pages) - **Mon-Tue**
- Chapter 3: Methodology (6-8 pages) - **Wed-Fri**

**YiLing:**
- Chapter 2.4-2.5: IoT + Web3 (3-5 pages) - **Mon-Wed**
- Chapter 4.3: Frontend implementation (5-6 pages) - **Thu-Fri**

**Team Meeting:** Friday - Review progress, adjust plan

### Week 11 (Jan 10-16, 2026)

**Sam:**
- Chapter 4.1: Smart contract implementation (6-7 pages) - **Mon-Wed**
- Chapter 6: Discussion (6-8 pages) - **Thu-Fri**

**TaiSheng:**
- Chapter 4.2: Backend implementation (3-4 pages) - **Mon-Tue**
- Chapter 5: Results & Testing (8-12 pages) - **Wed-Fri**

**YiLing:**
- Take screenshots for Chapter 5 - **Mon**
- Chapter 5.3: User acceptance testing (2 pages) - **Tue**
- Format all figures and tables - **Wed-Fri**

**Team:** Draft abstract together - **Friday evening** (2 hours)

### Week 12 (Jan 17-23, 2026)

**All:**
- **Monday:** Chapter 7: Conclusion (collaborative, 3-5 pages)
- **Tuesday:** Compile references, check citations
- **Wednesday:** Format appendices
- **Thursday:** Full thesis review (each reads entire document)
- **Friday:** Final edits, formatting fixes, generate PDF
- **Weekend:** Poster creation

**Submission:** ~January 23, 2026

---

## ✅ WRITING TIPS

### General Guidelines

1. **Consistent Style**
   - Past tense for what was done ("The system was developed...")
   - Present tense for facts ("Ethereum is a blockchain...")
   - Active voice preferred when possible
   - Third person (avoid "I" or "we" unless OAMK allows)

2. **Academic Writing**
   - Clear, concise sentences
   - Technical accuracy (define terms on first use)
   - Evidence-based (cite sources for claims)
   - Logical flow (use transition sentences)

3. **Formatting**
   - Use OAMK template styles (don't change fonts/spacing!)
   - Number all figures and tables
   - Caption every image
   - Cross-reference properly ("As shown in Figure 3...")

4. **Figures & Tables**
   - Every figure must be referenced in text
   - High-resolution images (300 DPI minimum)
   - Consistent styling (use same color scheme)
   - Clear labels and legends

5. **Code Snippets**
   - Use sparingly (only key functions)
   - Add comments explaining logic
   - Use syntax highlighting
   - Keep snippets short (max 20 lines)

6. **Citations**
   - Cite as you write (don't leave for end!)
   - Use reference manager (Zotero, Mendeley)
   - Consistent citation style throughout
   - Verify all URLs work

---

## 🔗 MAPPING BMAD OUTPUTS TO THESIS CHAPTERS

This shows how your development artifacts feed into thesis writing:

| BMAD Document | Thesis Chapter | How to Use |
|---------------|----------------|------------|
| `brief.md` | Chapter 1.1-1.3 | Copy problem statement, objectives |
| `prd.md` | Chapter 3.1, 4.x | Reference features built, timeline |
| `architecture.md` | Chapter 3.4, 4.x | Copy architecture diagrams, tech stack justification |
| `stories/*.md` | Chapter 4.x | Show development approach, tasks completed |
| `planning/session-notes/` | Chapter 3.3, 6.3 | Reference decision rationale (why Ethereum) |
| Code repositories | Chapter 4.x, Appendix A | Source code snippets, full contracts |
| Test results | Chapter 5.1-5.2 | Copy test coverage data, performance metrics |
| Screenshots | Chapter 4.3, 5.3 | User interface documentation |

**Pro Tip:** As you develop (Weeks 3-9), take notes in a `thesis-notes.md` file. When you implement something interesting, write a paragraph explaining it. This makes Week 10-12 writing much easier!

---

## 📝 QUALITY CHECKLIST (Before Submission)

### Content
- [ ] All research questions answered clearly
- [ ] Minimum 60 pages reached
- [ ] 20+ sources cited
- [ ] All figures/tables numbered and captioned
- [ ] Code snippets include explanations
- [ ] Results section includes data/graphs
- [ ] Discussion addresses limitations honestly

### Formatting
- [ ] Used OAMK template (not modified)
- [ ] Table of contents auto-generated
- [ ] Page numbers correct
- [ ] Headers/footers consistent
- [ ] No orphaned headings (heading at bottom of page)
- [ ] Figures aligned properly

### Technical Accuracy
- [ ] All contract addresses correct
- [ ] Technical terms defined on first use
- [ ] No contradictions between chapters
- [ ] Code snippets tested and working
- [ ] URLs verified (all links work)

### Language
- [ ] Spell-checked (UK/US English consistent)
- [ ] Grammar checked (Grammarly or similar)
- [ ] No colloquial language
- [ ] Consistent terminology (don't switch between "smart contract" and "contract")

### Citations
- [ ] Every claim has a source
- [ ] Citations formatted consistently
- [ ] References list alphabetical (if required)
- [ ] No broken citations (all in reference list)

### Final Review
- [ ] Abstract fits on 1 page
- [ ] All team members read full thesis
- [ ] Supervisor feedback incorporated
- [ ] PDF generated successfully
- [ ] File size reasonable (<20 MB)

---

**Document Owner:** Team
**Created:** 2025-10-24
**Last Updated:** 2025-10-24
**Purpose:** Guide thesis writing (Weeks 10-12)

---

_"A good thesis is well-organized, clearly written, technically accurate, and honestly reflective. Start writing early, cite as you go, and ask for feedback often!"_
