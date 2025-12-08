### Epic 9: Consumer Query Interface (Wallet-Free)

**Priority:** Must Have
**Estimated Time:** 6-9 hours (API enhancement 1-2h + Frontend 5-7h)
**Assigned:** TaiSheng (Backend), YiLing (Frontend)
**Timeline:** Week 5-6
**Dependencies:** Epic 5 (Product Registration), Epic 7 (Supply Chain Tracking)

**Note:** Epic 11 (QR Functionality) was merged into this epic on 2025-12-06. QRScanner component already exists from Epic 7 Story 7.10.

---

#### Epic Description

Public-facing wallet-free consumer interface where anyone can scan QR code OR manually enter Product ID to view complete product journey. Zero friction: no account creation, no wallet connection, no MetaMask prompt. Server-side queries database + blockchain verification links. Shows: product details, supply chain timeline (including registration as first event), link to Etherscan for blockchain proof.

**Key Design Decisions:**
- URL format: `/trace/{blockchainId}` (matches existing QR codes from Epic 5)
- No back button; instead use "Scan Another Product" forward action
- Registration event shown as synthetic first event in timeline
- No temperature chart (Epic 8 IoT deferred to Future Work)
- No verification badges (Epic 10 deferred to Future Work)
- Use existing Layout component without role prop

---

#### Business Value

- **Core Value Proposition:** Zero-friction consumer access is main selling point
- **Adoption:** No wallet/account requirement = 100x more consumers will use it
- **Trust Building:** Transparent journey increases willingness to pay premium
- **Viral Potential:** Consumers share impressive traceability with friends

---

#### User Stories (High-Level)

- As a **consumer**, I want to **scan QR code with phone camera** (no app download) so I can see product journey
- As a **consumer**, I want to **manually enter Product ID** if QR scanner fails or unavailable
- As a **consumer**, I want to **view product origin and harvest date** so I verify it's local
- As a **consumer**, I want to **see complete supply chain timeline** starting from registration
- As a **consumer**, I want to **link to Etherscan** if I want blockchain proof (advanced users)
- As a **consumer**, I want to **share product URL** to show friends
- As a **consumer**, I want **zero friction** - no login, no account, no wallet, no MetaMask, no app download

---

#### User Prerequisites (Verify Before Starting)

```bash
# Epic 5: At least one product with QR code exists
SELECT * FROM "Product" WHERE "qrCodeUrl" IS NOT NULL LIMIT 1;

# Epic 7: Trace records exist for timeline visualization
SELECT * FROM "TraceRecord" LIMIT 1;

# Epic 7: Components exist
ls src/components/scanner/QRScanner.tsx  # QR Scanner (Story 7.10)
ls src/components/trace/TraceTimeline.tsx  # Timeline (Story 7.5)
```

---

#### Story Breakdown

| Story | Title | Scope | Time | Dependencies |
|-------|-------|-------|------|--------------|
| 9.1 | Consumer Landing Page | `/trace` page with QR scanner + manual entry | 2-3h | Epic 7 QRScanner |
| 9.2 | Product Detail Page | `/trace/[id]` page with product header + timeline | 2-3h | Epic 7 TraceTimeline |
| 9.3 | Registration Event in Timeline | API enhancement + error handling | 1-2h | Story 9.2 |
| 9.4 | Share and Polish | Share button + responsive polish | 1h | Story 9.3 |

---

#### Acceptance Criteria (Epic Level)

**Consumer Landing Page (`/trace`):**

- Public Next.js page route (no authentication)
- QR scanner as primary option (reuse Epic 7 QRScanner component)
- Manual Product ID entry as fallback below scanner
- "Scan QR Code" button opens scanner modal
- Successful scan redirects to `/trace/{blockchainId}`
- Invalid Product ID shows user-friendly error message
- Mobile-first design (works on 360px width)

**Product Detail Page (`/trace/[id]`):**

- Public route accessible without authentication
- NO wallet connection prompt (no MetaMask, no RainbowKit)
- Product header: name, origin, harvest date, producer company
- Supply chain timeline showing complete journey:
  - Registration event as FIRST entry (synthetic from Product table)
  - All TraceRecord events in chronological order
  - Each event shows: action, location, actor name, company, timestamp
  - Etherscan link for each blockchain transaction
- "Scan Another Product" button at bottom (no back button)
- Share button copies URL to clipboard
- Error state for product not found (404)
- Loading state while fetching data

**API Enhancement (`/api/products/[id]/trace-history`):**

- Returns registration as synthetic first event
- Includes product metadata in response
- Proper error handling (404 for not found)

**Cross-Cutting:**

- Mobile-responsive (360px minimum width)
- Touch targets minimum 44px
- Font size minimum 16px
- Page load <3 seconds on 3G
- Works on iOS Safari 14+ and Android Chrome 9+

---

#### Technical Approach

**Consumer Landing Page:**

```typescript
// src/pages/trace/index.tsx (Pages Router)
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout';
import { QRScanner } from '@/components/scanner';

export default function ConsumerLandingPage() {
  const router = useRouter();
  const [productId, setProductId] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const handleScan = (id: string) => {
    setShowScanner(false);
    router.push(`/trace/${id}`);
  };

  const handleManualLookup = () => {
    if (productId.trim()) {
      router.push(`/trace/${productId}`);
    }
  };

  return (
    <Layout>
      {/* QR Scanner (primary) */}
      {/* Manual entry (fallback) */}
    </Layout>
  );
}
```

**Product Detail Page:**

```typescript
// src/pages/trace/[id].tsx (Pages Router)
import { GetServerSidePropsContext } from 'next';
import { Layout } from '@/components/layout';
import { TraceTimeline } from '@/components/trace';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.params;
  // Fetch product + trace history
  // Return 404 if not found
}

export default function ProductTracePage({ product, traceRecords }) {
  return (
    <Layout>
      {/* Product header */}
      {/* Timeline with registration as first event */}
      {/* Scan Another Product button */}
      {/* Share button */}
    </Layout>
  );
}
```

**Registration Event in API:**

```typescript
// In /api/products/[id]/trace-history.ts
// Prepend registration as synthetic first event
const registrationEvent = {
  id: 'registration',
  action: 'REGISTERED',
  location: product.origin,
  actor: { name: 'Producer', company: product.company.name },
  transactionHash: product.transactionHash,
  createdAt: product.createdAt,
};
return { traceRecords: [registrationEvent, ...dbRecords] };
```

---

#### Dependencies

**Requires:**
- Epic 5 (Product Registration) - Products with QR codes exist
- Epic 7 (Supply Chain Tracking) - TraceTimeline and QRScanner components

**Deferred (Future Work):**
- Epic 8 (IoT Simulator) - Temperature chart (not implemented)
- Epic 10 (Multi-Party Verification) - Verification badges (not implemented)

**Blocks:**
- Epic 13 (Deployment) - Consumer query is core thesis demo feature

---

#### Team Assignment

**TaiSheng (1-2 hours - Backend):**
- Story 9.3: Add registration event to trace-history API response
- Error handling for product not found

**YiLing (5-7 hours - Frontend):**
- Story 9.1: Consumer landing page with QR scanner + manual entry
- Story 9.2: Product detail page with timeline integration
- Story 9.4: Share button and responsive polish

---

#### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| QR scan fails on some phones | Manual Product ID entry fallback always visible |
| Page load too slow on mobile | Server-side rendering, minimal client JS |
| Confusing for non-tech consumers | Simple language ("Product Journey"), visual timeline |
| MetaMask popup appears | NO Web3 libraries on consumer pages, server-side only |
| Mobile layout issues | Test on 360px width, use Chakra responsive props |

---

#### What's NOT in Scope (Deferred)

These features were originally planned but deferred to Future Work:

1. **Temperature Chart** (Epic 8 not implemented)
   - SensorReading model doesn't exist
   - Document as "Future Work" in thesis

2. **Verification Badges** (Epic 10 not implemented)
   - verificationCount field doesn't exist
   - Document as "Future Work" in thesis

3. **Rate Limiting** (over-engineering for POC)
   - Render provides basic DDoS protection
   - Document as "Production recommendation" in thesis

4. **Redis Caching** (over-engineering for POC)
   - Database queries are fast enough for demo
   - Document as "Production recommendation" in thesis

---

**Last Updated:** 2025-12-06 (Epic 11 merged, scope corrected)
