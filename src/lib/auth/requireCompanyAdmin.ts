// Company Admin Authorization Middleware
// Story 2.7: Create Company Employee API
// Validates session, COMPANY_ADMIN role, and APPROVED company for company admin endpoints

import { getServerSession, Session } from 'next-auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

// Extended session with company data
interface CompanyAdminSession extends Session {
  user: Session['user'] & {
    company: {
      id: string;
      domain: string;
      type: string;
      status: string;
    };
  };
}

/**
 * Validates that the request has a valid session with COMPANY_ADMIN role
 * and an APPROVED company.
 * Returns the session with company data if authorized, or null if auth failed.
 *
 * Usage:
 * ```typescript
 * const session = await requireCompanyAdmin(req, res);
 * if (!session) return; // Auth failed, response already sent
 * // Use session.user.company for domain/type validation
 * ```
 *
 * @param req - Next.js API request
 * @param res - Next.js API response
 * @returns Session with company data if authorized, null if auth failed
 */
export async function requireCompanyAdmin(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<CompanyAdminSession | null> {
  const session = await getServerSession(req, res, authOptions);

  // 401 Unauthorized - No session
  if (!session?.user) {
    res.status(401).json({
      error: 'Authentication required',
      code: 'UNAUTHORIZED',
    });
    return null;
  }

  // 403 Forbidden - Not COMPANY_ADMIN role
  if (session.user.role !== 'COMPANY_ADMIN') {
    res.status(403).json({
      error: 'Only company administrators can access this resource',
      code: 'FORBIDDEN',
    });
    return null;
  }

  // Fetch user with company data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      company: {
        select: {
          id: true,
          domain: true,
          type: true,
          status: true,
        },
      },
    },
  });

  // 403 Forbidden - User must belong to a company
  if (!user?.company) {
    res.status(403).json({
      error: 'User must belong to a company',
      code: 'NO_COMPANY',
    });
    return null;
  }

  // 403 Forbidden - Company must be approved
  if (user.company.status !== 'APPROVED') {
    res.status(403).json({
      error: 'Company must be approved',
      code: 'COMPANY_NOT_APPROVED',
    });
    return null;
  }

  // Return session with company data attached
  return {
    ...session,
    user: {
      ...session.user,
      company: user.company,
    },
  } as CompanyAdminSession;
}
