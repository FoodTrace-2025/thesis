# UI Components (Chakra UI Patterns)

**Purpose:** Define reusable UI components, Chakra UI patterns, and component library.

---

## Component Library Strategy

**Design System:** Chakra UI v2 (accessible, responsive, themeable)
**Component Types:**
1. **Shared Components:** Used across all portals (Layout, Button, Modal)
2. **Role-Specific Components:** Used in specific portal (ProductRegistrationForm for producers)
3. **Third-Party Integrations:** QR scanner, charts, blockchain widgets

---

## Shared Components

### Layout Components

**Layout.tsx** - Main page wrapper
```typescript
<Layout role="PRODUCER">
  <PageContent />
</Layout>
```

**Header.tsx** - Navigation bar with role-based menu
- Logo/brand
- Role-specific navigation (Producer: Dashboard, Register | Consumer: Scan)
- User menu (Profile, Logout)

**Sidebar.tsx** - Left sidebar navigation
- Collapsible on mobile
- Role-based menu items
- Active route highlighting

**Footer.tsx** - Site footer
- Copyright, links, contact

---

### Form Components

**FormInput.tsx** - Chakra Input with validation
```typescript
<FormInput
  label="Product Name"
  name="name"
  placeholder="Enter product name"
  error={errors.name}
  required
/>
```

**Features:**
- Automatic error display
- Required field indicator (*)
- Accessibility (ARIA labels)
- Responsive width

**FormTextarea.tsx** - Multi-line text input
**FormSelect.tsx** - Dropdown select
**FormDatePicker.tsx** - Date selection with validation
**FormFileUpload.tsx** - Image upload with preview

---

### Feedback Components

**LoadingSpinner.tsx** - Loading indicator
```typescript
<LoadingSpinner
  size="lg"
  message="Waiting for blockchain confirmation..."
/>
```

**ErrorBoundary.tsx** - Error fallback UI
```typescript
<ErrorBoundary fallback={<ErrorMessage />}>
  <ProductDetails />
</ErrorBoundary>
```

**Toast.tsx** - Notification toasts
```typescript
toast({
  title: 'Product registered!',
  description: 'Your product is now on the blockchain.',
  status: 'success',
  duration: 5000,
  isClosable: true,
});
```

---

## Producer Components

### ProductRegistrationForm.tsx

**Multi-step form for product registration**

**Steps:**
1. Basic Information (name, origin, harvest date)
2. Product Details (description, category)
3. Image Upload (optional, max 5MB)
4. Certification (optional, organic/fair trade)
5. Review & Submit

**Features:**
- Step indicator progress bar
- Form validation (client + server)
- Image preview before upload
- Blockchain transaction status (pending → confirmed)

**Component Structure:**
```typescript
export function ProductRegistrationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});

  return (
    <Box>
      <StepIndicator currentStep={step} totalSteps={5} />

      {step === 1 && <BasicInfoStep data={formData} onNext={(data) => { setFormData(data); setStep(2); }} />}
      {step === 2 && <ProductDetailsStep ... />}
      {step === 3 && <ImageUploadStep ... />}
      {step === 4 && <CertificationStep ... />}
      {step === 5 && <ReviewStep data={formData} onSubmit={handleSubmit} />}
    </Box>
  );
}
```

---

### QRCodeDisplay.tsx

**Display QR code with download buttons**

**Features:**
- SVG QR code (react-qr-code)
- Download as PNG button
- Download as SVG button
- Copy link to clipboard button
- Responsive size (256×256px on desktop, 200×200px on mobile)

**Component:**
```typescript
import QRCode from 'react-qr-code';

export function QRCodeDisplay({ productId, qrCodeUrl }: Props) {
  const consumerUrl = `https://foodtrace.onrender.com/consumer/product/${productId}`;

  return (
    <Box>
      <QRCode value={consumerUrl} size={256} level="H" />

      <ButtonGroup mt={4}>
        <Button onClick={handleDownloadPNG}>Download PNG</Button>
        <Button onClick={handleDownloadSVG}>Download SVG</Button>
        <Button onClick={() => navigator.clipboard.writeText(consumerUrl)}>
          Copy Link
        </Button>
      </ButtonGroup>
    </Box>
  );
}
```

---

### ProductTable.tsx

**Paginated product list with search/filter**

**Features:**
- Search by product name/origin
- Filter by date range, status
- Sort by date, name, blockchain ID
- Pagination (20 items per page)
- Export to CSV button

**Columns:**
- Product Name (link to details)
- Origin
- Harvest Date
- Blockchain ID
- Status (Registered, Transferred, Sold)
- Actions (View, Transfer, QR Code)

---

## Distributor Components

### QRScanner.tsx

**QR code scanner using device camera**

**Features:**
- Camera permission request
- Back camera on mobile (`facingMode: 'environment'`)
- 10 FPS scanning rate
- Success feedback (vibration + sound)
- Manual product ID input fallback

**Component:**
```typescript
import { Html5Qrcode } from 'html5-qrcode';

export function QRScanner({ onScan }: Props) {
  const [scanning, setScanning] = useState(false);

  const startScanning = async () => {
    const html5QrCode = new Html5Qrcode("qr-reader");

    await html5QrCode.start(
      { facingMode: "environment" }, // Back camera
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        onScan(extractProductId(decodedText));
        html5QrCode.stop();
      },
      (error) => console.warn(error)
    );
  };

  return (
    <Box>
      <div id="qr-reader" style={{ width: '100%' }} />
      <Button onClick={startScanning} disabled={scanning}>
        {scanning ? 'Scanning...' : 'Start Scanning'}
      </Button>
    </Box>
  );
}
```

---

### TraceRecordForm.tsx

**Add trace record to product**

**Fields:**
- Action (dropdown: RECEIVED, QUALITY_CHECK, SHIPPED, STOCKED, SOLD)
- Location (text input, GPS autocomplete)
- Notes (textarea, max 500 characters)

**Features:**
- Real-time blockchain transaction status
- Optimistic UI update (show pending record immediately)
- Email notification toggle (notify next owner)

---

### ProductTimeline.tsx

**Vertical timeline showing complete product journey**

**Features:**
- Timeline events (product registered → received → shipped → sold)
- Actor information (who performed action)
- Timestamp (formatted as "2 hours ago" or "Nov 15, 2025")
- Blockchain verification link for each event
- Temperature chart inline (if sensor data available)

**Component:**
```typescript
export function ProductTimeline({ traceRecords }: Props) {
  return (
    <VStack align="stretch" spacing={4}>
      {traceRecords.map((record, index) => (
        <Box key={record.id} position="relative">
          {index < traceRecords.length - 1 && (
            <Box
              position="absolute"
              left="19px"
              top="40px"
              bottom="-40px"
              width="2px"
              bg="blue.500"
            />
          )}

          <HStack>
            <Circle size="40px" bg="blue.500" color="white">
              <Icon as={getIcon(record.action)} />
            </Circle>

            <Box flex="1">
              <Text fontWeight="bold">{record.action}</Text>
              <Text fontSize="sm" color="gray.600">{record.location}</Text>
              <Text fontSize="xs" color="gray.500">{formatDate(record.createdAt)}</Text>
              {record.notes && <Text mt={2}>{record.notes}</Text>}
              {record.txHash && (
                <Link href={`https://sepolia.etherscan.io/tx/${record.txHash}`} isExternal>
                  Verify on Blockchain
                </Link>
              )}
            </Box>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
}
```

---

## Consumer Components

### ConsumerProductView.tsx

**Read-only product journey display (wallet-free)**

**Sections:**
1. **Product Header:** Name, origin, image, producer
2. **Journey Timeline:** Complete supply chain history
3. **Temperature Chart:** Sensor data over time (if available)
4. **Certifications:** Organic, fair trade badges
5. **Blockchain Verification:** Link to Etherscan

**Features:**
- No wallet required (read-only blockchain queries)
- Mobile-responsive design
- Accessibility (WCAG 2.1 AA)
- Social sharing (WhatsApp, Facebook, Twitter)

---

### TemperatureChart.tsx

**Line chart showing sensor data over time**

**Features:**
- Line chart (Chart.js or Recharts)
- Color-coded alert zones (green <8°C, yellow 8-10°C, red >10°C)
- Hover tooltip (temperature, humidity, timestamp)
- Time range selector (Last 24h, Last 7 days, All time)
- Export to CSV button

**Component:**
```typescript
import { Line } from 'react-chartjs-2';

export function TemperatureChart({ sensorReadings }: Props) {
  const data = {
    labels: sensorReadings.map(r => formatDate(r.createdAt)),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: sensorReadings.map(r => r.temperature),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        segment: {
          borderColor: (ctx) => {
            const temp = ctx.p1.parsed.y;
            if (temp > 10) return 'rgb(255, 0, 0)'; // Red for CRITICAL
            if (temp > 8) return 'rgb(255, 165, 0)'; // Orange for WARNING
            return 'rgb(75, 192, 192)'; // Green for NORMAL
          },
        },
      },
    ],
  };

  return <Line data={data} options={{ responsive: true }} />;
}
```

---

### BlockchainVerifyButton.tsx

**Link to Etherscan for trustless verification**

**Features:**
- Button opens Etherscan in new tab
- Shows transaction details (block number, gas used, timestamp)
- Educates consumers about blockchain verification

---

## Admin Components

### ScenarioButtons.tsx

**IoT simulator scenario selector**

**Buttons:**
- Normal (2-4°C) - Green button
- Warning (8-10°C) - Yellow button
- Critical (>10°C) - Red button

**Features:**
- Real-time preview of generated data
- Auto-mode toggle (generate every N seconds)
- Batch generation (generate multiple readings)

---

### Chakra UI Theme Customization

**Custom Theme:**
```typescript
// theme/index.ts
import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    brand: {
      50: '#e3f2fd',
      100: '#bbdefb',
      // ... more shades
      900: '#0d47a1',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
});
```

---

**Last Updated:** 2025-11-20 (Week 0 Complete)
