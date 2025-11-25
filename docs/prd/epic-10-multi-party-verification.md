### Epic 10: Multi-Party Verification (Optional)

**Implementation Status**: Optional enhancement. Thesis Chapter 1.3.2 does not list multi-party verification as core objective. Recommended for future work if time permits after Week 6 checkpoint.

**Priority:** 🟢 Could Have (Optional Enhancement)
**Estimated Time:** 4-6 hours (basic), 6-8 hours (with reputation)
**Assigned:** Sam (Smart Contract), TaiSheng (Backend integration)
**Timeline:** Week 6-7 (after Epic 9, if time permits)
**Dependencies:** Epic 5 (Product Registration), Epic 7 (Supply Chain Tracking - verification linked to trace records)

#### Epic Description

Supply chain participants verify products from upstream partners (distributor verifies producer, retailer verifies distributor). Products marked "Verified" (✅ badge) after 2+ independent verifications. Builds trust through multi-party consensus. NO external third-party inspectors required (simplified chain-of-trust model for MVP).

#### Business Value

- **Trust Amplification:** Independent verification more credible than self-reported data
- **Reputation System:** Producers build trust score over time
- **Fraud Detection:** Fake products unlikely to get verifications
- **Premium Pricing:** Verified products command higher prices

**Note:** This epic is OPTIONAL. If falling behind schedule at Week 4, skip and focus on core features. Can be added post-thesis if project continues.

#### User Stories (High-Level)

- As a **distributor**, I want to **verify producer's product** after receiving and inspecting it
- As a **retailer**, I want to **verify distributor's product** after receiving it
- As a **producer**, I want **verified badge (✅)** on my products after 2+ verifications
- As a **consumer**, I want to **see verification count** (2+ verifications = high trust)
- As a **platform**, I want to **prevent self-verification** (producer cannot verify own products)

#### User Prerequisites (Manual Tasks - Complete First)

**IMPORTANT:** This is an OPTIONAL epic. Only implement if time permits after Week 6 core features complete. Verify:

```bash
# Epic 5: Products exist for verification
SELECT * FROM "Product" LIMIT 1;

# Epic 7: Trace records exist (verification linked to specific trace events)
SELECT * FROM "TraceRecord" LIMIT 1;
```

**Team Decision Required (5 minutes - IF implementing Epic 10):**

- ✅ **Verification Threshold Decision**:
  - Threshold: 2+ independent verifications = "Verified" badge (✅)
  - <2 verifications = "Unverified" badge (⚠️)
- ✅ **Chain of Trust Model (Simplified for MVP)**:
  - Distributor verifies Producer's product (after receiving/inspecting)
  - Retailer verifies Distributor's product (after receiving/inspecting)
  - NO external third-party inspectors (simplified scope)
  - Self-verification prevented (cannot verify own company's products)
- ✅ **Reputation System Decision**:
  - **Option A (Recommended for MVP):** Skip reputation system, basic verification only (saves 3h)
  - **Option B:** Implement basic reputation (verifier trust score, adds 3h development time)

#### Acceptance Criteria (Epic Level)

**Smart Contract (verifyProduct function):**

- ✅ `verifyProduct(productId)` function implemented
- ✅ Role-based access control (DISTRIBUTOR, RETAILER can verify, not PRODUCER or CONSUMER)
- ✅ Self-verification prevention (cannot verify products from own company)
- ✅ One verification per address per product (duplicate verification prevented)
- ✅ ProductVerified event emitted (productId, verifier address, timestamp)
- ✅ Verification count stored on-chain (mapping productId → count)
- ✅ Gas cost <50k gas per verification

**Backend API:**

- ✅ POST /api/products/:id/verify endpoint
- ✅ User role validation (only DISTRIBUTOR, RETAILER)
- ✅ Company ownership check (cannot verify own company's products)
- ✅ Blockchain transaction submission
- ✅ Database save (verificationCount increment)
- ✅ Audit log entry (action: PRODUCT_VERIFIED, userId, productId)

**Frontend (Verification UI):**

- ✅ "Verify Product" button on distributor/retailer dashboards
- ✅ Verification count displayed on Epic 9 consumer query page
- ✅ Verified badge (✅) shown if verificationCount ≥ 2
- ✅ Unverified badge (⚠️) shown if verificationCount < 2
- ✅ Error handling: self-verification attempt shows error message
- ✅ Error handling: duplicate verification shows "Already verified" message

#### Team Assignment

**Sam (3-4 hours - Smart Contract):**

- verifyProduct() function (2 hours)
  - Role-based access control (DISTRIBUTOR, RETAILER only)
  - Self-verification prevention
  - Duplicate verification prevention
  - Verification count mapping
- Smart contract unit tests (1-2 hours)
  - Test verification success cases
  - Test self-verification rejection
  - Test duplicate verification rejection
  - Test role-based access control

**TaiSheng (1-2 hours - Backend Integration):**

- POST /api/products/:id/verify endpoint (1 hour)
  - User role validation
  - Company ownership check
  - Blockchain transaction submission
  - Database verificationCount increment
- Audit logging (0.5 hours)

**YiLing (0.5-1 hour - Frontend Integration):**

- "Verify Product" button on dashboards (0.5 hours)
- Verified/Unverified badges on Epic 9 consumer page (integrated, no extra work)

#### Dependencies

**Requires:** Epic 5 (Product Registration), Epic 7 (Supply Chain Tracking)
**Optional:** Can be skipped if behind schedule (focus on core features first)
**Enhances:** Epic 9 (Consumer Query Interface - verification badges)

#### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Behind schedule at Week 6 | SKIP Epic 10 entirely, focus on core features (Epic 1-9), acceptable for MVP thesis |
| Self-verification not prevented (producer verifies own products) | Smart contract validation, company ownership check, integration tests verify prevention |
| Verification threshold too low (1 verification = verified) | Use 2+ threshold (distributor + retailer = 2 independent verifications) |
| Reputation system adds complexity | Skip reputation (Option A), implement basic verification only (saves 3h) |
