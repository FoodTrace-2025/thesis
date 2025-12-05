/**
 * @jest-environment node
 */
// Products List API Tests
// Story 7.4: Product Ownership Tracking
// Story 7.13: Product History API - Added history=me filter tests
// Story 7.17: Incoming Shipments API - Added incoming=me filter tests
// Tests for GET /api/products

// IMPORTANT: next-test-api-route-handler must be imported first
import { testApiHandler } from 'next-test-api-route-handler';

// Mock next-auth before importing handler
jest.mock('next-auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
  getServerSession: jest.fn(),
}));

import * as handler from './index';
import { prisma } from '@/lib/prisma';

const { getServerSession } = jest.requireMock('next-auth');

// Mock Prisma (Story 7.12: Added traceRecord for status)
jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    traceRecord: {
      findFirst: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('GET /api/products', () => {
  // Mock products
  const mockProducts = [
    {
      id: 'product-1',
      name: 'Organic Strawberries',
      origin: 'Helsinki Farm',
      blockchainId: 1,
      harvestDate: new Date('2025-12-01T00:00:00Z'),
      currentOwner: { name: 'Helsinki Farm' },
      createdAt: new Date('2025-12-01T10:00:00Z'),
    },
    {
      id: 'product-2',
      name: 'Organic Blueberries',
      origin: 'Oulu Farm',
      blockchainId: 2,
      harvestDate: new Date('2025-12-02T00:00:00Z'),
      currentOwner: { name: 'Oulu Distributors' },
      createdAt: new Date('2025-12-02T10:00:00Z'),
    },
  ];

  const mockSession = {
    user: {
      id: 'user-1',
      email: 'producer@farm.com',
      name: 'Producer User',
      role: 'PRODUCER',
      companyId: 'company-1',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default: session exists
    getServerSession.mockResolvedValue(mockSession);

    // Default: products exist
    (mockPrisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
    (mockPrisma.product.count as jest.Mock).mockResolvedValue(2);

    // Story 7.12: Default - products are IN_STOCK (last action not SOLD)
    (mockPrisma.traceRecord.findFirst as jest.Mock).mockResolvedValue({
      action: 'RECEIVED',
    });
  });

  // ==================== PUBLIC ACCESS ====================

  describe('Public Access (no filter)', () => {
    it('should return 200 with all products', async () => {
      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(200);
          const json = await res.json();
          expect(json.success).toBe(true);
          expect(json.products).toHaveLength(2);
          expect(json.total).toBe(2);
        },
      });
    });

    it('should include currentOwner name in response', async () => {
      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          const json = await res.json();
          expect(json.products[0].currentOwner).toEqual({ name: 'Helsinki Farm' });
        },
      });
    });

    it('should use default pagination (limit=50, offset=0)', async () => {
      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });

          expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
              take: 50,
              skip: 0,
            })
          );

          const json = await res.json();
          expect(json.limit).toBe(50);
          expect(json.offset).toBe(0);
        },
      });
    });

    it('should respect custom pagination', async () => {
      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?limit=10&offset=5',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });

          expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
              take: 10,
              skip: 5,
            })
          );

          const json = await res.json();
          expect(json.limit).toBe(10);
          expect(json.offset).toBe(5);
        },
      });
    });

    it('should format dates as ISO strings', async () => {
      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          const json = await res.json();
          expect(json.products[0].harvestDate).toBe('2025-12-01T00:00:00.000Z');
          expect(json.products[0].createdAt).toBe('2025-12-01T10:00:00.000Z');
        },
      });
    });

    it('should order by createdAt descending', async () => {
      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          await fetch({ method: 'GET' });

          expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
              orderBy: { createdAt: 'desc' },
            })
          );
        },
      });
    });
  });

  // ==================== AUTHENTICATED ACCESS (owner=me) ====================

  describe('Authenticated Access (owner=me)', () => {
    it('should return 401 when owner=me without session', async () => {
      getServerSession.mockResolvedValueOnce(null);

      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?owner=me',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(401);
          const json = await res.json();
          expect(json.error).toBe('Authentication required');
          expect(json.code).toBe('UNAUTHORIZED');
        },
      });
    });

    it('should return 401 when session has no companyId', async () => {
      getServerSession.mockResolvedValueOnce({
        user: { id: 'user-1', email: 'admin@test.com', role: 'PLATFORM_ADMIN' },
      });

      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?owner=me',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(401);
        },
      });
    });

    it('should return filtered products when owner=me with valid session', async () => {
      const companyProducts = [mockProducts[0]];
      (mockPrisma.product.findMany as jest.Mock).mockResolvedValueOnce(companyProducts);
      (mockPrisma.product.count as jest.Mock).mockResolvedValueOnce(1);

      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?owner=me',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(200);
          const json = await res.json();
          expect(json.success).toBe(true);
          expect(json.products).toHaveLength(1);
          expect(json.total).toBe(1);
        },
      });
    });

    it('should filter by currentOwnerId = companyId', async () => {
      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?owner=me',
        test: async ({ fetch }) => {
          await fetch({ method: 'GET' });

          expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
              where: { currentOwnerId: 'company-1' },
            })
          );

          expect(mockPrisma.product.count).toHaveBeenCalledWith({
            where: { currentOwnerId: 'company-1' },
          });
        },
      });
    });

    it('should return empty array when company owns no products', async () => {
      (mockPrisma.product.findMany as jest.Mock).mockResolvedValueOnce([]);
      (mockPrisma.product.count as jest.Mock).mockResolvedValueOnce(0);

      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?owner=me',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(200);
          const json = await res.json();
          expect(json.success).toBe(true);
          expect(json.products).toEqual([]);
          expect(json.total).toBe(0);
        },
      });
    });
  });

  // ==================== VALIDATION ====================

  describe('Validation', () => {
    it('should return 400 for limit > 100', async () => {
      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?limit=101',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(400);
          const json = await res.json();
          expect(json.error).toBe('Invalid parameters');
          expect(json.code).toBe('VALIDATION_ERROR');
          expect(json.details).toBeDefined();
        },
      });
    });

    it('should return 400 for limit < 1', async () => {
      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?limit=0',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(400);
          const json = await res.json();
          expect(json.code).toBe('VALIDATION_ERROR');
        },
      });
    });

    it('should return 400 for negative offset', async () => {
      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?offset=-1',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(400);
          const json = await res.json();
          expect(json.code).toBe('VALIDATION_ERROR');
        },
      });
    });

    it('should return 400 for non-integer limit', async () => {
      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?limit=abc',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(400);
          const json = await res.json();
          expect(json.code).toBe('VALIDATION_ERROR');
        },
      });
    });

    it('should return 400 for invalid owner value', async () => {
      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?owner=invalid',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(400);
          const json = await res.json();
          expect(json.code).toBe('VALIDATION_ERROR');
        },
      });
    });
  });

  // ==================== METHOD VALIDATION ====================

  describe('Method Validation', () => {
    it('should return 405 for POST method', async () => {
      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'POST' });
          expect(res.status).toBe(405);
          const json = await res.json();
          expect(json.error).toBe('Method not allowed');
        },
      });
    });

    it('should return 405 for PUT method', async () => {
      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'PUT' });
          expect(res.status).toBe(405);
        },
      });
    });

    it('should return 405 for DELETE method', async () => {
      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'DELETE' });
          expect(res.status).toBe(405);
        },
      });
    });
  });

  // ==================== ERROR HANDLING ====================

  describe('Error Handling', () => {
    it('should return 500 on database error', async () => {
      (mockPrisma.product.findMany as jest.Mock).mockRejectedValueOnce(
        new Error('Database connection failed')
      );

      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(500);
          const json = await res.json();
          expect(json.error).toBe('Internal server error');
          expect(json.code).toBe('SERVER_ERROR');
        },
      });
    });
  });

  // ==================== RESPONSE FORMAT ====================

  describe('Response Format', () => {
    it('should include all required fields in response', async () => {
      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          const json = await res.json();

          expect(json.products[0]).toHaveProperty('id');
          expect(json.products[0]).toHaveProperty('name');
          expect(json.products[0]).toHaveProperty('origin');
          expect(json.products[0]).toHaveProperty('blockchainId');
          expect(json.products[0]).toHaveProperty('harvestDate');
          expect(json.products[0]).toHaveProperty('currentOwner');
          expect(json.products[0]).toHaveProperty('createdAt');
        },
      });
    });

    it('should handle products with null currentOwner', async () => {
      const productsWithNullOwner = [
        {
          ...mockProducts[0],
          currentOwner: null,
        },
      ];
      (mockPrisma.product.findMany as jest.Mock).mockResolvedValueOnce(productsWithNullOwner);
      (mockPrisma.product.count as jest.Mock).mockResolvedValueOnce(1);

      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(200);
          const json = await res.json();
          expect(json.products[0].currentOwner).toBeNull();
        },
      });
    });
  });

  // ==================== STORY 7.12: STATUS FIELD ====================

  describe('Product Status Field', () => {
    it('should return IN_STOCK status for products with no trace records', async () => {
      // No trace records = null result from findFirst
      (mockPrisma.traceRecord.findFirst as jest.Mock).mockResolvedValue(null);

      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(200);
          const json = await res.json();
          expect(json.products[0].status).toBe('IN_STOCK');
          expect(json.products[1].status).toBe('IN_STOCK');
        },
      });
    });

    it('should return IN_STOCK status for products with last action RECEIVED', async () => {
      (mockPrisma.traceRecord.findFirst as jest.Mock).mockResolvedValue({
        action: 'RECEIVED',
      });

      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(200);
          const json = await res.json();
          expect(json.products[0].status).toBe('IN_STOCK');
        },
      });
    });

    it('should return SOLD status for products with last action SOLD', async () => {
      (mockPrisma.traceRecord.findFirst as jest.Mock).mockResolvedValue({
        action: 'SOLD',
      });

      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(200);
          const json = await res.json();
          expect(json.products[0].status).toBe('SOLD');
          expect(json.products[1].status).toBe('SOLD');
        },
      });
    });

    it('should return IN_STOCK for non-SOLD actions (QUALITY_CHECK, SHIPPED, STOCKED)', async () => {
      // Test each non-SOLD action
      const nonSoldActions = ['QUALITY_CHECK', 'SHIPPED', 'STOCKED'];

      for (const action of nonSoldActions) {
        (mockPrisma.traceRecord.findFirst as jest.Mock).mockResolvedValue({ action });

        await testApiHandler({
          pagesHandler: handler,
          test: async ({ fetch }) => {
            const res = await fetch({ method: 'GET' });
            const json = await res.json();
            expect(json.products[0].status).toBe('IN_STOCK');
          },
        });
      }
    });

    it('should include status field in response for authenticated requests', async () => {
      (mockPrisma.traceRecord.findFirst as jest.Mock).mockResolvedValue({
        action: 'RECEIVED',
      });

      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?owner=me',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(200);
          const json = await res.json();
          expect(json.products[0]).toHaveProperty('status');
          expect(json.products[0].status).toBe('IN_STOCK');
        },
      });
    });
  });

  // ==================== STORY 7.13: HISTORY FILTER ====================

  describe('Product History (history=me)', () => {
    it('should return 401 when history=me without session', async () => {
      getServerSession.mockResolvedValueOnce(null);

      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?history=me',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(401);
          const json = await res.json();
          expect(json.error).toBe('Authentication required');
          expect(json.code).toBe('UNAUTHORIZED');
        },
      });
    });

    it('should return 401 when session has no companyId', async () => {
      getServerSession.mockResolvedValueOnce({
        user: { id: 'user-1', email: 'admin@test.com', role: 'PLATFORM_ADMIN' },
      });

      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?history=me',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(401);
        },
      });
    });

    it('should return products where company has trace records', async () => {
      const historyProducts = [mockProducts[0]];
      (mockPrisma.product.findMany as jest.Mock).mockResolvedValueOnce(historyProducts);
      (mockPrisma.product.count as jest.Mock).mockResolvedValueOnce(1);

      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?history=me',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(200);
          const json = await res.json();
          expect(json.success).toBe(true);
          expect(json.products).toHaveLength(1);
          expect(json.total).toBe(1);
        },
      });
    });

    it('should use traceRecords.some filter for history query', async () => {
      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?history=me',
        test: async ({ fetch }) => {
          await fetch({ method: 'GET' });

          expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
              where: {
                traceRecords: {
                  some: { companyId: 'company-1' },
                },
              },
            })
          );

          expect(mockPrisma.product.count).toHaveBeenCalledWith({
            where: {
              traceRecords: {
                some: { companyId: 'company-1' },
              },
            },
          });
        },
      });
    });

    it('should order products by createdAt desc', async () => {
      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?history=me',
        test: async ({ fetch }) => {
          await fetch({ method: 'GET' });

          expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
              orderBy: { createdAt: 'desc' },
            })
          );
        },
      });
    });

    it('should include status field for history products', async () => {
      (mockPrisma.traceRecord.findFirst as jest.Mock).mockResolvedValue({
        action: 'SOLD',
      });

      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?history=me',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(200);
          const json = await res.json();
          expect(json.products[0]).toHaveProperty('status');
          expect(json.products[0].status).toBe('SOLD');
        },
      });
    });

    it('should support pagination for history query', async () => {
      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?history=me&limit=10&offset=5',
        test: async ({ fetch }) => {
          await fetch({ method: 'GET' });

          expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
              take: 10,
              skip: 5,
            })
          );
        },
      });
    });

    it('should return empty array when company has no trace records', async () => {
      (mockPrisma.product.findMany as jest.Mock).mockResolvedValueOnce([]);
      (mockPrisma.product.count as jest.Mock).mockResolvedValueOnce(0);

      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?history=me',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(200);
          const json = await res.json();
          expect(json.success).toBe(true);
          expect(json.products).toEqual([]);
          expect(json.total).toBe(0);
        },
      });
    });
  });

  // ==================== STORY 7.13 + 7.17: PARAMETER CONFLICT VALIDATION ====================

  describe('Parameter Conflict Validation', () => {
    it('should return 400 if owner and history both provided', async () => {
      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?owner=me&history=me',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(400);
          const json = await res.json();
          expect(json.error).toBe('Only one filter allowed: owner, company, history, or incoming');
          expect(json.code).toBe('VALIDATION_ERROR');
        },
      });
    });

    it('should return 400 if company and history both provided', async () => {
      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?company=me&history=me',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(400);
          const json = await res.json();
          expect(json.error).toBe('Only one filter allowed: owner, company, history, or incoming');
          expect(json.code).toBe('VALIDATION_ERROR');
        },
      });
    });

    it('should return 400 if owner and company both provided', async () => {
      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?owner=me&company=me',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(400);
          const json = await res.json();
          expect(json.error).toBe('Only one filter allowed: owner, company, history, or incoming');
          expect(json.code).toBe('VALIDATION_ERROR');
        },
      });
    });

    it('should return 400 if all four filters provided', async () => {
      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?owner=me&company=me&history=me&incoming=me',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(400);
          const json = await res.json();
          expect(json.error).toBe('Only one filter allowed: owner, company, history, or incoming');
          expect(json.code).toBe('VALIDATION_ERROR');
        },
      });
    });

    it('should return 400 if incoming and owner both provided', async () => {
      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?incoming=me&owner=me',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(400);
          const json = await res.json();
          expect(json.error).toBe('Only one filter allowed: owner, company, history, or incoming');
          expect(json.code).toBe('VALIDATION_ERROR');
        },
      });
    });
  });

  // ==================== STORY 7.17: INCOMING SHIPMENTS ====================

  describe('Incoming Shipments (incoming=me)', () => {
    // Mock incoming products with shipping info
    const mockIncomingProducts = [
      {
        id: 'product-1',
        name: 'Organic Strawberries',
        origin: 'Helsinki Farm',
        blockchainId: 1,
        harvestDate: new Date('2025-12-01T00:00:00Z'),
        currentOwner: { name: 'Helsinki Farm' },
        createdAt: new Date('2025-12-01T10:00:00Z'),
        traceRecords: [
          {
            action: 'SHIPPED',
            createdAt: new Date('2025-12-02T10:00:00Z'),
            company: { name: 'Helsinki Farm' },
          },
        ],
      },
    ];

    it('should return 401 when incoming=me without session', async () => {
      getServerSession.mockResolvedValueOnce(null);

      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?incoming=me',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(401);
          const json = await res.json();
          expect(json.error).toBe('Authentication required');
          expect(json.code).toBe('UNAUTHORIZED');
        },
      });
    });

    it('should return 401 when session has no companyId', async () => {
      getServerSession.mockResolvedValueOnce({
        user: { id: 'user-1', email: 'admin@test.com', role: 'PLATFORM_ADMIN' },
      });

      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?incoming=me',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(401);
        },
      });
    });

    it('should return incoming products with IN_TRANSIT status', async () => {
      (mockPrisma.product.findMany as jest.Mock).mockResolvedValueOnce(mockIncomingProducts);
      (mockPrisma.product.count as jest.Mock).mockResolvedValueOnce(1);

      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?incoming=me',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(200);
          const json = await res.json();
          expect(json.success).toBe(true);
          expect(json.products).toHaveLength(1);
          expect(json.products[0].status).toBe('IN_TRANSIT');
        },
      });
    });

    it('should include shippedBy and shippedAt in response', async () => {
      (mockPrisma.product.findMany as jest.Mock).mockResolvedValueOnce(mockIncomingProducts);
      (mockPrisma.product.count as jest.Mock).mockResolvedValueOnce(1);

      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?incoming=me',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(200);
          const json = await res.json();
          expect(json.products[0].shippedBy).toEqual({ name: 'Helsinki Farm' });
          expect(json.products[0].shippedAt).toBe('2025-12-02T10:00:00.000Z');
        },
      });
    });

    it('should use SHIPPED + NOT RECEIVED filter for incoming query', async () => {
      (mockPrisma.product.findMany as jest.Mock).mockResolvedValueOnce([]);
      (mockPrisma.product.count as jest.Mock).mockResolvedValueOnce(0);

      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?incoming=me',
        test: async ({ fetch }) => {
          await fetch({ method: 'GET' });

          expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
              where: expect.objectContaining({
                traceRecords: {
                  some: {
                    action: 'SHIPPED',
                    recipientCompanyId: 'company-1',
                  },
                },
                NOT: {
                  traceRecords: {
                    some: {
                      action: 'RECEIVED',
                      companyId: 'company-1',
                    },
                  },
                },
              }),
            })
          );
        },
      });
    });

    it('should return empty array when no incoming shipments', async () => {
      (mockPrisma.product.findMany as jest.Mock).mockResolvedValueOnce([]);
      (mockPrisma.product.count as jest.Mock).mockResolvedValueOnce(0);

      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?incoming=me',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(200);
          const json = await res.json();
          expect(json.success).toBe(true);
          expect(json.products).toEqual([]);
          expect(json.total).toBe(0);
        },
      });
    });

    it('should support pagination for incoming query', async () => {
      (mockPrisma.product.findMany as jest.Mock).mockResolvedValueOnce([]);
      (mockPrisma.product.count as jest.Mock).mockResolvedValueOnce(0);

      await testApiHandler({
        pagesHandler: handler,
        url: '/api/products?incoming=me&limit=10&offset=5',
        test: async ({ fetch }) => {
          await fetch({ method: 'GET' });

          expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
              take: 10,
              skip: 5,
            })
          );
        },
      });
    });
  });
});
