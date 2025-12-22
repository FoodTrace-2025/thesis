/**
 * @jest-environment node
 */
// Single Product Lookup API Tests
// Story 7.7: GET /api/products/[id]
// Tests for product lookup by blockchainId or internal id

// IMPORTANT: next-test-api-route-handler must be imported first
import { testApiHandler } from 'next-test-api-route-handler';

import * as handler from './[id]';
import { prisma } from '@/lib/prisma';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findFirst: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe.skip('GET /api/products/[id]', () => {
  // Mock product
  const mockProduct = {
    id: 'cuid-product-1',
    name: 'Organic Strawberries',
    origin: 'Helsinki Farm',
    blockchainId: 100,
    harvestDate: new Date('2025-12-01T00:00:00Z'),
    transactionHash: '0x1234567890abcdef',
    currentOwner: { name: 'Helsinki Distributors' },
    company: { name: 'Helsinki Farm' },
    createdAt: new Date('2025-12-01T10:00:00Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== METHOD VALIDATION ====================

  describe('Method Validation', () => {
    it('should return 405 for POST requests', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: '100' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'POST' });
          expect(res.status).toBe(405);
          const json = await res.json();
          expect(json.error).toBe('Method not allowed');
        },
      });
    });

    it('should return 405 for PUT requests', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: '100' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'PUT' });
          expect(res.status).toBe(405);
        },
      });
    });
  });

  // ==================== LOOKUP BY BLOCKCHAIN ID ====================

  describe('Lookup by blockchainId', () => {
    it('should return 200 with product when found by blockchainId', async () => {
      (mockPrisma.product.findFirst as jest.Mock).mockResolvedValue(mockProduct);

      await testApiHandler({
        pagesHandler: handler,
        params: { id: '100' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(200);
          const json = await res.json();
          expect(json.success).toBe(true);
          expect(json.product.blockchainId).toBe(100);
          expect(json.product.name).toBe('Organic Strawberries');
        },
      });
    });

    it('should query by blockchainId when id is numeric', async () => {
      (mockPrisma.product.findFirst as jest.Mock).mockResolvedValue(mockProduct);

      await testApiHandler({
        pagesHandler: handler,
        params: { id: '100' },
        test: async ({ fetch }) => {
          await fetch({ method: 'GET' });
          expect(mockPrisma.product.findFirst).toHaveBeenCalledWith({
            where: { blockchainId: 100 },
            include: {
              currentOwner: { select: { name: true } },
              company: { select: { name: true } },
            },
          });
        },
      });
    });

    it('should return 404 when product not found by blockchainId', async () => {
      (mockPrisma.product.findFirst as jest.Mock).mockResolvedValue(null);

      await testApiHandler({
        pagesHandler: handler,
        params: { id: '999' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          expect(res.status).toBe(404);
          const json = await res.json();
          expect(json.error).toBe('Product not found');
          expect(json.code).toBe('NOT_FOUND');
        },
      });
    });
  });

  // ==================== LOOKUP BY INTERNAL ID ====================

  describe('Lookup by internal id', () => {
    it('should query by internal id when id is non-numeric (cuid)', async () => {
      (mockPrisma.product.findFirst as jest.Mock).mockResolvedValue(mockProduct);

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'cuid-product-1' },
        test: async ({ fetch }) => {
          await fetch({ method: 'GET' });
          expect(mockPrisma.product.findFirst).toHaveBeenCalledWith({
            where: { id: 'cuid-product-1' },
            include: {
              currentOwner: { select: { name: true } },
              company: { select: { name: true } },
            },
          });
        },
      });
    });
  });

  // ==================== RESPONSE FORMAT ====================

  describe('Response Format', () => {
    it('should include all required fields', async () => {
      (mockPrisma.product.findFirst as jest.Mock).mockResolvedValue(mockProduct);

      await testApiHandler({
        pagesHandler: handler,
        params: { id: '100' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          const json = await res.json();

          expect(json.product).toHaveProperty('id');
          expect(json.product).toHaveProperty('name');
          expect(json.product).toHaveProperty('origin');
          expect(json.product).toHaveProperty('blockchainId');
          expect(json.product).toHaveProperty('harvestDate');
          expect(json.product).toHaveProperty('transactionHash');
          expect(json.product).toHaveProperty('currentOwner');
          expect(json.product).toHaveProperty('company');
          expect(json.product).toHaveProperty('createdAt');
        },
      });
    });

    it('should format dates as ISO strings', async () => {
      (mockPrisma.product.findFirst as jest.Mock).mockResolvedValue(mockProduct);

      await testApiHandler({
        pagesHandler: handler,
        params: { id: '100' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          const json = await res.json();

          expect(json.product.harvestDate).toBe('2025-12-01T00:00:00.000Z');
          expect(json.product.createdAt).toBe('2025-12-01T10:00:00.000Z');
        },
      });
    });

    it('should include company name (producer)', async () => {
      (mockPrisma.product.findFirst as jest.Mock).mockResolvedValue(mockProduct);

      await testApiHandler({
        pagesHandler: handler,
        params: { id: '100' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          const json = await res.json();

          expect(json.product.company.name).toBe('Helsinki Farm');
        },
      });
    });

    it('should include currentOwner name', async () => {
      (mockPrisma.product.findFirst as jest.Mock).mockResolvedValue(mockProduct);

      await testApiHandler({
        pagesHandler: handler,
        params: { id: '100' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          const json = await res.json();

          expect(json.product.currentOwner.name).toBe('Helsinki Distributors');
        },
      });
    });
  });

  // ==================== ERROR HANDLING ====================

  describe('Error Handling', () => {
    it('should return 500 on database error', async () => {
      (mockPrisma.product.findFirst as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      );

      await testApiHandler({
        pagesHandler: handler,
        params: { id: '100' },
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
});
