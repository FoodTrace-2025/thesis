/**
 * @jest-environment node
 */
// Get Trace History API Tests
// Story 7.3: GET Trace History API
// Tests for GET /api/products/:id/trace-history

// IMPORTANT: next-test-api-route-handler must be imported first
import { testApiHandler } from 'next-test-api-route-handler';
import * as handler from './trace-history';
import { prisma } from '@/lib/prisma';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findUnique: jest.fn(),
    },
    traceRecord: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('GET /api/products/:id/trace-history', () => {
  // Mock product
  const mockProduct = {
    id: 'test-product-id',
  };

  // Mock trace records
  const mockTraceRecords = [
    {
      id: 'trace-1',
      action: 'RECEIVED',
      location: 'Helsinki Distribution Center',
      notes: 'Product received in good condition, temperature 2.1C',
      user: {
        name: 'Liisa Korhonen',
        role: 'DISTRIBUTOR',
      },
      company: {
        name: 'Helsinki Distributors',
      },
      transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      createdAt: new Date('2025-12-04T10:00:00Z'),
    },
    {
      id: 'trace-2',
      action: 'SHIPPED',
      location: 'Logistics Hub',
      notes: null,
      user: {
        name: 'Jari Virtanen',
        role: 'DISTRIBUTOR',
      },
      company: {
        name: 'Helsinki Distributors',
      },
      transactionHash: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      createdAt: new Date('2025-12-04T11:00:00Z'),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Default: product exists
    (mockPrisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

    // Default: trace records exist
    (mockPrisma.traceRecord.findMany as jest.Mock).mockResolvedValue(mockTraceRecords);
    (mockPrisma.traceRecord.count as jest.Mock).mockResolvedValue(2);
  });

  // ==================== PRODUCT VALIDATION ====================

  describe('Product Validation', () => {
    it('should return 404 when product does not exist', async () => {
      (mockPrisma.product.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'non-existent-product' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(404);
          const json = await res.json();
          expect(json.error).toBe('Product not found');
          expect(json.code).toBe('PRODUCT_NOT_FOUND');
        },
      });
    });
  });

  // ==================== EMPTY HISTORY ====================

  describe('Empty History', () => {
    it('should return 200 with empty array when no trace records', async () => {
      (mockPrisma.traceRecord.findMany as jest.Mock).mockResolvedValueOnce([]);
      (mockPrisma.traceRecord.count as jest.Mock).mockResolvedValueOnce(0);

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(200);
          const json = await res.json();
          expect(json.success).toBe(true);
          expect(json.traceRecords).toEqual([]);
          expect(json.total).toBe(0);
          expect(json.limit).toBe(50);
          expect(json.offset).toBe(0);
        },
      });
    });
  });

  // ==================== SUCCESS CASES ====================

  describe('Success Cases', () => {
    it('should return 200 with trace records', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(200);
          const json = await res.json();
          expect(json.success).toBe(true);
          expect(json.traceRecords).toHaveLength(2);
          expect(json.total).toBe(2);
        },
      });
    });

    it('should include actor name, role, and company', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          const json = await res.json();

          expect(json.traceRecords[0].actor).toEqual({
            name: 'Liisa Korhonen',
            role: 'DISTRIBUTOR',
            company: 'Helsinki Distributors',
          });
        },
      });
    });

    it('should include etherscanLink for each record', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          const json = await res.json();

          expect(json.traceRecords[0].etherscanLink).toBe(
            'https://sepolia.etherscan.io/tx/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
          );
        },
      });
    });

    it('should sort by createdAt ascending (oldest first)', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });

          // Verify Prisma was called with correct orderBy
          expect(mockPrisma.traceRecord.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
              orderBy: { createdAt: 'asc' },
            })
          );

          const json = await res.json();
          expect(json.traceRecords[0].createdAt).toBe('2025-12-04T10:00:00.000Z');
          expect(json.traceRecords[1].createdAt).toBe('2025-12-04T11:00:00.000Z');
        },
      });
    });

    it('should handle null notes', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          const json = await res.json();

          expect(json.traceRecords[1].notes).toBeNull();
        },
      });
    });
  });

  // ==================== PAGINATION ====================

  describe('Pagination', () => {
    it('should use default limit=50 and offset=0', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });

          expect(mockPrisma.traceRecord.findMany).toHaveBeenCalledWith(
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

    it('should respect custom limit and offset', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        url: '/api/products/test-product-id/trace-history?limit=10&offset=5',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });

          expect(mockPrisma.traceRecord.findMany).toHaveBeenCalledWith(
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

    it('should return correct total count', async () => {
      (mockPrisma.traceRecord.count as jest.Mock).mockResolvedValueOnce(25);

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          const json = await res.json();

          expect(json.total).toBe(25);
          expect(mockPrisma.traceRecord.count).toHaveBeenCalledWith({
            where: { productId: 'test-product-id' },
          });
        },
      });
    });
  });

  // ==================== VALIDATION ====================

  describe('Validation', () => {
    it('should return 400 for limit > 100', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        url: '/api/products/test-product-id/trace-history?limit=101',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(400);
          const json = await res.json();
          expect(json.error).toBe('Invalid pagination parameters');
          expect(json.code).toBe('VALIDATION_ERROR');
          expect(json.details).toBeDefined();
        },
      });
    });

    it('should return 400 for negative offset', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        url: '/api/products/test-product-id/trace-history?offset=-1',
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
        params: { id: 'test-product-id' },
        url: '/api/products/test-product-id/trace-history?limit=abc',
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
        params: { id: 'test-product-id' },
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
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'PUT' });
          expect(res.status).toBe(405);
        },
      });
    });

    it('should return 405 for DELETE method', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'DELETE' });
          expect(res.status).toBe(405);
        },
      });
    });
  });
});
