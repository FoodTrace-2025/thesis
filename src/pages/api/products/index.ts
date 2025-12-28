// Products List API
// Story 7.4: Product Ownership Tracking
// Story 7.12: Product Status Badges - Added status field
// Story 7.13: Product History API - Added history=me filter
// Story 7.17: Incoming Shipments API - Added incoming=me filter
// Story 7.18: Quarantine Filter - Added quarantined=me filter
// GET /api/products - List products with optional owner/company/history/incoming/quarantined filter

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
  incoming: z.enum(['me']).optional(), // Story 7.17: Products shipped to me but not yet received
  quarantined: z.enum(['me']).optional(), // Story 7.18: Quarantined products owned by user's company
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

// Response types
type OnChainStatus =
  | 'REGISTERED'
  | 'RECEIVED'
  | 'QUALITY_CHECK'
  | 'QUALITY_FAIL' // Story 7.18
  | 'SHIPPED'
  | 'STOCKED'
  | 'SOLD'
  | 'REJECTED';

interface ProductResponse {
  id: string;
  name: string;
  origin: string;
  blockchainId: number;
  harvestDate: string;
  currentOwner: { name: string } | null;
  status: OnChainStatus;
  createdAt: string;
  // Story 7.17: Shipping info (only for incoming=me)
  shippedBy?: { name: string };
  shippedAt?: string;
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
  const validStatuses: Set<OnChainStatus> = new Set<OnChainStatus>([
    'REGISTERED',
    'RECEIVED',
    'QUALITY_CHECK',
    'QUALITY_FAIL', // Story 7.18
    'SHIPPED',
    'STOCKED',
    'SOLD',
    'REJECTED',
  ] as OnChainStatus[]);

  return Promise.all(
    products.map(async (product) => {
      const lastTrace = await prisma.traceRecord.findFirst({
        where: { productId: product.id },
        orderBy: { createdAt: 'desc' },
        select: { action: true },
      });

      const rawAction = lastTrace?.action?.toString().toUpperCase() as OnChainStatus | undefined;
      const status: OnChainStatus =
        (rawAction && validStatuses.has(rawAction) && rawAction) || 'REGISTERED';

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

    const { owner, company, history, incoming, quarantined, limit, offset } = validation.data;

    // 3. Story 7.13 + 7.17 + 7.18: Validate mutually exclusive filters
    const filterCount = [owner, company, history, incoming, quarantined].filter(Boolean).length;
    if (filterCount > 1) {
      return res.status(400).json({
        error: 'Only one filter allowed: owner, company, history, incoming, or quarantined',
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
      //           Story 7.18: Excludes quarantined products (they appear in quarantined=me)
      // company=me: products registered by user's company (for producers)
      const whereClause = company === 'me'
        ? { companyId: session.user.companyId }
        : { currentOwnerId: session.user.companyId, isQuarantined: false };

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

    // 8. Story 7.17: incoming=me - products shipped to me but not yet received
    if (incoming === 'me') {
      const session = await getServerSession(req, res, authOptions);
      if (!session?.user?.companyId) {
        return res.status(401).json({
          error: 'Authentication required',
          code: 'UNAUTHORIZED',
        });
      }

      const myCompanyId = session.user.companyId;

      // Find products with SHIPPED trace to me, without my RECEIVED
      const whereClause = {
        traceRecords: {
          some: {
            action: 'SHIPPED',
            recipientCompanyId: myCompanyId,
          },
        },
        NOT: {
          traceRecords: {
            some: {
              action: 'RECEIVED',
              companyId: myCompanyId,
            },
          },
        },
      };

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where: whereClause,
          include: {
            currentOwner: { select: { name: true } },
            // Include the SHIPPED trace to get shipper info
            traceRecords: {
              where: {
                action: 'SHIPPED',
                recipientCompanyId: myCompanyId,
              },
              orderBy: { createdAt: 'desc' },
              take: 1,
              include: {
                company: { select: { name: true } },
              },
            },
          },
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.product.count({ where: whereClause }),
      ]);

      // Format response with SHIPPED status and shipping info
      const formattedProducts: ProductResponse[] = products.map((product) => {
        const shippedTrace = product.traceRecords[0]; // Most recent SHIPPED trace to me
        return {
          id: product.id,
          name: product.name,
          origin: product.origin,
          blockchainId: product.blockchainId,
          harvestDate: product.harvestDate.toISOString(),
          currentOwner: product.currentOwner,
          status: 'SHIPPED',
          createdAt: product.createdAt.toISOString(),
          // Shipping info
          shippedBy: shippedTrace?.company ? { name: shippedTrace.company.name } : undefined,
          shippedAt: shippedTrace?.createdAt.toISOString(),
        };
      });

      return res.status(200).json({
        success: true,
        products: formattedProducts,
        total,
        limit,
        offset,
      });
    }

    // 9. Story 7.18: quarantined=me - quarantined products owned by user's company
    if (quarantined === 'me') {
      const session = await getServerSession(req, res, authOptions);
      if (!session?.user?.companyId) {
        return res.status(401).json({
          error: 'Authentication required',
          code: 'UNAUTHORIZED',
        });
      }

      // Find products that are quarantined AND owned by user's company
      const whereClause = {
        currentOwnerId: session.user.companyId,
        isQuarantined: true,
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

    // 10. Public access: return all products
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
