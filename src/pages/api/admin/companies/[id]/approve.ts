// Company Approve API
// Story 2.3: Company Approve API
// POST /api/admin/companies/:id/approve - Approve a pending company and generate wallet

import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { prisma } from '@/lib/prisma';
import { encryptWalletKey, getEncryptionKey } from '@/lib/crypto';
import { requirePlatformAdmin } from '@/lib/auth/requireAdmin';

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
      select: { id: true, status: true },
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

      // Create audit log entry
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

      return updatedCompany;
    });

    // 8. Return success response (never include encryptedPrivateKey)
    return res.status(200).json({
      success: true,
      company: result,
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
