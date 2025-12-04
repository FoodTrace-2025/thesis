// Add Trace Record API
// Story 7.2: Add Trace Record API
// POST /api/products/:id/trace - Add a trace record to a product on blockchain

import type { NextApiRequest, NextApiResponse } from 'next';
import {
  createPublicClient,
  createWalletClient,
  http,
  parseEventLogs,
} from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { decryptWalletKey, getEncryptionKey } from '@/lib/crypto';
import { requireSupplyChainRole } from '@/lib/auth/requireRole';
import ProductRegistryABI from '@/../artifacts/contracts/ProductRegistry.sol/ProductRegistry.json';

// Valid trace record actions
const TRACE_ACTIONS = [
  'RECEIVED',
  'QUALITY_CHECK',
  'SHIPPED',
  'STOCKED',
  'SOLD',
] as const;

// Request validation schema
const traceSchema = z.object({
  action: z.enum(TRACE_ACTIONS, {
    message: `Action must be one of: ${TRACE_ACTIONS.join(', ')}`,
  }),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(100, 'Location too long (max 100 chars)'),
  notes: z
    .string()
    .max(500, 'Notes too long (max 500 chars)')
    .optional()
    .default(''),
});

// Response types
interface SuccessResponse {
  success: true;
  traceRecord: {
    id: string;
    action: string;
    location: string;
    notes: string;
    transactionHash: string;
    blockchainIndex: number;
    createdAt: string;
  };
}

interface ErrorResponse {
  error: string;
  code?: string;
  details?: z.ZodIssue[];
}

type ApiResponse = SuccessResponse | ErrorResponse;

// Transient errors that should be retried
const RETRYABLE_ERRORS = [
  'nonce',
  'timeout',
  'ETIMEDOUT',
  'ECONNRESET',
  'ECONNREFUSED',
  'network',
  'rate limit',
  '429',
  '503',
];

// Check if error is transient and should be retried
function isRetryableError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return RETRYABLE_ERRORS.some((e) => message.includes(e.toLowerCase()));
}

// Retry helper for blockchain transactions (only retries transient errors)
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      // Only retry transient network errors, not validation/funds errors
      if (!isRetryableError(lastError) || attempt >= maxAttempts) {
        throw lastError;
      }
      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }
  throw lastError;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // 1. Method validation
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 2. Authentication & authorization (PRODUCER, DISTRIBUTOR, RETAILER)
    const session = await requireSupplyChainRole(req, res);
    if (!session) return; // Auth failed, response already sent

    const { company } = session.user;

    // 3. Extract and validate productId
    const productId = req.query.id as string;
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, blockchainId: true, currentOwnerId: true }, // Story 7.4: Include for ownership transfer
    });

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND',
      });
    }

    // 4. Input validation
    const validation = traceSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: validation.error.issues,
      });
    }

    const { action, location, notes } = validation.data;

    // 5. Decrypt company wallet
    const encryptionKey = getEncryptionKey();
    const privateKey = decryptWalletKey(
      company.encryptedPrivateKey!,
      encryptionKey
    );

    if (!privateKey) {
      console.error('Wallet decryption failed:', {
        userId: session.user.id,
        companyId: company.id,
        productId,
      });

      await prisma.auditLog.create({
        data: {
          action: 'WALLET_DECRYPT_FAILED',
          userId: session.user.id,
          companyId: company.id,
          details: { error: 'Decryption returned null', productId },
        },
      });

      return res.status(500).json({
        error: 'Failed to access company wallet',
        code: 'WALLET_DECRYPT_ERROR',
      });
    }

    // 6. Create viem clients
    const rpcUrl = process.env.SEPOLIA_RPC_URL;
    const contractAddress = process.env.NEXT_PUBLIC_PRODUCT_REGISTRY_ADDRESS;

    if (!rpcUrl || !contractAddress) {
      return res.status(500).json({
        error: 'Blockchain configuration missing',
        code: 'CONFIG_ERROR',
      });
    }

    const account = privateKeyToAccount(privateKey as `0x${string}`);
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(rpcUrl),
    });
    const walletClient = createWalletClient({
      account,
      chain: sepolia,
      transport: http(rpcUrl),
    });

    // 7. Estimate gas
    const gasEstimate = await publicClient.estimateContractGas({
      address: contractAddress as `0x${string}`,
      abi: ProductRegistryABI.abi,
      functionName: 'addTraceRecord',
      args: [BigInt(product.blockchainId), action, location, notes],
      account,
    });

    // 8. Submit transaction with retry
    const hash = await withRetry(async () => {
      return walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: ProductRegistryABI.abi,
        functionName: 'addTraceRecord',
        args: [BigInt(product.blockchainId), action, location, notes],
        gas: gasEstimate + gasEstimate / BigInt(5), // 20% buffer
      });
    });

    // 9. Wait for receipt
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
      confirmations: 1,
    });

    if (receipt.status !== 'success') {
      console.error('Transaction failed:', { hash, receipt, productId });
      return res.status(502).json({
        error: 'Blockchain transaction failed',
        code: 'TX_FAILED',
      });
    }

    // 10. Parse TraceRecordAdded event
    interface TraceRecordAddedEvent {
      args: {
        productId: bigint;
        actor: `0x${string}`;
        action: string;
        timestamp: bigint;
      };
    }

    const logs = parseEventLogs({
      abi: ProductRegistryABI.abi,
      eventName: 'TraceRecordAdded',
      logs: receipt.logs,
    }) as unknown as TraceRecordAddedEvent[];

    if (logs.length === 0) {
      console.error('TraceRecordAdded event not found:', { hash, receipt });
      return res.status(502).json({
        error: 'Trace record event not found',
        code: 'EVENT_NOT_FOUND',
      });
    }

    // Get blockchain index by querying trace history length
    // The index is the position in the array (length - 1 after adding)
    const traceHistory = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: ProductRegistryABI.abi,
      functionName: 'getTraceHistory',
      args: [BigInt(product.blockchainId)],
    });

    const blockchainIndex = Array.isArray(traceHistory)
      ? traceHistory.length - 1
      : 0;

    // 11. Save to database (atomic with audit log)
    const traceRecord = await prisma.$transaction(async (tx) => {
      const newTrace = await tx.traceRecord.create({
        data: {
          productId: product.id,
          userId: session.user.id,
          companyId: company.id,
          action,
          location,
          notes,
          transactionHash: hash,
          blockchainIndex,
        },
      });

      // Story 7.4: Transfer ownership on RECEIVED action (idempotent)
      if (action === 'RECEIVED') {
        await tx.product.update({
          where: { id: product.id },
          data: { currentOwnerId: company.id },
        });
      }

      // Story 7.4: Include ownership transfer info in audit log (combined entry approach)
      await tx.auditLog.create({
        data: {
          action: 'TRACE_RECORD_ADDED',
          userId: session.user.id,
          companyId: company.id,
          details: {
            traceRecordId: newTrace.id,
            productId: product.id,
            blockchainId: product.blockchainId,
            traceAction: action,
            location,
            transactionHash: hash,
            blockchainIndex,
            // Story 7.4: Ownership transfer info
            ownershipTransferred: action === 'RECEIVED',
            previousOwnerId: action === 'RECEIVED' ? product.currentOwnerId : undefined,
            newOwnerId: action === 'RECEIVED' ? company.id : undefined,
          },
        },
      });

      return newTrace;
    });

    // 12. Success response
    return res.status(201).json({
      success: true,
      traceRecord: {
        id: traceRecord.id,
        action: traceRecord.action,
        location: traceRecord.location,
        notes: traceRecord.notes || '',
        transactionHash: traceRecord.transactionHash,
        blockchainIndex: traceRecord.blockchainIndex ?? 0,
        createdAt: traceRecord.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Add trace record failed:', error);
    return res.status(500).json({
      error: 'Internal server error',
      code: 'SERVER_ERROR',
    });
  }
}
