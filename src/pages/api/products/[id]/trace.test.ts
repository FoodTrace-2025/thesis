/**
 * @jest-environment node
 */
// Add Trace Record API Tests
// Story 7.2: Add Trace Record API
// Tests for POST /api/products/:id/trace

// IMPORTANT: next-test-api-route-handler must be imported first
import { testApiHandler } from 'next-test-api-route-handler';
import * as handler from './trace';
import { prisma } from '@/lib/prisma';

// Mock NextAuth - default to PRODUCER session
jest.mock('next-auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
  getServerSession: jest.fn(() =>
    Promise.resolve({
      user: {
        id: 'producer-user-id',
        email: 'producer@farm.com',
        name: 'Producer User',
        role: 'PRODUCER',
        companyId: 'producer-company-id',
      },
    })
  ),
}));

// Use Node's crypto directly to create test encrypted data
// This sidesteps all Jest module resolution issues
import crypto from 'crypto';

// Test encryption key (64 hex chars = 256 bits)
const TEST_ENCRYPTION_KEY = '0'.repeat(64);
const TEST_PRIVATE_KEY = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

// Set environment variables so handler works
process.env.WALLET_ENCRYPTION_KEY = TEST_ENCRYPTION_KEY;
process.env.SEPOLIA_RPC_URL = 'https://test-rpc.example.com';
process.env.NEXT_PUBLIC_PRODUCT_REGISTRY_ADDRESS = '0x1234567890123456789012345678901234567890';

// Helper to encrypt using the same algorithm as wallet-encryption.ts
function testEncryptWalletKey(privateKey: string, encryptionKey: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(encryptionKey, 'hex'), iv);
  let encrypted = cipher.update(privateKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return iv.toString('hex') + authTag.toString('hex') + encrypted;
}

// Pre-compute encrypted test data
const TEST_ENCRYPTED_PRIVATE_KEY = testEncryptWalletKey(TEST_PRIVATE_KEY, TEST_ENCRYPTION_KEY);

// No crypto mock needed - we use the real implementation with
// the WALLET_ENCRYPTION_KEY env var set to TEST_ENCRYPTION_KEY above

// Mock viem
jest.mock('viem', () => ({
  createPublicClient: jest.fn(() => ({
    estimateContractGas: jest.fn(() => Promise.resolve(BigInt(200000))),
    waitForTransactionReceipt: jest.fn(() =>
      Promise.resolve({
        status: 'success',
        logs: [{ topics: [], data: '0x' }],
      })
    ),
    readContract: jest.fn(() => Promise.resolve([{ productId: 1n }])), // Mock getTraceHistory
  })),
  createWalletClient: jest.fn(() => ({
    writeContract: jest.fn(() => Promise.resolve('0xmocktransactionhash123456789')),
  })),
  http: jest.fn(() => 'http-transport'),
  parseEventLogs: jest.fn(() => [
    {
      args: {
        productId: BigInt(1),
        actor: '0xMockAddress',
        action: 'RECEIVED',
        timestamp: BigInt(Math.floor(Date.now() / 1000)),
      },
    },
  ]),
}));

jest.mock('viem/chains', () => ({
  sepolia: { id: 11155111, name: 'Sepolia' },
}));

jest.mock('viem/accounts', () => ({
  privateKeyToAccount: jest.fn(() => ({
    address: '0xMockWalletAddress',
  })),
}));

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
    company: {
      findUnique: jest.fn(), // Story 7.16: For recipient company validation
    },
    traceRecord: {
      create: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const { getServerSession } = jest.requireMock('next-auth');

describe('/api/products/[id]/trace', () => {
  // Default mock company with wallet - use properly encrypted test data
  const mockCompany = {
    id: 'producer-company-id',
    status: 'APPROVED',
    type: 'PRODUCER',
    walletAddress: '0xMockWalletAddress',
    encryptedPrivateKey: TEST_ENCRYPTED_PRIVATE_KEY,
  };

  // Default mock product
  const mockProduct = {
    id: 'test-product-id',
    blockchainId: 1,
  };

  // Valid trace request body
  const validTraceData = {
    action: 'RECEIVED',
    location: 'Helsinki Distribution Center',
    notes: 'Product received in good condition',
  };

  // Mock created trace record
  const mockCreatedTrace = {
    id: 'new-trace-id',
    productId: 'test-product-id',
    userId: 'producer-user-id',
    companyId: 'producer-company-id',
    action: 'RECEIVED',
    location: 'Helsinki Distribution Center',
    notes: 'Product received in good condition',
    transactionHash: '0xmocktransactionhash123456789',
    blockchainIndex: 0,
    createdAt: new Date('2025-12-04T10:00:00Z'),
  };

  beforeEach(() => {
    // Clear all mock call history but not implementations
    jest.clearAllMocks();

    // Reset to PRODUCER session
    getServerSession.mockResolvedValue({
      user: {
        id: 'producer-user-id',
        email: 'producer@farm.com',
        name: 'Producer User',
        role: 'PRODUCER',
        companyId: 'producer-company-id',
      },
    });

    // Mock user lookup for requireSupplyChainRole middleware
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'producer-user-id',
      company: mockCompany,
    });

    // Mock product lookup
    (mockPrisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

    // Note: crypto functions are mocked with static values in jest.mock factory above

    // Mock transaction - return created trace record
    (mockPrisma.$transaction as jest.Mock).mockImplementation(async (fn) => {
      return fn({
        traceRecord: {
          create: jest.fn().mockResolvedValue(mockCreatedTrace),
        },
        product: {
          update: jest.fn().mockResolvedValue({}), // Story 7.4: Ownership transfer
        },
        auditLog: {
          create: jest.fn().mockResolvedValue({}),
        },
      });
    });
  });

  // ==================== AUTHENTICATION TESTS ====================

  describe('Authentication', () => {
    it('returns 401 when not authenticated', async () => {
      getServerSession.mockResolvedValueOnce(null);

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validTraceData),
          });
          expect(res.status).toBe(401);
          const json = await res.json();
          expect(json.code).toBe('UNAUTHORIZED');
        },
      });
    });

    it('returns 403 when user is PLATFORM_ADMIN', async () => {
      getServerSession.mockResolvedValueOnce({
        user: {
          id: 'admin-id',
          role: 'PLATFORM_ADMIN',
        },
      });

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validTraceData),
          });
          expect(res.status).toBe(403);
          const json = await res.json();
          expect(json.code).toBe('FORBIDDEN');
        },
      });
    });

    it('returns 403 when user is COMPANY_ADMIN', async () => {
      getServerSession.mockResolvedValueOnce({
        user: {
          id: 'company-admin-id',
          role: 'COMPANY_ADMIN',
        },
      });

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validTraceData),
          });
          expect(res.status).toBe(403);
        },
      });
    });

    it('returns 403 when company not approved', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 'producer-user-id',
        company: { ...mockCompany, status: 'PENDING' },
      });

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validTraceData),
          });
          expect(res.status).toBe(403);
          const json = await res.json();
          expect(json.code).toBe('COMPANY_NOT_APPROVED');
        },
      });
    });
  });

  // ==================== PRODUCT VALIDATION TESTS ====================

  describe('Product Validation', () => {
    it('returns 404 when product does not exist', async () => {
      (mockPrisma.product.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'non-existent-product' },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validTraceData),
          });
          expect(res.status).toBe(404);
          const json = await res.json();
          expect(json.code).toBe('PRODUCT_NOT_FOUND');
        },
      });
    });
  });

  // ==================== INPUT VALIDATION TESTS ====================

  describe('Input Validation', () => {
    it('returns 400 for invalid action enum', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...validTraceData,
              action: 'INVALID_ACTION',
            }),
          });
          expect(res.status).toBe(400);
          const json = await res.json();
          expect(json.code).toBe('VALIDATION_ERROR');
          expect(json.details).toBeDefined();
        },
      });
    });

    it('returns 400 when location is missing', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'RECEIVED',
              notes: 'Some notes',
            }),
          });
          expect(res.status).toBe(400);
          const json = await res.json();
          expect(json.code).toBe('VALIDATION_ERROR');
        },
      });
    });

    it('returns 400 when location exceeds 100 chars', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...validTraceData,
              location: 'A'.repeat(101),
            }),
          });
          expect(res.status).toBe(400);
          const json = await res.json();
          expect(json.code).toBe('VALIDATION_ERROR');
        },
      });
    });

    it('returns 400 when notes exceeds 500 chars', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...validTraceData,
              notes: 'N'.repeat(501),
            }),
          });
          expect(res.status).toBe(400);
          const json = await res.json();
          expect(json.code).toBe('VALIDATION_ERROR');
        },
      });
    });
  });

  // ==================== SUCCESS CASES ====================

  describe('Success Cases', () => {
    it('returns 201 for PRODUCER with valid input', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validTraceData),
          });
          expect(res.status).toBe(201);
          const json = await res.json();
          expect(json.success).toBe(true);
          expect(json.traceRecord).toBeDefined();
          expect(json.traceRecord.action).toBe('RECEIVED');
          expect(json.traceRecord.location).toBe('Helsinki Distribution Center');
          expect(json.traceRecord.transactionHash).toBeDefined();
        },
      });
    });

    it('returns 201 for DISTRIBUTOR with valid input', async () => {
      getServerSession.mockResolvedValueOnce({
        user: {
          id: 'distributor-user-id',
          email: 'distributor@logistics.com',
          name: 'Distributor User',
          role: 'DISTRIBUTOR',
          companyId: 'distributor-company-id',
        },
      });

      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 'distributor-user-id',
        company: { ...mockCompany, id: 'distributor-company-id', type: 'DISTRIBUTOR' },
      });

      // Story 7.16: Mock recipient company for SHIPPED action
      (mockPrisma.company.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 'retailer-company-id',
        status: 'APPROVED',
      });

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'SHIPPED',
              location: 'Logistics Hub',
              recipientCompanyId: 'retailer-company-id', // Story 7.16: Required for SHIPPED
            }),
          });
          expect(res.status).toBe(201);
        },
      });
    });

    it('returns 201 for RETAILER with valid input', async () => {
      getServerSession.mockResolvedValueOnce({
        user: {
          id: 'retailer-user-id',
          email: 'retailer@store.com',
          name: 'Retailer User',
          role: 'RETAILER',
          companyId: 'retailer-company-id',
        },
      });

      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 'retailer-user-id',
        company: { ...mockCompany, id: 'retailer-company-id', type: 'RETAILER' },
      });

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'STOCKED',
              location: 'Retail Store',
            }),
          });
          expect(res.status).toBe(201);
        },
      });
    });

    it('allows empty notes', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'RECEIVED',
              location: 'Warehouse',
            }),
          });
          expect(res.status).toBe(201);
        },
      });
    });

    it('handles all valid action types', async () => {
      const actions = ['RECEIVED', 'QUALITY_CHECK', 'SHIPPED', 'STOCKED', 'SOLD'];

      for (const action of actions) {
        // Reset mocks for each iteration
        (mockPrisma.$transaction as jest.Mock).mockImplementation(async (fn) => {
          return fn({
            traceRecord: {
              create: jest.fn().mockResolvedValue({ ...mockCreatedTrace, action }),
            },
            product: {
              update: jest.fn().mockResolvedValue({}), // Story 7.4: Ownership transfer
            },
            auditLog: {
              create: jest.fn().mockResolvedValue({}),
            },
          });
        });

        // Story 7.16: Mock recipient company for SHIPPED action
        if (action === 'SHIPPED') {
          (mockPrisma.company.findUnique as jest.Mock).mockResolvedValueOnce({
            id: 'recipient-company-id',
            status: 'APPROVED',
          });
        }

        await testApiHandler({
          pagesHandler: handler,
          params: { id: 'test-product-id' },
          test: async ({ fetch }) => {
            // Story 7.16: Include recipientCompanyId for SHIPPED action
            const body: { action: string; location: string; recipientCompanyId?: string } = {
              action,
              location: 'Test Location',
            };
            if (action === 'SHIPPED') {
              body.recipientCompanyId = 'recipient-company-id';
            }

            const res = await fetch({
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
            });
            expect(res.status).toBe(201);
          },
        });
      }
    });
  });

  // ==================== ERROR HANDLING ====================

  describe('Error Handling', () => {
    it('returns 405 for non-POST methods', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(405);
        },
      });
    });

    it('returns 500 when wallet decryption fails', async () => {
      // Use invalid encrypted data to trigger decryption failure
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 'producer-user-id',
        company: {
          ...mockCompany,
          encryptedPrivateKey: 'invalid-encrypted-data-too-short',
        },
      });
      (mockPrisma.auditLog.create as jest.Mock).mockResolvedValueOnce({});

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validTraceData),
          });
          expect(res.status).toBe(500);
          const json = await res.json();
          expect(json.code).toBe('WALLET_DECRYPT_ERROR');
        },
      });
    });
  });

  // ==================== SOLD OWNERSHIP TRANSFER (Story 7.11) ====================

  describe('SOLD action ownership transfer', () => {
    it('should set currentOwnerId to null when action is SOLD', async () => {
      // Setup: Product currently owned by retailer
      const productWithOwner = {
        id: 'test-product-id',
        blockchainId: 1,
        currentOwnerId: 'retailer-company-id',
      };
      (mockPrisma.product.findUnique as jest.Mock).mockResolvedValueOnce(productWithOwner);

      // Track the product.update call
      let productUpdateData: { currentOwnerId: string | null } | undefined;
      (mockPrisma.$transaction as jest.Mock).mockImplementation(async (fn) => {
        return fn({
          traceRecord: {
            create: jest.fn().mockResolvedValue({
              ...mockCreatedTrace,
              action: 'SOLD',
            }),
          },
          product: {
            update: jest.fn().mockImplementation(({ data }) => {
              productUpdateData = data;
              return Promise.resolve({});
            }),
          },
          auditLog: {
            create: jest.fn().mockResolvedValue({}),
          },
        });
      });

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'SOLD',
              location: 'Retail Store',
              notes: 'Sold to consumer',
            }),
          });
          expect(res.status).toBe(201);
          // Verify currentOwnerId was set to null
          expect(productUpdateData).toBeDefined();
          expect(productUpdateData?.currentOwnerId).toBeNull();
        },
      });
    });

    it('should include soldToConsumer in audit log for SOLD action', async () => {
      // Track the auditLog.create call
      let auditLogDetails: Record<string, unknown> | undefined;
      (mockPrisma.$transaction as jest.Mock).mockImplementation(async (fn) => {
        return fn({
          traceRecord: {
            create: jest.fn().mockResolvedValue({
              ...mockCreatedTrace,
              action: 'SOLD',
            }),
          },
          product: {
            update: jest.fn().mockResolvedValue({}),
          },
          auditLog: {
            create: jest.fn().mockImplementation(({ data }) => {
              auditLogDetails = data.details as Record<string, unknown>;
              return Promise.resolve({});
            }),
          },
        });
      });

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'SOLD',
              location: 'Retail Store',
            }),
          });
          expect(res.status).toBe(201);
          // Verify audit log contains soldToConsumer flag
          expect(auditLogDetails).toBeDefined();
          expect(auditLogDetails?.soldToConsumer).toBe(true);
          expect(auditLogDetails?.ownershipTransferred).toBe(true);
          expect(auditLogDetails?.newOwnerId).toBeNull();
        },
      });
    });

    it('should not affect currentOwnerId for non-ownership actions', async () => {
      // Track the product.update call
      let productUpdateCalled = false;
      (mockPrisma.$transaction as jest.Mock).mockImplementation(async (fn) => {
        return fn({
          traceRecord: {
            create: jest.fn().mockResolvedValue({
              ...mockCreatedTrace,
              action: 'QUALITY_CHECK',
            }),
          },
          product: {
            update: jest.fn().mockImplementation(() => {
              productUpdateCalled = true;
              return Promise.resolve({});
            }),
          },
          auditLog: {
            create: jest.fn().mockResolvedValue({}),
          },
        });
      });

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'QUALITY_CHECK',
              location: 'Warehouse',
            }),
          });
          expect(res.status).toBe(201);
          // Verify product.update was NOT called for non-ownership actions
          expect(productUpdateCalled).toBe(false);
        },
      });
    });
  });
});
