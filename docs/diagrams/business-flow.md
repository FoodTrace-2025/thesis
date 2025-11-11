# Business Flow Diagram

**Purpose**: Complete supply chain journey from Producer to Consumer

**Use Cases**:
- Kickoff meeting presentation
- Explaining system to non-technical stakeholders
- Thesis Chapter 1 (Introduction)
- Demo videos

---

## Supply Chain Journey (4 Steps + Blockchain)

```mermaid
graph LR
    subgraph S1["Step 1: Registration"]
        Producer["🌾 Producer<br/>registers Product<br/><br/>• Product name<br/>• Origin location<br/>• Harvest date<br/>• Organic cert<br/>• Upload photo"]
    end

    subgraph S2["Step 2: Distribution"]
        Distributor["🚛 Distributor Adds<br/>Transport Data<br/><br/>• Receive product<br/>• Add location<br/>• Record temperature<br/>• Quality check<br/>• Timestamp"]
    end

    subgraph S3["Step 3: Retail"]
        Retailer["🏪 Retailer<br/>Scans QR Stock<br/><br/>• Scan QR code<br/>• Confirm receipt<br/>• Stock product<br/>• Update status<br/>• Display to consumers"]
    end

    subgraph S4["Step 4: Consumer Query"]
        Consumer["👤 Consumer Scans<br/>& Views Journey<br/><br/>• Scan QR (wallet-free)<br/>• View full history<br/>• Check temperature<br/>• Verify authenticity<br/>• See all participants"]
    end

    subgraph BC["🔗 Blockchain"]
        Blockchain["Immutable Records<br/><br/>• Product registration<br/>• All trace records<br/>• Sensor data<br/>• Timestamps<br/>• Cannot be altered"]
    end

    Producer -->|"QR Code Scan"| Distributor
    Distributor -->|"QR Code Scan"| Retailer
    Retailer -->|"QR Code Scan"| Consumer

    Producer -.->|"Write to blockchain"| Blockchain
    Distributor -.->|"Write to blockchain"| Blockchain
    Retailer -.->|"Write to blockchain"| Blockchain
    Consumer -.->|"Read from blockchain"| Blockchain

    style S1 fill:#c8e6c9
    style S2 fill:#bbdefb
    style S3 fill:#ffccbc
    style S4 fill:#e1bee7
    style BC fill:#fff9c4
```

---

## Key Features Demonstrated

### 1. QR Code-Based Tracking
- Each product gets unique QR code at registration
- Same QR code used throughout entire journey
- Simple scan connects to blockchain data

### 2. Multi-Role System
- **Producer** (Wallet): Registers product, generates QR
- **Distributor** (Wallet): Adds transport data, temperature logs
- **Retailer** (Wallet): Confirms receipt, stocks product
- **Consumer** (No Wallet): Views complete journey, wallet-free access

### 3. Blockchain Integration
- Solid lines (→): Physical QR code scans
- Dotted lines (-.->): Blockchain read/write operations
- All data immutable once written
- Transparent verification for consumers

### 4. Data Flow
- **Write operations**: Producer, Distributor, Retailer (requires MetaMask wallet)
- **Read operations**: Consumer (wallet-free, just scan QR)
- **Storage**: Critical data on-chain, metadata off-chain (hybrid approach)

---

## Example Product Journey

**Product**: Organic Blueberries from Northern Finland

1. **Producer (Hirsimäki Farm)**:
   - Registers: "Organic Wild Blueberries, Yli-Ii, Finland"
   - Harvest date: July 15, 2025
   - Uploads photo of blueberries
   - Blockchain records: Product ID #001
   - QR code printed on packaging

2. **Distributor (Oulu Logistics)**:
   - Scans QR code at pickup
   - Records: "Received July 16, 2025, 06:00"
   - Temperature during transport: 2-4°C (cold chain maintained)
   - Location: En route to Helsinki
   - Blockchain records: Trace #001-002

3. **Retailer (K-Market Helsinki)**:
   - Scans QR code at delivery
   - Records: "Stocked July 17, 2025, 15:00"
   - Location: Refrigerated section
   - Product available for sale
   - Blockchain records: Trace #001-003

4. **Consumer (Sanna, Helsinki resident)**:
   - Scans QR code in store with smartphone
   - Sees complete journey: Farm → Transport → Store
   - Views temperature history: All readings 2-4°C ✅
   - Verifies organic certification
   - Trusts product authenticity
   - NO wallet or registration required

---

## Presentation Script

**For Kickoff Meeting (2-3 minutes):**

"Let me walk you through how a consumer would experience this system:

1. **At the farm**: Producer registers organic blueberries, blockchain creates permanent record, QR code generated
2. **During transport**: Distributor scans QR, adds location and temperature data to blockchain
3. **At the store**: Retailer scans QR, confirms product stocked
4. **Consumer experience**: Scan QR with phone → instantly see complete journey from farm to shelf → verify authenticity → NO wallet needed

The key innovation is **wallet-free consumer access**. Traditional blockchain apps require crypto wallets, creating friction. Our system solves this: businesses use wallets (Producer, Distributor, Retailer), but consumers just scan and view."

---

## Technical Implementation Notes

**QR Code Libraries**:
- Generation: `react-qr-code` (npm package)
- Scanning: `html5-qrcode` (works on iOS/Android browsers)
- Format: QR encodes Product ID → links to `/products/[id]` page

**Blockchain Transactions**:
- `registerProduct()` - Producer creates product (Gas: <100k)
- `addTraceRecord()` - Distributor/Retailer add records (Gas: <80k)
- `addSensorData()` - Temperature/humidity logs (Gas: <60k)

**Wallet Requirements**:
- Producer, Distributor, Retailer: MetaMask required (RainbowKit UI)
- Consumer: No wallet, reads from blockchain via API

---

## Diagram Export

**For Excalidraw**:
1. Copy entire Mermaid code block above
2. Paste into Excalidraw canvas
3. Excalidraw will auto-render

**For Thesis Document**:
1. Open https://mermaid.live/
2. Paste Mermaid code
3. Export as PNG (300 DPI for print quality)
4. Insert into thesis Chapter 1 or Chapter 4

**For Presentation Slides**:
1. Export as SVG (scalable, no pixelation)
2. Import into PowerPoint/Google Slides
3. Use for thesis defense presentation

---

**Last Updated**: November 10, 2025
**Created by**: Sam Chou
**Session**: Diagram optimization for kickoff meeting
