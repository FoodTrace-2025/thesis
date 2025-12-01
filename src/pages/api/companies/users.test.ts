/**
 * @jest-environment node
 */
// Company Employee API Tests
// Story 2.7: Create Company Employee API
// Tests for POST /api/companies/users

// IMPORTANT: next-test-api-route-handler must be imported first
import { testApiHandler } from 'next-test-api-route-handler';
import * as handler from './users';
import { prisma } from '@/lib/prisma';

// Mock NextAuth - default to COMPANY_ADMIN session
jest.mock('next-auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
  getServerSession: jest.fn(() =>
    Promise.resolve({
      user: {
        id: 'company-admin-id',
        email: 'admin@producer.farm',
        name: 'Company Admin',
        role: 'COMPANY_ADMIN',
        companyId: 'test-producer-company',
      },
    })
  ),
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('$2b$10$hashedpassword')),
}));

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
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

describe('/api/companies/users', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset to COMPANY_ADMIN session with PRODUCER company by default
    getServerSession.mockResolvedValue({
      user: {
        id: 'company-admin-id',
        email: 'admin@producer.farm',
        name: 'Company Admin',
        role: 'COMPANY_ADMIN',
        companyId: 'test-producer-company',
      },
    });

    // Mock user lookup for requireCompanyAdmin middleware (returns user with company)
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'company-admin-id',
      company: {
        id: 'test-producer-company',
        domain: 'producer.farm',
        type: 'PRODUCER',
        status: 'APPROVED',
      },
    });
  });

  // Valid test data
  const validEmployeeData = {
    email: 'worker@producer.farm',
    password: 'WorkerPass123!',
    name: 'Farm Worker',
    role: 'PRODUCER',
  };

  const mockCreatedUser = {
    id: 'new-employee-id',
    email: 'worker@producer.farm',
    name: 'Farm Worker',
    role: 'PRODUCER',
    companyId: 'test-producer-company',
    createdAt: new Date('2025-12-01T10:00:00Z'),
  };

  describe('POST - Create Company Employee', () => {
    it('creates employee with valid data (201)', async () => {
      // Mock: no existing user with this email
      (mockPrisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce({
          // First call: requireCompanyAdmin middleware
          id: 'company-admin-id',
          company: {
            id: 'test-producer-company',
            domain: 'producer.farm',
            type: 'PRODUCER',
            status: 'APPROVED',
          },
        })
        .mockResolvedValueOnce(null); // Second call: email uniqueness check

      // Mock: transaction creates user and audit log
      (mockPrisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
        const tx = {
          user: {
            create: jest.fn().mockResolvedValue(mockCreatedUser),
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
            body: JSON.stringify(validEmployeeData),
          });

          expect(res.status).toBe(201);

          const data = await res.json();
          expect(data.success).toBe(true);
          expect(data.user).toBeDefined();
          expect(data.user.email).toBe(validEmployeeData.email);
          expect(data.user.name).toBe(validEmployeeData.name);
          expect(data.user.role).toBe('PRODUCER');
          expect(data.user.companyId).toBe('test-producer-company');
          // Ensure passwordHash is NOT in response
          expect(data.user.passwordHash).toBeUndefined();
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
            body: JSON.stringify({ email: 'test@producer.farm' }), // Missing password, name, role
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
              ...validEmployeeData,
              email: 'not-an-email',
            }),
          });

          expect(res.status).toBe(400);

          const data = await res.json();
          expect(data.code).toBe('VALIDATION_ERROR');
        },
      });
    });

    it('returns 400 for email domain mismatch', async () => {
      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...validEmployeeData,
              email: 'worker@wrongdomain.com', // Does not match company domain
            }),
          });

          expect(res.status).toBe(400);

          const data = await res.json();
          expect(data.code).toBe('INVALID_EMAIL_DOMAIN');
          expect(data.error).toContain('producer.farm');
        },
      });
    });

    it('returns 400 for role mismatch (role doesn\'t match company type)', async () => {
      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...validEmployeeData,
              role: 'DISTRIBUTOR', // Company type is PRODUCER, not DISTRIBUTOR
            }),
          });

          expect(res.status).toBe(400);

          const data = await res.json();
          expect(data.code).toBe('ROLE_MISMATCH');
          expect(data.error).toContain('PRODUCER');
        },
      });
    });

    it('returns 400 for invalid role (PLATFORM_ADMIN/COMPANY_ADMIN rejected by Zod)', async () => {
      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...validEmployeeData,
              role: 'PLATFORM_ADMIN', // Not allowed by Zod enum
            }),
          });

          expect(res.status).toBe(400);

          const data = await res.json();
          expect(data.code).toBe('VALIDATION_ERROR');
        },
      });
    });

    it('returns 409 for duplicate email', async () => {
      // Mock: existing user found (after middleware)
      (mockPrisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce({
          // First call: requireCompanyAdmin middleware
          id: 'company-admin-id',
          company: {
            id: 'test-producer-company',
            domain: 'producer.farm',
            type: 'PRODUCER',
            status: 'APPROVED',
          },
        })
        .mockResolvedValueOnce({ id: 'existing-user-id' }); // Second call: email exists

      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validEmployeeData),
          });

          expect(res.status).toBe(409);

          const data = await res.json();
          expect(data.code).toBe('DUPLICATE_EMAIL');
          expect(data.error).toContain('already exists');
        },
      });
    });
  });

  describe('Authentication', () => {
    it('returns 401 for no session', async () => {
      // Mock: no session
      getServerSession.mockResolvedValue(null);

      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validEmployeeData),
          });

          expect(res.status).toBe(401);

          const data = await res.json();
          expect(data.code).toBe('UNAUTHORIZED');
        },
      });
    });

    it('returns 403 for non-COMPANY_ADMIN role', async () => {
      // Mock: session with PRODUCER role (not COMPANY_ADMIN)
      getServerSession.mockResolvedValue({
        user: {
          id: 'producer-id',
          email: 'worker@producer.farm',
          name: 'Producer Worker',
          role: 'PRODUCER', // Not COMPANY_ADMIN
          companyId: 'test-producer-company',
        },
      });

      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validEmployeeData),
          });

          expect(res.status).toBe(403);

          const data = await res.json();
          expect(data.code).toBe('FORBIDDEN');
        },
      });
    });

    it('returns 403 for company not approved', async () => {
      // Mock: user with PENDING company
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'company-admin-id',
        company: {
          id: 'test-producer-company',
          domain: 'producer.farm',
          type: 'PRODUCER',
          status: 'PENDING', // Not APPROVED
        },
      });

      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validEmployeeData),
          });

          expect(res.status).toBe(403);

          const data = await res.json();
          expect(data.code).toBe('COMPANY_NOT_APPROVED');
        },
      });
    });
  });

  describe('Method validation', () => {
    it('returns 405 for non-POST methods', async () => {
      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' });

          expect(res.status).toBe(405);

          const data = await res.json();
          expect(data.error).toBe('Method not allowed');
          expect(data.code).toBe('METHOD_NOT_ALLOWED');
        },
      });
    });
  });
});
