/**
 * @jest-environment node
 */
// User API Tests
// Story 2.6: Create Company Admin User API
// Tests for POST /api/admin/users

// IMPORTANT: next-test-api-route-handler must be imported first
import { testApiHandler } from 'next-test-api-route-handler';
import * as handler from './users';
import { prisma } from '@/lib/prisma';

// Mock NextAuth - default to PLATFORM_ADMIN session
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

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn(() => Promise.resolve('$2b$10$hashedpassword')),
}));

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    company: {
      findUnique: jest.fn(),
    },
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

describe('/api/admin/users', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset to PLATFORM_ADMIN session by default
    getServerSession.mockResolvedValue({
      user: {
        id: 'admin-user-id',
        email: 'admin@foodtrace.app',
        name: 'Platform Admin',
        role: 'PLATFORM_ADMIN',
        companyId: null,
      },
    });
  });

  // Valid test data
  const validUserData = {
    email: 'admin@hirsimakifarm.fi',
    password: 'SecurePass123!',
    name: 'Company Admin',
    companyId: 'test-company-id',
  };

  const mockApprovedCompany = {
    id: 'test-company-id',
    status: 'APPROVED',
    domain: 'hirsimakifarm.fi',
  };

  const mockPendingCompany = {
    id: 'test-company-id',
    status: 'PENDING',
    domain: 'hirsimakifarm.fi',
  };

  const mockRejectedCompany = {
    id: 'test-company-id',
    status: 'REJECTED',
    domain: 'hirsimakifarm.fi',
  };

  const mockCreatedUser = {
    id: 'new-user-id',
    email: 'admin@hirsimakifarm.fi',
    name: 'Company Admin',
    role: 'COMPANY_ADMIN',
    companyId: 'test-company-id',
    createdAt: new Date('2025-12-01T10:00:00Z'),
  };

  describe('POST - Create Company Admin User', () => {
    it('creates user with valid data (201)', async () => {
      // Mock: company exists and is APPROVED
      (mockPrisma.company.findUnique as jest.Mock).mockResolvedValue(mockApprovedCompany);
      // Mock: no existing user
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
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
            body: JSON.stringify(validUserData),
          });

          expect(res.status).toBe(201);

          const data = await res.json();
          expect(data.success).toBe(true);
          expect(data.user).toBeDefined();
          expect(data.user.email).toBe(validUserData.email);
          expect(data.user.name).toBe(validUserData.name);
          expect(data.user.role).toBe('COMPANY_ADMIN');
          expect(data.user.companyId).toBe(validUserData.companyId);
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
            body: JSON.stringify({ email: 'test@test.com' }), // Missing password, name, companyId
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
              ...validUserData,
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
      // Mock: company exists and is APPROVED
      (mockPrisma.company.findUnique as jest.Mock).mockResolvedValue(mockApprovedCompany);

      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...validUserData,
              email: 'admin@wrongdomain.com', // Does not match company domain
            }),
          });

          expect(res.status).toBe(400);

          const data = await res.json();
          expect(data.code).toBe('INVALID_EMAIL_DOMAIN');
          expect(data.error).toContain('hirsimakifarm.fi');
        },
      });
    });

    it('returns 400 for company not approved (PENDING)', async () => {
      // Mock: company exists but is PENDING
      (mockPrisma.company.findUnique as jest.Mock).mockResolvedValue(mockPendingCompany);

      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validUserData),
          });

          expect(res.status).toBe(400);

          const data = await res.json();
          expect(data.code).toBe('COMPANY_NOT_APPROVED');
          expect(data.error).toBe('Company must be approved');
        },
      });
    });

    it('returns 400 for company not approved (REJECTED)', async () => {
      // Mock: company exists but is REJECTED
      (mockPrisma.company.findUnique as jest.Mock).mockResolvedValue(mockRejectedCompany);

      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validUserData),
          });

          expect(res.status).toBe(400);

          const data = await res.json();
          expect(data.code).toBe('COMPANY_NOT_APPROVED');
        },
      });
    });

    it('returns 404 for company not found', async () => {
      // Mock: company does not exist
      (mockPrisma.company.findUnique as jest.Mock).mockResolvedValue(null);

      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validUserData),
          });

          expect(res.status).toBe(404);

          const data = await res.json();
          expect(data.code).toBe('NOT_FOUND');
          expect(data.error).toBe('Company not found');
        },
      });
    });

    it('returns 409 for duplicate email', async () => {
      // Mock: company exists and is APPROVED
      (mockPrisma.company.findUnique as jest.Mock).mockResolvedValue(mockApprovedCompany);
      // Mock: existing user found
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing-user-id',
      });

      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validUserData),
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
            body: JSON.stringify(validUserData),
          });

          expect(res.status).toBe(401);

          const data = await res.json();
          expect(data.code).toBe('UNAUTHORIZED');
        },
      });
    });

    it('returns 403 for non-PLATFORM_ADMIN', async () => {
      // Mock: session with non-admin role
      getServerSession.mockResolvedValue({
        user: {
          id: 'user-id',
          email: 'user@company.com',
          name: 'Regular User',
          role: 'COMPANY_ADMIN', // Not PLATFORM_ADMIN
          companyId: 'some-company',
        },
      });

      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validUserData),
          });

          expect(res.status).toBe(403);

          const data = await res.json();
          expect(data.code).toBe('FORBIDDEN');
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

    it('returns 405 for DELETE method', async () => {
      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'DELETE' });

          expect(res.status).toBe(405);
        },
      });
    });
  });
});
