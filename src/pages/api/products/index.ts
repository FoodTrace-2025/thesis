// Products List API
// Story 7.4: Product Ownership Tracking
// Story 7.12: Product Status Badges - Added status field
// Story 7.13: Product History API - Added history=me filter
// GET /api/products - List products with optional owner/company/history filter

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// Query parameters validation schema
const querySchema = z.object({
  owner: z.enum(['me']).optional(), // Products currently owned by user's company
  company: z.enum(['me']).optional(), // Products registered by user's company (for producers)
  history: z.enum(['me']).optional(), // Story 7.13: Products where company has ANY trace record
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

// Response types
type ProductStatus = 'IN_STOCK' | 'SOLD';

interface ProductResponse {
  id: string;
  name: string;
  origin: string;
  blockchainId: number;
  harvestDate: string;
  currentOwner: { name: string } | null;
  status: ProductStatus;
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

// Story 7.12: Helper to get status for each product from last trace action
// Note: N+1 query pattern accepted for POC scale (~50-100 products per request)
// TODO: Optimize with aggregation query if performance becomes an issue
async function getProductsWithStatus(
  products: { id: string; name: string; origin: string; blockchainId: number; harvestDate: Date; currentOwner: { name: string } | null; createdAt: Date }[]
): Promise<ProductResponse[]> {
  return Promise.all(
    products.map(async (product) => {
      const lastTrace = await prisma.traceRecord.findFirst({
        where: { productId: product.id },
        orderBy: { createdAt: 'desc' },
        select: { action: true },
      });

      const status: ProductStatus = lastTrace?.action === 'SOLD' ? 'SOLD' : 'IN_STOCK';

      return {
        id: product.id,
        name: product.name,
        origin: product.origin,
        blockchainId: product.blockchainId,
        harvestDate: product.harvestDate.toISOString(),
        currentOwner: product.currentOwner,
        status,
        createdAt: product.createdAt.toISOString(),
      };
    })
  );
}

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

    const { owner, company, history, limit, offset } = validation.data;

    // 3. Story 7.13: Validate mutually exclusive filters
    const filterCount = [owner, company, history].filter(Boolean).length;
    if (filterCount > 1) {
      return res.status(400).json({
        error: 'Only one filter allowed: owner, company, or history',
        code: 'VALIDATION_ERROR',
      });
    }

    // 4. If owner=me or company=me, require authentication
    if (owner === 'me' || company === 'me') {
      const session = await getServerSession(req, res, authOptions);
      if (!session?.user?.companyId) {
        return res.status(401).json({
          error: 'Authentication required',
          code: 'UNAUTHORIZED',
        });
      }

      // 5. Build where clause based on filter type
      // owner=me: products currently owned by user's company (for distributors/retailers)
      // company=me: products registered by user's company (for producers)
      const whereClause = company === 'me'
        ? { companyId: session.user.companyId }
        : { currentOwnerId: session.user.companyId };

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where: whereClause,
          include: { currentOwner: { select: { name: true } } },
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.product.count({ where: whereClause }),
      ]);

      // 6. Format response with status (Story 7.12)
      const formattedProducts = await getProductsWithStatus(products);

      return res.status(200).json({
        success: true,
        products: formattedProducts,
        total,
        limit,
        offset,
      });
    }

    // 7. Story 7.13: history=me - products where company has ANY trace record
    if (history === 'me') {
      const session = await getServerSession(req, res, authOptions);
      if (!session?.user?.companyId) {
        return res.status(401).json({
          error: 'Authentication required',
          code: 'UNAUTHORIZED',
        });
      }

      // Use Prisma's relation filter - efficient single query
      const whereClause = {
        traceRecords: {
          some: { companyId: session.user.companyId },
        },
      };

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where: whereClause,
          include: { currentOwner: { select: { name: true } } },
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.product.count({ where: whereClause }),
      ]);

      const formattedProducts = await getProductsWithStatus(products);

      return res.status(200).json({
        success: true,
        products: formattedProducts,
        total,
        limit,
        offset,
      });
    }

    // 8. Public access: return all products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        include: { currentOwner: { select: { name: true } } },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count(),
    ]);

    // 9. Format response with status (Story 7.12)
    const formattedProducts = await getProductsWithStatus(products);

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
