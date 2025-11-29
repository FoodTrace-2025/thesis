/**
 * Prisma Client Exports
 * Central export point for all Prisma client utilities
 *
 * Usage:
 * - Base client: `import { prisma } from '@/lib/prisma'` (for PLATFORM_ADMIN)
 * - Tenant client: `import { createTenantClient } from '@/lib/prisma'` (for company-scoped operations)
 */

// Re-export base Prisma client (singleton)
export { prisma } from '@/lib/prisma';

// Export tenant client factory and type
export { createTenantClient, type TenantPrismaClient } from './tenant-client';
