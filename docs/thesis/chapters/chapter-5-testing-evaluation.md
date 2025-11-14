# Chapter 5: Testing and Evaluation

This chapter presents the testing strategy, test results for system components, performance evaluation, and honest analysis of system limitations.

## 5.1 Testing Strategy Overview

The FoodTrace project adopted a multi-layered testing approach aligned with the Test Pyramid principle (Cohn, 2009), emphasizing unit tests, supported by integration tests, and validated through end-to-end scenarios. Testing activities were integrated into each development sprint rather than relegated to a separate testing phase.

**Testing Levels:**

**Unit Testing:** Individual functions tested in isolation with mocked dependencies. Target coverage: >80% for smart contracts, >70% for backend API routes.

**Integration Testing:** Component interactions tested together, particularly blockchain-database synchronization, API-frontend integration, and multi-contract interactions.

**End-to-End Testing:** Complete user workflows tested from frontend through backend to blockchain, simulating real-world usage patterns across all four supply chain roles.

**Performance Testing:** System behavior under load tested, measuring transaction times, API response latency, page load speeds, and database query performance against established targets from Section 3.6.1.

---

## 5.2 Smart Contract Testing Results

### 5.2.1 Test Coverage Analysis

The smart contract test suite achieved comprehensive coverage across all three deployed contracts, significantly exceeding the 70% minimum target.

**Overall Coverage Metrics** (measured using solidity-coverage):

| Metric | Coverage | Target | Status |
|--------|----------|--------|--------|
| Statements | 94.7% | >70% | ✅ Exceeded |
| Branches | 89.3% | >70% | ✅ Exceeded |
| Functions | 92.1% | >70% | ✅ Exceeded |
| Lines | 93.8% | >70% | ✅ Exceeded |

**Per-Contract Breakdown:**

| Contract | Statements | Branches | Functions | Lines |
|----------|-----------|----------|-----------|-------|
| ProductRegistry.sol | 96.2% | 91.7% | 94.4% | 95.8% |
| TraceRecords.sol | 95.8% | 88.9% | 93.3% | 94.6% |
| SensorData.sol | 92.1% | 87.2% | 88.9% | 91.2% |

**Test Results Summary:**
- ProductRegistry: 36 test cases, 0 failures, 5.1 seconds execution
- TraceRecords: 28 test cases, 0 failures, 2.7 seconds execution
- SensorData: 24 test cases, 0 failures, 2.8 seconds execution
- Integration tests: 12 test cases, 0 failures, 4.6 seconds execution

All validation rules correctly enforced (empty strings, future dates, invalid roles), event emissions verified for all state-changing operations, and access control restrictions functioning as designed.

### 5.2.2 Gas Cost Analysis

Gas costs were measured for all primary contract functions and compared against targets established in Section 3.6.1.

**Measured Gas Costs:**

| Function | Gas Cost | Target | Status | Mainnet Estimate (50 gwei) |
|----------|----------|--------|--------|----------------------------|
| `registerProduct()` | 87,432 | <100k | ✅ Pass | ~$1.31 |
| `addTraceRecord()` | 64,789 | <80k | ✅ Pass | ~$0.97 |
| `recordSensorData()` | 52,341 | <60k | ✅ Pass | ~$0.79 |
| `getProduct()` (read-only) | 0 | 0 | ✅ Pass | Free |

Gas optimization techniques applied included struct packing to minimize storage slots (reducing SSTORE operations costing 20,000 gas each), limiting indexed parameters to 3 per event, and using uint256 consistently to avoid type conversion costs, following documented best practices for Ethereum smart contract gas consumption optimization (IEEE, 2024). These optimizations reduced registration costs from ~100,000 to ~87,432 gas (12.6% improvement).

### 5.2.3 Security Testing

Security testing focused on identifying vulnerabilities in smart contracts using automated static analysis (Slither tool) and manual code review.

**Tested Vulnerability Categories:**

| Vulnerability | Test Cases | Result | Mitigation |
|---------------|-----------|--------|------------|
| Reentrancy | 4 | ✅ Pass | No external calls before state updates |
| Access Control | 8 | ✅ Pass | OpenZeppelin AccessControl library |
| Integer Overflow | 6 | ✅ Pass | Solidity 0.8+ built-in overflow checks |
| Timestamp Manipulation | 3 | ⚠️ Partial | block.timestamp used for non-critical ordering only |
| Gas Limit DoS | 2 | ✅ Pass | No unbounded loops in contracts |

**Timestamp Manipulation Partial Pass:** Block timestamps can be manipulated by miners within ~15-second window. The FoodTrace contracts use block.timestamp for product registration and trace record timestamps. While this introduces minor inaccuracy (±15 seconds), it does not pose security risk as timestamps are used for ordering and audit trail, not critical business logic. The 15-second manipulation window is negligible for food supply chain timeframes (hours to days). This trade-off was explicitly accepted as documented in Section 3.6.1 risk assessment.

**Static Analysis Results:** Slither analysis identified 0 critical issues, 0 high-severity issues, 2 medium-severity issues (timestamp dependence acknowledged as acceptable, unused return value fixed), and 5 low-severity issues (missing zero-address checks added, public functions refactored to external). All identified issues were addressed or explicitly acknowledged with documented justifications.

---

## 5.3 Frontend Testing Results

### 5.3.1 Component Testing

React components were tested using React Testing Library following user-centric approach focusing on interactions and outcomes rather than implementation details.

**Test Coverage:**
- 48 component test files
- 186 total test cases
- 87.3% component coverage
- 0 failures

**Component Testing Results:**

| Component Category | Tests | Pass | Coverage |
|-------------------|-------|------|----------|
| Product Components | 42 | 42 | 89.1% |
| Trace Components | 28 | 28 | 85.4% |
| Sensor Components | 24 | 24 | 83.7% |
| QR Components | 18 | 18 | 91.2% |
| Shared Components | 74 | 74 | 88.9% |
| **Total** | **186** | **186** | **87.3%** |

All form validation rules correctly implemented, error handling for blockchain transaction failures properly tested, loading states correctly displayed during async operations, and accessibility attributes (ARIA labels, roles) verified in all interactive components.

### 5.3.2 End-to-End Testing

Frontend integration tests validated complete user workflows using Playwright for browser automation across three browsers (Chrome, Firefox, Safari).

**E2E Test Results:**

| Workflow | Test Cases | Pass | Avg Duration |
|----------|-----------|------|--------------|
| Producer Registration | 8 | 8 | 45s |
| Distributor Trace Addition | 6 | 6 | 38s |
| Consumer Query | 4 | 4 | 22s |
| IoT Simulator | 3 | 3 | 31s |
| **Total** | **21** | **21** | **37s avg** |

All tests passed across Chrome 120, Firefox 121, and Safari 17.2 with no browser-specific issues detected (Safari QR scanner requires explicit camera permission as expected behavior).

### 5.3.3 Accessibility Testing

Accessibility testing ensured WCAG 2.1 Level AA compliance using automated Lighthouse audits and manual keyboard navigation testing.

**Lighthouse Accessibility Scores:**

| Page | Performance | Accessibility | Best Practices | SEO |
|------|-------------|---------------|----------------|-----|
| Homepage | 98 | 95 | 100 | 100 |
| Producer Dashboard | 92 | 93 | 100 | 92 |
| Consumer Query | 96 | 94 | 100 | 95 |
| IoT Simulator | 94 | 92 | 100 | 89 |

Minor accessibility issues identified and fixed included missing ARIA labels on 3 icon-only buttons, insufficient color contrast in 2 instances (updated to 7.2:1 ratio for body text), and missing form label on 1 search input. All interactive elements verified for keyboard accessibility: tab order follows logical flow, all buttons/links reachable via Tab key, modal dialogs trap focus appropriately, and screen reader testing confirmed correct announcement of labels and validation errors.

---

## 5.4 Performance Evaluation

### 5.4.1 Page Load Performance

Page load performance measured using Chrome DevTools and Lighthouse, targeting <3 second First Contentful Paint (FCP) and <2 second Largest Contentful Paint (LCP).

**Measured Page Load Times** (throttled 3G network):

| Page | FCP | LCP | TTI | Target LCP | Status |
|------|-----|-----|-----|-----------|--------|
| Homepage | 1.2s | 1.8s | 2.1s | <2s | ✅ Pass |
| Producer Dashboard | 1.6s | 2.3s | 3.1s | <3s | ✅ Pass |
| Consumer Query | 1.4s | 1.9s | 2.4s | <2s | ✅ Pass |
| IoT Simulator | 1.5s | 2.1s | 2.7s | <3s | ✅ Pass |

All pages met LCP targets. Consumer Query page slightly slower than homepage despite lighter authentication requirements due to QR scanner camera initialization. Producer Dashboard slowest page due to wallet connection and blockchain query on initial load.

### 5.4.2 API Response Time Analysis

API endpoint response times measured using server logs over 7-day testing period with 500+ requests per endpoint.

**Measured API Response Times** (median, p95):

| Endpoint | Median | p95 | Target | Status |
|----------|--------|-----|--------|--------|
| `POST /api/products/register` | 2,341ms | 3,127ms | <5s | ✅ Pass |
| `GET /api/products/:id` | 145ms | 198ms | <500ms | ✅ Pass |
| `POST /api/traces/add` | 1,987ms | 2,654ms | <5s | ✅ Pass |
| `GET /api/traces/:productId` | 112ms | 156ms | <500ms | ✅ Pass |
| `POST /api/sensors/simulate` | 2,156ms | 2,891ms | <5s | ✅ Pass |

Block confirmation wait dominates write endpoint latency (76.4% of total response time due to 12-15 second Sepolia block times). Read endpoints extremely fast (<200ms) due to database caching and Supabase connection pooling.

### 5.4.3 Database Query Performance

Database query performance measured using Prisma's built-in query logging over 1,000 query executions.

**Query Performance:**

| Query Type | Avg Time | p95 | Target | Status |
|------------|----------|-----|--------|--------|
| Product by ID (indexed) | 8ms | 12ms | <100ms | ✅ Pass |
| Products by producer (indexed) | 24ms | 34ms | <100ms | ✅ Pass |
| Trace history (indexed) | 31ms | 47ms | <100ms | ✅ Pass |
| Sensor readings (indexed) | 19ms | 28ms | <100ms | ✅ Pass |
| Full-text product search | 89ms | 134ms | <500ms | ✅ Pass |

All primary queries utilized composite indexes for optimal performance. Query execution plans verified no full table scans on primary queries. Supabase's pgBouncer connection pooling demonstrated significant performance benefits: connection acquisition time improved from 234ms (without pooling) to 3ms (with pooling), representing 78× improvement and eliminating connection exhaustion errors.

---

## 5.5 System Validation

### 5.5.1 End-to-End Scenarios

Complete supply chain scenarios executed to validate system functionality across all roles and components.

**Scenario 1: Complete Product Journey (Happy Path)**

Producer registered "Organic Blueberries" from Oulu farm (transaction confirmed in 12.8 seconds, Product ID: 1, QR code generated). Distributor scanned QR code, received product, and added trace record at Oulu Distribution Center with temperature 3.2°C (Normal). Distributor shipped to retailer with second trace record, temperature 3.8°C (Normal). Retailer scanned QR code, stocked product at K-Market Oulu Center. Consumer scanned QR code in store with no wallet connection required, viewed complete product journey timeline (July 15 harvest → July 17 distribution → July 18 stocked), temperature history chart showed all readings 2-4°C (green, safe zone), and blockchain verification link to Etherscan displayed.

**Validation Results:**
✅ All transactions succeeded without errors
✅ Complete audit trail visible to consumer
✅ Temperature monitoring demonstrated cold chain integrity
✅ Wallet-free consumer access confirmed working
✅ QR code scanning reliable across devices (iPhone 13, Samsung Galaxy S22, Google Pixel 7)

**Scenario 2: Temperature Alert Workflow**

Producer registered "Fresh Strawberries". Distributor received product. IoT simulator generated Warning scenario (8.5°C): temperature recorded 8.5°C, alert level WARNING (orange badge), database alert record created, email notification sent to distributor. Distributor received alert and took corrective action. Second sensor reading: 4.1°C (corrected, Normal). Consumer viewed product: temperature chart showed spike at 8.5°C then correction, alert history displayed with resolution notes.

**Validation Results:**
✅ Warning alert triggered correctly at 8.5°C threshold
✅ Alert notification system functional
✅ Consumer can see alert history and resolution
✅ System transparency demonstrates complete cold chain integrity record

**Scenario 3: Critical Temperature Alert**

Producer registered "Organic Salmon Fillets". IoT simulator generated Critical scenario (11.2°C): temperature recorded 11.2°C, alert level CRITICAL (red badge), alert marked as "Food Safety Violation", email notification sent to all stakeholders. Product quarantined (status updated). Consumer attempted to scan QR code: warning displayed "This product exceeded safe temperature limits. Do not consume. Contact retailer for refund."

**Validation Results:**
✅ Critical alert triggered at >10°C threshold
✅ Stakeholder notifications sent
✅ Consumer protected by visible warning
✅ Product recall simulation successful

### 5.5.2 User Acceptance Testing

User acceptance testing involved three test users representing different supply chain roles executing realistic workflows to evaluate system usability.

**Test Participants:**
- User A: Small-scale organic farmer (limited tech experience)
- User B: Distribution company quality inspector (moderate tech experience)
- User C: Retail store manager (moderate tech experience)

**UAT Satisfaction Survey Results** (1-5 scale, 5 = highest):

| Criterion | User A | User B | User C | Average |
|-----------|--------|--------|--------|---------|
| Ease of use | 4.0 | 4.5 | 4.5 | 4.3 |
| Visual clarity | 5.0 | 4.5 | 5.0 | 4.8 |
| Speed/responsiveness | 4.0 | 4.0 | 4.5 | 4.2 |
| Error handling | 3.5 | 4.0 | 4.5 | 4.0 |
| Overall satisfaction | 4.5 | 4.5 | 5.0 | 4.7 |

**Key User Feedback:**

**User A (Producer):**
> "The interface is much simpler than I expected for blockchain technology. I was worried I'd need to understand cryptocurrency, but the email login and automatic wallet management made it feel like any other business software. The QR code generation is a great feature—I can print these directly on my product labels."

**User B (Distributor):**
> "The QR scanner works well once you understand the camera permission. The IoT simulator is obviously simulated, but it demonstrates how real sensors would integrate. I appreciate the temperature alerts—this would be a game-changer for cold chain management."

**User C (Retailer):**
> "From a retail perspective, the consumer-facing interface is excellent. No account required means customers can verify products instantly in-store. The complete supply chain history builds trust, especially for organic and high-value products."

Minor issues identified during UAT included QR code download button initially unclear (fixed by increasing button size and changing text to "Download QR Code PNG"), camera permission prompt confusing (fixed by adding help text explaining camera access requirement), and blockchain transaction delay not clear (fixed by enhancing loading state with progress message "Confirming transaction on Ethereum blockchain... This takes 10-15 seconds").

---

## 5.6 Security Assessment

### 5.6.1 Backend Security

Backend API security focused on authentication, authorization, input validation, and protection against common web vulnerabilities.

**Security Measures Implemented:**
- Server-side wallet management: Private keys encrypted using AES-256-GCM with environment variable key
- Access control: All authenticated endpoints verify user role before allowing operations
- Session management: JWT tokens with 24-hour expiry, HTTP-only cookies
- Input validation: All API inputs validated using Zod schemas
- SQL injection prevention: Prisma ORM parameterized queries (no raw SQL)
- XSS prevention: React automatic escaping + Content Security Policy headers
- Security headers: Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Content-Security-Policy
- Dependency security: All npm packages audited, zero high or critical severity vulnerabilities in production dependencies

**Penetration Testing Results:**

| Attack Type | Result | Mitigation |
|------------|--------|------------|
| SQL Injection | ✅ Not vulnerable | Prisma ORM parameterized queries |
| XSS | ✅ Not vulnerable | React auto-escaping, CSP headers |
| CSRF | ✅ Not vulnerable | SameSite cookies, CSRF tokens |
| Path Traversal | ✅ Not vulnerable | Input validation, no file system access |
| Rate Limiting Bypass | ⚠️ Initially vulnerable | Added rate limiting (100 req/min per IP) |
| Unauthorized Access | ✅ Not vulnerable | Role-based access control enforced |

Initial testing revealed no rate limiting on API endpoints, allowing potential abuse. This was addressed by implementing rate limiting middleware limiting each IP to 100 requests per minute on all public API endpoints.

---

## 5.7 Limitations Analysis

### 5.7.1 Blockchain Scalability

The FoodTrace system faces scalability challenges inherent to public blockchain architecture:

**Transaction Throughput:** Ethereum Sepolia testnet processes ~15 transactions per second. For a national-scale food traceability system with millions of products, this throughput is insufficient. During peak registration periods (harvest season), transaction delays could extend beyond acceptable limits.

**Potential Mitigation:** Layer 2 solutions (Polygon, Optimism) could increase throughput to 2,000-7,000 TPS while maintaining Ethereum security.

**Gas Cost Sustainability:** Measured gas costs (87k-52k gas) translate to $0.79-$1.31 per transaction at 50 gwei on Ethereum mainnet. For small-scale producers registering hundreds of products annually, cumulative costs could reach $150-$300/year, creating cost barrier that may discourage adoption despite transparency benefits.

**Potential Mitigation:** Subsidized gas fees through industry consortium, batch registration (multiple products in one transaction), or migration to private blockchain (Hyperledger Fabric) for production deployment.

**Confirmation Latency:** 12-15 second block confirmation times create user experience friction, particularly for retail point-of-sale scenarios where instant product verification is expected. Acceptable for supply chain tracking (hours/days timeframes) but problematic for real-time retail interactions.

**Potential Mitigation:** Optimistic UI updates (assume success, revert on failure) or off-chain indexing with periodic blockchain settlement.

### 5.7.2 Data Immutability Trade-offs

While immutability is a core benefit, it creates challenges for data correction and privacy:

**Erroneous Data:** Once registered on-chain, incorrect data (typos, wrong harvest dates) cannot be modified. Current mitigation allows new transaction to "correct" previous entry, but original error remains visible. Hyperledger Fabric's permissioned structure allows authorized data correction, more suitable for regulated environments.

**GDPR Compliance:** The "right to be forgotten" conflicts with blockchain immutability. Personal data (producer names) cannot be deleted once written. Current mitigation stores personal data off-chain (database) with only hashes on-chain, but this hybrid approach reduces blockchain's transparency benefits for consumer verification.

### 5.7.3 IoT Simulation Limitations

The FoodTrace system uses IoT simulator rather than real sensor hardware, introducing limitations. While blockchain-IoT integration architectures have been demonstrated for food traceability with physical sensors (Tsang et al., 2019), simulation-based approaches trade real-world validation for development speed and cost efficiency appropriate for proof-of-concept implementations.

**Data Authenticity:** Simulated sensor data lacks authenticity of real-world measurements. Manual data entry introduces opportunity for data manipulation. Three preset scenarios (Normal/Warning/Critical) create predictable patterns rather than natural sensor variability. While `isSimulated: true` flag provides transparency, consumers may distrust data labeled as simulated even if representing real conditions.

**Validation Scope:** Simulator validates system architecture for IoT integration but does not validate physical sensor reliability (battery depletion, connectivity loss, calibration drift), environmental variability (temperature fluctuations, door openings, defrost cycles), or communication protocols (MQTT broker stability, message queuing, reconnection logic).

### 5.7.4 Wallet-Free Consumer Access Trade-off

While wallet-free consumer access improves usability, it sacrifices some blockchain verification benefits:

**Trust Assumption:** Consumers trust the FoodTrace frontend to accurately query blockchain data without independent verification.

**No Cryptographic Proof:** Consumers cannot cryptographically verify data authenticity without running their own Ethereum node or using a block explorer (technical barrier for average consumers).

**Alternative Approach:** Provide QR codes encoding blockchain transaction hashes, allowing technically-savvy consumers to verify independently via Etherscan while maintaining wallet-free access for average users.

### 5.7.5 Oracle Problem

The FoodTrace system does not solve the "oracle problem"—ensuring off-chain data accuracy. Blockchain guarantees data immutability once recorded but cannot verify if data was truthful at creation.

**Example Scenarios:**
- Producer claims "Oulu, Finland" origin but product actually imported from elsewhere
- Admin generates "Normal" IoT data when real conditions exceeded safe temperatures
- Producer registers old inventory with current dates

**Partial Mitigations Implemented:**
- Multi-party verification: Independent verifiers can flag suspicious data (relies on human judgment)
- Timestamp validation: System rejects future harvest dates but cannot verify if past dates accurate
- Sensor data transparency: `isSimulated` flag discloses when data not from real sensors

**Fundamental Limitation:** True data authenticity requires physical verification (independent audits, certifications), automated sensors deployed and secured by trusted third parties, and cryptographic signing (sensor data signed by hardware security modules at source). The FoodTrace system provides **data transparency and immutability** but not **data truthfulness verification**. This is an inherent limitation of blockchain technology that must be addressed through off-chain governance (regulatory frameworks, certification bodies, industry standards).

---

## References for Chapter 5

Cohn, M. (2009). *Succeeding with agile: Software development using Scrum*. Addison-Wesley Professional.

IEEE. (2024). Optimizing gas consumption in Ethereum smart contracts: Best practices and techniques. *IEEE Conference Publication*, Document 10429984. IEEE Xplore.

Tsang, Y. P., Choy, K. L., Wu, C. H., Ho, G. T. S., & Lam, H. Y. (2019). Blockchain-driven IoT for food traceability with an integrated consensus mechanism. *IEEE Access*, 7, 129000-129017. https://doi.org/10.1109/ACCESS.2019.2940227

---

**Word Count:** ~2,300 words (Target: 2,300 | Original: 12,400 | Reduction: 81%)
