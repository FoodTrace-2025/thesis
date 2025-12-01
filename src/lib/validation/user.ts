// User validation schemas using Zod
// Story 2.6: Create Company Admin User API
// Story 2.7: Create Company Employee API

import { z } from 'zod';

/**
 * Schema for creating a COMPANY_ADMIN user
 * Used by POST /api/admin/users
 *
 * Note: Password complexity is minimal for POC (min 8 chars).
 * PLATFORM_ADMIN manually creates accounts, not public registration.
 */
export const createCompanyAdminSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  companyId: z.string().min(1, 'Company ID is required'),
});

/**
 * Type inference for createCompanyAdminSchema input
 */
export type CreateCompanyAdminInput = z.infer<typeof createCompanyAdminSchema>;

/**
 * Schema for creating an employee user
 * Used by POST /api/companies/users
 *
 * Note: Role must be PRODUCER, DISTRIBUTOR, or RETAILER.
 * PLATFORM_ADMIN and COMPANY_ADMIN cannot be created via this endpoint.
 * Role-company type matching is validated server-side (not in schema).
 */
export const createEmployeeSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  role: z.enum(['PRODUCER', 'DISTRIBUTOR', 'RETAILER'], {
    message: 'Role must be PRODUCER, DISTRIBUTOR, or RETAILER',
  }),
});

/**
 * Type inference for createEmployeeSchema input
 */
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
