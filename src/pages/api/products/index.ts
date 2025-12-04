// Products List API
// Story 7.4: Product Ownership Tracking
// GET /api/products - List products with optional owner filter

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// Query parameters validation schema
const querySchema = z.object({
  owner: z.enum(['me']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

// Response types
interface ProductResponse {
  id: string;
  name: string;
  origin: string;
  blockchainId: number;
  harvestDate: string;
  currentOwner: { name: string } | null;
  createdAt: string;
}

interface SuccessResponse {
  success: true;
  products: ProductResponse[];
  total: number;
  limit: number;
  offset: number;
}

interface ErrorResponse {
  error: string;
  code?: string;
  details?: z.ZodIssue[];
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
    // 2. Validate query parameters
    const validation = querySchema.safeParse(req.query);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid parameters',
        code: 'VALIDATION_ERROR',
        details: validation.error.issues,
      });
    }

    const { owner, limit, offset } = validation.data;

    // 3. If owner=me, require authentication
    if (owner === 'me') {
      const session = await getServerSession(req, res, authOptions);
      if (!session?.user?.companyId) {
        return res.status(401).json({
          error: 'Authentication required',
          code: 'UNAUTHORIZED',
        });
      }

      // 4. Query products owned by user's company
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where: { currentOwnerId: session.user.companyId },
          include: { currentOwner: { select: { name: true } } },
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.product.count({ where: { currentOwnerId: session.user.companyId } }),
      ]);

      // 5. Format response
      const formattedProducts: ProductResponse[] = products.map((product) => ({
        id: product.id,
        name: product.name,
        origin: product.origin,
        blockchainId: product.blockchainId,
        harvestDate: product.harvestDate.toISOString(),
        currentOwner: product.currentOwner,
        createdAt: product.createdAt.toISOString(),
      }));

      return res.status(200).json({
        success: true,
        products: formattedProducts,
        total,
        limit,
        offset,
      });
    }

    // 6. Public access: return all products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        include: { currentOwner: { select: { name: true } } },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count(),
    ]);

    // 7. Format response
    const formattedProducts: ProductResponse[] = products.map((product) => ({
      id: product.id,
      name: product.name,
      origin: product.origin,
      blockchainId: product.blockchainId,
      harvestDate: product.harvestDate.toISOString(),
      currentOwner: product.currentOwner,
      createdAt: product.createdAt.toISOString(),
    }));

    return res.status(200).json({
      success: true,
      products: formattedProducts,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Get products failed:', error);
    return res.status(500).json({
      error: 'Internal server error',
      code: 'SERVER_ERROR',
    });
  }
}
