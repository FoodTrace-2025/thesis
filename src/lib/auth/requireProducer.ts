// Producer Authorization Middleware
// Story 5.3: Product Registration API
// Validates session, PRODUCER role, and APPROVED company for producer endpoints

import { getServerSession, Session } from 'next-auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

// Extended session with company data
interface ProducerSession extends Session {
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
 * Validates that the request has a valid session with PRODUCER role
 * and an APPROVED company with wallet configured.
 * Returns the session with company data if authorized, or null if auth failed.
 *
 * Usage:
 * ```typescript
 * const session = await requireProducer(req, res);
 * if (!session) return; // Auth failed, response already sent
 * // Use session.user.company for wallet access
 * ```
 *
 * @param req - Next.js API request
 * @param res - Next.js API response
 * @returns Session with company data if authorized, null if auth failed
 */
export async function requireProducer(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<ProducerSession | null> {
  const session = await getServerSession(req, res, authOptions);

  // 401 Unauthorized - No session
  if (!session?.user) {
    res.status(401).json({
      error: 'Authentication required',
      code: 'UNAUTHORIZED',
    });
    return null;
  }

  // 403 Forbidden - Not PRODUCER role
  if (session.user.role !== 'PRODUCER') {
    res.status(403).json({
      error: 'Only producers can access this resource',
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
  } as ProducerSession;
}
