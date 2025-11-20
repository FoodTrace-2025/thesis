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
