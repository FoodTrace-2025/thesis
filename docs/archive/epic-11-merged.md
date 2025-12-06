# Epic 11: QR Code Functionality [ARCHIVED]

**Status:** ARCHIVED - Merged into Epic 9 (Consumer Query Interface)
**Archived Date:** 2025-12-06
**Reason:** QRScanner component already existed from Epic 7 (Story 7.10). The artificial split between Epic 9 (Consumer Query) and Epic 11 (QR Functionality) created unnecessary coordination overhead. Both epics had the same end goal: allowing consumers to query products.

**See:** `docs/prd/epic-9-consumer-query.md` for consolidated scope.

---

## What Was Merged

The following from Epic 11 was incorporated into Epic 9:

1. **QR Scanner integration** - Already implemented in Epic 7 Story 7.10 (`src/components/scanner/QRScanner.tsx`)
2. **Manual Product ID entry fallback** - Added to Epic 9 Story 9.1
3. **Mobile testing requirements** - Deferred to deployment epic (requires HTTPS)
4. **Camera permission handling** - Already in QRScanner component

## What Was Already Implemented (Epic 7)

- `src/components/scanner/QRScanner.tsx` - Full QR scanner component
- `src/components/scanner/index.ts` - Export barrel
- html5-qrcode library installed
- Integration into distributor/retailer dashboards

## What Remains in Epic 9

- Consumer landing page (`/trace`) with QR scanner + manual entry
- Consumer product detail page (`/trace/[id]`)
- Public (no-auth) access to product information

---

## Original Epic Content (For Reference)

The original Epic 11 content is preserved below for historical reference.

---

### Epic 11: QR Code Functionality (Original)

**Priority:** Must Have
**Estimated Time:** 4-6 hours (Backend 2h + Frontend 2-4h)
**Assigned:** TaiSheng (Backend), YiLing (Frontend)
**Timeline:** Week 5-6
**Dependencies:** Epic 5 (Product Registration)

#### Epic Description

**IMPORTANT:** This epic focuses on QR SCANNING functionality only. QR code GENERATION happens in Epic 5 (Product Registration) when products are registered. Epic 11 implements the consumer-facing QR scanner that reads these QR codes and redirects to the consumer query page.

Consumer-facing QR code scanner using html5-qrcode library. Consumers scan QR codes with phone camera (iOS Safari, Android Chrome native cameras, no app download required) to instantly view product journey. Scanner component integrated into Epic 9 consumer query landing page. Works on all modern smartphones with camera access.

#### Business Value

- **Consumer Access:** QR scanning is familiar, works on all smartphones
- **No App Required:** Camera app scans QR -> opens browser -> sees product info
- **Physical-Digital Bridge:** Connects physical product to blockchain data
- **Marketing Tool:** "Scan to verify authenticity" builds premium brand

#### User Stories (High-Level)

- As a **consumer**, I want to **scan QR code with phone camera** (iOS Safari, Android Chrome native cameras)
- As a **consumer**, I want **QR scanner to work without app download** (browser-based scanning)
- As a **consumer**, I want **automatic redirect to product page** after successful scan
- As a **consumer**, I want **manual Product ID entry fallback** if QR scan fails or camera unavailable
- As a **consumer**, I want **clear camera permission request** so I understand why camera access is needed

---

**End of archived document**
