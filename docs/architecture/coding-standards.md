# Coding Standards & Conventions

**Purpose:** Define coding rules, conventions, and best practices for consistent codebase quality.

---

## TypeScript Standards

**Strict Mode:** Enabled in `tsconfig.json`
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**Type Annotations:**
- Always annotate function parameters and return types
- Use interfaces for object shapes, types for unions
- Avoid `any` type (use `unknown` if truly dynamic)

**Naming Conventions:**
- **Variables/Functions:** camelCase (`getUserData`, `productCount`)
- **Types/Interfaces:** PascalCase (`ProductData`, `TraceRecord`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_RETRIES`, `DEFAULT_TIMEOUT`)
- **Private fields:** Prefix with underscore (`_privateField`)

---

## Solidity Standards

**Version Pragma:** Always use fixed version
```solidity
pragma solidity 0.8.20;  // ✅ GOOD (fixed version)
pragma solidity ^0.8.0;  // ❌ BAD (floating version)
```

**Contract Structure Order:**
1. License identifier (`// SPDX-License-Identifier: MIT`)
2. Pragma statement
3. Import statements
4. Interfaces, libraries, contracts

**Function Visibility Order:**
1. Constructor
2. External functions
3. Public functions
4. Internal functions
5. Private functions

**Code Layout:**
- Use 4-space indentation (not tabs)
- Maximum line length: 120 characters
- One statement per line
- Opening brace on same line as declaration

**Security Patterns:**
- Use OpenZeppelin contracts (AccessControl, Pausable, ReentrancyGuard)
- Always validate inputs with `require` statements
- Emit events for all state changes
- Use `uint256` instead of `uint` (explicit is better)

**Gas Optimization:**
- Pack struct variables efficiently (uint256 + address + uint256 in single slot)
- Use `memory` keyword for function parameters
- Cache storage variables in memory when accessed multiple times
- Use events instead of storage for query-only data

---

## React/Next.js Standards

**Component Structure:**
```typescript
// 1. Imports (external → internal)
import React, { useState, useEffect } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { ProductCard } from '@/components/ProductCard';

// 2. Types/Interfaces
interface ProductListProps {
  companyId: string;
  onProductSelect: (id: string) => void;
}

// 3. Component definition
export function ProductList({ companyId, onProductSelect }: ProductListProps) {
  // 4. State hooks
  const [products, setProducts] = useState<Product[]>([]);

  // 5. Effect hooks
  useEffect(() => {
    fetchProducts();
  }, [companyId]);

  // 6. Event handlers
  const handleProductClick = (id: string) => {
    onProductSelect(id);
  };

  // 7. Render
  return (
    <Box>
      {products.map(product => (
        <ProductCard key={product.id} product={product} onClick={handleProductClick} />
      ))}
    </Box>
  );
}
```

**Component Naming:**
- Use PascalCase for component files (`ProductCard.tsx`)
- Export named components, not default exports
- Co-locate types with components

**Hooks Best Practices:**
- Use custom hooks for reusable logic (`useProducts`, `useBlockchain`)
- Keep components focused (single responsibility)
- Avoid deeply nested components (max 3 levels)

---

## API Route Standards

**File Structure:**
```typescript
// pages/api/products/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

// 1. Input validation schema
const registerSchema = z.object({
  name: z.string().min(3).max(100),
  origin: z.string().min(2).max(50),
  harvestDate: z.date().max(new Date()),
});

// 2. Handler function
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 3. Method validation
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 4. Authentication check
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 5. Input validation
  try {
    const data = registerSchema.parse(req.body);

    // 6. Business logic
    const product = await registerProduct(data, session.user.companyId);

    // 7. Success response
    logger.info({ productId: product.id }, 'Product registered');
    return res.status(200).json({ success: true, productId: product.id });

  } catch (error) {
    // 8. Error handling
    logger.error({ error }, 'Product registration failed');
    return res.status(500).json({ error: 'Registration failed' });
  }
}
```

**Error Response Format:**
```typescript
// Consistent error structure
{
  error: "User-friendly message",
  code: "VALIDATION_ERROR",  // Optional error code
  details: { field: "harvestDate", issue: "Future date not allowed" }  // Optional details
}
```

---

## Database Standards (Prisma)

**Model Naming:**
- Use singular PascalCase (`Product`, not `Products`)
- Field names in camelCase (`createdAt`, `companyId`)

**Query Best Practices:**
```typescript
// ✅ GOOD: Select only needed fields
const products = await prisma.product.findMany({
  select: {
    id: true,
    name: true,
    origin: true,
  },
  where: { companyId },
});

// ❌ BAD: Fetch all fields (includes encrypted keys, large blobs)
const products = await prisma.product.findMany({ where: { companyId } });
```

**Transaction Usage:**
```typescript
// Use transactions for multi-step operations
await prisma.$transaction(async (tx) => {
  const product = await tx.product.create({ data: productData });
  await tx.traceRecord.create({ data: { productId: product.id, ...traceData } });
});
```

---

## Git Commit Standards

**Commit Message Format:** Conventional Commits
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature (Epic 1.3: Add QR download button)
- `fix`: Bug fix (Fix QR scanner camera permissions)
- `docs`: Documentation (Update PRD with Week 2 decisions)
- `test`: Tests (Add unit tests for ProductRegistry)
- `refactor`: Code refactoring (Extract wallet logic to separate module)
- `chore`: Build/tooling (Update Hardhat to v2.19)

**Examples:**
```
feat(producer): add QR code download button

Allow producers to download QR codes as PNG after product registration.
Implements Epic 1.3 requirement.

Closes #42
```

```
fix(blockchain): handle Alchemy RPC rate limit

Add retry logic with exponential backoff when Alchemy returns 429.
Fallback to Infura if all retries exhausted.
```

---

## Code Documentation

**Function Documentation (JSDoc):**
```typescript
/**
 * Registers a product on the blockchain and database.
 *
 * @param data - Product registration data (name, origin, harvest date)
 * @param companyId - Company ID performing registration
 * @returns Product ID and transaction hash
 * @throws ValidationError if data invalid
 * @throws BlockchainError if transaction fails
 */
async function registerProduct(data: ProductData, companyId: string): Promise<ProductResult> {
  // Implementation
}
```

**Complex Logic Comments:**
```typescript
// Wait for blockchain confirmation before updating database
// This ensures database state matches blockchain state (eventual consistency)
const receipt = await tx.wait();

// Decrypt custodial wallet using AES-256-GCM
// Key stored in environment variable, never logged or exposed to client
const privateKey = decryptWallet(company.encryptedPrivateKey);
```

---

## Testing Standards

**Test File Naming:**
- Unit tests: `ProductRegistry.test.ts` (same directory as source)
- Integration tests: `productRegistration.integration.test.ts`
- E2E tests: `producerWorkflow.e2e.test.ts`

**Test Structure (AAA Pattern):**
```typescript
describe('ProductRegistry', () => {
  describe('registerProduct', () => {
    it('should register product with valid data', async () => {
      // Arrange
      const productData = { name: 'Milk', origin: 'Oulu', harvestDate: 1699920000 };

      // Act
      const tx = await productRegistry.registerProduct(productData.name, productData.origin, productData.harvestDate);
      const receipt = await tx.wait();

      // Assert
      expect(receipt.status).to.equal(1);
      expect(receipt.events[0].event).to.equal('ProductRegistered');
    });

    it('should reject future harvest dates', async () => {
      // Arrange
      const futureDate = Math.floor(Date.now() / 1000) + 86400;

      // Act & Assert
      await expect(
        productRegistry.registerProduct('Test', 'Oulu', futureDate)
      ).to.be.revertedWith('Future date not allowed');
    });
  });
});
```

**Coverage Targets:**
- Smart contracts: >70% statement coverage
- Frontend components: >80% component coverage
- API routes: >70% endpoint coverage

---

## Code Quality Metrics (Week 9 Target)

- **TypeScript Coverage:** 100% (no `.js` files in `src/`)
- **ESLint Violations:** 0 errors, <10 warnings
- **Prettier Formatting:** 100% auto-formatted (enforced via pre-commit hook)
- **Smart Contract Slither Analysis:** 0 critical/high severity issues
- **npm Audit:** Zero high/critical vulnerabilities

---

## Pre-Commit Checks

**Automated Checks (Husky + lint-staged):**
1. ESLint: Fix auto-fixable issues
2. Prettier: Format all staged files
3. TypeScript: Type check (tsc --noEmit)
4. Unit tests: Run tests related to changed files

**Manual Checks:**
1. No `console.log` statements in production code (use logger)
2. No sensitive data in code (API keys, private keys)
3. All environment variables documented in `.env.example`

---

**Last Updated:** 2025-11-20 (Week 0 Complete)
