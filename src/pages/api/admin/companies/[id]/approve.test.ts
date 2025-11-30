/**
 * @jest-environment node
 */
// Company Approve API Tests
// Story 2.3: Company Approve API
// Tests for POST /api/admin/companies/:id/approve

// IMPORTANT: next-test-api-route-handler must be imported first
import { testApiHandler } from 'next-test-api-route-handler';
import * as handler from './approve';
import { prisma } from '@/lib/prisma';

// Mock NextAuth - must be before handler import
jest.mock('next-auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
  getServerSession: jest.fn(() =>
    Promise.resolve({
      user: {
        id: 'admin-user-id',
        email: 'admin@foodtrace.app',
        name: 'Platform Admin',
        role: 'PLATFORM_ADMIN',
        companyId: null,
      },
    })
  ),
}));

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    company: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

// Mock viem for deterministic tests
jest.mock('viem/accounts', () => ({
  generatePrivateKey: jest.fn(
    () =>
      '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
  ),
  privateKeyToAccount: jest.fn(() => ({
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
  })),
}));

// Mock encryption to avoid env dependency in tests
jest.mock('@/lib/crypto', () => ({
  encryptWalletKey: jest.fn(() => 'mock-encrypted-private-key'),
  getEncryptionKey: jest.fn(() => '0'.repeat(64)),
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('/api/admin/companies/[id]/approve', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPendingCompany = {
    id: 'test-company-id',
    name: 'Hirsimaki Farm Ltd',
    email: 'contact@hirsimakifarm.fi',
    domain: 'hirsimakifarm.fi',
    type: 'PRODUCER',
    status: 'PENDING',
    walletAddress: null,
    approvedAt: null,
    createdAt: new Date('2025-11-27T12:00:00.000Z'),
  };

  const mockApprovedCompany = {
    ...mockPendingCompany,
    status: 'APPROVED',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    approvedAt: new Date('2025-11-28T14:00:00.000Z'),
  };

  describe('POST - Approve Company', () => {
    it('approves PENDING company successfully (200)', async () => {
      // Mock: find company returns PENDING
      (mockPrisma.company.findUnique as jest.Mock).mockResolvedValue({
        id: mockPendingCompany.id,
        status: 'PENDING',
      });

      // Mock: transaction returns approved company
      (mockPrisma.$transaction as jest.Mock).mockImplementation(
        async (callback) => {
          const tx = {
            company: {
              update: jest.fn().mockResolvedValue(mockApprovedCompany),
            },
            auditLog: {
              create: jest.fn().mockResolvedValue({ id: 'audit-id' }),
            },
          };
          return callback(tx);
        }
      );

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-company-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'POST' });

          expect(res.status).toBe(200);

          const data = await res.json();
          expect(data.success).toBe(true);
          expect(data.company).toBeDefined();
          expect(data.company.status).toBe('APPROVED');
          expect(data.company.walletAddress).toBe(
            '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1'
          );
          expect(data.company.approvedAt).toBeDefined();
        },
      });
    });

    it('returns 404 for non-existent company', async () => {
      (mockPrisma.company.findUnique as jest.Mock).mockResolvedValue(null);

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'non-existent-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'POST' });

          expect(res.status).toBe(404);

          const data = await res.json();
          expect(data.error).toBe('Company not found');
          expect(data.code).toBe('NOT_FOUND');
        },
      });
    });

    it('returns 409 for already APPROVED company', async () => {
      (mockPrisma.company.findUnique as jest.Mock).mockResolvedValue({
        id: 'test-company-id',
        status: 'APPROVED',
      });

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-company-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'POST' });

          expect(res.status).toBe(409);

          const data = await res.json();
          expect(data.error).toBe('Company is already approved');
          expect(data.code).toBe('CONFLICT_ERROR');
        },
      });
    });

    it('returns 409 for REJECTED company', async () => {
      (mockPrisma.company.findUnique as jest.Mock).mockResolvedValue({
        id: 'test-company-id',
        status: 'REJECTED',
      });

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-company-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'POST' });

          expect(res.status).toBe(409);

          const data = await res.json();
          expect(data.error).toBe('Company was rejected');
          expect(data.code).toBe('CONFLICT_ERROR');
        },
      });
    });

    it('response includes walletAddress but not encryptedPrivateKey', async () => {
      (mockPrisma.company.findUnique as jest.Mock).mockResolvedValue({
        id: mockPendingCompany.id,
        status: 'PENDING',
      });

      (mockPrisma.$transaction as jest.Mock).mockImplementation(
        async (callback) => {
          const tx = {
            company: {
              update: jest.fn().mockResolvedValue(mockApprovedCompany),
            },
            auditLog: {
              create: jest.fn().mockResolvedValue({ id: 'audit-id' }),
            },
          };
          return callback(tx);
        }
      );

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-company-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'POST' });
          const data = await res.json();

          expect(data.company.walletAddress).toBeDefined();
          expect(data.company.encryptedPrivateKey).toBeUndefined();
        },
      });
    });

    it('creates AuditLog entry with correct action and walletAddress', async () => {
      (mockPrisma.company.findUnique as jest.Mock).mockResolvedValue({
        id: mockPendingCompany.id,
        status: 'PENDING',
      });

      let capturedAuditLog: unknown = null;

      (mockPrisma.$transaction as jest.Mock).mockImplementation(
        async (callback) => {
          const tx = {
            company: {
              update: jest.fn().mockResolvedValue(mockApprovedCompany),
            },
            auditLog: {
              create: jest.fn().mockImplementation((args) => {
                capturedAuditLog = args;
                return { id: 'audit-id' };
              }),
            },
          };
          return callback(tx);
        }
      );

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-company-id' },
        test: async ({ fetch }) => {
          await fetch({ method: 'POST' });

          expect(capturedAuditLog).toBeDefined();
          expect((capturedAuditLog as Record<string, unknown>).data).toEqual(
            expect.objectContaining({
              action: 'APPROVE_COMPANY',
              companyId: 'test-company-id',
              details: expect.objectContaining({
                walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
              }),
            })
          );
        },
      });
    });

    it('company approvedAt timestamp is set', async () => {
      (mockPrisma.company.findUnique as jest.Mock).mockResolvedValue({
        id: mockPendingCompany.id,
        status: 'PENDING',
      });

      let capturedUpdateData: unknown = null;

      (mockPrisma.$transaction as jest.Mock).mockImplementation(
        async (callback) => {
          const tx = {
            company: {
              update: jest.fn().mockImplementation((args) => {
                capturedUpdateData = args;
                return mockApprovedCompany;
              }),
            },
            auditLog: {
              create: jest.fn().mockResolvedValue({ id: 'audit-id' }),
            },
          };
          return callback(tx);
        }
      );

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-company-id' },
        test: async ({ fetch }) => {
          await fetch({ method: 'POST' });

          const updateArgs = capturedUpdateData as Record<string, unknown>;
          const data = updateArgs.data as Record<string, unknown>;

          expect(data.approvedAt).toBeInstanceOf(Date);
          expect(data.status).toBe('APPROVED');
        },
      });
    });

    it('returns 500 when transaction fails', async () => {
      (mockPrisma.company.findUnique as jest.Mock).mockResolvedValue({
        id: mockPendingCompany.id,
        status: 'PENDING',
      });

      (mockPrisma.$transaction as jest.Mock).mockRejectedValue(
        new Error('Database connection error')
      );

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-company-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'POST' });

          expect(res.status).toBe(500);

          const data = await res.json();
          expect(data.error).toBe('Failed to approve company');
          expect(data.code).toBe('SERVER_ERROR');
        },
      });
    });

    it('returns 500 when encryption key is missing', async () => {
      // This tests error handling when getEncryptionKey throws
      const { getEncryptionKey } = jest.requireMock('@/lib/crypto');
      (getEncryptionKey as jest.Mock).mockImplementationOnce(() => {
        throw new Error(
          'WALLET_ENCRYPTION_KEY environment variable is not configured'
        );
      });

      (mockPrisma.company.findUnique as jest.Mock).mockResolvedValue({
        id: mockPendingCompany.id,
        status: 'PENDING',
      });

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-company-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'POST' });

          expect(res.status).toBe(500);

          const data = await res.json();
          expect(data.error).toBe('Failed to approve company');
          expect(data.code).toBe('SERVER_ERROR');
        },
      });
    });
  });

  describe('Method validation', () => {
    it('returns 405 for GET method', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-company-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });

          expect(res.status).toBe(405);

          const data = await res.json();
          expect(data.error).toBe('Method not allowed');
        },
      });
    });

    it('returns 405 for PUT method', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-company-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'PUT' });

          expect(res.status).toBe(405);
        },
      });
    });

    it('returns 405 for DELETE method', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-company-id' },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'DELETE' });

          expect(res.status).toBe(405);
        },
      });
    });
  });
});
