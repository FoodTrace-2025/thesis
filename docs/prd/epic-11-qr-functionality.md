### Epic 11: QR Code Functionality

**Priority:** 🔴 Must Have
**Estimated Time:** 4-6 hours (Backend 2h + Frontend 2-4h)
**Assigned:** TaiSheng (Backend), YiLing (Frontend)
**Timeline:** Week 5-6
**Dependencies:** Epic 5 (Product Registration)

#### Epic Description

**IMPORTANT:** This epic focuses on QR SCANNING functionality only. QR code GENERATION happens in Epic 5 (Product Registration) when products are registered. Epic 11 implements the consumer-facing QR scanner that reads these QR codes and redirects to the consumer query page.

Consumer-facing QR code scanner using html5-qrcode library. Consumers scan QR codes with phone camera (iOS Safari, Android Chrome native cameras, no app download required) to instantly view product journey. Scanner component integrated into Epic 9 consumer query landing page. Works on all modern smartphones with camera access.

#### Business Value

- **Consumer Access:** QR scanning is familiar, works on all smartphones
- **No App Required:** Camera app scans QR → opens browser → sees product info
- **Physical-Digital Bridge:** Connects physical product to blockchain data
- **Marketing Tool:** "Scan to verify authenticity" builds premium brand

#### User Stories (High-Level)

**Note:** Producer QR code generation stories are in Epic 5 (Product Registration). This epic focuses on consumer scanning.

- As a **consumer**, I want to **scan QR code with phone camera** (iOS Safari, Android Chrome native cameras)
- As a **consumer**, I want **QR scanner to work without app download** (browser-based scanning)
- As a **consumer**, I want **automatic redirect to product page** after successful scan
- As a **consumer**, I want **manual Product ID entry fallback** if QR scan fails or camera unavailable
- As a **consumer**, I want **clear camera permission request** so I understand why camera access is needed

#### User Prerequisites (Manual Tasks - Complete First)

**IMPORTANT:** This epic implements QR SCANNING only. QR code GENERATION is in Epic 5 (Product Registration). Verify:

```bash
# Epic 5: Products with QR codes must exist for testing
SELECT * FROM "Product" WHERE "qrCodeUrl" IS NOT NULL LIMIT 1;

# Epic 9: Consumer query page exists (QR scanner integrates into this page)
ls src/app/products/[id]/page.tsx
```

**Team Decision Required (15 minutes together - BEFORE starting Epic 11):**

- ✅ **QR Scanner Library Decision**:
  - **Chosen:** html5-qrcode (most popular, 2.7k stars, browser-based, no native app required)
  - **Alternative:** react-qr-reader (deprecated), qr-scanner (lower browser support)
  - **Installation:** `npm install html5-qrcode`
  - **Why:** Works on iOS Safari + Android Chrome, no app download, 95%+ scan success rate
- ✅ **Mobile Testing Device Setup**:
  - **iOS Testing:** Test on iPhone Safari (iOS 14+) with camera permissions
  - **Android Testing:** Test on Android Chrome (Android 9+) with camera permissions
  - **Fallback Device:** If no physical devices, test using Chrome DevTools mobile emulation + localhost tunneling (ngrok)
  - **Camera Permission Flow:** Test camera permission request, denial handling, manual entry fallback
- ✅ **QR Scanner UX Decision** (Integration with Epic 9):
  - **Landing Page UX:** Consumer query page shows BOTH "Scan QR Code" button AND "Enter Product ID" text input
  - **Scanner Placement:** QR scanner primary option (featured at top), manual entry fallback below
  - **Mobile-First:** QR scanner takes full screen width on mobile (<768px)
  - **Fallback Message:** If camera unavailable, show "Camera not available - Use manual entry below"

**Developer Setup (After Prerequisites):**

- html5-qrcode library installed: `npm install html5-qrcode`
- Mobile device with camera access OR ngrok for localhost tunneling
- Epic 9 consumer query page route exists: `/products/[id]`
- At least 1 product with QR code URL in database (from Epic 5)

#### Acceptance Criteria (Epic Level)

**Note:** QR code GENERATION criteria are in Epic 5 (Product Registration). This section covers QR SCANNING only.

**Frontend (QR Scanner Component - Integrated into Epic 9 Consumer Query Page):**

- ✅ QR scanner component implemented using html5-qrcode library
- ✅ Scanner opens fullscreen on mobile devices (<768px width)
- ✅ Scanner visible on consumer query landing page (primary option above manual entry)
- ✅ Camera permission request shown with clear explanation message
- ✅ Camera permission denial handled gracefully with fallback message
- ✅ Scanner auto-detects Product ID from QR code URL format (`https://foodtrace.app/products/{productId}`)
- ✅ Scanner extracts Product ID correctly from QR code URL
- ✅ Successful scan redirects to `/products/[id]` page automatically
- ✅ Scanner shows loading state during QR code detection
- ✅ Scanner shows success animation/feedback when QR detected
- ✅ Scanner shows error message if QR code format invalid or unrecognized
- ✅ Manual Product ID entry fallback visible below scanner
- ✅ Scanner works on iOS Safari (iOS 14+) with camera permissions
- ✅ Scanner works on Android Chrome (Android 9+) with camera permissions
- ✅ Scanner handles low-light conditions (acceptable scan rate in dim lighting)
- ✅ Scanner handles damaged/blurry QR codes (shows error message, prompts manual entry)
- ✅ QR scan success rate >95% on clean QR codes (tested on 10+ devices)
- ✅ Scanner stops camera stream when user navigates away (prevent battery drain)
- ✅ Scanner component responsive on all screen sizes (360px minimum width)
- ✅ Error handling: unsupported browser shows "QR scanner unavailable - Use manual entry" message

**Backend (Optional - QR Code URL Validation):**

- ✅ Optional backend validation endpoint: `POST /api/qr/validate` (validates Product ID from QR scan before redirect)
- ✅ Validation endpoint checks if Product ID exists in database
- ✅ Validation endpoint returns 404 if Product ID not found
- ✅ Frontend shows user-friendly error if Product ID invalid

**Mobile Testing Requirements:**

- ✅ Tested on iPhone Safari (iOS 14+) with front and rear cameras
- ✅ Tested on Android Chrome (Android 9+) with front and rear cameras
- ✅ Camera permission request flow tested (allow, deny, ask again)
- ✅ QR scanner performance tested on 3G network (acceptable loading time)
- ✅ Scanner tested with QR codes from Epic 5 (react-qr-code generated QR codes)
- ✅ Scanner tested with damaged QR codes (80% damaged → error message, manual fallback)
- ✅ Scanner accessibility tested (screen reader announces camera permission request)

#### Technical Approach

**Note:** QR code GENERATION code is in Epic 5 (Product Registration). This section covers QR SCANNING implementation only.

**QR Scanner Component (html5-qrcode):**

```typescript
// src/components/scanner/QRScanner.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useRouter } from 'next/navigation';

interface QRScannerProps {
  onScanSuccess?: (productId: string) => void;
  onScanError?: (error: string) => void;
}

export function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const router = useRouter();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    // Initialize scanner
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      /* verbose= */ false
    );

    // Scan success callback
    const onScanSuccessCallback = (decodedText: string) => {
      console.log(`QR Code detected: ${decodedText}`);

      // Extract Product ID from URL: https://foodtrace.app/products/{productId}
      const productId = extractProductId(decodedText);

      if (productId) {
        setScanning(false);
        scannerRef.current?.clear();

        // Call custom callback if provided
        if (onScanSuccess) {
          onScanSuccess(productId);
        } else {
          // Default: redirect to product page
          router.push(`/products/${productId}`);
        }
      } else {
        onScanError?.('Invalid QR code format. Please enter Product ID manually.');
      }
    };

    // Scan error callback (ignore continuous scan errors)
    const onScanErrorCallback = (errorMessage: string) => {
      // Ignore continuous scan errors (normal behavior)
      // Only log critical errors
      if (errorMessage.includes('NotAllowedError')) {
        onScanError?.('Camera permission denied. Please enable camera access or use manual entry.');
      }
    };

    // Render scanner
    scannerRef.current.render(onScanSuccessCallback, onScanErrorCallback);
    setScanning(true);

    // Cleanup on unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [router, onScanSuccess, onScanError]);

  return (
    <div className="qr-scanner-container">
      <div id="qr-reader" style={{ width: '100%' }}></div>
      {scanning && (
        <p className="text-sm text-gray-600 mt-2 text-center">
          Position QR code within the frame
        </p>
      )}
    </div>
  );
}

// Helper function to extract Product ID from QR code URL
function extractProductId(url: string): string | null {
  try {
    // Expected format: https://foodtrace.app/products/{productId}
    const match = url.match(/\/products\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Failed to extract Product ID:', error);
    return null;
  }
}
```

**Consumer Query Landing Page (Epic 9 Integration):**

```typescript
// src/app/products/page.tsx (Landing page with QR scanner + manual entry)
'use client';

import { useState } from 'react';
import { QRScanner } from '@/components/scanner/QRScanner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ProductQueryPage() {
  const [showScanner, setShowScanner] = useState(false);
  const [manualProductId, setManualProductId] = useState('');
  const router = useRouter();

  const handleManualSubmit = () => {
    if (manualProductId.trim()) {
      router.push(`/products/${manualProductId}`);
    }
  };

  return (
    <div className="container max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Scan Product QR Code</h1>

      {/* QR Scanner (Primary Option) */}
      {!showScanner ? (
        <Button
          onClick={() => setShowScanner(true)}
          size="lg"
          className="w-full mb-4"
        >
          📷 Scan QR Code
        </Button>
      ) : (
        <>
          <QRScanner />
          <Button
            onClick={() => setShowScanner(false)}
            variant="outline"
            className="w-full mt-4"
          >
            Cancel Scan
          </Button>
        </>
      )}

      {/* Manual Entry Fallback */}
      <div className="mt-8">
        <p className="text-sm text-gray-600 mb-2">
          Or enter Product ID manually:
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Enter Product ID"
            value={manualProductId}
            onChange={(e) => setManualProductId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
          />
          <Button onClick={handleManualSubmit}>Go</Button>
        </div>
      </div>
    </div>
  );
}
```

**Mobile Camera Permissions Handling:**

```typescript
// Check camera permissions before showing scanner
async function checkCameraPermissions(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach(track => track.stop()); // Stop immediately
    return true;
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      console.error('Camera permission denied');
      return false;
    }
    console.error('Camera not available:', error);
    return false;
  }
}
```

#### Dependencies

**Requires:**
- Epic 5 (Product Registration) - QR codes must be generated before scanning (Epic 5 creates QR codes, Epic 11 scans them)
- Epic 9 (Consumer Query Interface) - QR scanner integrates into consumer query landing page

**Blocks:** None (Epic 11 is optional enhancement, can be developed in parallel with Epic 9)

**Parallel Development:**
- Can develop in parallel with Epic 9 consumer query page
- QR scanner component can be integrated into Epic 9 landing page after both complete

#### Team Assignment

**Note:** QR code GENERATION is in Epic 5 (TaiSheng generates QR codes server-side during product registration). This epic focuses on QR SCANNING only.

**TaiSheng (0.5-1 hour - Backend Support, Optional):**

- Optional QR validation endpoint (0.5 hours)
  - POST /api/qr/validate endpoint (validates Product ID before redirect)
  - Check if Product ID exists in database
  - Return 404 if Product ID not found
- Testing support (0.5 hours)
  - Generate test QR codes using Epic 5 code
  - Test QR code URL format with YiLing

**YiLing (3-5 hours - Frontend Lead):**

- QR scanner component implementation (2-3 hours)
  - Install html5-qrcode library
  - Implement QRScanner component with camera permissions
  - Integrate scanner into Epic 9 consumer query landing page
  - Error handling (camera denial, invalid QR format)
  - Loading states and success feedback
- Mobile device testing (1.5-2 hours)
  - Test on iOS Safari (iOS 14+) with camera permissions
  - Test on Android Chrome (Android 9+) with camera permissions
  - Test camera permission flow (allow, deny, ask again)
  - Test damaged/blurry QR codes
  - Test manual Product ID entry fallback
  - Achieve >95% QR scan success rate on clean QR codes
- Cross-browser testing (0.5 hours)
  - Test on multiple browsers (Safari, Chrome, Firefox)
  - Fallback message for unsupported browsers
  - Accessibility testing (screen reader)

#### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| QR scanner fails on iOS Safari (camera permission issues) | Test camera permission flow thoroughly on iOS 14+, show clear permission request message, provide manual entry fallback |
| QR scanner fails on Android Chrome (low-light conditions) | Use html5-qrcode library (handles low-light better than alternatives), show flashlight hint if available, manual entry fallback |
| Camera permission denied by user | Show user-friendly error message ("Camera access denied - Please use manual entry below"), make manual entry prominent |
| QR code format incompatible (Epic 5 generates different format) | Use standard QR code URL format in both epics (`https://foodtrace.app/products/{productId}`), integration testing between Epic 5 and Epic 11 |
| QR scanner unavailable on desktop browsers | Show "QR scanner requires mobile device with camera - Use manual entry" message, hide scanner button on desktop |
| Damaged/blurry QR codes fail to scan | Show error message after 5 seconds of failed scanning, prompt manual Product ID entry, include Product ID text below QR code (Epic 5) |
| Battery drain from camera stream | Stop camera stream immediately after successful scan, add "Cancel Scan" button to manually stop camera |
| QR scanner performance slow on 3G network | Minimal library bundle size (html5-qrcode is lightweight ~50KB), lazy-load scanner component, cache scanner library |
| Epic 9 consumer query page not ready (integration blocked) | Develop QR scanner component standalone first, integrate into Epic 9 landing page after Epic 9 complete (parallel development) |
| No physical devices for testing (team has no iPhone/Android) | Use ngrok for localhost tunneling, test using team members' personal devices, fallback to Chrome DevTools mobile emulation |
| QR scan success rate <95% (acceptance criteria not met) | Use standard QR code format with error correction level M (Epic 5), test on 10+ devices, optimize scanner fps and qrbox size |
