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
  // Mock product (includes fields for registration event - Story 9.3)
  const mockProduct = {
    id: 'test-product-id',
    origin: 'Hirsimäki Farm, Oulu',
    transactionHash: '0xregistration1234567890abcdef1234567890abcdef1234567890abcdef12345678',
    createdAt: new Date('2025-12-03T09:00:00Z'),
    company: { name: 'Hirsimäki Farm Oy' },
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

  // ==================== EMPTY TRACE HISTORY ====================

  describe('Empty Trace History', () => {
    it('should return registration event when no trace records', async () => {
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
          // Story 9.3: Registration event is always included
          expect(json.traceRecords).toHaveLength(1);
          expect(json.traceRecords[0].action).toBe('REGISTERED');
          expect(json.total).toBe(1);
          expect(json.limit).toBe(50);
          expect(json.offset).toBe(0);
        },
      });
    });
  });

  // ==================== SUCCESS CASES ====================

  describe('Success Cases', () => {
    it('should return 200 with registration + trace records', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(200);
          const json = await res.json();
          expect(json.success).toBe(true);
          // Story 9.3: 1 registration + 2 trace records = 3
          expect(json.traceRecords).toHaveLength(3);
          expect(json.total).toBe(3);
        },
      });
    });

    it('should include actor name, role, and company for trace records', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          const json = await res.json();

          // Index 1 is first trace record (index 0 is registration)
          expect(json.traceRecords[1].actor).toEqual({
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

          // Index 0 is registration, index 1 is first trace record
          expect(json.traceRecords[1].etherscanLink).toBe(
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
          // Index 0 is registration (2025-12-03), index 1-2 are trace records
          expect(json.traceRecords[0].createdAt).toBe('2025-12-03T09:00:00.000Z'); // Registration
          expect(json.traceRecords[1].createdAt).toBe('2025-12-04T10:00:00.000Z');
          expect(json.traceRecords[2].createdAt).toBe('2025-12-04T11:00:00.000Z');
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

          // Index 2 is second trace record (has null notes)
          expect(json.traceRecords[2].notes).toBeNull();
        },
      });
    });
  });

  // ==================== REGISTRATION EVENT (Story 9.3) ====================

  describe('Registration Event', () => {
    it('should include registration as first event', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          const json = await res.json();

          expect(json.traceRecords[0].action).toBe('REGISTERED');
          expect(json.traceRecords[0].id).toBe('registration');
        },
      });
    });

    it('should use product data for registration event', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          const json = await res.json();
          const reg = json.traceRecords[0];

          expect(reg.location).toBe('Hirsimäki Farm, Oulu');
          expect(reg.actor.company).toBe('Hirsimäki Farm Oy');
          expect(reg.actor.role).toBe('PRODUCER');
          expect(reg.actor.name).toBe('Producer');
          expect(reg.transactionHash).toBe('0xregistration1234567890abcdef1234567890abcdef1234567890abcdef12345678');
          expect(reg.etherscanLink).toBe(
            'https://sepolia.etherscan.io/tx/0xregistration1234567890abcdef1234567890abcdef1234567890abcdef12345678'
          );
        },
      });
    });

    it('should have null notes for registration event', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          const json = await res.json();

          expect(json.traceRecords[0].notes).toBeNull();
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

    it('should return correct total count including registration', async () => {
      (mockPrisma.traceRecord.count as jest.Mock).mockResolvedValueOnce(25);

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-product-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          const json = await res.json();

          // Story 9.3: total = trace records + 1 registration
          expect(json.total).toBe(26);
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
