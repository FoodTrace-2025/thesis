### Epic 9: Consumer Query Interface (Wallet-Free)

**Priority:** 🔴 Must Have
**Estimated Time:** 8-10 hours (Backend 3h + Frontend 5-7h)
**Assigned:** TaiSheng (Backend), YiLing (Frontend)
**Timeline:** Week 6-8
**Dependencies:** Epic 4 (Component Library - Timeline), Epic 5 (Product Registration - QR codes), Epic 7 (Supply Chain Tracking - trace records), Epic 8 (IoT Simulator - sensor data optional)

#### Epic Description

Public-facing wallet-free consumer interface where anyone can scan QR code OR manually enter Product ID to view complete product journey. Zero friction: no account creation, no wallet connection, no MetaMask prompt. Server-side queries blockchain + database. Shows: product details, supply chain timeline, temperature logs (if available), verification status, link to Etherscan for blockchain proof.

#### Business Value

- **Core Value Proposition:** Zero-friction consumer access is main selling point
- **Adoption:** No wallet/account requirement = 100x more consumers will use it
- **Trust Building:** Transparent journey increases willingness to pay premium
- **Viral Potential:** Consumers share impressive traceability with friends

#### User Stories (High-Level)

- As a **consumer**, I want to **scan QR code with phone camera** (no app download) so I can see product journey
- As a **consumer**, I want to **manually enter Product ID** if QR scanner fails or unavailable
- As a **consumer**, I want to **view product origin and harvest date** so I verify it's local
- As a **consumer**, I want to **see complete supply chain timeline** with all participants
- As a **consumer**, I want to **check temperature history** so I know cold chain was maintained
- As a **consumer**, I want to **see organic certification** so I trust marketing claims
- As a **consumer**, I want to **link to Etherscan** if I want blockchain proof (advanced users)
- As a **consumer**, I want **zero friction** - no login, no account, no wallet, no MetaMask prompt, no app download

#### User Prerequisites (Manual Tasks - Complete First)

**IMPORTANT:** This is a public-facing epic (no authentication, no external services needed). Verify:

```bash
# Epic 5: At least one product with QR code exists
SELECT * FROM "Product" WHERE "qrCodeUrl" IS NOT NULL LIMIT 1;

# Epic 7: Trace records exist for timeline visualization
SELECT * FROM "TraceRecord" LIMIT 1;

# Epic 4: Timeline component available
ls src/components/visualization/Timeline.tsx

# Epic 8 (Optional): Sensor readings exist for temperature chart
SELECT * FROM "SensorReading" LIMIT 1; # Optional - chart hidden if no data
```

**Team Decision Required (10 minutes together - BEFORE starting Epic 9):**

- ✅ **QR Code Scanner vs Manual Entry UX Decision**:
  - **Landing page shows BOTH options**:
    - Option 1: "Scan QR Code" button (opens camera scanner)
    - Option 2: "Enter Product ID" text input field
  - Decision: QR scanner primary option (featured at top), manual entry fallback below
  - Mobile-first design: QR scanner takes full screen width on mobile
- ✅ **Wallet-Free Architecture Validation**:
  - **NO MetaMask popup** - Server-side blockchain queries only
  - **NO authentication required** - Public route accessible to anyone
  - **NO account creation** - Zero friction consumer experience
  - Backend queries blockchain via Alchemy RPC (Epic 1 setup)
- ✅ **Mobile-First Design Requirements**:
  - Timeline must work on 360px width (smallest modern smartphone)
  - Touch-friendly buttons (minimum 44px tap target)
  - Text legible without zoom (minimum 16px font size)
  - Test on iPhone Safari and Android Chrome

**Developer Setup (After Prerequisites):**

- No external accounts needed (public-facing, uses Epic 1 Alchemy RPC)
- html5-qrcode library: `npm install html5-qrcode` (QR scanner)
- Public route (no authentication middleware)

#### Acceptance Criteria (Epic Level)

**Backend API (GET /api/products/:id/public - No Authentication):**

- ✅ Public route accessible without NextAuth.js session
- ✅ Server-side blockchain query (NO client-side MetaMask prompt)
- ✅ Query Alchemy RPC for on-chain data verification
- ✅ Returns: product details (name, origin, harvestDate, imageUrl, certification)
- ✅ Returns: trace history with user/company names (joined from database)
- ✅ Returns: sensor readings with temperature chart data (if Epic 8 data exists)
- ✅ Returns: verification status (count of multi-party verifications from Epic 10)
- ✅ Returns: blockchain transaction hash for Etherscan link
- ✅ Caching for popular products (5-minute TTL, Redis or in-memory cache)
- ✅ Rate limiting: 100 requests/minute per IP (prevent DDoS/scraping)
- ✅ Error handling: product not found returns 404 with user-friendly message

**Frontend (Consumer Landing Page - /products/[id]):**

- ✅ Public Next.js page route (no authentication middleware)
- ✅ **NO wallet connection prompt** (no MetaMask, no RainbowKit, no WalletConnect)
- ✅ **NO account creation required** (zero friction, accessible to anyone)
- ✅ QR code scanner component (html5-qrcode library):
  - Scanner opens fullscreen on mobile
  - Camera permission request with fallback message
  - Auto-detects Product ID from QR code URL format
  - Redirects to /products/[id] after successful scan
- ✅ Manual Product ID entry (fallback if QR scanner fails):
  - Text input field with placeholder "Enter Product ID"
  - Submit button or Enter key triggers search
  - Error message if Product ID not found
- ✅ Product header shows name, origin, harvest date, image
- ✅ Supply chain timeline using Epic 4 Timeline component:
  - Shows all trace records chronologically (oldest → newest)
  - Displays actor name, company, action, location, timestamp
  - Mobile-responsive: vertical timeline on mobile, horizontal on desktop
- ✅ Temperature history chart (if sensor data exists from Epic 8):
  - Line chart showing temperature over time
  - Warning/critical thresholds highlighted
  - Chart hidden if no sensor data available
- ✅ Verification badges:
  - ✅ "Verified" badge if verificationCount ≥ 2 (Epic 10 data)
  - ⚠️ "Unverified" badge if verificationCount < 2
- ✅ Blockchain proof section:
  - Link to Etherscan transaction: `https://sepolia.etherscan.io/tx/{hash}`
  - Explanation: "View blockchain proof (technical users)"
- ✅ Share button copies product URL to clipboard
- ✅ Mobile-first design requirements:
  - Works on 360px width screens (iPhone SE, Samsung Galaxy S8)
  - Touch targets minimum 44px (Apple Human Interface Guidelines)
  - Font size minimum 16px (prevent zoom on iOS)
  - Timeline horizontal scroll on mobile (<768px width)
  - Images optimized for mobile data usage
- ✅ Cross-browser compatibility:
  - Tested on iPhone Safari (iOS 14+)
  - Tested on Android Chrome (Android 9+)
  - QR scanner fallback for unsupported browsers
- ✅ Performance:
  - Page load time <3 seconds on 3G network
  - Images lazy-loaded (below the fold)
  - Temperature chart lazy-loaded (conditional rendering)

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

**Requires:**
- Epic 4 (Component Library) - Timeline component for supply chain visualization
- Epic 5 (Product Registration) - Products with QR codes must exist
- Epic 7 (Supply Chain Tracking) - Trace records for timeline display

**Optional:**
- Epic 8 (IoT Simulator) - Sensor data for temperature chart (chart hidden if no data)
- Epic 10 (Multi-Party Verification) - Verification badges (shows "Unverified" if Epic 10 skipped)

**Blocks:** None (Epic 9 is final consumer-facing feature)

#### Team Assignment

**TaiSheng (3-4 hours - Backend Lead):**

- Public product query API (2 hours)
  - GET /api/products/:id/public endpoint (no authentication)
  - Server-side blockchain query via Alchemy RPC
  - Database joins (Product + TraceRecord + SensorReading + User + Company)
  - Return verification count from Epic 10 (if available)
- Performance optimization (1.5 hours)
  - Query optimization (select only needed fields, eager loading)
  - Caching layer (5-minute TTL, Redis or in-memory cache)
  - Rate limiting middleware (100 req/min per IP)
- Error handling (0.5 hours)
  - 404 for product not found
  - User-friendly error messages

**YiLing (6-8 hours - Frontend Lead):**

- QR scanner integration (2-3 hours)
  - Install html5-qrcode library
  - QR scanner component with camera permission request
  - Auto-detect Product ID from QR code URL
  - Fallback message for unsupported browsers
- Consumer landing page layout (2 hours)
  - Product header (name, origin, harvest date, image)
  - No-wallet architecture (no MetaMask prompt)
  - Manual Product ID entry fallback
- Supply chain timeline integration (2 hours)
  - Integrate Epic 4 Timeline component
  - Mobile-responsive layout (vertical timeline on <768px)
  - Display trace records with user/company names
- Additional features (2 hours)
  - Temperature chart (conditional rendering if sensor data exists)
  - Verification badges (verified/unverified)
  - Blockchain proof link to Etherscan
  - Share button (copy URL to clipboard)
- Mobile-first optimization (1 hour)
  - Test on 360px width (iPhone SE)
  - Touch targets 44px minimum
  - Font size 16px minimum
  - Lazy-load images and charts

#### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| QR scan fails on some phones (iOS camera permission, unsupported browsers) | Fallback to manual Product ID entry, clear permission request message, browser compatibility detection |
| Page load too slow (>3 seconds on 3G) | Caching (5-minute TTL), optimize images (WebP format), lazy-load charts, server-side rendering |
| Abuse/spam requests (DDoS, scraping) | Rate limiting (100 req/min per IP), Cloudflare DDoS protection (Epic 13), bot detection |
| Confusing for non-tech consumers (blockchain jargon) | Simple language ("Product Journey", not "Blockchain"), visual timeline, hide technical details by default |
| MetaMask popup appears (wallet connection prompt) | NO Web3 libraries on consumer page, server-side blockchain queries only, explicit no-wallet architecture validation |
| Epic 4 Timeline component not ready | Fallback to simple ordered list view (acceptable for MVP), Timeline component prioritized in Epic 4 Week 4 |
| Epic 8 missing (no sensor data) | Temperature chart hidden conditionally, page still functional without IoT data |
| Mobile layout broken on old devices (Android 7, iOS 12) | Test on real devices, graceful degradation, minimum supported: iOS 14, Android 9 |
