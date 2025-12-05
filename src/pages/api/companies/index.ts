// Companies List API
// Story 7.16: SHIPPED Action - Recipient Selection
// GET /api/companies - List approved companies for shipping recipient selection

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// Query parameters validation schema
const querySchema = z.object({
  type: z.string().optional(), // Comma-separated: "DISTRIBUTOR,RETAILER"
  status: z.enum(['APPROVED', 'PENDING', 'REJECTED']).optional(),
});

// Response types
interface CompanyResponse {
  id: string;
  name: string;
  type: string;
}

interface SuccessResponse {
  success: true;
  companies: CompanyResponse[];
}

interface ErrorResponse {
  error: string;
  code: string;
  details?: z.ZodIssue[];
}

type ApiResponse = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // 1. Method validation
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED',
    });
  }

  // 2. Authentication required
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({
      error: 'Authentication required',
      code: 'UNAUTHORIZED',
    });
  }

  // 3. Get user's company ID for exclusion
  const userCompanyId = session.user.companyId;

  try {
    // 4. Validate query parameters
    const validation = querySchema.safeParse(req.query);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid parameters',
        code: 'VALIDATION_ERROR',
        details: validation.error.issues,
      });
    }

    const { type, status } = validation.data;

    // 5. Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {};

    // Filter by status (default to APPROVED if not specified)
    whereClause.status = status || 'APPROVED';

    // Filter by type (comma-separated)
    if (type) {
      const types = type.split(',').map((t) => t.trim().toUpperCase());
      const validTypes = ['PRODUCER', 'DISTRIBUTOR', 'RETAILER'];
      const filteredTypes = types.filter((t) => validTypes.includes(t));

      if (filteredTypes.length > 0) {
        whereClause.type = { in: filteredTypes };
      }
    }

    // Exclude current user's company (can't ship to yourself)
    if (userCompanyId) {
      whereClause.id = { not: userCompanyId };
    }

    // 6. Query companies
    const companies = await prisma.company.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        type: true,
      },
      orderBy: { name: 'asc' },
    });

    // 7. Return success response
    return res.status(200).json({
      success: true,
      companies: companies.map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
      })),
    });
  } catch (error) {
    console.error('Companies list error:', error);
    return res.status(500).json({
      error: 'Failed to fetch companies',
      code: 'INTERNAL_ERROR',
    });
  }
}
