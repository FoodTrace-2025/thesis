### Epic 6: Product Transfer Workflow

**Priority:** 🟡 Should Have
**Estimated Time:** 4-6 hours (Backend 2-3h + Frontend 2-3h)
**Assigned:** TaiSheng (Backend), YiLing (Frontend)
**Timeline:** Week 4-6
**Dependencies:** Epic 5 (Product Registration)

#### Epic Description

Automate product handoff workflow between supply chain participants. Producer transfers product to distributor, system sends email notification + dashboard alert. Distributor receives product, updates status. Same flow repeats for distributor → retailer transfer. Eliminates manual email coordination.

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

#### Acceptance Criteria (Epic Level)

**Backend:**

- ✅ `POST /api/products/:id/transfer` endpoint
- ✅ Transfer specifies target company + user
- ✅ Email notification sent to recipient (SendGrid or Supabase Email)
- ✅ Dashboard notification created in database
- ✅ Product status updated (Draft → In Transit → Received)
- ✅ Audit log records transfer (from/to/when)

**Frontend:**

- ✅ Producer dashboard shows "Transfer Product" button
- ✅ Transfer modal: Select distributor company, select user
- ✅ Loading state during transfer
- ✅ Distributor dashboard shows "Pending Shipments" section
- ✅ "Receive Product" button confirms receipt
- ✅ Email notification template clear and actionable

#### Technical Approach

**Transfer API:**

```typescript
// POST /api/products/:id/transfer
export async function POST(req, { params }) {
  const { toCompanyId, toUserId, notes } = req.body;

  // 1. Update product status
  await db.product.update({
    where: { id: params.id },
    data: {
      status: "IN_TRANSIT",
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
  await sendEmail({
    to: toUser.email,
    subject: `New shipment: ${product.name}`,
    body: `Login to FoodTrace to receive it. Product ID: ${params.id}`,
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

**Requires:** Epic 5 (products must exist), Epic 2 (company/user system)
**Blocks:** None (enhancement to Epic 7 workflow)

#### Team Assignment

**TaiSheng (2-3 hours):**

- Transfer API endpoint (1 hour)
- Email notification service (1 hour)
- Dashboard notification system (1 hour)

**YiLing (2-3 hours):**

- Transfer modal UI (1 hour)
- Pending shipments dashboard (1-2 hours)

#### Risks & Mitigations

| Risk                         | Mitigation                                           |
| ---------------------------- | ---------------------------------------------------- |
| Email not delivered          | Use reliable service (SendGrid), log delivery status |
| User doesn't check dashboard | Email notification as primary method                 |
| Transfer to wrong company    | Confirmation modal, show company name clearly        |
