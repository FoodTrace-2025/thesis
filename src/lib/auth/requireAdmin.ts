// Auth helper stub for admin endpoints
// TODO: Implement in Story 2.5 with NextAuth.js
// This stub will be replaced with actual session validation

import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Mock admin session for development
 * Returns a fake admin user object until NextAuth is configured in Story 2.5
 *
 * @param req - Next.js API request
 * @param res - Next.js API response
 * @returns Mock admin session object
 */
export async function requirePlatformAdmin(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{ user: { id: string; role: string } }> {
  // Auth not yet implemented - see Story 2.5
  // For now, all requests are allowed
  return {
    user: {
      id: 'dev-admin',
      role: 'PLATFORM_ADMIN',
    },
  };
}
