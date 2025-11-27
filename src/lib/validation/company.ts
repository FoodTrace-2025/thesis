// Company validation schemas using Zod
// Story 2.2: Company Creation API

import { z } from 'zod';
import { CompanyType, CompanyStatus } from '@prisma/client';

/**
 * Schema for creating a new company
 * Validates: name, email, domain, type
 * Enforces: company email must end with @{domain}
 */
export const createCompanySchema = z
  .object({
    name: z
      .string()
      .min(2, 'Company name must be at least 2 characters')
      .max(255, 'Company name must be at most 255 characters'),
    email: z
      .string()
      .email('Invalid email format'),
    domain: z
      .string()
      .min(2, 'Domain must be at least 2 characters')
      .max(100, 'Domain must be at most 100 characters'),
    type: z.nativeEnum(CompanyType, {
      errorMap: () => ({ message: 'Type must be one of: PRODUCER, DISTRIBUTOR, RETAILER' }),
    }),
  })
  .refine((data) => data.email.endsWith(`@${data.domain}`), {
    message: 'Company email must match the company domain',
    path: ['email'],
  });

/**
 * Schema for filtering companies by status (GET query parameter)
 */
export const companyStatusFilterSchema = z
  .nativeEnum(CompanyStatus)
  .optional();

/**
 * Type inference for createCompanySchema input
 */
export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
