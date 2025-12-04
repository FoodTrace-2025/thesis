// Get Trace History API
// Story 7.3: GET Trace History API
// GET /api/products/:id/trace-history - Get complete trace history for a product

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Pagination schema
const paginationSchema = z.object({
  limit: z.coerce
    .number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit must be at most 100')
    .default(50),
  offset: z.coerce
    .number()
    .int('Offset must be an integer')
    .min(0, 'Offset must be non-negative')
    .default(0),
});

// Response types
interface TraceRecordResponse {
  id: string;
  action: string;
  location: string;
  notes: string | null;
  actor: {
    name: string;
    role: string;
    company: string;
  };
  transactionHash: string;
  etherscanLink: string;
  createdAt: string;
}

interface SuccessResponse {
  success: true;
  traceRecords: TraceRecordResponse[];
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
    // 2. Extract and validate productId
    const productId = req.query.id as string;
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND',
      });
    }

    // 3. Validate pagination parameters
    const validation = paginationSchema.safeParse({
      limit: req.query.limit,
      offset: req.query.offset,
    });

    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid pagination parameters',
        code: 'VALIDATION_ERROR',
        details: validation.error.issues,
      });
    }

    const { limit, offset } = validation.data;

    // 4. Query trace records with relations
    const [traceRecords, total] = await Promise.all([
      prisma.traceRecord.findMany({
        where: { productId },
        include: {
          user: { select: { name: true, role: true } },
          company: { select: { name: true } },
        },
        orderBy: { createdAt: 'asc' },
        take: limit,
        skip: offset,
      }),
      prisma.traceRecord.count({ where: { productId } }),
    ]);

    // 5. Format response
    const formattedRecords: TraceRecordResponse[] = traceRecords.map((record) => ({
      id: record.id,
      action: record.action,
      location: record.location,
      notes: record.notes,
      actor: {
        name: record.user.name,
        role: record.user.role,
        company: record.company.name,
      },
      transactionHash: record.transactionHash,
      etherscanLink: `https://sepolia.etherscan.io/tx/${record.transactionHash}`,
      createdAt: record.createdAt.toISOString(),
    }));

    // 6. Success response
    return res.status(200).json({
      success: true,
      traceRecords: formattedRecords,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Get trace history failed:', error);
    return res.status(500).json({
      error: 'Internal server error',
      code: 'SERVER_ERROR',
    });
  }
}
