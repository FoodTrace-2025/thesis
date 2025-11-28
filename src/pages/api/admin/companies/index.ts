// Company Management API
// Story 2.2: Company Creation API
// POST /api/admin/companies - Create a new company
// GET /api/admin/companies - List all companies (with optional status filter)

import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, CompanyStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  createCompanySchema,
  companyStatusFilterSchema,
} from '@/lib/validation/company';
import { requirePlatformAdmin } from '@/lib/auth/requireAdmin';

// Response types
interface SuccessResponse {
  success: true;
  company?: Prisma.CompanyGetPayload<{
    select: {
      id: true;
      name: true;
      email: true;
      domain: true;
      type: true;
      status: true;
      walletAddress: true;
      createdAt: true;
    };
  }>;
  companies?: Prisma.CompanyGetPayload<{
    select: {
      id: true;
      name: true;
      email: true;
      domain: true;
      type: true;
      status: true;
      walletAddress: true;
      createdAt: true;
    };
  }>[];
  count?: number;
}

interface ErrorResponse {
  error: string;
  code?: string;
  details?: Array<{ field: string; message: string }>;
}

type ApiResponse = SuccessResponse | ErrorResponse;

// Fields to select (exclude sensitive data like encryptedPrivateKey)
const companySelectFields = {
  id: true,
  name: true,
  email: true,
  domain: true,
  type: true,
  status: true,
  walletAddress: true,
  createdAt: true,
} as const;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Validate PLATFORM_ADMIN session
  const session = await requirePlatformAdmin(req, res);
  if (!session) return; // Auth failed, response already sent

  if (req.method === 'POST') {
    return handlePost(req, res, session.user.id);
  }

  if (req.method === 'GET') {
    return handleGet(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

/**
 * POST /api/admin/companies
 * Create a new company with PENDING status
 */
async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
  userId: string
) {
  try {
    // 1. Validate request body
    const parseResult = createCompanySchema.safeParse(req.body);

    if (!parseResult.success) {
      // Zod 4 uses .issues instead of .errors
      const details = parseResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details,
      });
    }

    const { name, email, domain, type } = parseResult.data;

    // 2. Check email uniqueness (Prisma will also enforce this, but we want a cleaner error)
    const existingCompany = await prisma.company.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingCompany) {
      return res.status(409).json({
        error: 'Company with this email already exists',
        code: 'DUPLICATE_ERROR',
      });
    }

    // 3. Create company with audit log in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create company with PENDING status
      const company = await tx.company.create({
        data: {
          name,
          email,
          domain,
          type,
          // status defaults to PENDING
          // wallet fields are null until approved
        },
        select: companySelectFields,
      });

      // Create audit log entry
      await tx.auditLog.create({
        data: {
          action: 'CREATE_COMPANY',
          companyId: company.id,
          userId,
          details: {
            companyName: name,
            companyEmail: email,
            companyType: type,
          },
        },
      });

      return company;
    });

    // 4. Return created company
    return res.status(201).json({
      success: true,
      company: result,
    });
  } catch (error) {
    // Handle Prisma unique constraint error (backup for race condition)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({
        error: 'Company with this email already exists',
        code: 'DUPLICATE_ERROR',
      });
    }

    // Log error for debugging (in production, use proper logger)
    console.error('Company creation failed:', error);

    return res.status(500).json({
      error: 'Failed to create company',
      code: 'DATABASE_ERROR',
    });
  }
}

/**
 * GET /api/admin/companies
 * List all companies with optional status filter
 */
async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    // 1. Parse and validate optional status filter
    const statusParam = req.query.status as string | undefined;
    let statusFilter: CompanyStatus | undefined;

    if (statusParam) {
      const parseResult = companyStatusFilterSchema.safeParse(statusParam);

      if (!parseResult.success) {
        return res.status(400).json({
          error: 'Invalid status filter',
          code: 'VALIDATION_ERROR',
          details: [
            {
              field: 'status',
              message: 'Status must be one of: PENDING, APPROVED, REJECTED',
            },
          ],
        });
      }

      statusFilter = parseResult.data;
    }

    // 2. Query companies
    const companies = await prisma.company.findMany({
      where: statusFilter ? { status: statusFilter } : undefined,
      select: companySelectFields,
      orderBy: { createdAt: 'desc' },
    });

    // 3. Return company list with count
    return res.status(200).json({
      success: true,
      companies,
      count: companies.length,
    });
  } catch (error) {
    console.error('Company list failed:', error);

    return res.status(500).json({
      error: 'Failed to fetch companies',
      code: 'DATABASE_ERROR',
    });
  }
}
