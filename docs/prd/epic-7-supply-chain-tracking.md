### Epic 7: Supply Chain Tracking

**Updated: 2025-12-04 (Session 61)** - Aligned roles and API format with rest-api-spec.md

**Priority:** 🔴 Must Have
**Estimated Time:** 12-15 hours (Smart Contract 4h + Backend 3-4h + Frontend 5-7h)
**Assigned:** Sam (Smart Contract), TaiSheng (Backend), YiLing (Frontend)
**Timeline:** Week 5-7
**Dependencies:** Epic 4 (Component Library - Timeline), Epic 5 (Product Registration), Epic 6 (Product Transfer - Optional)

#### Epic Description

Distributors and retailers add trace records to products as they move through supply chain. Each trace record captures: actor (who), action (what), location (where), timestamp (when), quality notes. Blockchain ensures immutable audit trail. Database stores off-chain metadata for fast queries. Forms complete timeline of product journey visible to consumers in Epic 9.

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

#### User Prerequisites (Manual Tasks - Complete First)

**IMPORTANT:** This epic depends on Epic 4 (Timeline component), Epic 5 (products exist), and optionally Epic 6 (transfer workflow creates initial trace records). Verify:

```bash
# Epic 5: At least one product registered
SELECT * FROM "Product" WHERE status = 'REGISTERED' LIMIT 1;

# Epic 4: Chakra UI theme configured (Timeline built as first task of this epic)
# Timeline.tsx will be created in src/components/visualization/ using Chakra UI components

# Epic 6 (Optional): Transfer workflow creates trace records automatically
# If Epic 6 skipped, distributors/retailers manually create first trace record
```

**Team Decision Required (10 minutes together - BEFORE starting Epic 7):**

- ✅ **Blockchain Query Approach Decision**:
  - **Option A (Recommended):** Database audit log for trace history queries - Fast (<50ms), supports pagination, joins with user/company names
  - **Option B:** Blockchain events for trace history - Slow (1-2s), requires RPC calls, limited metadata
  - **Decision:** Use database audit log (Option A), blockchain only for tamper-proof timestamp verification
- ✅ **Timeline Component Approach Decision**:
  - **Decision:** Build custom Timeline using Chakra UI (VStack, Box, Divider)
  - Timeline created as Task 1 of first story in this epic
  - No external timeline library needed - simple vertical timeline sufficient for supply chain
- ✅ **GPS Location Integration Decision**:
  - MVP: Manual text input for location (e.g., "Helsinki Distribution Center")
  - Future: Browser Geolocation API integration (defer to post-MVP)

**Developer Setup (After Prerequisites):**

- No additional external accounts needed (uses Epic 1 blockchain credentials)
- TraceRecord model added to Prisma schema (see Technical Approach)

#### Acceptance Criteria (Epic Level)

**Smart Contract (TraceRecords.sol or ProductRegistry.sol):**

- ✅ TraceRecord struct stores (productId, actor, action, location, notes, timestamp)
- ✅ `addTraceRecord()` function accepts (productId, action, location, notes) parameters
- ✅ TraceRecordAdded event emitted with (productId, actor, action, timestamp)
- ✅ Role-based access control (PRODUCER, DISTRIBUTOR, RETAILER roles can add trace records, not CONSUMER)
- ✅ Automatic blockchain timestamp (block.timestamp) - no manual timestamp manipulation
- ✅ Cannot modify past trace records (append-only array, immutable history)
- ✅ Gas cost measured and documented in test output (no hard target - optimization deferred to future work)
- ✅ Product existence validation (require products[productId].exists)
- ✅ Unit tests achieve >70% code coverage
- ✅ Function returns trace record index (array length)

**Backend API (POST /api/products/:id/trace):**

- ✅ NextAuth.js session validation (user must be authenticated)
- ✅ User role validation (PRODUCER, DISTRIBUTOR, RETAILER can add trace records)
- ✅ Server-side wallet decryption using Epic 3 Tier 1 encryption
- ✅ Blockchain transaction submission (addTraceRecord smart contract call)
- ✅ Wait for 1 block confirmation before returning success
- ✅ Database save to TraceRecord table (off-chain metadata with user/company joins)
- ✅ Audit log entry created (action: TRACE_RECORD_ADDED, userId, companyId, productId)
- ✅ Error handling: wallet decryption failure returns 500 error
- ✅ Error handling: product not found returns 404 error
- ✅ Transaction hash returned to frontend

**Backend API (GET /api/products/:id/trace-history):**

- ✅ Query database audit log (not blockchain) for fast response (<50ms)
- ✅ Join with User and Company tables to include actor names (e.g., "John from Helsinki Distributors")
- ✅ Return trace records sorted chronologically (oldest first)
- ✅ Include blockchain transaction hash for each record (tamper-proof verification link)
- ✅ Pagination support (limit/offset parameters) for products with 50+ trace records
- ✅ Caching for frequently queried products (Redis or in-memory cache, 5-minute TTL)

**Frontend (Distributor/Retailer Dashboards):**

- ✅ "Add Trace Record" form rendered using Epic 4 components
- ✅ Action dropdown with predefined values (RECEIVED, QUALITY_CHECK, SHIPPED, STOCKED, SOLD)
- ✅ Location text input (manual entry, e.g., "Helsinki Distribution Center")
- ✅ Quality notes textarea (optional, max 500 characters)
- ✅ Form validation: action required, location required, notes optional
- ✅ Loading states shown during blockchain transaction submission
- ✅ Success toast notification when trace record added
- ✅ Error handling: wallet decryption failure shows "Contact admin" message

**Frontend (Product Trace History Timeline):**

- ✅ Timeline component (from Epic 4) displays complete product journey
- ✅ Timeline shows actor name, company name, action, location, timestamp
- ✅ Timeline sorted chronologically (oldest at top, newest at bottom)
- ✅ Blockchain transaction hash link to Etherscan for verification
- ✅ Mobile-responsive timeline layout (works on phone/tablet/desktop)
- ✅ Empty state message when no trace records exist ("No trace records yet")

#### Technical Approach

**TraceRecord Model (Prisma Schema):**

```prisma
model TraceRecord {
  id                String   @id @default(cuid())
  productId         String
  userId            String   // User who added the trace record
  companyId         String   // Company of the user
  action            String   // "RECEIVED", "QUALITY_CHECK", "SHIPPED", "STOCKED", "SOLD"
  location          String   // "Helsinki Distribution Center"
  notes             String?  // Optional quality notes
  transactionHash   String   // Blockchain transaction hash
  blockchainIndex   Int?     // Index in blockchain array (for verification)
  createdAt         DateTime @default(now())

  product Product @relation(fields: [productId], references: [id])
  user    User    @relation(fields: [userId], references: [id])
  company Company @relation(fields: [companyId], references: [id])

  @@index([productId, createdAt])
  @@index([companyId])
}
```

**Smart Contract (ProductRegistry.sol or TraceRecords.sol):**

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

event TraceRecordAdded(
  uint256 indexed productId,
  address indexed actor,
  string action,
  uint256 timestamp
);

// Roles: PRODUCER_ROLE already exists, add DISTRIBUTOR_ROLE and RETAILER_ROLE
bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
bytes32 public constant RETAILER_ROLE = keccak256("RETAILER_ROLE");

function addTraceRecord(
  uint256 productId,
  string memory action,
  string memory location,
  string memory notes
) public returns (uint256) {
  // Check caller has PRODUCER, DISTRIBUTOR, or RETAILER role
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

  // Return index for database storage
  return productTraceHistory[productId].length - 1;
}

// View function to get complete trace history
function getTraceHistory(uint256 productId) public view returns (TraceRecord[] memory) {
  return productTraceHistory[productId];
}
```

**Backend API (Trace History Query - Database Approach):**

```typescript
// GET /api/products/:id/trace-history
export async function GET(req, { params }) {
  const { limit = 50, offset = 0 } = req.query;

  // Query database (fast, includes user/company names)
  const traceRecords = await db.traceRecord.findMany({
    where: { productId: params.id },
    include: {
      user: { select: { name: true } },
      company: { select: { name: true } },
    },
    orderBy: { createdAt: 'asc' }, // Chronological order
    take: limit,
    skip: offset,
  });

  // Format response with blockchain verification links
  const formattedRecords = traceRecords.map(record => ({
    id: record.id,
    action: record.action,
    location: record.location,
    notes: record.notes,
    createdAt: record.createdAt,
    actor: {
      name: record.user.name,
      role: record.user.role,
      company: record.company.name,
    },
    transactionHash: record.transactionHash,
    etherscanLink: `https://sepolia.etherscan.io/tx/${record.transactionHash}`,
  }));

  return Response.json({
    success: true,
    traceRecords: formattedRecords,
    total: traceRecords.length,
    limit,
    offset,
  });
}
```

#### Dependencies

**Requires:**
- Epic 4 (Component Library) - Chakra UI theme configured (Timeline built as first task of this epic using Chakra components)
- Epic 5 (Product Registration) - Products must exist before trace records can be added
- Epic 3 Tier 1 (Wallet Encryption) - Server-side wallet decryption for blockchain transactions

**Optional:**
- Epic 6 (Product Transfer Workflow) - Transfer workflow automatically creates initial trace records (e.g., "SHIPPED", "RECEIVED")

**Blocks:**
- Epic 9 (Consumer Query Interface) - Consumer query shows complete trace history timeline

#### Team Assignment

**Sam (4 hours - Smart Contract Lead):**

- TraceRecord struct and addTraceRecord() function (2.5 hours)
  - Implement TraceRecord struct (productId, actor, action, location, notes, timestamp)
  - Implement addTraceRecord() function with role-based access control
  - Implement getTraceHistory() view function
  - Product existence validation
  - Gas measurement (document actual usage in test output)
- Smart contract unit tests (1 hour)
  - Test addTraceRecord() success cases (different actions, different roles)
  - Test role-based access control (PRODUCER, DISTRIBUTOR, RETAILER can add; CONSUMER cannot)
  - Test product existence validation (reject invalid productId)
  - Test getTraceHistory() returns correct array
  - Achieve >70% code coverage
- Contract deployment/integration (0.5 hours)
  - Deploy TraceRecords contract or integrate into ProductRegistry
  - Share contract ABI with TaiSheng

**TaiSheng (3-4 hours - Backend Lead):**

- Trace record API endpoint (2 hours)
  - POST /api/products/:id/trace implementation
  - Blockchain transaction submission
  - Database save with transactionHash and blockchainIndex
  - Error handling (wallet decryption, product not found)
- Trace history query endpoint (1.5 hours)
  - GET /api/products/:id/trace-history implementation
  - Database query with user/company joins
  - Pagination support (limit/offset)
  - Format response with Etherscan links
  - Optional: Caching layer (Redis or in-memory, 5-minute TTL)
- TraceRecord Prisma model (0.5 hours)
  - Add TraceRecord model to schema
  - Run Prisma migration

**YiLing (5-7 hours - Frontend Lead):**

- Add trace record form (distributor dashboard) (2 hours)
  - Form with action dropdown, location input, notes textarea
  - Form validation (action required, location required)
  - Loading states during blockchain transaction
  - Success toast notification
- Add trace record form (retailer dashboard) (2 hours)
  - Similar form for retailer role
  - Additional action option: "SOLD"
- Timeline view component integration (2-3 hours)
  - Integrate Epic 4 Timeline component
  - Fetch trace history from GET /api/products/:id/trace-history
  - Display actor name, company, action, location, timestamp
  - Show blockchain transaction hash link to Etherscan
  - Empty state when no trace records
  - Mobile-responsive layout

#### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Gas costs too high (many trace records per product) | Accept realistic costs for POC (follows Story 5.1 precedent: 190-207k gas); optimization deferred to future work; consider off-chain storage with blockchain hash for production |
| Missing trace records (user forgets to add) | Dashboard reminders show products without recent trace records, Epic 6 transfer workflow auto-creates trace records |
| Fake location data (manual text entry) | Manual entry acceptable for MVP POC, GPS integration (Browser Geolocation API) deferred to post-MVP, blockchain timestamp provides tamper-proof audit |
| Database query slow (products with 100+ trace records) | Pagination (limit 50 per page), database indexes on productId + createdAt, optional caching layer (5-minute TTL) |
| Timeline component complexity | Build simple vertical timeline using Chakra UI (VStack, Box, Divider) - no external library needed |
| Blockchain event query too slow (1-2s per product) | Use database audit log for queries (Option A decision), blockchain events only for verification/dispute resolution |
| Epic 6 not implemented (no auto trace records) | Manual trace record entry acceptable, distributors/retailers create first trace record manually when receiving product |
