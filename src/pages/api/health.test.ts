/**
 * @jest-environment node
 */
// Health Check API Tests
// Story 13.2: Health Check Endpoint & Render.com Setup
// Tests for GET /api/health

// IMPORTANT: next-test-api-route-handler must be imported first
import { testApiHandler } from 'next-test-api-route-handler';
import * as handler from './health';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    $queryRaw: jest.fn(),
  },
}));

// Mock viem
jest.mock('viem', () => ({
  createPublicClient: jest.fn(() => ({
    getBlockNumber: jest.fn(),
  })),
  http: jest.fn(() => 'mock-transport'),
}));

jest.mock('viem/chains', () => ({
  sepolia: { id: 11155111, name: 'Sepolia' },
}));

// Get mocked modules
const { prisma } = jest.requireMock('@/lib/prisma');
const { createPublicClient } = jest.requireMock('viem');

describe('/api/health', () => {
  // Store original env
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    // Set up environment
    process.env = {
      ...originalEnv,
      SEPOLIA_RPC_URL: 'https://eth-sepolia.test.com',
    };
    // Default: both services healthy
    prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);
    createPublicClient.mockReturnValue({
      getBlockNumber: jest.fn().mockResolvedValue(BigInt(12345678)),
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('GET - Health Check', () => {
    it('returns 200 with healthy status when all services connected', async () => {
      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });

          expect(res.status).toBe(200);

          const data = await res.json();
          expect(data.status).toBe('healthy');
          expect(data.database).toBe('connected');
          expect(data.blockchain).toBe('connected');
          expect(data.timestamp).toBeDefined();
          expect(data.error).toBeUndefined();
        },
      });
    });

    it('returns 500 with unhealthy status when database fails', async () => {
      // Mock database failure
      prisma.$queryRaw.mockRejectedValue(new Error('Connection refused'));

      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });

          expect(res.status).toBe(500);

          const data = await res.json();
          expect(data.status).toBe('unhealthy');
          expect(data.database).toBe('error');
          expect(data.error).toContain('Database');
        },
      });
    });

    it('returns 200 with blockchain timeout (lenient mode)', async () => {
      // Mock blockchain timeout
      const timeoutError = new Error('Timeout');
      timeoutError.name = 'TimeoutError';
      createPublicClient.mockReturnValue({
        getBlockNumber: jest.fn().mockRejectedValue(timeoutError),
      });

      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });

          // Lenient: 200 even with blockchain timeout
          expect(res.status).toBe(200);

          const data = await res.json();
          expect(data.status).toBe('healthy');
          expect(data.database).toBe('connected');
          expect(data.blockchain).toBe('timeout');
          expect(data.error).toContain('RPC timeout');
        },
      });
    });

    it('returns 200 with blockchain error (lenient mode)', async () => {
      // Mock blockchain error (not timeout)
      createPublicClient.mockReturnValue({
        getBlockNumber: jest.fn().mockRejectedValue(new Error('RPC unavailable')),
      });

      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });

          // Lenient: 200 even with blockchain error
          expect(res.status).toBe(200);

          const data = await res.json();
          expect(data.status).toBe('healthy');
          expect(data.database).toBe('connected');
          expect(data.blockchain).toBe('error');
          expect(data.error).toContain('RPC unavailable');
        },
      });
    });

    it('handles missing SEPOLIA_RPC_URL gracefully', async () => {
      // Remove RPC URL from env
      delete process.env.SEPOLIA_RPC_URL;

      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });

          // Lenient: 200 even without RPC URL
          expect(res.status).toBe(200);

          const data = await res.json();
          expect(data.status).toBe('healthy');
          expect(data.blockchain).toBe('error');
          expect(data.error).toContain('RPC URL not configured');
        },
      });
    });

    it('includes timestamp in ISO format', async () => {
      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });
          const data = await res.json();

          // Verify timestamp is valid ISO string
          const timestamp = new Date(data.timestamp);
          expect(timestamp.toISOString()).toBe(data.timestamp);
        },
      });
    });
  });
});
