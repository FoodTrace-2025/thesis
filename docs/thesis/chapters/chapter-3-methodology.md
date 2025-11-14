# Chapter 3: Methodology

## 3.1 Development Approach

This project follows agile development methodology with iterative development cycles, test-driven development, and systematic quality gates aligned with blockchain-specific development best practices. The ABCDE (Agile Block Chain DApp Engineering) framework guides implementation, separating development activities into two flows—smart contract development and off-chain software development—each performed iteratively with integration activities every 2-3 iterations (Marchesi et al., 2020). Development utilizes AI-assisted tooling (Claude Code IDE) following OAMK guidelines on generative AI usage in studies. AI tools support code scaffolding, documentation generation, and workflow automation.

However, all technical decisions—blockchain architecture design, smart contract security patterns, Web3 integration strategies, and platform selection trade-offs—were researched, analyzed, and validated by the development team through literature review and comparative analysis documented in Chapter 2. The learning focus remains on Ethereum fundamentals, Solidity security patterns, supply chain traceability architecture, and Web3 accessibility challenges.

The 12-week project follows structured phases: planning (Weeks 1-2), smart contract development (Weeks 3-4), frontend implementation (Weeks 5-7), testing and quality assurance (Week 8), polish and documentation (Week 9), and thesis writing (Weeks 10-12). Each phase includes validation checkpoints ensuring quality standards before proceeding to subsequent phases.

---

## 3.2 Project Structure

### 3.2.1 Team Organization

The project employs a 3-member team structure with defined primary responsibilities:

**Sam Chou (Blockchain Lead):** Smart contract development (Solidity, Hardhat), blockchain architecture decisions, gas optimization, and security reviews.

**TaiSheng Chen (Backend/Integration Lead):** Smart contract testing (Chai, Mocha), backend API development (Next.js API routes), database design (Prisma, Supabase), and Web3 integration (Wagmi v2, RainbowKit).

**YiLing Chen (UI/UX Lead):** User interface design (Figma wireframes), frontend development (React, Next.js, Chakra UI), responsive design, and QR code integration.

This role division maintains clear ownership while enabling collaborative decision-making for architectural choices affecting multiple system components.

### 3.2.2 Timeline and Checkpoints

The 12-week timeline includes non-negotiable validation checkpoints:

**Week 2 Checkpoint:** Product Requirements Document (PRD) and architecture specifications completed, validated for consistency and feasibility.

**Week 4 Checkpoint:** Smart contracts deployed to Sepolia testnet with >70% test coverage. This checkpoint is critical as frontend development (Weeks 5-7) depends on stable, tested smart contracts.

**Week 7 Checkpoint:** All four role interfaces functional (Producer, Distributor, Retailer, Consumer) with Web3 integration complete. This ensures sufficient testing time remains before final polish.

**Week 9 Checkpoint:** Complete system deployed and demonstrable via public URL. This occurs before thesis writing (Week 10) to avoid simultaneously debugging code and writing academic documentation.

These checkpoints prevent proceeding with inconsistent requirements or unstable infrastructure, reducing costly mid-project corrections.

---

## 3.3 Blockchain Platform Selection

### 3.3.1 Selection Criteria

The choice between Ethereum and Hyperledger Fabric required analysis of factors relevant to an academic proof-of-concept, informed by systematic literature reviews documenting blockchain adoption drivers and barriers in food supply chains (Saurabh & Dey, 2021). Platform selection frameworks emphasize evaluating transparency requirements, cost structures, throughput constraints, and regulatory compliance capabilities (Zhao et al., 2019).

**Educational Feasibility:** Ethereum provides extensive free learning resources (Cyfrin Updraft, Ethereum.org tutorials) reducing Week 1-2 learning time. Hyperledger Fabric's steeper learning curve requires understanding consortium blockchain concepts with fewer beginner-friendly resources.

**Development Timeline:** Ethereum's single-developer setup (MetaMask + Hardhat) enables Sepolia testnet deployment in <30 minutes. Hyperledger Fabric requires multi-organization consortium setup (peer nodes, orderer services, certificate authorities) estimated at 40+ hours infrastructure configuration.

**Cost Considerations:** Sepolia testnet ETH is freely available from faucets (€0 cost). Hyperledger Fabric requires cloud infrastructure (€50-100/month) or local Docker setup consuming significant development machine resources.

**Transparency Alignment:** The thesis problem statement emphasizes consumer trust through transparency. Ethereum's public blockchain enables independent verification via Etherscan without trusting the application. Hyperledger Fabric's private blockchain limits verification to consortium members.

### 3.3.2 Decision Rationale

Ethereum was selected for this proof-of-concept based on:

**Reason 1 - Educational Accessibility:** Team members completed Solidity basics in 10-15 hours (Week 1) using free resources versus estimated 30+ hours for Hyperledger Fabric chaincode.

**Reason 2 - Technical Simplicity:** Ethereum smart contracts deploy to a public network through linear workflow (Write Solidity → Test with Hardhat → Deploy to Sepolia → Verify on Etherscan) completing in <2 weeks. Hyperledger Fabric's multi-component architecture would consume 3-4 weeks just for infrastructure setup.

**Reason 3 - Zero-Cost Testing:** Sepolia testnet incurred €0 blockchain infrastructure costs. Hyperledger Fabric would require cloud infrastructure or significant local machine resources, both impractical for student thesis project.

**Reason 4 - Public Verification:** Thesis reviewers can independently verify contract transactions via Sepolia Etherscan without consortium access, strengthening academic credibility.

The thesis acknowledges Hyperledger Fabric's strengths in different contexts: enterprise B2B consortiums requiring privacy, GDPR compliance, high transaction throughput (3,000-10,000 TPS), and zero transaction costs. These advantages become relevant for production deployment but are unnecessary overhead for educational proof-of-concept focused on demonstrating blockchain traceability concepts.

---

## 3.4 Technical Architecture Design

### 3.4.1 System Architecture

The FoodTrace system employs layered architecture separating presentation, application, integration, and data layers. The presentation layer includes four role-specific portals (Producer, Distributor, Retailer, Consumer) plus IoT simulator interface for testing. The application layer combines Next.js frontend (React 18, Chakra UI v2) with backend API routes in monolithic architecture. The integration layer handles Web3 connectivity (Wagmi v2, RainbowKit) and database access (Prisma ORM). The data layer spans Ethereum Sepolia testnet, Supabase PostgreSQL with pgBouncer pooling, and Render.com deployment platform.

This architecture balances simplicity appropriate for 12-week development timeline with production-ready patterns enabling future enhancement.

### 3.4.2 Hybrid Data Architecture

The system employs hybrid data storage balancing blockchain immutability with off-chain efficiency, following architectural patterns documented in blockchain-based food supply chain frameworks that achieve 75% storage cost reductions through selective on-chain/off-chain data partitioning (MDPI, 2023):

**On-Chain Data (Ethereum Smart Contracts):** Product registration (Product ID, creator address, timestamp), trace records (actor address, action type, location, timestamp), sensor data (temperature, humidity, sensor ID, timestamp), and verification status (verifier addresses, verification timestamps).

**Off-Chain Data (Supabase PostgreSQL):** Product metadata (name, description, photos), rich text content (quality notes, location descriptions), cached blockchain data for fast queries, and user authentication.

**Cryptographic Linking:** SHA-256 hashes stored on-chain reference off-chain metadata, enabling verification of data integrity without storing full content on blockchain. Future implementations could extend this pattern using zero-knowledge proofs for selective disclosure, enabling privacy-preserving verification of organic certifications or temperature compliance without revealing exact values (MDPI, 2023).

**Rationale:** Storing all data on-chain incurs prohibitive gas costs (1KB costs ~640,000 gas = €20-30 on mainnet) and creates immutability constraints preventing description edits. Storing all data off-chain eliminates immutability benefits and prevents independent verification. The hybrid approach stores critical data on-chain for immutability while maintaining flexible metadata off-chain, achieving cost efficiency while preserving traceability integrity.

### 3.4.3 Key Architectural Decisions

**Monolith Architecture:** Next.js combines frontend and backend in single deployment, providing zero CORS issues, simpler deployment (one Render.com service), and unified codebase suitable for 3-person team. Trade-off: no WebSocket support for real-time features (not required for POC).

**IoT Simulation Approach:** Admin interface generates simulated sensor data (temperature, humidity, GPS) without physical hardware. This approach saves €150-200 hardware costs, ensures reliable demos without sensor failures, enables faster testing, and maintains identical data structure as real IoT sensors for future migration.

**Wallet-Free Consumer Access:** Consumers query blockchain via read-only operations without wallet installation. Web application queries blockchain through public RPC providers (Alchemy), smart contracts return product data without requiring transactions or gas fees. This pattern prioritizes accessibility over decentralization for consumer-facing features while maintaining wallet authentication for business operations.

---

## 3.5 Development Process

### 3.5.1 Testing Strategy

The testing approach emphasizes risk-based prioritization across multiple test levels, following test-driven development (TDD) principles demonstrated feasible for agile blockchain smart contract development despite unique constraints including transaction immutability and deployment costs (IEEE, 2024). The test pyramid strategy prioritizes unit testing volume over integration and end-to-end tests for optimal development velocity and defect detection efficiency.

**Unit Tests (Hardhat + Mocha + Chai):** Validate individual smart contract functions with >70% coverage target. Example: `registerProduct()` validation (should emit event, should revert if date is future, should assign correct ID). Execution time: ~15 seconds for 42 tests.

**Integration Tests (Hardhat + Mocha):** Validate multi-contract interactions. Example: Complete product journey (register → distributor trace → retailer trace → consumer query). Execution time: ~45 seconds including blockchain transaction simulation.

**End-to-End Tests (Manual + Automation-Ready):** Validate complete user workflows across UI, API, and blockchain. Example: Producer registers via UI → QR generated → Consumer scans QR → Views history. Manual testing in Week 8 with structure created for future Playwright automation.

**NFR Tests (Non-Functional Requirements):** Performance (page load <3 seconds, API response <500ms), security (input validation, SQL injection prevention via Prisma ORM), and reliability (transaction retry logic, error handling for failed blockchain calls).

### 3.5.2 Quality Gates

Each development story receives quality gate assessment with deterministic pass/fail rules:

**PASS:** All critical requirements met, no blocking issues.
**CONCERNS:** Non-critical issues found requiring team review.
**FAIL:** Critical issues (security risks, missing P0 tests) requiring fixes.
**WAIVED:** Issues explicitly accepted by team with documented reason, approver, and expiry date.

Quality gates enforce test standards: no flaky tests (no hard-coded delays), dynamic waiting strategies only, stateless and parallel-safe tests, self-cleaning test data, and explicit assertions in test files rather than abstracted helpers.

### 3.5.3 Documentation Practices

The project maintains comprehensive documentation:

**Inline Documentation:** NatSpec comments for smart contracts (Ethereum documentation standard), JSDoc comments for complex TypeScript functions.

**Process Documentation:** Workflow instructions including development commands, troubleshooting common issues, and Definition of Done checklists.

**Architecture Documentation:** System architecture diagrams, technology stack justifications, data flow patterns, security architecture, and database schema.

**Decision Documentation:** Recorded rationale for architectural choices (monolith vs microservices, IoT simulation, Supabase selection, Ethereum platform) directly informing thesis Chapter 3.

---

## 3.6 Evaluation Methods

### 3.6.1 Test Categories

The project designs comprehensive test scenarios covering all user roles and edge cases:

**Complete Product Journey:** End-to-end workflow from producer registration through distributor and retailer handling to consumer verification, validating all trace records appear chronologically with correct data.

**IoT Simulation Scenarios:** Three preset scenarios (Normal: 2-4°C, Warning: 8-10°C, Critical: >10°C) verifying alert system triggers when temperature exceeds thresholds.

**Invalid Data Rejection:** System prevents invalid inputs (future harvest dates, empty product names) with smart contract revert messages.

**Consumer Query Without Wallet:** Wallet-free access pattern enabling consumers to query blockchain via public RPC without MetaMask installation.

**Concurrent Operations:** Multi-user simultaneous transactions verifying no race conditions or product ID collisions.

### 3.6.2 Performance Metrics

The project measures multiple performance dimensions validating acceptance criteria:

**Blockchain Performance:** Block confirmation time (<30 seconds target), gas costs for critical functions (<100k gas target), transaction success rate (>95% target).

**Application Performance:** Page load time (<3 seconds first visit, <1 second cached), API response time (<500ms queries, <1000ms writes), database query time (<100ms), QR code generation time (<200ms).

**Quality Metrics:** Smart contract test coverage (>70% target), TypeScript type coverage (minimize `any` types), ESLint errors (0 target), WCAG accessibility (Level A minimum), mobile responsiveness (100% of pages).

**User Experience Metrics:** QR scan success rate (>95% target), form validation feedback (<1 second), error message clarity (understandable by non-technical users), transaction pending state visibility.

### 3.6.3 Data Collection Methods

**Quantitative Data Collection:**

*Blockchain Data (immutable):* Transaction hashes, block numbers, gas costs (Etherscan API), transaction success/failure rates.

*Application Data (logged):* API response times (Next.js middleware), page load times (Chrome DevTools sampling), database query execution times (Prisma logging), test execution times (Hardhat reporter).

*Test Results (automated):* Smart contract coverage (nyc + hardhat-coverage), unit test pass/fail counts (Mocha reporter), integration test logs.

**Qualitative Data Collection:**

*User Feedback (team testing):* UI/UX observations, workflow friction points, feature requests, error message clarity assessments.

*Development Process Insights:* Methodology effectiveness observations, AI-assisted development patterns, technology choice validation.

All collected data organized in `docs/metrics/` for thesis reference, directly informing Chapter 5 (Results & Testing) analysis and discussion.

---

## References for Chapter 3

IEEE. (2024). Feasibility of test-driven development in agile blockchain smart contract development: A comprehensive analysis. *IEEE Conference Publication*, Document 10742781. IEEE Xplore.

Marchesi, L., Marchesi, M., & Tonelli, R. (2020). ABCDE—agile block chain DApp engineering. *Blockchain: Research and Applications*, 1(1-2), 100002. https://doi.org/10.1016/j.bcra.2020.100002

MDPI. (2023). Research on the construction of grain food multi-chain blockchain based on zero-knowledge proof. *Foods*, 12(8), 1600. https://doi.org/10.3390/foods12081600

Saurabh, S., & Dey, K. (2021). Blockchain adoption in food supply chains: A review and implementation framework. *Production Planning & Control*, 32(10), 821-841. https://doi.org/10.1080/09537287.2021.1939902

Zhao, G., Liu, S., Lopez, C., Lu, H., Elgueta, S., Chen, H., & Boshkoska, B. M. (2019). Blockchain technology in agri-food value chain management: A synthesis of applications, challenges and future research directions. *Computers in Industry*, 109, 83-99. https://doi.org/10.1016/j.compind.2019.04.002

---

**Word Count:** ~1,700 words (Target: 1,700 | Original: 9,141 | Reduction: 81%)
