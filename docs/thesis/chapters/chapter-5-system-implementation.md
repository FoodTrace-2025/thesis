# Chapter 5: System Implementation

**Target Length:** 2,200-2,700 words (~5-6 pages)
**Owners:** TaiSheng (Backend), YiLing (Frontend + IoT Simulator)
**Purpose:** Detail the supporting system components connecting users to smart contracts - backend API, Web3 integration, frontend interfaces, and IoT simulation

**Note:** This chapter will reference:

- Section 2.4.1 (Custodial Wallet Patterns - to be written) → Backend correspondence
- Section 2.4.2 (Wallet-Free Consumer Access) → Frontend correspondence
- Section 2.4.3 (IoT-Blockchain Integration - to be written) → IoT Simulator correspondence

---

## 5.1 Backend Development

**Owner:** TaiSheng Chen

The backend architecture uses Next.js 14 API routes (Next.js, 2024) for serverless functions combined with Supabase PostgreSQL for off-chain data storage and Wagmi v2 (Wagmi, 2024) for blockchain interaction following modern Web3 development patterns.

**Note:** This section corresponds to Section 2.4.1 (Custodial Wallet Patterns) in Literature Review, which reviews custodial wallet patterns, Wagmi/Viem libraries, and API design best practices.

### 5.1.1 Database Schema (Prisma + Supabase)

The PostgreSQL database schema follows normalized relational database principles while accommodating blockchain data patterns. Primary tables include Product (stores off-chain metadata linked to on-chain product IDs), TraceRecord (caches blockchain trace events for fast queries), SensorReading (stores IoT simulator data), and User/Company (authentication and multi-tenancy). Each table includes blockchain-specific fields: transactionHash (links to Ethereum transaction), blockNumber (for event ordering), and onChainId (maps to smart contract product ID).

Foreign key relationships enforce referential integrity between Product, TraceRecord, SensorReading, User, and Company tables. Prisma ORM (Prisma, 2024) manages schema evolution through declarative migrations with automatic rollback capabilities, providing type-safe database access and preventing SQL injection vulnerabilities. Connection pooling through Supabase's pgBouncer (TRANSACTION mode) prevents connection exhaustion in Next.js serverless environment where each API route invocation creates a new database client.

Database indexing strategy prioritizes consumer query performance: composite index on (Product.onChainId, TraceRecord.timestamp) enables efficient trace history retrieval, and index on SensorReading.timestamp enables cold chain monitoring queries.

### 5.1.2 API Route Architecture

API routes follow REST conventions with domain-based organization: `/api/products/*` for product operations, `/api/traces/*` for trace records, `/api/sensors/*` for IoT data, and `/api/blockchain/*` for direct contract interactions. Each route implements authentication (NextAuth.js session validation), authorization (role-based access control), validation (Zod schema validation), business logic (Prisma database queries and Wagmi blockchain interactions), and error handling (structured responses with appropriate HTTP status codes).

Key endpoints include:

- `POST /api/products/register` - Registers product to blockchain and database
- `GET /api/products/[id]` - Retrieves product details (public, wallet-free)
- `POST /api/traces/add` - Adds trace record to blockchain and database
- `GET /api/traces/[productId]` - Retrieves complete trace history
- `POST /api/sensors/simulate` - Records IoT simulator data

Performance optimization employs caching strategies: React Query on frontend caches blockchain read queries for 30 seconds, reducing redundant RPC calls and improving perceived performance.

### 5.1.3 Web3 Integration (Wagmi v2)

**Note:** This section applies custodial wallet patterns reviewed in Section 2.4.1 (to be written) to address wallet UX barriers discussed in Section 2.4.2.

Web3 functionality implemented using Wagmi v2 library (Wagmi, 2024) providing React hooks for Ethereum interaction, built on Viem (Viem, 2024) for type-safe Ethereum operations. Configuration in `src/lib/wagmi.ts` defines Sepolia chain connection, Alchemy RPC provider (HTTP transport), and contract ABIs. Wagmi's createConfig initializes Web3 client with connection pooling and automatic retry logic for failed RPC requests.

**Custodial Wallet Pattern:**

Server-side blockchain interaction follows custodial wallet pattern: producer/distributor/retailer wallets stored encrypted (AES-256) in database, decrypted server-side for transaction signing. This eliminates frontend MetaMask requirements for business users while maintaining security through encryption-at-rest and HTTPS transport encryption.

Transaction signing flow:

1. API route retrieves encrypted private key from database
2. Decrypts using environment variable key (AES-256)
3. Creates Wagmi wallet connector with decrypted key
4. Signs transaction
5. Returns transaction hash to frontend
6. Private key discarded from memory

**Wallet-Free Consumer Access:**

Consumer-facing queries use public RPC endpoints (no wallet required): frontend calls read-only contract methods via Wagmi's useReadContract hook, transparently connecting to Alchemy RPC without authentication. This enables wallet-free consumer product verification while maintaining blockchain transparency guarantees.

**Error Handling:**

Addresses common Web3 failure modes: RPC timeout (retry with exponential backoff), insufficient gas (estimate gas before transaction), nonce conflicts (serialize transactions per wallet), and contract revert (parse revert reason and return user-friendly message).

---

## 5.2 Frontend Development

**Owner:** YiLing Chen

**Note:** This section implements wallet-free access patterns reviewed in Section 2.4.2 (Wallet-Free Consumer Access) to address the 80% wallet setup abandonment rate documented in literature.

The frontend implements four role-specific interfaces (Producer, Distributor, Retailer, Consumer) using Next.js 14 Pages Router with TypeScript and Chakra UI v2 component library (Chakra UI, 2024) for accessible, customizable React components following WAI-ARIA design patterns.

### 5.2.1 Layout Architecture and Routing

Application structure follows Next.js Pages Router conventions with file-based routing organized in the `pages/` directory. The root layout provides global Chakra UI theme provider and navigation wrapper. Role-specific dashboards organized under `/producer`, `/distributor`, `/retailer`, and `/consumer` routes, each with dedicated layout components defining navigation sidebars and role-appropriate menu items.

Authentication state management uses NextAuth.js with Prisma adapter, storing user sessions in Supabase PostgreSQL. Protected routes implement middleware-based authentication checks: unauthenticated requests redirect to `/login`, and role-based authorization validates user permissions before rendering dashboard content. Consumer routes remain public (no authentication) to enable wallet-free product verification.

Responsive design implemented using Chakra UI's responsive style props: mobile-first breakpoints (base: 320px, md: 768px, lg: 1024px) ensure interfaces function on smartphones (primary device for QR scanning) through desktop browsers. Navigation collapses to hamburger menu on mobile, and data tables transform to card layouts for touch-friendly interaction.

### 5.2.2 Business User Interfaces (Producer, Distributor, Retailer)

All three business user dashboards share common architectural patterns while implementing role-specific workflows:

**Producer Dashboard** provides product registration form collecting product name, origin location, harvest date, weight, and product photo. Client-side validation using React Hook Form with Zod schema ensures data completeness before blockchain submission. Form submission triggers API request creating blockchain transaction and database record atomically. Transaction state feedback displays loading spinner during blockchain confirmation (12-15 second Sepolia block time), success message with product ID and QR code upon confirmation, and detailed error messages if transaction fails. Product list view displays registered products with thumbnails, action buttons for QR code generation (downloads 300x300px PNG using react-qr-code library), and transfer functionality to downstream partners.

**Distributor Dashboard** focuses on receiving products and adding trace records during transport/storage. Main view displays pending shipments with product details and sender information. Trace record form provides action type selection (Received, Quality_Check, Shipped, Stored) with context-specific fields. Product detail view shows complete supply chain journey using vertical timeline component displaying all trace records chronologically with icons, actor addresses, locations, and timestamps. Temperature sensor data displayed as line chart with color-coded zones (green: safe, yellow: warning, red: critical).

**Retailer Dashboard** mirrors distributor functionality with retail-specific actions including inventory management panel, sales recording interface, and batch operations for marking multiple products sold simultaneously. Products approaching expiration highlighted in amber, and products with critical temperature violations flagged in red for immediate attention.

All business user interfaces implement optimistic UI updates showing pending operations before blockchain confirmation, reverting if transaction fails to provide responsive user experience despite blockchain latency.

### 5.2.3 Consumer Query Interface (Wallet-Free)

**Note:** This section directly addresses wallet complexity barriers reviewed in Section 2.4.2, implementing the wallet-free access pattern to solve the 80% abandonment rate problem.

Consumer query interface provides public product verification without authentication or wallet requirements, addressing wallet complexity barriers including seed phrase management and private key storage that deter mainstream consumer adoption. Empirical studies analyzing 45,821 app reviews of mobile cryptocurrency wallets document that both new and experienced users struggle with UX issues leading to frustration, disengagement, and dangerous errors including irreversible monetary losses (Voskobojnikov et al., 2021).

Primary entry point uses QR code scanning via html5-qrcode library: accesses device camera (requires HTTPS and user permission), decodes QR code, extracts product ID, and navigates to product detail page. Fallback manual entry allows consumers to type product ID directly if camera unavailable or QR code damaged.

Product detail page fetches data via `/api/products/[id]` endpoint (public read-only) and displays:

1. **Product Identity:** Name, origin location, harvest date, producer information
2. **Supply Chain Timeline:** Vertical timeline showing all trace records (producer → distributor → retailer) with timestamps, locations, and actors
3. **Temperature History:** Line chart of IoT sensor readings with safe/warning/critical zones
4. **Verification Status:** Green checkmark if all trace records valid and no temperature violations; yellow warning if minor issues; red alert if critical violations detected
5. **Blockchain Proof:** Link to Etherscan showing on-chain transaction for independent verification

Mobile-optimized layout prioritizes information hierarchy: product identity and verification status above fold, supply chain timeline lazy-loaded on scroll, technical details (block numbers, transaction hashes) collapsed by default with "Show Technical Details" expand button. Page load time <2 seconds on 4G network achieved through Next.js Image component optimization (automatic WebP format conversion) and aggressive caching (stale-while-revalidate strategy).

Accessibility features include ARIA labels for screen readers, keyboard navigation support for non-touch devices, and color-blind safe palette (blue/amber/red zones use patterns in addition to color for differentiation).

---

## 5.3 IoT Simulator Implementation

**Owner:** YiLing Chen (UI), TaiSheng Chen (Backend Integration)

**Note:** This section implements IoT simulation patterns reviewed in Section 2.4.3 (IoT-Blockchain Integration - to be written), demonstrating the hybrid architecture (events vs storage) for sensor data while maintaining production-ready patterns.

IoT simulator provides admin interface for generating realistic sensor data without physical hardware, enabling reproducible testing and demonstration while maintaining architectural compatibility with future real sensor integration.

### 5.3.1 Simulator Interface

Admin-only page at `/simulator` (protected by admin role check) displays product selector dropdown, scenario selection buttons (Normal, Warning, Critical), real-time data preview panel, and manual override fields. Scenario buttons trigger pre-configured data generation:

- **Normal Scenario:** Temperature 2-4°C, Humidity 70-75% (optimal refrigeration)
- **Warning Scenario:** Temperature 8-10°C, Humidity 75-85% (approaching danger zone)
- **Critical Scenario:** Temperature >10°C, Humidity >85% (food safety violation)

Data generation uses pseudorandom number generation seeded with timestamp to ensure reproducibility while appearing realistic. Temperature values follow normal distribution with scenario-appropriate mean and standard deviation.

Generated data submitted to `/api/sensors/simulate` endpoint, which records to database and optionally blockchain (only alert-triggering readings stored on-chain for gas optimization). Real-time feedback displays transaction hash upon successful blockchain recording and database record ID.

### 5.3.2 Simulator Architecture

**Hybrid Data Recording:**

Following blockchain-IoT integration patterns reviewed in Section 2.4.3:

- **Normal readings:** Emit events only (cheap, 375 gas/event)
- **Alert readings:** Store on-chain permanently (20,000 gas/record) for regulatory compliance
- **All readings:** Stored in Supabase for fast querying and visualization

**Benefits of Simulation Approach:**

1. **Cost Savings:** €150-200 hardware costs avoided (no Raspberry Pi, DHT22 sensors, power supplies)
2. **Time Savings:** ~3 weeks development time saved (no MQTT setup, edge computing, hardware debugging)
3. **Reproducibility:** Identical scenarios generated on demand for testing and demos
4. **Academic Validity:** Demonstrates production-ready architecture without physical hardware dependency

**Migration Path to Real Sensors:**

Simulator interface can be replaced with MQTT subscriber listening to real sensor topics without changing backend API, blockchain contracts, or frontend displays. The hybrid recording strategy (normal = events, alerts = storage) remains optimal for real deployment.

---

## Chapter 5 Summary

[To be written after implementation]

This chapter demonstrated the supporting system components connecting users to the smart contracts detailed in Chapter 4. The implementation validates Research Question 4 "How can user experience challenges be addressed to enable broader blockchain adoption?" through:

**Key Achievements:**

- Custodial wallet pattern eliminating MetaMask requirement for business users
- Wallet-free consumer access via public RPC queries
- IoT simulation demonstrating production-ready architecture without hardware costs
- Responsive mobile-first design optimized for QR scanning

**Correspondence to Literature:**

- Section 2.4.2 (Wallet-Free Consumer Access) → Consumer wallet-free interface
- Section 2.4.3 (IoT-Blockchain Integration) → Hybrid sensor data architecture
- Section 2.4.1 (Custodial Wallet Patterns) → Custodial wallet implementation

**Limitations Acknowledged:**

- Simulated sensor data (not real-world conditions)
- Custodial wallet centralization risk (platform holds keys)
- RPC provider centralization (Alchemy single point of failure)

Next chapter (Chapter 6: Results and Testing) presents performance metrics, test coverage results, and comparative analysis against traditional systems.
