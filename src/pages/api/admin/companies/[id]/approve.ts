// Company Approve API
// Story 2.3: Company Approve API
// Story 5.2: Add PRODUCER_ROLE granting on blockchain
// POST /api/admin/companies/:id/approve - Approve a pending company and generate wallet

import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { createPublicClient, createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { prisma } from '@/lib/prisma';
import { encryptWalletKey, getEncryptionKey } from '@/lib/crypto';
import { requirePlatformAdmin } from '@/lib/auth/requireAdmin';
import ProductRegistryABI from '@/../artifacts/contracts/ProductRegistry.sol/ProductRegistry.json';

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
      walletAddress: true;
      approvedAt: true;
      createdAt: true;
    };
  }>;
  roleGrantTxHash?: string; // Only for PRODUCER companies (Story 5.2)
}

interface ErrorResponse {
  error: string;
  code?: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

// Fields to select (exclude sensitive data like encryptedPrivateKey)
const companySelectFields = {
  id: true,
  name: true,
  email: true,
  domain: true,
  type: true,
  status: true,
  walletAddress: true,
  approvedAt: true,
  createdAt: true,
} as const;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Validate PLATFORM_ADMIN session
  const session = await requirePlatformAdmin(req, res);
  if (!session) return; // Auth failed, response already sent

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

  try {
    // 3. Find company and validate status
    const company = await prisma.company.findUnique({
      where: { id },
      select: { id: true, status: true, type: true }, // type needed for PRODUCER_ROLE check
    });

    if (!company) {
      return res.status(404).json({
        error: 'Company not found',
        code: 'NOT_FOUND',
      });
    }

    // 4. Validate company status is PENDING
    if (company.status === 'APPROVED') {
      return res.status(409).json({
        error: 'Company is already approved',
        code: 'CONFLICT_ERROR',
      });
    }

    if (company.status === 'REJECTED') {
      return res.status(409).json({
        error: 'Company was rejected',
        code: 'CONFLICT_ERROR',
      });
    }

    // 5. Generate wallet using viem
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);
    const walletAddress = account.address;

    // 6. Encrypt private key using Story 3.1 encryption
    const encryptionKey = getEncryptionKey();
    const encryptedPrivateKey = encryptWalletKey(privateKey, encryptionKey);

    // 6b. Grant blockchain role based on company type - Story 5.2 + Story 7.7 fix
    let roleGrantTxHash: string | undefined;

    // Map company type to grant function
    const roleGrantFunctions: Record<string, string> = {
      PRODUCER: 'grantProducerRole',
      DISTRIBUTOR: 'grantDistributorRole',
      RETAILER: 'grantRetailerRole',
    };

    const grantFunctionName = roleGrantFunctions[company.type];

    if (grantFunctionName) {
      const deployerPrivateKey = process.env.PRIVATE_KEY;
      const contractAddress = process.env.NEXT_PUBLIC_PRODUCT_REGISTRY_ADDRESS;
      const rpcUrl = process.env.SEPOLIA_RPC_URL;

      if (!deployerPrivateKey || !contractAddress || !rpcUrl) {
        console.error(`Missing blockchain configuration for ${company.type}_ROLE granting`);
        return res.status(500).json({
          error: 'Blockchain configuration missing',
          code: 'CONFIG_ERROR',
        });
      }

      // Create deployer wallet client (has DEFAULT_ADMIN_ROLE on contract)
      const deployerAccount = privateKeyToAccount(deployerPrivateKey as `0x${string}`);

      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(rpcUrl),
      });

      const walletClient = createWalletClient({
        account: deployerAccount,
        chain: sepolia,
        transport: http(rpcUrl),
      });

      // Grant role to the new company wallet
      const hash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: ProductRegistryABI.abi,
        functionName: grantFunctionName,
        args: [walletAddress],
      });

      // Wait for confirmation (1 block)
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
        confirmations: 1,
      });

      if (receipt.status !== 'success') {
        console.error(`${company.type}_ROLE granting transaction failed:`, { hash, receipt });
        return res.status(500).json({
          error: 'Failed to grant blockchain role',
          code: 'BLOCKCHAIN_ERROR',
        });
      }

      roleGrantTxHash = hash;
      console.log(`${company.type}_ROLE granted:`, { walletAddress, txHash: hash });
    }

    // 7. Atomic update: company + audit log
    const result = await prisma.$transaction(async (tx) => {
      // Update company with wallet and approval data
      const updatedCompany = await tx.company.update({
        where: { id },
        data: {
          status: 'APPROVED',
          walletAddress,
          encryptedPrivateKey,
          approvedAt: new Date(),
        },
        select: companySelectFields,
      });

      // Create audit log entry for company approval
      await tx.auditLog.create({
        data: {
          action: 'APPROVE_COMPANY',
          companyId: id,
          userId: session.user.id,
          details: {
            walletAddress,
          },
        },
      });

      // Create audit log entry for PRODUCER_ROLE granting (Story 5.2)
      if (roleGrantTxHash) {
        await tx.auditLog.create({
          data: {
            action: 'GRANT_PRODUCER_ROLE',
            companyId: id,
            userId: session.user.id,
            details: {
              walletAddress,
              transactionHash: roleGrantTxHash,
              contractAddress: process.env.NEXT_PUBLIC_PRODUCT_REGISTRY_ADDRESS,
            },
          },
        });
      }

      return updatedCompany;
    });

    // 8. Return success response (never include encryptedPrivateKey)
    return res.status(200).json({
      success: true,
      company: result,
      ...(roleGrantTxHash && { roleGrantTxHash }), // Include only for PRODUCER companies
    });
  } catch (error) {
    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002: Unique constraint violation (wallet address already exists - highly unlikely)
      if (error.code === 'P2002') {
        console.error('Wallet address collision detected:', error);
        return res.status(500).json({
          error: 'Failed to approve company',
          code: 'SERVER_ERROR',
        });
      }
    }

    // Log error for debugging but never log sensitive data
    console.error('Company approval failed:', (error as Error).message);

    return res.status(500).json({
      error: 'Failed to approve company',
      code: 'SERVER_ERROR',
    });
  }
}
