// Product Registration API
// Story 5.3: Product Registration API
// POST /api/products/register - Register a product on blockchain

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
import { requireProducer } from '@/lib/auth/requireProducer';
import ProductRegistryABI from '@/lib/abi/ProductRegistry';

// Request validation schema
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  origin: z.string().min(1, 'Origin is required').max(100, 'Origin too long'),
  harvestDate: z.string().refine(
    (date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime()) && parsed <= new Date();
    },
    'Harvest date must be valid and not in the future'
  ),
});

// Response types
interface SuccessResponse {
  success: true;
  product: {
    id: string;
    blockchainId: number;
    name: string;
    origin: string;
    harvestDate: string;
    transactionHash: string;
    qrCodeUrl: string;
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
    // 2-4. Authentication, authorization, and company validation (using middleware)
    const session = await requireProducer(req, res);
    if (!session) return; // Auth failed, response already sent

    const { company } = session.user;

    // 5. Input validation
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: validation.error.issues,
      });
    }

    const { name, origin, harvestDate } = validation.data;
    const harvestDateTime = new Date(harvestDate);
    const harvestTimestamp = BigInt(
      Math.floor(harvestDateTime.getTime() / 1000)
    );

    // 6. Decrypt company wallet (returns null on failure, per backend-architecture.md pattern)
    const encryptionKey = getEncryptionKey();
    const privateKey = decryptWalletKey(
      company.encryptedPrivateKey!,
      encryptionKey
    );

    if (!privateKey) {
      console.error('Wallet decryption failed:', {
        userId: session.user.id,
        companyId: company.id,
      });

      // Audit log for decryption failure
      await prisma.auditLog.create({
        data: {
          action: 'WALLET_DECRYPT_FAILED',
          userId: session.user.id,
          companyId: company.id,
          details: { error: 'Decryption returned null' },
        },
      });

      return res.status(500).json({
        error: 'Failed to access company wallet',
        code: 'WALLET_DECRYPT_ERROR',
      });
    }

    // 7. Create viem clients
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

    // 8. Estimate gas
    const gasEstimate = await publicClient.estimateContractGas({
      address: contractAddress as `0x${string}`,
      abi: ProductRegistryABI.abi,
      functionName: 'registerProduct',
      args: [name, origin, harvestTimestamp],
      account,
    });

    // 9. Submit transaction with retry
    const hash = await withRetry(async () => {
      return walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: ProductRegistryABI.abi,
        functionName: 'registerProduct',
        args: [name, origin, harvestTimestamp],
        gas: gasEstimate + gasEstimate / BigInt(5), // 20% buffer
      });
    });

    // 10. Wait for receipt
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
      confirmations: 1,
    });

    if (receipt.status !== 'success') {
      console.error('Transaction failed:', { hash, receipt });
      return res.status(502).json({
        error: 'Blockchain transaction failed',
        code: 'TX_FAILED',
      });
    }

    // 11. Parse ProductRegistered event
    // Type for the parsed event
    interface ProductRegisteredEvent {
      args: {
        productId: bigint;
        producer: `0x${string}`;
        name: string;
        timestamp: bigint;
      };
    }

    const logs = parseEventLogs({
      abi: ProductRegistryABI.abi,
      eventName: 'ProductRegistered',
      logs: receipt.logs,
    }) as unknown as ProductRegisteredEvent[];

    if (logs.length === 0) {
      console.error('ProductRegistered event not found:', { hash, receipt });
      return res.status(502).json({
        error: 'Product registration event not found',
        code: 'EVENT_NOT_FOUND',
      });
    }

    // Extract productId from the first event's args
    const blockchainId = Number(logs[0].args.productId);
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const qrCodeUrl = `${baseUrl}/trace/${blockchainId}`;

    // 12. Save to database (atomic with audit log)
    const product = await prisma.$transaction(async (tx) => {
      const newProduct = await tx.product.create({
        data: {
          blockchainId,
          name,
          origin,
          harvestDate: harvestDateTime,
          transactionHash: hash,
          qrCodeUrl,
          companyId: company.id,
          createdByUserId: session.user.id,
          currentOwnerId: company.id, // Story 7.4: Producer is initial owner
        },
      });

      await tx.auditLog.create({
        data: {
          action: 'PRODUCT_REGISTERED',
          userId: session.user.id,
          companyId: company.id,
          details: {
            productId: newProduct.id,
            blockchainId,
            transactionHash: hash,
            name,
            origin,
          },
        },
      });

      return newProduct;
    });

    // 13. Success response
    return res.status(201).json({
      success: true,
      product: {
        id: product.id,
        blockchainId: product.blockchainId,
        name: product.name,
        origin: product.origin,
        harvestDate: product.harvestDate.toISOString(),
        transactionHash: product.transactionHash,
        qrCodeUrl: product.qrCodeUrl || '',
      },
    });
  } catch (error) {
    console.error('Product registration failed:', error);
    return res.status(500).json({
      error: 'Internal server error',
      code: 'SERVER_ERROR',
    });
  }
}
