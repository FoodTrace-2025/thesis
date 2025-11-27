# API Specification

**Purpose:** Define REST API endpoints, request/response formats, authentication, and error codes.

---

## API Overview

**Base URL:** `https://foodtrace.onrender.com/api`
**Protocol:** HTTPS only
**Content-Type:** `application/json`
**Authentication:** JWT session tokens (NextAuth.js)

---

## Authentication

**Session Management:**
- **Provider:** NextAuth.js with JWT strategy
- **Session Duration:** 24 hours
- **Cookie Name:** `foodtrace-session`
- **Cookie Attributes:** `httpOnly`, `sameSite: strict`, `secure` (production)

**Login:**
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "producer@hirsimakifarm.fi",
  "password": "SecurePassword123!"
}

Response 200 OK:
{
  "user": {
    "id": "uuid-123",
    "email": "producer@hirsimakifarm.fi",
    "name": "Matti Virtanen",
    "role": "PRODUCER",
    "companyId": "uuid-company-1"
  }
}
```

**Logout:**
```http
POST /api/auth/signout
```

---

## Product Endpoints

### POST /api/products/register

**Purpose:** Register new product on blockchain and database

**Authentication:** Required (PRODUCER role)

**Request:**
```http
POST /api/products/register
Content-Type: multipart/form-data
Authorization: Session cookie

{
  "name": "Organic Milk",
  "origin": "Oulu, Finland",
  "harvestDate": "2025-11-15T00:00:00.000Z",
  "description": "Fresh organic milk from grass-fed cows",
  "image": <File>  // Optional, max 5MB, JPEG/PNG/WebP
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "productId": "uuid-product-123",
  "blockchainId": 42,
  "transactionHash": "0x8a791620dd6260079bf849dc5567adc3f2fdc318...",
  "qrCodeUrl": "https://storage.supabase.co/qr-codes/product-123.png"
}
```

**Response 400 Bad Request:**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "harvestDate",
      "message": "Harvest date cannot be in the future"
    }
  ]
}
```

**Response 401 Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```

**Response 403 Forbidden:**
```json
{
  "error": "Forbidden: Only producers can register products"
}
```

---

### GET /api/products/:id

**Purpose:** Fetch product details (blockchain + database)

**Authentication:** Optional (public for consumers)

**Request:**
```http
GET /api/products/uuid-product-123
```

**Response 200 OK:**
```json
{
  "success": true,
  "product": {
    "id": "uuid-product-123",
    "blockchainId": 42,
    "name": "Organic Milk",
    "origin": "Oulu, Finland",
    "harvestDate": "2025-11-15T00:00:00.000Z",
    "imageUrl": "https://storage.supabase.co/products/milk-123.jpg",
    "description": "Fresh organic milk",
    "transactionHash": "0x8a791620dd6260079bf849dc5567adc3f2fdc318...",
    "company": {
      "name": "Hirsimäki Farm",
      "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
    },
    "createdAt": "2025-11-15T10:30:00.000Z",
    "blockchain": {
      "name": "Organic Milk",
      "origin": "Oulu, Finland",
      "producer": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "timestamp": 1731663000
    }
  }
}
```

**Response 404 Not Found:**
```json
{
  "error": "Product not found"
}
```

---

### POST /api/products/:id/transfer

**Purpose:** Transfer product ownership to another company

**Authentication:** Required (current owner)

**Request:**
```http
POST /api/products/uuid-product-123/transfer
Content-Type: application/json
Authorization: Session cookie

{
  "newOwnerAddress": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  "notes": "Transfer to distributor for quality check"
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "transactionHash": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0..."
}
```

---

## Trace Endpoints

### POST /api/trace/add

**Purpose:** Add trace record to blockchain and database

**Authentication:** Required (DISTRIBUTOR or RETAILER role)

**Request:**
```http
POST /api/trace/add
Content-Type: application/json
Authorization: Session cookie

{
  "productId": "uuid-product-123",
  "action": "RECEIVED",  // RECEIVED | QUALITY_CHECK | SHIPPED | STOCKED | SOLD
  "location": "Helsinki Distribution Center",
  "notes": "Product received in good condition, temperature 2.1°C"
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "traceId": "uuid-trace-456",
  "transactionHash": "0x1234567890abcdef..."
}
```

---

### GET /api/trace/history/:productId

**Purpose:** Fetch complete trace history for product

**Authentication:** Optional (public for consumers)

**Request:**
```http
GET /api/trace/history/uuid-product-123
```

**Response 200 OK:**
```json
{
  "success": true,
  "traceRecords": [
    {
      "id": "uuid-trace-1",
      "action": "RECEIVED",
      "location": "Helsinki Distribution Center",
      "notes": "Product received in good condition",
      "actor": {
        "name": "Liisa Korhonen",
        "role": "DISTRIBUTOR"
      },
      "txHash": "0x1234...",
      "createdAt": "2025-11-16T08:15:00.000Z"
    },
    {
      "id": "uuid-trace-2",
      "action": "QUALITY_CHECK",
      "location": "Helsinki Distribution Center",
      "notes": "Temperature check passed: 2.8°C",
      "actor": {
        "name": "Liisa Korhonen",
        "role": "DISTRIBUTOR"
      },
      "txHash": "0x5678...",
      "createdAt": "2025-11-16T09:30:00.000Z"
    }
  ]
}
```

---

## IoT Endpoints

### POST /api/iot/simulate

**Purpose:** Generate simulated IoT sensor data

**Authentication:** Required (ADMIN role)

**Request:**
```http
POST /api/iot/simulate
Content-Type: application/json
Authorization: Session cookie

{
  "productId": "uuid-product-123",
  "scenario": "critical",  // normal | warning | critical
  "count": 1  // Optional, defaults to 1
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "readings": [
    {
      "id": "uuid-sensor-789",
      "temperature": 11.2,
      "humidity": 88.5,
      "location": "Helsinki Distribution Center",
      "alertLevel": "CRITICAL",
      "isSimulated": true,
      "txHash": "0x9abc...",
      "createdAt": "2025-11-16T10:45:00.000Z"
    }
  ],
  "alertSent": true  // Email notification sent
}
```

---

### GET /api/iot/scenarios

**Purpose:** Get preset IoT scenario configurations

**Authentication:** Required (ADMIN role)

**Request:**
```http
GET /api/iot/scenarios
```

**Response 200 OK:**
```json
{
  "success": true,
  "scenarios": {
    "normal": {
      "temperature": { "min": 2, "max": 4 },
      "humidity": { "min": 70, "max": 75 },
      "alertLevel": "NORMAL"
    },
    "warning": {
      "temperature": { "min": 8, "max": 10 },
      "humidity": { "min": 75, "max": 82 },
      "alertLevel": "WARNING"
    },
    "critical": {
      "temperature": { "min": 10, "max": 15 },
      "humidity": { "min": 85, "max": 95 },
      "alertLevel": "CRITICAL"
    }
  }
}
```

---

## QR Code Endpoints

### POST /api/qrcode/generate

**Purpose:** Generate QR code for product

**Authentication:** Required (PRODUCER role)

**Request:**
```http
POST /api/qrcode/generate
Content-Type: application/json
Authorization: Session cookie

{
  "productId": "uuid-product-123"
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "qrCodeUrl": "https://storage.supabase.co/qr-codes/product-123.png",
  "downloadUrl": "https://storage.supabase.co/download/product-123.png",
  "consumerUrl": "https://foodtrace.onrender.com/consumer/product/uuid-product-123"
}
```

---

## Admin Endpoints

### POST /api/admin/companies

**Purpose:** Create a new company record (B2B partner onboarding)

**Authentication:** Required (PLATFORM_ADMIN role) - Implemented in Story 2.5

**Request:**
```http
POST /api/admin/companies
Content-Type: application/json
Authorization: Session cookie

{
  "name": "Hirsimaki Farm Ltd",
  "email": "contact@hirsimakifarm.fi",
  "domain": "hirsimakifarm.fi",
  "type": "PRODUCER"
}
```

**Validation Rules:**
- `name`: Required, 2-255 characters
- `email`: Required, valid email format, must end with `@{domain}`
- `domain`: Required, 2-100 characters
- `type`: Required, one of: PRODUCER, DISTRIBUTOR, RETAILER

**Response 201 Created:**
```json
{
  "success": true,
  "company": {
    "id": "clxyz123...",
    "name": "Hirsimaki Farm Ltd",
    "email": "contact@hirsimakifarm.fi",
    "domain": "hirsimakifarm.fi",
    "type": "PRODUCER",
    "status": "PENDING",
    "createdAt": "2025-11-27T12:00:00.000Z"
  }
}
```

**Response 400 Bad Request:**
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    { "field": "email", "message": "Company email must match the company domain" }
  ]
}
```

**Response 409 Conflict:**
```json
{
  "error": "Company with this email already exists",
  "code": "DUPLICATE_ERROR"
}
```

---

### GET /api/admin/companies

**Purpose:** List all companies with optional status filter

**Authentication:** Required (PLATFORM_ADMIN role) - Implemented in Story 2.5

**Request:**
```http
GET /api/admin/companies?status=PENDING
```

**Query Parameters:**
- `status` (optional): Filter by CompanyStatus (PENDING, APPROVED, REJECTED)

**Response 200 OK:**
```json
{
  "success": true,
  "companies": [
    {
      "id": "clxyz123...",
      "name": "Hirsimaki Farm Ltd",
      "email": "contact@hirsimakifarm.fi",
      "domain": "hirsimakifarm.fi",
      "type": "PRODUCER",
      "status": "PENDING",
      "walletAddress": null,
      "createdAt": "2025-11-27T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### POST /api/admin/companies/:id/approve

**Purpose:** Approve a pending company and generate blockchain wallet

**Authentication:** Required (PLATFORM_ADMIN role)

**Dependencies:** Epic 3 Tier 1 (Wallet Encryption)

**Request:**
```http
POST /api/admin/companies/clxyz123/approve
```

**Response 200 OK:**
```json
{
  "success": true,
  "company": {
    "id": "clxyz123...",
    "status": "APPROVED",
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "approvedAt": "2025-11-27T14:00:00.000Z"
  }
}
```

---

### POST /api/admin/companies/:id/reject

**Purpose:** Reject a pending company with reason

**Authentication:** Required (PLATFORM_ADMIN role)

**Request:**
```http
POST /api/admin/companies/clxyz123/reject
Content-Type: application/json

{
  "reason": "Incomplete business documentation"
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "company": {
    "id": "clxyz123...",
    "status": "REJECTED",
    "rejectionReason": "Incomplete business documentation"
  }
}
```

---

## Error Responses

**Standard Error Format:**
```json
{
  "error": "User-friendly error message",
  "code": "ERROR_CODE",  // Optional
  "details": { ... }     // Optional
}
```

**HTTP Status Codes:**
- `400 Bad Request`: Invalid input (validation error)
- `401 Unauthorized`: Authentication required (no session token)
- `403 Forbidden`: Insufficient permissions (wrong role)
- `404 Not Found`: Resource not found
- `405 Method Not Allowed`: Wrong HTTP method
- `409 Conflict`: Resource already exists (duplicate)
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: Service temporarily down

**Error Codes:**
- `VALIDATION_ERROR`: Input validation failed
- `AUTH_ERROR`: Authentication failed
- `AUTHZ_ERROR`: Authorization failed
- `NOT_FOUND`: Resource not found
- `DUPLICATE_ERROR`: Resource already exists
- `BLOCKCHAIN_ERROR`: Blockchain transaction failed
- `DATABASE_ERROR`: Database operation failed
- `RATE_LIMIT_ERROR`: Too many requests

---

## Rate Limiting

**Limits:**
- `POST /api/products/register`: 10 requests/minute per user
- `POST /api/trace/add`: 20 requests/minute per user
- `POST /api/iot/simulate`: 60 requests/minute per admin
- `GET` endpoints: 100 requests/minute per IP

**Rate Limit Response:**
```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60

{
  "error": "Too many requests. Please try again in 60 seconds.",
  "code": "RATE_LIMIT_ERROR"
}
```

---

## CORS Policy

**Allowed Origins:**
- `https://foodtrace.onrender.com` (production)
- `http://localhost:3000` (development)

**Allowed Methods:** `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`

**Allowed Headers:** `Content-Type`, `Authorization`

---

**Last Updated:** 2025-11-20 (Week 0 Complete)
