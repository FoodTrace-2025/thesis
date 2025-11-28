// Platform Admin Authorization Middleware
// Story 2.5: Admin Authentication
// Validates session and PLATFORM_ADMIN role for admin endpoints

import { getServerSession, Session } from 'next-auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

/**
 * Validates that the request has a valid session with PLATFORM_ADMIN role.
 * Returns the session if authorized, or null if auth failed (response already sent).
 *
 * Usage:
 * ```typescript
 * const session = await requirePlatformAdmin(req, res);
 * if (!session) return; // Auth failed, response already sent
 * // Use session.user.id for audit logs
 * ```
 *
 * @param req - Next.js API request
 * @param res - Next.js API response
 * @returns Session if authorized, null if auth failed
 */
export async function requirePlatformAdmin(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Session | null> {
  const session = await getServerSession(req, res, authOptions);

  // 401 Unauthorized - No session
  if (!session) {
    res.status(401).json({
      error: 'Authentication required',
      code: 'UNAUTHORIZED',
    });
    return null;
  }

  // 403 Forbidden - Not PLATFORM_ADMIN
  if (session.user.role !== 'PLATFORM_ADMIN') {
    res.status(403).json({
      error: 'Platform admin access required',
      code: 'FORBIDDEN',
    });
    return null;
  }

  return session;
}
