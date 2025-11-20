### Epic 11: QR Code Functionality

**Priority:** 🔴 Must Have
**Estimated Time:** 4-6 hours (Backend 2h + Frontend 2-4h)
**Assigned:** TaiSheng (Backend), YiLing (Frontend)
**Timeline:** Week 5-6
**Dependencies:** Epic 5 (Product Registration)

#### Epic Description

Automatic QR code generation when products registered. QR code encodes Product ID, links to consumer query page. Producers download QR code PNG, print, and attach to packaging. Consumers scan with phone camera (no app) to instantly view product journey.

#### Business Value

- **Consumer Access:** QR scanning is familiar, works on all smartphones
- **No App Required:** Camera app scans QR → opens browser → sees product info
- **Physical-Digital Bridge:** Connects physical product to blockchain data
- **Marketing Tool:** "Scan to verify authenticity" builds premium brand

#### User Stories (High-Level)

- As a **producer**, I want **QR code auto-generated** after product registration
- As a **producer**, I want to **download QR code as PNG** for printing
- As a **producer**, I want **high-resolution QR** (300 DPI) for professional packaging
- As a **consumer**, I want to **scan QR with phone camera** (iOS/Android native camera)
- As a **consumer**, I want **QR link to open consumer query page** immediately

#### Acceptance Criteria (Epic Level)

**Backend:**

- ✅ QR code generated server-side after product registration
- ✅ QR encodes: `https://foodtrace.app/products/{productId}`
- ✅ PNG file saved to Supabase Storage
- ✅ High resolution (300x300 px minimum, scalable SVG)
- ✅ QR download endpoint: `GET /api/products/:id/qr`

**Frontend:**

- ✅ Producer dashboard shows QR code thumbnail
- ✅ "Download QR Code" button (downloads PNG)
- ✅ QR preview modal (before download)
- ✅ Consumer query page QR scanner (html5-qrcode)
- ✅ QR scan success rate >95% (test on multiple phones)

#### Technical Approach

**QR Generation (server-side):**

```typescript
import QRCode from "qrcode";

async function generateQR(productId: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/products/${productId}`;

  const qrDataUrl = await QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    width: 300,
    margin: 2,
  });

  // Upload to Supabase Storage
  const { data } = await supabase.storage
    .from("qr-codes")
    .upload(`${productId}.png`, qrDataUrl);

  return data.publicUrl;
}
```

**Producer Dashboard:**

```typescript
<ProductCard>
  <Image src={product.qrCodeUrl} alt="QR Code" width={100} />
  <Button onClick={() => downloadQR(product.id)}>Download QR Code</Button>
</ProductCard>
```

**Consumer QR Scanner:**

```typescript
<QRScanner
  fps={10}
  qrbox={250}
  onScanSuccess={(decodedText) => {
    const productId = extractProductId(decodedText);
    router.push(`/products/${productId}`);
  }}
/>
```

#### Dependencies

**Requires:** Epic 5 (products must exist)
**Blocks:** Epic 4 (consumer query needs QR codes)

#### Team Assignment

**TaiSheng (2 hours):**

- QR generation on product registration (1 hour)
- QR download API (1 hour)

**YiLing (2-4 hours):**

- QR display in producer dashboard (1 hour)
- QR scanner in consumer page (2-3 hours, includes testing on multiple devices)

#### Risks & Mitigations

| Risk                           | Mitigation                                      |
| ------------------------------ | ----------------------------------------------- |
| QR doesn't scan on some phones | Use standard QR format, test on iOS + Android   |
| QR print quality poor          | Generate high-res (300 DPI), provide SVG option |
| QR damaged/unreadable          | Include Product ID text below QR as backup      |
