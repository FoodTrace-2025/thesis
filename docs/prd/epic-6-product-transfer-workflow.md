### Epic 6: Product Transfer Workflow

**Priority:** 🟡 Should Have
**Estimated Time:** 4-6 hours (Backend 2-3h + Frontend 2-3h)
**Assigned:** TaiSheng (Backend), YiLing (Frontend)
**Timeline:** Week 5-6
**Dependencies:** Epic 4 (Component Library), Epic 5 (Product Registration), Epic 2 (Company/User System)

#### Epic Description

Automate product handoff workflow between supply chain participants (Producer → Distributor → Retailer). System sends email notifications and dashboard alerts when products are transferred. Tracks product status changes through supply chain. Eliminates manual email coordination and provides clear audit trail.

#### Business Value

- **Professional UX:** Matches modern supply chain platforms (SAP, Microsoft Dynamics)
- **Time Savings:** Automatic notifications vs manual emails
- **Reduced Errors:** Clear pending shipments dashboard, no products forgotten
- **Audit Trail:** Blockchain + database track who transferred to whom, when

#### User Stories (High-Level)

- As a **producer**, I want to **select distributor from list** and transfer product
- As a **producer**, I want **distributor automatically notified via email** so they expect shipment
- As a **distributor**, I want to **see pending shipments dashboard** so I know what's arriving
- As a **distributor**, I want to **click "Receive Product"** to confirm receipt
- As a **distributor**, I want to **transfer to retailer** with same workflow
- As a **retailer**, I want **same workflow** for receiving from distributor

#### User Prerequisites (Manual Tasks - Complete First)

**IMPORTANT:** This epic depends on Epic 4 (Component Library), Epic 5 (Product Registration), and Epic 2 email service decision. Verify:

```bash
# Epic 5: Products must exist in database
SELECT * FROM "Product" LIMIT 1; # Verify at least one product registered

# Epic 4: Chakra UI components available (used directly, no wrappers)
# Modal, Select, Button from @chakra-ui/react - already configured in theme.ts
```

**Team Decision Confirmation (From Epic 2 - Verify Before Starting):**

- ✅ **Email Notification Service Chosen** (Epic 2 user prerequisite):
  - If Supabase Email chosen: Verify 3 emails/hour limit acceptable for transfers
  - If SendGrid chosen: Verify API key in .env.local: `SENDGRID_API_KEY=...`
  - If console logging chosen: Acknowledge no actual emails sent (acceptable for Epic 6 MVP testing)
- ✅ **Email Template Approved** (see Technical Approach below):
  - Review HTML/text email template with team
  - Confirm company branding (logo, colors) or use plain text
  - Test email delivery with test transfer

**Developer Setup (After Prerequisites):**

- No additional external accounts needed (uses Epic 2 email service setup)
- Prisma Notification model added to schema (see Technical Approach)

#### Acceptance Criteria (Epic Level)

**Backend API (POST /api/products/:id/transfer):**

- ✅ NextAuth.js session validation (user must be authenticated)
- ✅ User role validation (only PRODUCER can transfer to DISTRIBUTOR, only DISTRIBUTOR can transfer to RETAILER)
- ✅ Transfer endpoint accepts (productId, toCompanyId, toUserId, notes)
- ✅ Product ownership validation (only current holder can transfer product)
- ✅ Target company validation (PRODUCER → DISTRIBUTOR only, DISTRIBUTOR → RETAILER only)
- ✅ Product status updated based on transfer direction:
  - Producer → Distributor: `REGISTERED` → `IN_TRANSIT_TO_DISTRIBUTOR`
  - Distributor receives: `IN_TRANSIT_TO_DISTRIBUTOR` → `RECEIVED_BY_DISTRIBUTOR`
  - Distributor → Retailer: `RECEIVED_BY_DISTRIBUTOR` → `IN_TRANSIT_TO_RETAILER`
  - Retailer receives: `IN_TRANSIT_TO_RETAILER` → `RECEIVED_BY_RETAILER`
- ✅ Notification model entry created in database (userId, type, productId, message, read: false)
- ✅ Email notification sent to recipient using Epic 2 email service
- ✅ Email delivery status logged (sent, failed, skipped)
- ✅ Audit log entry created (action: PRODUCT_TRANSFERRED, fromCompanyId, toCompanyId, productId)
- ✅ Error handling: transfer to invalid company returns 400 error
- ✅ Error handling: transfer already in-transit returns 409 conflict error

**Backend API (POST /api/products/:id/receive):**

- ✅ Endpoint for recipient to confirm product receipt
- ✅ Updates product status to RECEIVED_BY_DISTRIBUTOR or RECEIVED_BY_RETAILER
- ✅ Marks notification as read (read: true)
- ✅ Audit log entry created (action: PRODUCT_RECEIVED)

**Frontend (Transfer Workflow UI):**

- ✅ Producer dashboard shows "Transfer Product" button for each registered product
- ✅ Transfer modal opens with dropdown to select distributor company (filtered by type: DISTRIBUTOR)
- ✅ Transfer modal shows dropdown to select specific user within distributor company
- ✅ Transfer modal includes optional notes textarea
- ✅ Loading state shown during transfer API call
- ✅ Success toast notification shown when transfer completes
- ✅ Distributor/Retailer dashboard shows "Pending Shipments" section (unread notifications)
- ✅ "Pending Shipments" shows product name, origin company, transfer date
- ✅ "Receive Product" button confirms receipt and updates product status
- ✅ Error handling: transfer to invalid company shows error message
- ✅ Error handling: email delivery failure shows warning but allows transfer to succeed

**Email Notification Template:**

- ✅ Email subject line: "New shipment: [Product Name] from [Company Name]"
- ✅ Email body includes product details (name, origin, harvest date)
- ✅ Email body includes sender company name and user who initiated transfer
- ✅ Email body includes call-to-action link: "Login to FoodTrace to confirm receipt"
- ✅ Email body includes Product ID for reference

#### Technical Approach

**Notification Model (Prisma Schema):**

```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String   // "INCOMING_SHIPMENT", "PRODUCT_RECEIVED", "TRANSFER_COMPLETE"
  productId String
  message   String   // "New shipment from Hirsimäki Farm"
  read      Boolean  @default(false)
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id])
  product Product @relation(fields: [productId], references: [id])

  @@index([userId, read])
  @@index([createdAt])
}
```

**Email Template (HTML + Text):**

```typescript
// src/lib/email/transfer-notification-template.ts
export function transferNotificationEmail(data: {
  recipientName: string;
  productName: string;
  senderCompanyName: string;
  senderUserName: string;
  productId: string;
  origin: string;
  harvestDate: string;
  notes?: string;
}) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>New Shipment Notification</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
    <h2 style="color: #2d3748;">New Shipment Received</h2>
    <p>Hi ${data.recipientName},</p>
    <p>${data.senderUserName} from <strong>${data.senderCompanyName}</strong> has transferred a product to you:</p>

    <div style="background-color: white; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
      <h3 style="margin-top: 0;">${data.productName}</h3>
      <p><strong>Product ID:</strong> ${data.productId}</p>
      <p><strong>Origin:</strong> ${data.origin}</p>
      <p><strong>Harvest Date:</strong> ${data.harvestDate}</p>
      ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
    </div>

    <p>Please login to FoodTrace to confirm receipt of this shipment.</p>
    <a href="https://foodtrace.app/dashboard" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">
      Confirm Receipt
    </a>

    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
      This is an automated notification from FoodTrace.
    </p>
  </div>
</body>
</html>
`;

  const text = `
New Shipment Received

Hi ${data.recipientName},

${data.senderUserName} from ${data.senderCompanyName} has transferred a product to you:

Product: ${data.productName}
Product ID: ${data.productId}
Origin: ${data.origin}
Harvest Date: ${data.harvestDate}
${data.notes ? `Notes: ${data.notes}` : ''}

Please login to FoodTrace to confirm receipt: https://foodtrace.app/dashboard

---
This is an automated notification from FoodTrace.
`;

  return { html, text };
}
```

**Transfer API:**

```typescript
// POST /api/products/:id/transfer
export async function POST(req, { params }) {
  const session = await getServerSession();
  const { toCompanyId, toUserId, notes } = req.body;

  // Validate user role (PRODUCER → DISTRIBUTOR, DISTRIBUTOR → RETAILER)
  const product = await db.product.findUnique({ where: { id: params.id } });
  const targetCompany = await db.company.findUnique({ where: { id: toCompanyId } });

  let newStatus: string;
  if (session.user.role === "PRODUCER" && targetCompany.type === "DISTRIBUTOR") {
    newStatus = "IN_TRANSIT_TO_DISTRIBUTOR";
  } else if (session.user.role === "DISTRIBUTOR" && targetCompany.type === "RETAILER") {
    newStatus = "IN_TRANSIT_TO_RETAILER";
  } else {
    return Response.json({ error: "Invalid transfer direction" }, { status: 400 });
  }

  // 1. Update product status
  await db.product.update({
    where: { id: params.id },
    data: {
      status: newStatus,
      currentHolderId: toCompanyId,
    },
  });

  // 2. Create notification
  await db.notification.create({
    data: {
      userId: toUserId,
      type: "INCOMING_SHIPMENT",
      productId: params.id,
      message: `New shipment from ${session.user.company.name}`,
      read: false,
    },
  });

  // 3. Send email
  const emailTemplate = transferNotificationEmail({
    recipientName: toUser.name,
    productName: product.name,
    senderCompanyName: session.user.company.name,
    senderUserName: session.user.name,
    productId: product.id,
    origin: product.origin,
    harvestDate: product.harvestDate,
    notes: notes,
  });

  await sendEmail({
    to: toUser.email,
    subject: `New shipment: ${product.name} from ${session.user.company.name}`,
    html: emailTemplate.html,
    text: emailTemplate.text,
  });

  // 4. Audit log
  await db.auditLog.create({
    data: {
      action: "PRODUCT_TRANSFERRED",
      userId: session.user.id,
      companyId: session.user.companyId,
      details: { productId: params.id, toCompanyId, toUserId },
    },
  });

  return Response.json({ success: true });
}
```

**Dashboard Pending Shipments:**

```typescript
<DashboardSection title="Pending Shipments" count={pendingCount}>
  {pendingShipments.map((product) => (
    <ProductCard key={product.id}>
      <Text>{product.name}</Text>
      <Text>From: {product.company.name}</Text>
      <Button onClick={() => receiveProduct(product.id)}>
        Receive Product
      </Button>
    </ProductCard>
  ))}
</DashboardSection>
```

#### Dependencies

**Requires:**
- Epic 2 (Company/User Management) - Email service decision, company/user data models
- Epic 4 (Component Library) - Chakra UI theme configured (Modal, Select, Button used directly from @chakra-ui/react)
- Epic 5 (Product Registration) - Products must exist before transfers can occur

**Blocks:**
- None (Epic 6 is optional enhancement, but improves Epic 7 supply chain tracking workflow)

**Enhancement:**
- Epic 7 (Supply Chain Tracking) - Transfer workflow creates audit trail for supply chain visualization

#### Team Assignment

**TaiSheng (3-4 hours - Backend Lead):**

- Transfer API endpoint (1.5 hours)
  - POST /api/products/:id/transfer implementation
  - Role validation (PRODUCER → DISTRIBUTOR, DISTRIBUTOR → RETAILER)
  - Product status updates based on transfer direction
  - Error handling (400 for invalid company, 409 for already in-transit)
- Receive API endpoint (0.5 hours)
  - POST /api/products/:id/receive implementation
  - Update product status to RECEIVED_BY_DISTRIBUTOR or RECEIVED_BY_RETAILER
- Email notification integration (1 hour)
  - Implement transferNotificationEmail template function
  - Integrate with Epic 2 email service (SendGrid/Supabase/console)
  - Email delivery status logging
- Notification model and dashboard queries (1 hour)
  - Add Notification model to Prisma schema
  - Implement GET /api/notifications endpoint for pending shipments
  - Audit log entries for transfers and receipts

**YiLing (2-3 hours - Frontend Lead):**

- Transfer modal UI (1.5 hours)
  - "Transfer Product" button on producer dashboard
  - Modal with company/user dropdowns (filtered by role)
  - Optional notes textarea
  - Loading states and success/error toasts
- Pending shipments dashboard (1-1.5 hours)
  - "Pending Shipments" section on distributor/retailer dashboard
  - Product cards showing name, origin company, transfer date
  - "Receive Product" button with confirmation
  - Mark notification as read after receipt

#### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Email not delivered | Use reliable service (SendGrid/Supabase), log delivery status (sent, failed, skipped), show warning but allow transfer to succeed |
| User doesn't check dashboard | Email notification as primary method with call-to-action link, dashboard shows notification badge count |
| Transfer to wrong company | Confirmation modal showing target company name clearly, role validation prevents invalid transfers (PRODUCER → DISTRIBUTOR only) |
| Transfer already in-transit | 409 conflict error returned, show error message to user, prevent duplicate transfers |
| Invalid transfer direction (e.g., PRODUCER → RETAILER) | Role validation returns 400 error, UI dropdowns filter companies by valid role (producers only see distributors) |
| Email service not configured (Epic 2 decision pending) | Fail fast with clear error message, user prerequisite ensures decision made before Epic 6 starts |
| Notification model missing in database | Prisma migration check before Epic 6 starts, fail fast if migration not applied |
| Epic 4 components not ready (Modal, Select) | Epic 4 completes Week 4, Epic 6 starts Week 5, dependencies enforced by timeline |
| User receives product without checking notification | Audit log still records receipt timestamp, acceptable for MVP (manual confirmation required) |
| Email template breaks on long product names | CSS max-width + text-overflow ellipsis, test with 100+ character product names |
| Concurrent transfers (race condition) | Database transaction isolation ensures status updates are atomic, use row-level locking if needed |
