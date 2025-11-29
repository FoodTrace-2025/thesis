/**
 * Tenant-Scoped Prisma Client Factory
 * Story 3.2: Implement Prisma Tenant Client
 * Epic 3: Security Hardening - Tier 1
 *
 * Creates a Prisma client extension that automatically filters queries by companyId,
 * ensuring multi-tenant data isolation. This prevents cross-company data leaks.
 *
 * IMPORTANT:
 * - Use this client for ALL company-scoped operations (COMPANY_ADMIN, PRODUCER, DISTRIBUTOR, RETAILER)
 * - Use base `prisma` client ONLY for PLATFORM_ADMIN cross-tenant operations
 * - Uses Prisma 7 Client Extensions (`$extends`) - `$use` middleware was removed
 *
 * @see https://www.prisma.io/docs/orm/prisma-client/client-extensions
 * @see docs/prd/epic-3-security-hardening.md
 */

import { prisma } from '@/lib/prisma';

/**
 * Creates a tenant-scoped Prisma client that automatically filters
 * queries by companyId. Use this for company-scoped operations.
 *
 * PLATFORM_ADMIN should use the base `prisma` client for cross-tenant access.
 *
 * @param companyId - The company ID to scope all queries to
 * @returns Extended Prisma client with automatic companyId filtering
 *
 * @example
 * ```typescript
 * // In API route or service function
 * import { createTenantClient } from '@/lib/prisma';
 *
 * // Get companyId from authenticated session
 * const tenantPrisma = createTenantClient(session.user.companyId);
 *
 * // All queries automatically filtered by companyId
 * const users = await tenantPrisma.user.findMany(); // Only returns company's users
 * const logs = await tenantPrisma.auditLog.findMany(); // Only returns company's logs
 * ```
 */
export function createTenantClient(companyId: string) {
  return prisma.$extends({
    query: {
      /**
       * User model - Tenant isolation for company employees
       * Filters: findMany, findFirst, update, delete
       */
      user: {
        async findMany({ args, query }) {
          args.where = { ...args.where, companyId };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, companyId };
          return query(args);
        },
        async update({ args, query }) {
          // Type cast needed for update/delete where clauses in Prisma 7
          args.where = { ...args.where, companyId } as typeof args.where;
          return query(args);
        },
        async delete({ args, query }) {
          // Type cast needed for update/delete where clauses in Prisma 7
          args.where = { ...args.where, companyId } as typeof args.where;
          return query(args);
        },
      },
      /**
       * AuditLog model - Tenant isolation for company audit logs
       * Filters: findMany, findFirst
       * Note: create/update/delete not filtered - handled by business logic
       */
      auditLog: {
        async findMany({ args, query }) {
          args.where = { ...args.where, companyId };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, companyId };
          return query(args);
        },
      },
      // NOTE: Company model NOT filtered - it IS the tenant entity
      // Future models (Epic 5+): Product, Transfer, etc. will be added here
    },
  });
}

/**
 * Type alias for the tenant-scoped Prisma client
 * Use this type for function parameters and return types
 *
 * @example
 * ```typescript
 * function getCompanyUsers(db: TenantPrismaClient) {
 *   return db.user.findMany(); // Automatically filtered by companyId
 * }
 * ```
 */
export type TenantPrismaClient = ReturnType<typeof createTenantClient>;
