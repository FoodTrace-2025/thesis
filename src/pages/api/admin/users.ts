// Create Company Admin User API
// Story 2.6: Create Company Admin User API
// POST /api/admin/users - Create COMPANY_ADMIN user for approved company

import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { createCompanyAdminSchema } from '@/lib/validation/user';
import { requirePlatformAdmin } from '@/lib/auth/requireAdmin';

// Response types
interface SuccessResponse {
  success: true;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    companyId: string;
    createdAt: Date;
  };
}

interface ErrorResponse {
  error: string;
  code: string;
  details?: Array<{ field: string; message: string }>;
}

type ApiResponse = SuccessResponse | ErrorResponse;

// Bcrypt rounds - industry standard (OWASP recommends 10-14)
const BCRYPT_ROUNDS = 10;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED',
    });
  }

  // Validate PLATFORM_ADMIN session
  const session = await requirePlatformAdmin(req, res);
  if (!session) return; // Auth failed, response already sent

  try {
    // 1. Validate request body
    const parseResult = createCompanyAdminSchema.safeParse(req.body);

    if (!parseResult.success) {
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

    const { email, password, name, companyId } = parseResult.data;

    // 2. Verify company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true, status: true, domain: true },
    });

    if (!company) {
      return res.status(404).json({
        error: 'Company not found',
        code: 'NOT_FOUND',
      });
    }

    // 3. Verify company is APPROVED
    if (company.status !== 'APPROVED') {
      return res.status(400).json({
        error: 'Company must be approved',
        code: 'COMPANY_NOT_APPROVED',
      });
    }

    // 4. Validate email domain matches company domain
    if (!email.endsWith(`@${company.domain}`)) {
      return res.status(400).json({
        error: `Email must match company domain: ${company.domain}`,
        code: 'INVALID_EMAIL_DOMAIN',
      });
    }

    // 5. Check email uniqueness (cleaner error before transaction)
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'User with this email already exists',
        code: 'DUPLICATE_EMAIL',
      });
    }

    // 6. Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // 7. Create user and audit log in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user with COMPANY_ADMIN role (forced, ignore any role in request)
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
          role: 'COMPANY_ADMIN',
          companyId,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          companyId: true,
          createdAt: true,
        },
      });

      // Create audit log entry
      await tx.auditLog.create({
        data: {
          action: 'CREATE_COMPANY_ADMIN',
          companyId,
          userId: session.user.id,
          details: {
            createdUserEmail: email,
            createdUserId: user.id,
          },
        },
      });

      return user;
    });

    // 8. Return success response (excludes passwordHash)
    return res.status(201).json({
      success: true,
      user: {
        id: result.id,
        email: result.email,
        name: result.name,
        role: result.role,
        companyId: result.companyId!,
        createdAt: result.createdAt,
      },
    });
  } catch (error) {
    // Handle Prisma unique constraint error (backup for race condition)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({
        error: 'User with this email already exists',
        code: 'DUPLICATE_EMAIL',
      });
    }

    // Log error for debugging
    console.error('User creation failed:', error);

    return res.status(500).json({
      error: 'Failed to create user',
      code: 'DATABASE_ERROR',
    });
  }
}
