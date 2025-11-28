// Company Reject API
// Story 2.4: Company Reject API
// POST /api/admin/companies/:id/reject - Reject a pending company with reason

import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requirePlatformAdmin } from '@/lib/auth/requireAdmin';
import { rejectCompanySchema } from '@/lib/validation/company';

// Response types
interface SuccessResponse {
  success: true;
  company: Prisma.CompanyGetPayload<{
    select: {
      id: true;
      name: true;
      email: true;
      domain: true;
      type: true;
      status: true;
      rejectionReason: true;
      createdAt: true;
    };
  }>;
}

interface ErrorResponse {
  error: string;
  code?: string;
  details?: Array<{ field: string; message: string }>;
}

type ApiResponse = SuccessResponse | ErrorResponse;

// Fields to select (exclude sensitive data)
const companySelectFields = {
  id: true,
  name: true,
  email: true,
  domain: true,
  type: true,
  status: true,
  rejectionReason: true,
  createdAt: true,
} as const;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // TODO: Add PLATFORM_ADMIN authentication in Story 2.5
  // For now, using stub that allows all requests
  await requirePlatformAdmin(req, res);

  // 1. Method validation (POST only)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Parse company ID from URL
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      error: 'Company ID is required',
      code: 'VALIDATION_ERROR',
    });
  }

  // 3. Validate request body with Zod
  const validationResult = rejectCompanySchema.safeParse(req.body);

  if (!validationResult.success) {
    // Zod 4 uses .issues instead of .errors
    const details = validationResult.error.issues.map((issue) => ({
      field: issue.path.join('.') || 'reason',
      message: issue.message,
    }));

    return res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details,
    });
  }

  const { reason } = validationResult.data;

  try {
    // 4. Find company and validate status
    const company = await prisma.company.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!company) {
      return res.status(404).json({
        error: 'Company not found',
        code: 'NOT_FOUND',
      });
    }

    // 5. Validate company status is PENDING
    if (company.status === 'APPROVED') {
      return res.status(409).json({
        error: 'Company is already approved',
        code: 'CONFLICT_ERROR',
      });
    }

    if (company.status === 'REJECTED') {
      return res.status(409).json({
        error: 'Company is already rejected',
        code: 'CONFLICT_ERROR',
      });
    }

    // 6. Atomic update: company + audit log
    const result = await prisma.$transaction(async (tx) => {
      // Update company with rejection status and reason
      const updatedCompany = await tx.company.update({
        where: { id },
        data: {
          status: 'REJECTED',
          rejectionReason: reason,
        },
        select: companySelectFields,
      });

      // Create audit log entry
      await tx.auditLog.create({
        data: {
          action: 'REJECT_COMPANY',
          companyId: id,
          userId: null, // Auth not implemented yet - see Story 2.5
          details: {
            reason,
          },
        },
      });

      return updatedCompany;
    });

    // 7. Return success response
    return res.status(200).json({
      success: true,
      company: result,
    });
  } catch (error) {
    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error during rejection:', error.code);
    }

    // Log error for debugging but never log sensitive data
    console.error('Company rejection failed:', (error as Error).message);

    return res.status(500).json({
      error: 'Failed to reject company',
      code: 'SERVER_ERROR',
    });
  }
}
