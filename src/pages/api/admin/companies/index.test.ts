/**
 * @jest-environment node
 */
// Company API Tests
// Story 2.2: Company Creation API
// Tests for POST /api/admin/companies and GET /api/admin/companies

// IMPORTANT: next-test-api-route-handler must be imported first
import { testApiHandler } from 'next-test-api-route-handler';
import * as handler from './index';
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
      findMany: jest.fn(),
      create: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('/api/admin/companies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST - Create Company', () => {
    const validCompanyData = {
      name: 'Hirsimaki Farm Ltd',
      email: 'contact@hirsimakifarm.fi',
      domain: 'hirsimakifarm.fi',
      type: 'PRODUCER',
    };

    it('creates company with valid data (201)', async () => {
      const mockCompany = {
        id: 'test-company-id',
        ...validCompanyData,
        status: 'PENDING',
        walletAddress: null,
        createdAt: new Date(),
      };

      // Mock: no existing company
      (mockPrisma.company.findUnique as jest.Mock).mockResolvedValue(null);

      // Mock: transaction creates company and audit log
      (mockPrisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
        const tx = {
          company: {
            create: jest.fn().mockResolvedValue(mockCompany),
          },
          auditLog: {
            create: jest.fn().mockResolvedValue({ id: 'audit-id' }),
          },
        };
        return callback(tx);
      });

      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validCompanyData),
          });

          expect(res.status).toBe(201);

          const data = await res.json();
          expect(data.success).toBe(true);
          expect(data.company).toBeDefined();
          expect(data.company.name).toBe(validCompanyData.name);
          expect(data.company.email).toBe(validCompanyData.email);
          expect(data.company.status).toBe('PENDING');
        },
      });
    });

    it('returns 400 for missing required fields', async () => {
      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test' }), // Missing email, domain, type
          });

          expect(res.status).toBe(400);

          const data = await res.json();
          expect(data.error).toBe('Validation failed');
          expect(data.code).toBe('VALIDATION_ERROR');
          expect(data.details).toBeDefined();
          expect(Array.isArray(data.details)).toBe(true);
        },
      });
    });

    it('returns 400 for invalid email format', async () => {
      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...validCompanyData,
              email: 'not-an-email',
            }),
          });

          expect(res.status).toBe(400);

          const data = await res.json();
          expect(data.code).toBe('VALIDATION_ERROR');
        },
      });
    });

    it('returns 400 when email does not match domain', async () => {
      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Test Farm',
              email: 'contact@otherdomain.com', // Does not match domain
              domain: 'testfarm.fi',
              type: 'PRODUCER',
            }),
          });

          expect(res.status).toBe(400);

          const data = await res.json();
          expect(data.code).toBe('VALIDATION_ERROR');
          expect(data.details).toContainEqual(
            expect.objectContaining({
              field: 'email',
              message: expect.stringContaining('match'),
            })
          );
        },
      });
    });

    it('returns 409 for duplicate email', async () => {
      // Mock: existing company found
      (mockPrisma.company.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing-id',
      });

      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validCompanyData),
          });

          expect(res.status).toBe(409);

          const data = await res.json();
          expect(data.error).toContain('already exists');
          expect(data.code).toBe('DUPLICATE_ERROR');
        },
      });
    });

    it('returns 400 for invalid company type', async () => {
      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...validCompanyData,
              type: 'INVALID_TYPE',
            }),
          });

          expect(res.status).toBe(400);

          const data = await res.json();
          expect(data.code).toBe('VALIDATION_ERROR');
        },
      });
    });
  });

  describe('GET - List Companies', () => {
    const mockCompanies = [
      {
        id: 'company-1',
        name: 'Farm A',
        email: 'a@farma.fi',
        domain: 'farma.fi',
        type: 'PRODUCER',
        status: 'PENDING',
        walletAddress: null,
        createdAt: new Date(),
      },
      {
        id: 'company-2',
        name: 'Farm B',
        email: 'b@farmb.fi',
        domain: 'farmb.fi',
        type: 'DISTRIBUTOR',
        status: 'APPROVED',
        walletAddress: '0x1234',
        createdAt: new Date(),
      },
    ];

    it('returns list of all companies (200)', async () => {
      (mockPrisma.company.findMany as jest.Mock).mockResolvedValue(mockCompanies);

      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });

          expect(res.status).toBe(200);

          const data = await res.json();
          expect(data.success).toBe(true);
          expect(data.companies).toBeDefined();
          expect(Array.isArray(data.companies)).toBe(true);
          expect(data.count).toBe(2);
        },
      });
    });

    it('filters by status query parameter', async () => {
      const pendingCompanies = mockCompanies.filter((c) => c.status === 'PENDING');
      (mockPrisma.company.findMany as jest.Mock).mockResolvedValue(pendingCompanies);

      await testApiHandler({
        pagesHandler: handler,
        url: '/api/admin/companies?status=PENDING',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });

          expect(res.status).toBe(200);

          const data = await res.json();
          expect(data.count).toBe(1);
        },
      });

      // Verify Prisma was called with correct filter
      expect(mockPrisma.company.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'PENDING' },
        })
      );
    });

    it('returns 400 for invalid status filter', async () => {
      await testApiHandler({
        pagesHandler: handler,
        url: '/api/admin/companies?status=INVALID',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });

          expect(res.status).toBe(400);

          const data = await res.json();
          expect(data.code).toBe('VALIDATION_ERROR');
        },
      });
    });
  });

  describe('Method validation', () => {
    it('returns 405 for unsupported methods', async () => {
      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'DELETE' });

          expect(res.status).toBe(405);

          const data = await res.json();
          expect(data.error).toBe('Method not allowed');
        },
      });
    });
  });
});
