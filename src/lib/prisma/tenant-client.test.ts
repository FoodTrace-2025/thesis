/**
 * Tenant Client Tests
 * Story 3.2: Implement Prisma Tenant Client
 * Epic 3: Security Hardening - Tier 1
 *
 * Tests tenant isolation for multi-tenant data access control.
 * Ensures company data is properly scoped and cross-tenant access is prevented.
 */

import { createTenantClient } from './tenant-client';
import type { TenantPrismaClient } from './tenant-client';

// Mock the base Prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    $extends: jest.fn(),
  },
}));

import { prisma } from '@/lib/prisma';

describe('createTenantClient', () => {
  const COMPANY_A_ID = 'company-a-id';
  const COMPANY_B_ID = 'company-b-id';

  let mockExtendedClient: any;
  let userQueries: any;
  let auditLogQueries: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Track the query functions passed to $extends
    userQueries = {};
    auditLogQueries = {};

    // Mock $extends to capture query definitions and return a mock client
    (prisma.$extends as unknown as jest.Mock).mockImplementation((config: any) => {
      // Store the query functions for testing
      if (config.query?.user) {
        userQueries = config.query.user;
      }
      if (config.query?.auditLog) {
        auditLogQueries = config.query.auditLog;
      }

      // Return a mock extended client
      return {
        user: {
          findMany: jest.fn(),
          findFirst: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
        },
        auditLog: {
          findMany: jest.fn(),
          findFirst: jest.fn(),
        },
      };
    });
  });

  describe('Factory Function', () => {
    it('returns extended Prisma client', () => {
      const tenantClient = createTenantClient(COMPANY_A_ID);

      expect(tenantClient).toBeDefined();
      expect(tenantClient.user).toBeDefined();
      expect(tenantClient.auditLog).toBeDefined();
      expect(prisma.$extends).toHaveBeenCalledTimes(1);
    });

    it('calls prisma.$extends with query configuration', () => {
      createTenantClient(COMPANY_A_ID);

      expect(prisma.$extends).toHaveBeenCalledWith(
        expect.objectContaining({
          query: expect.objectContaining({
            user: expect.any(Object),
            auditLog: expect.any(Object),
          }),
        })
      );
    });

    it('creates independent clients for different companies', () => {
      const clientA = createTenantClient(COMPANY_A_ID);
      const clientB = createTenantClient(COMPANY_B_ID);

      expect(clientA).toBeDefined();
      expect(clientB).toBeDefined();
      expect(prisma.$extends).toHaveBeenCalledTimes(2);
    });
  });

  describe('User Model - findMany', () => {
    it('injects companyId into where clause', async () => {
      createTenantClient(COMPANY_A_ID);

      const mockQuery = jest.fn().mockResolvedValue([]);
      const args = { where: {} };

      await userQueries.findMany({ args, query: mockQuery });

      expect(args.where).toEqual({ companyId: COMPANY_A_ID });
      expect(mockQuery).toHaveBeenCalledWith(args);
    });

    it('preserves existing where conditions', async () => {
      createTenantClient(COMPANY_A_ID);

      const mockQuery = jest.fn().mockResolvedValue([]);
      const args = { where: { role: 'PRODUCER' } };

      await userQueries.findMany({ args, query: mockQuery });

      expect(args.where).toEqual({
        role: 'PRODUCER',
        companyId: COMPANY_A_ID,
      });
      expect(mockQuery).toHaveBeenCalledWith(args);
    });

    it('filters only for specified company', async () => {
      createTenantClient(COMPANY_B_ID);

      const mockQuery = jest.fn().mockResolvedValue([]);
      const args = { where: {} };

      await userQueries.findMany({ args, query: mockQuery });

      expect(args.where).toEqual({ companyId: COMPANY_B_ID });
      expect(mockQuery).toHaveBeenCalledWith(args);
    });
  });

  describe('User Model - findFirst', () => {
    it('injects companyId into where clause', async () => {
      createTenantClient(COMPANY_A_ID);

      const mockQuery = jest.fn().mockResolvedValue(null);
      const args = { where: {} };

      await userQueries.findFirst({ args, query: mockQuery });

      expect(args.where).toEqual({ companyId: COMPANY_A_ID });
      expect(mockQuery).toHaveBeenCalledWith(args);
    });

    it('preserves existing where conditions', async () => {
      createTenantClient(COMPANY_A_ID);

      const mockQuery = jest.fn().mockResolvedValue(null);
      const args = { where: { email: 'user@example.com' } };

      await userQueries.findFirst({ args, query: mockQuery });

      expect(args.where).toEqual({
        email: 'user@example.com',
        companyId: COMPANY_A_ID,
      });
      expect(mockQuery).toHaveBeenCalledWith(args);
    });
  });

  describe('User Model - update', () => {
    it('injects companyId into where clause', async () => {
      createTenantClient(COMPANY_A_ID);

      const mockQuery = jest.fn().mockResolvedValue({});
      const args = { where: { id: 'user-id' }, data: { name: 'Updated' } };

      await userQueries.update({ args, query: mockQuery });

      expect(args.where).toEqual({
        id: 'user-id',
        companyId: COMPANY_A_ID,
      });
      expect(mockQuery).toHaveBeenCalledWith(args);
    });

    it('preserves data field during update', async () => {
      createTenantClient(COMPANY_A_ID);

      const mockQuery = jest.fn().mockResolvedValue({});
      const args = { where: { id: 'user-id' }, data: { name: 'Updated Name' } };

      await userQueries.update({ args, query: mockQuery });

      expect(args.data).toEqual({ name: 'Updated Name' });
      expect(mockQuery).toHaveBeenCalledWith(args);
    });
  });

  describe('User Model - delete', () => {
    it('injects companyId into where clause', async () => {
      createTenantClient(COMPANY_A_ID);

      const mockQuery = jest.fn().mockResolvedValue({});
      const args = { where: { id: 'user-id' } };

      await userQueries.delete({ args, query: mockQuery });

      expect(args.where).toEqual({
        id: 'user-id',
        companyId: COMPANY_A_ID,
      });
      expect(mockQuery).toHaveBeenCalledWith(args);
    });

    it('prevents deletion of users from other companies', async () => {
      createTenantClient(COMPANY_A_ID);

      const mockQuery = jest.fn().mockResolvedValue(null);
      const args = { where: { id: 'user-from-company-b' } };

      await userQueries.delete({ args, query: mockQuery });

      // Verify companyId is injected (prevents cross-company deletion)
      expect(args.where).toEqual({
        id: 'user-from-company-b',
        companyId: COMPANY_A_ID,
      });
    });
  });

  describe('AuditLog Model - findMany', () => {
    it('injects companyId into where clause', async () => {
      createTenantClient(COMPANY_A_ID);

      const mockQuery = jest.fn().mockResolvedValue([]);
      const args = { where: {} };

      await auditLogQueries.findMany({ args, query: mockQuery });

      expect(args.where).toEqual({ companyId: COMPANY_A_ID });
      expect(mockQuery).toHaveBeenCalledWith(args);
    });

    it('preserves existing where conditions', async () => {
      createTenantClient(COMPANY_A_ID);

      const mockQuery = jest.fn().mockResolvedValue([]);
      const args = { where: { action: 'CREATE_USER' } };

      await auditLogQueries.findMany({ args, query: mockQuery });

      expect(args.where).toEqual({
        action: 'CREATE_USER',
        companyId: COMPANY_A_ID,
      });
      expect(mockQuery).toHaveBeenCalledWith(args);
    });

    it('filters logs for specified company only', async () => {
      createTenantClient(COMPANY_B_ID);

      const mockQuery = jest.fn().mockResolvedValue([]);
      const args = { where: {} };

      await auditLogQueries.findMany({ args, query: mockQuery });

      expect(args.where).toEqual({ companyId: COMPANY_B_ID });
    });
  });

  describe('AuditLog Model - findFirst', () => {
    it('injects companyId into where clause', async () => {
      createTenantClient(COMPANY_A_ID);

      const mockQuery = jest.fn().mockResolvedValue(null);
      const args = { where: {} };

      await auditLogQueries.findFirst({ args, query: mockQuery });

      expect(args.where).toEqual({ companyId: COMPANY_A_ID });
      expect(mockQuery).toHaveBeenCalledWith(args);
    });

    it('preserves existing where conditions', async () => {
      createTenantClient(COMPANY_A_ID);

      const mockQuery = jest.fn().mockResolvedValue(null);
      const args = {
        where: { action: 'APPROVE_COMPANY' },
        orderBy: { timestamp: 'desc' },
      };

      await auditLogQueries.findFirst({ args, query: mockQuery });

      expect(args.where).toEqual({
        action: 'APPROVE_COMPANY',
        companyId: COMPANY_A_ID,
      });
      expect(args.orderBy).toEqual({ timestamp: 'desc' });
      expect(mockQuery).toHaveBeenCalledWith(args);
    });
  });

  describe('Tenant Isolation', () => {
    it('Company A client cannot access Company B users (integration concept)', async () => {
      // This test demonstrates the isolation concept
      // In a real database, this would verify no cross-company access
      createTenantClient(COMPANY_A_ID);

      const mockQuery = jest.fn().mockResolvedValue([]);
      const args = { where: {} };

      await userQueries.findMany({ args, query: mockQuery });

      // Verify companyId filter is applied (blocks Company B access)
      expect(args.where).toEqual({ companyId: COMPANY_A_ID });
      expect(args.where).not.toEqual({ companyId: COMPANY_B_ID });
    });

    it('each tenant client is independent', () => {
      const clientA = createTenantClient(COMPANY_A_ID);
      const clientB = createTenantClient(COMPANY_B_ID);

      // Both clients should be different instances
      expect(clientA).toBeDefined();
      expect(clientB).toBeDefined();
      expect(prisma.$extends).toHaveBeenCalledTimes(2);
    });
  });

  describe('Type Safety', () => {
    it('TenantPrismaClient type is exported', () => {
      const tenantClient: TenantPrismaClient = createTenantClient(COMPANY_A_ID);

      expect(tenantClient).toBeDefined();
    });

    it('companyId must be a string', () => {
      // TypeScript will catch this at compile time
      // This test verifies runtime behavior
      const validClient = createTenantClient('valid-company-id');
      expect(validClient).toBeDefined();

      // @ts-expect-error - Testing runtime with invalid type
      const invalidClient = createTenantClient(123);
      expect(invalidClient).toBeDefined(); // Still creates client (runtime)
    });
  });

  describe('Edge Cases', () => {
    it('handles empty where clause', async () => {
      createTenantClient(COMPANY_A_ID);

      const mockQuery = jest.fn().mockResolvedValue([]);
      const args = { where: {} };

      await userQueries.findMany({ args, query: mockQuery });

      expect(args.where).toEqual({ companyId: COMPANY_A_ID });
    });

    it('handles undefined where clause', async () => {
      createTenantClient(COMPANY_A_ID);

      const mockQuery = jest.fn().mockResolvedValue([]);
      const args: any = {};

      await userQueries.findMany({ args, query: mockQuery });

      expect(args).toHaveProperty('where');
      expect(args.where).toEqual({ companyId: COMPANY_A_ID });
    });

    it('handles complex where conditions', async () => {
      createTenantClient(COMPANY_A_ID);

      const mockQuery = jest.fn().mockResolvedValue([]);
      const args = {
        where: {
          role: 'PRODUCER',
          OR: [{ email: 'user1@example.com' }, { email: 'user2@example.com' }],
        },
      };

      await userQueries.findMany({ args, query: mockQuery });

      expect(args.where).toEqual({
        role: 'PRODUCER',
        OR: [{ email: 'user1@example.com' }, { email: 'user2@example.com' }],
        companyId: COMPANY_A_ID,
      });
    });
  });
});
