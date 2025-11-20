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
) public onlyRole(SUPPLY_CHAIN_ROLE) {
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
