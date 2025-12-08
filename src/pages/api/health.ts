// Health Check API Endpoint
// Story 13.2: Health Check Endpoint & Render.com Setup
// GET /api/health - Check database and blockchain connectivity
//
// Design decisions (documented during review):
// - 3-second timeout on blockchain RPC (Render.com has 5-second limit)
// - Lenient failure: Only fail on database error, blockchain issues are warnings
// - Uses AbortSignal.timeout() - modern best practice (2024-2025)

import type { NextApiRequest, NextApiResponse } from 'next';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { prisma } from '@/lib/prisma';

interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  database: 'connected' | 'error';
  blockchain: 'connected' | 'error' | 'timeout';
  error?: string;
}

// Render.com has 5-second timeout, so we use 3s for blockchain check
const BLOCKCHAIN_TIMEOUT_MS = 3000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  const response: HealthResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: 'connected',
    blockchain: 'connected',
  };

  // Check database connection
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    response.status = 'unhealthy';
    response.database = 'error';
    response.error = `Database: ${(error as Error).message}`;
  }

  // Check blockchain RPC with timeout (AbortSignal.timeout - modern best practice)
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  if (!rpcUrl) {
    response.blockchain = 'error';
    response.error = response.error
      ? `${response.error}; Blockchain: RPC URL not configured`
      : 'Blockchain: RPC URL not configured';
  } else {
    try {
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(rpcUrl, {
          fetchOptions: { signal: AbortSignal.timeout(BLOCKCHAIN_TIMEOUT_MS) },
        }),
      });
      await publicClient.getBlockNumber();
    } catch (error) {
      const isTimeout = (error as Error).name === 'TimeoutError';
      response.blockchain = isTimeout ? 'timeout' : 'error';
      const errorMsg = isTimeout ? 'RPC timeout (3s)' : (error as Error).message;
      response.error = response.error
        ? `${response.error}; Blockchain: ${errorMsg}`
        : `Blockchain: ${errorMsg}`;
    }
  }

  // LENIENT: Only fail on database error, blockchain issues are warnings
  // (Sepolia is flaky, app still works for database operations)
  // Database error already sets status = 'unhealthy' above
  // Blockchain errors are warnings, don't change status

  return res.status(response.status === 'healthy' ? 200 : 500).json(response);
}
