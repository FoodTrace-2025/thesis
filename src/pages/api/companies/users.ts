// Create Company Employee API
// Story 2.7: Create Company Employee API
// POST /api/companies/users - Create employee user for COMPANY_ADMIN's company

import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createEmployeeSchema } from '@/lib/validation/user';
import { requireCompanyAdmin } from '@/lib/auth/requireCompanyAdmin';

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

  // Validate COMPANY_ADMIN session and get company data
  const session = await requireCompanyAdmin(req, res);
  if (!session) return; // Auth failed, response already sent

  const { company } = session.user;

  try {
    // 1. Validate request body
    const parseResult = createEmployeeSchema.safeParse(req.body);

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

    const { email, password, name, role } = parseResult.data;

    // 2. Validate role matches company type
    // PRODUCER company can only create PRODUCER employees, etc.
    if (role !== company.type) {
      return res.status(400).json({
        error: `Role must match company type. Your company type is ${company.type}.`,
        code: 'ROLE_MISMATCH',
      });
    }

    // 3. Validate email domain matches company domain
    if (!email.endsWith(`@${company.domain}`)) {
      return res.status(400).json({
        error: `Email must match company domain: ${company.domain}`,
        code: 'INVALID_EMAIL_DOMAIN',
      });
    }

    // 4. Check email uniqueness (cleaner error before transaction)
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

    // 5. Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // 6. Create user and audit log in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user with role from request (validated by Zod enum)
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
          role,
          companyId: company.id, // Auto-assigned from session, not user input
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
          action: 'CREATE_EMPLOYEE',
          companyId: company.id,
          userId: session.user.id,
          details: {
            createdUserEmail: email,
            createdUserId: user.id,
            createdUserRole: role,
          },
        },
      });

      return user;
    });

    // 7. Return success response (excludes passwordHash)
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
    console.error('Employee creation failed:', error);

    return res.status(500).json({
      error: 'Failed to create employee',
      code: 'DATABASE_ERROR',
    });
  }
}
