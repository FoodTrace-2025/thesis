// Single Product Lookup API
// Story 7.7: GET /api/products/[id] - Lookup product by blockchainId
// Public endpoint for consumer query and distributor receive feature

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

// Response types
interface ProductResponse {
  id: string;
  name: string;
  origin: string;
  blockchainId: number;
  harvestDate: string;
  transactionHash: string;
  currentOwner: { name: string } | null;
  company: { name: string };
  createdAt: string;
}

interface SuccessResponse {
  success: true;
  product: ProductResponse;
}

interface ErrorResponse {
  error: string;
  code?: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // 1. Method validation
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    // 2. Validate id parameter
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        error: 'Product ID is required',
        code: 'MISSING_ID',
      });
    }

    // 3. Determine lookup method: blockchainId (numeric) or internal id (cuid)
    const blockchainId = parseInt(id, 10);
    const isBlockchainId = !isNaN(blockchainId) && blockchainId > 0;

    // 4. Query product
    const product = await prisma.product.findFirst({
      where: isBlockchainId ? { blockchainId } : { id },
      include: {
        currentOwner: { select: { name: true } },
        company: { select: { name: true } },
      },
    });

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        code: 'NOT_FOUND',
      });
    }

    // 5. Format response
    const formattedProduct: ProductResponse = {
      id: product.id,
      name: product.name,
      origin: product.origin,
      blockchainId: product.blockchainId,
      harvestDate: product.harvestDate.toISOString(),
      transactionHash: product.transactionHash,
      currentOwner: product.currentOwner,
      company: product.company,
      createdAt: product.createdAt.toISOString(),
    };

    return res.status(200).json({
      success: true,
      product: formattedProduct,
    });
  } catch (error) {
    console.error('Get product failed:', error);
    return res.status(500).json({
      error: 'Internal server error',
      code: 'SERVER_ERROR',
    });
  }
}
