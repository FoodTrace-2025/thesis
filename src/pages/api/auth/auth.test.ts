/**
 * @jest-environment node
 */
// Authentication Tests
// Story 2.5: Admin Authentication
// Tests for NextAuth.js configuration and requirePlatformAdmin middleware

import { getServerSession } from 'next-auth';
import { requirePlatformAdmin } from '@/lib/auth/requireAdmin';
import type { NextApiRequest, NextApiResponse } from 'next';

// Mock NextAuth
jest.mock('next-auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
  getServerSession: jest.fn(),
}));

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

describe('Authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requirePlatformAdmin middleware', () => {
    let mockReq: Partial<NextApiRequest>;
    let mockRes: Partial<NextApiResponse>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
      jsonMock = jest.fn();
      statusMock = jest.fn(() => ({ json: jsonMock }));
      mockReq = {};
      mockRes = {
        status: statusMock,
        json: jsonMock,
      };
    });

    it('returns 401 without session', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const result = await requirePlatformAdmin(
        mockReq as NextApiRequest,
        mockRes as NextApiResponse
      );

      expect(result).toBeNull();
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Authentication required',
        code: 'UNAUTHORIZED',
      });
    });

    it('returns 403 with non-PLATFORM_ADMIN role', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          id: 'user-id',
          email: 'user@company.fi',
          name: 'Company User',
          role: 'PRODUCER',
          companyId: 'company-id',
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });

      const result = await requirePlatformAdmin(
        mockReq as NextApiRequest,
        mockRes as NextApiResponse
      );

      expect(result).toBeNull();
      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Platform admin access required',
        code: 'FORBIDDEN',
      });
    });

    it('returns 403 with COMPANY_ADMIN role', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          id: 'admin-id',
          email: 'admin@company.fi',
          name: 'Company Admin',
          role: 'COMPANY_ADMIN',
          companyId: 'company-id',
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });

      const result = await requirePlatformAdmin(
        mockReq as NextApiRequest,
        mockRes as NextApiResponse
      );

      expect(result).toBeNull();
      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Platform admin access required',
        code: 'FORBIDDEN',
      });
    });

    it('returns session with valid PLATFORM_ADMIN', async () => {
      const mockSession = {
        user: {
          id: 'admin-user-id',
          email: 'admin@foodtrace.app',
          name: 'Platform Admin',
          role: 'PLATFORM_ADMIN',
          companyId: null,
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
      mockGetServerSession.mockResolvedValue(mockSession);

      const result = await requirePlatformAdmin(
        mockReq as NextApiRequest,
        mockRes as NextApiResponse
      );

      expect(result).toEqual(mockSession);
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });

  describe('NextAuth configuration (authOptions)', () => {
    // Note: These tests verify the configuration structure
    // The actual authorize function requires bcrypt and Prisma,
    // which would need integration tests with a test database

    it('exports authOptions with correct session strategy', async () => {
      // Import the actual authOptions to verify configuration
      const { authOptions } = await import('./[...nextauth]');

      expect(authOptions.session).toBeDefined();
      expect(authOptions.session?.strategy).toBe('jwt');
      expect(authOptions.session?.maxAge).toBe(24 * 60 * 60); // 24 hours
    });

    it('exports authOptions with CredentialsProvider', async () => {
      const { authOptions } = await import('./[...nextauth]');

      expect(authOptions.providers).toBeDefined();
      expect(authOptions.providers.length).toBeGreaterThan(0);
      // CredentialsProvider uses 'Credentials' as the default name when name option is 'Email'
      expect(authOptions.providers[0].name).toBe('Credentials');
    });

    it('exports authOptions with custom pages', async () => {
      const { authOptions } = await import('./[...nextauth]');

      expect(authOptions.pages).toBeDefined();
      expect(authOptions.pages?.signIn).toBe('/login');
      expect(authOptions.pages?.error).toBe('/login');
    });

    it('exports authOptions with callbacks', async () => {
      const { authOptions } = await import('./[...nextauth]');

      expect(authOptions.callbacks).toBeDefined();
      expect(authOptions.callbacks?.jwt).toBeDefined();
      expect(authOptions.callbacks?.session).toBeDefined();
    });
  });
});
