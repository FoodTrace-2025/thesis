/**
 * @jest-environment node
 */
// Company Reject API Tests
// Story 2.4: Company Reject API
// Tests for POST /api/admin/companies/:id/reject

// IMPORTANT: next-test-api-route-handler must be imported first
import { testApiHandler } from 'next-test-api-route-handler';
import * as handler from './reject';
import { prisma } from '@/lib/prisma';

// Mock NextAuth - must be before handler import
jest.mock('next-auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
  getServerSession: jest.fn(() =>
    Promise.resolve({
      user: {
        id: 'admin-user-id',
        email: 'admin@foodtrace.local',
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

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('/api/admin/companies/[id]/reject', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPendingCompany = {
    id: 'test-company-id',
    name: 'Test Company Ltd',
    email: 'contact@testcompany.fi',
    domain: 'testcompany.fi',
    type: 'PRODUCER',
    status: 'PENDING',
    rejectionReason: null,
    createdAt: new Date('2025-11-27T12:00:00.000Z'),
  };

  const mockRejectedCompany = {
    ...mockPendingCompany,
    status: 'REJECTED',
    rejectionReason: 'Incomplete business documentation',
  };

  describe('POST - Reject Company', () => {
    it('rejects PENDING company successfully (200)', async () => {
      // Mock: find company returns PENDING
      (mockPrisma.company.findUnique as jest.Mock).mockResolvedValue({
        id: mockPendingCompany.id,
        status: 'PENDING',
      });

      // Mock: transaction returns rejected company
      (mockPrisma.$transaction as jest.Mock).mockImplementation(
        async (callback) => {
          const tx = {
            company: {
              update: jest.fn().mockResolvedValue(mockRejectedCompany),
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
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: 'Incomplete business documentation' }),
          });

          expect(res.status).toBe(200);

          const data = await res.json();
          expect(data.success).toBe(true);
          expect(data.company).toBeDefined();
          expect(data.company.status).toBe('REJECTED');
          expect(data.company.rejectionReason).toBe('Incomplete business documentation');
        },
      });
    });

    it('returns 404 for non-existent company', async () => {
      (mockPrisma.company.findUnique as jest.Mock).mockResolvedValue(null);

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'non-existent-id' },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: 'Some reason' }),
          });

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
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: 'Some reason' }),
          });

          expect(res.status).toBe(409);

          const data = await res.json();
          expect(data.error).toBe('Company is already approved');
          expect(data.code).toBe('CONFLICT_ERROR');
        },
      });
    });

    it('returns 409 for already REJECTED company', async () => {
      (mockPrisma.company.findUnique as jest.Mock).mockResolvedValue({
        id: 'test-company-id',
        status: 'REJECTED',
      });

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-company-id' },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: 'Some reason' }),
          });

          expect(res.status).toBe(409);

          const data = await res.json();
          expect(data.error).toBe('Company is already rejected');
          expect(data.code).toBe('CONFLICT_ERROR');
        },
      });
    });

    it('returns 400 for missing reason', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-company-id' },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
          });

          expect(res.status).toBe(400);

          const data = await res.json();
          expect(data.error).toBe('Validation failed');
          expect(data.code).toBe('VALIDATION_ERROR');
          expect(data.details).toBeDefined();
          expect(data.details.length).toBeGreaterThan(0);
        },
      });
    });

    it('returns 400 for empty reason', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-company-id' },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: '' }),
          });

          expect(res.status).toBe(400);

          const data = await res.json();
          expect(data.error).toBe('Validation failed');
          expect(data.code).toBe('VALIDATION_ERROR');
          expect(data.details).toContainEqual(
            expect.objectContaining({
              field: 'reason',
              message: 'Rejection reason is required',
            })
          );
        },
      });
    });

    it('returns 400 for reason exceeding 500 characters', async () => {
      const longReason = 'a'.repeat(501);

      await testApiHandler({
        pagesHandler: handler,
        params: { id: 'test-company-id' },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: longReason }),
          });

          expect(res.status).toBe(400);

          const data = await res.json();
          expect(data.error).toBe('Validation failed');
          expect(data.code).toBe('VALIDATION_ERROR');
          expect(data.details).toContainEqual(
            expect.objectContaining({
              field: 'reason',
              message: 'Rejection reason must be at most 500 characters',
            })
          );
        },
      });
    });

    it('creates AuditLog entry with correct action and reason', async () => {
      (mockPrisma.company.findUnique as jest.Mock).mockResolvedValue({
        id: mockPendingCompany.id,
        status: 'PENDING',
      });

      let capturedAuditLog: unknown = null;

      (mockPrisma.$transaction as jest.Mock).mockImplementation(
        async (callback) => {
          const tx = {
            company: {
              update: jest.fn().mockResolvedValue(mockRejectedCompany),
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
          await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: 'Incomplete business documentation' }),
          });

          expect(capturedAuditLog).toBeDefined();
          expect((capturedAuditLog as Record<string, unknown>).data).toEqual(
            expect.objectContaining({
              action: 'REJECT_COMPANY',
              companyId: 'test-company-id',
              details: expect.objectContaining({
                reason: 'Incomplete business documentation',
              }),
            })
          );
        },
      });
    });

    it('stores rejectionReason correctly in company update', async () => {
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
                return mockRejectedCompany;
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
          await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: 'Failed compliance check' }),
          });

          const updateArgs = capturedUpdateData as Record<string, unknown>;
          const data = updateArgs.data as Record<string, unknown>;

          expect(data.status).toBe('REJECTED');
          expect(data.rejectionReason).toBe('Failed compliance check');
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
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: 'Some reason' }),
          });

          expect(res.status).toBe(500);

          const data = await res.json();
          expect(data.error).toBe('Failed to reject company');
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
