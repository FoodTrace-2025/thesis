// Generic Role-Based Authorization Middleware
// Story 7.2: Add Trace Record API
// Validates session, role (from allowed list), and APPROVED company with wallet for supply chain endpoints

import { getServerSession, Session } from 'next-auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

// Extended session with company + wallet data
export interface SupplyChainSession extends Session {
  user: Session['user'] & {
    company: {
      id: string;
      status: string;
      type: string;
      walletAddress: string | null;
      encryptedPrivateKey: string | null;
    };
  };
}

/**
 * Generic role-based authorization middleware for supply chain operations.
 * Validates session, role, approved company, and wallet configuration.
 *
 * Usage:
 * ```typescript
 * const session = await requireRole(req, res, ['PRODUCER', 'DISTRIBUTOR']);
 * if (!session) return; // Auth failed, response already sent
 * // Use session.user.company for wallet access
 * ```
 *
 * @param req - Next.js API request
 * @param res - Next.js API response
 * @param allowedRoles - Array of roles that can access this endpoint
 * @returns Session with company data if authorized, null if auth failed
 */
export async function requireRole(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedRoles: UserRole[]
): Promise<SupplyChainSession | null> {
  const session = await getServerSession(req, res, authOptions);

  // 401 Unauthorized - No session
  if (!session?.user) {
    res.status(401).json({
      error: 'Authentication required',
      code: 'UNAUTHORIZED',
    });
    return null;
  }

  // 403 Forbidden - Role not allowed
  if (!allowedRoles.includes(session.user.role as UserRole)) {
    res.status(403).json({
      error: `Only ${allowedRoles.join(', ')} can access this resource`,
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
          status: true,
          type: true,
          walletAddress: true,
          encryptedPrivateKey: true,
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

  // 500 Internal Server Error - Wallet not configured
  if (!user.company.encryptedPrivateKey || !user.company.walletAddress) {
    res.status(500).json({
      error: 'Company wallet not configured',
      code: 'WALLET_NOT_CONFIGURED',
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
  } as SupplyChainSession;
}

/**
 * Convenience middleware for supply chain operations.
 * Allows PRODUCER, DISTRIBUTOR, or RETAILER roles.
 *
 * Usage:
 * ```typescript
 * const session = await requireSupplyChainRole(req, res);
 * if (!session) return;
 * ```
 */
export async function requireSupplyChainRole(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<SupplyChainSession | null> {
  return requireRole(req, res, ['PRODUCER', 'DISTRIBUTOR', 'RETAILER']);
}
