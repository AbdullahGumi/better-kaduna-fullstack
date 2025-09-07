// GET /api/mdas/[id], PUT /api/mdas/[id], DELETE /api/mdas/[id]
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { mdaSchema } from '@/lib/validations';
import { NotFoundError } from '@/lib/errors';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/mdas/[id] - Get single MDA
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    const mda = await prisma.MDA.findUnique({
      where: { id }
    });

    if (!mda) {
      throw new NotFoundError('MDA not found');
    }

    logger.info("MDA fetched successfully", { mdaId: id });

    return NextResponse.json(mda);
  } catch (error) {
    logger.error("Error fetching MDA", { mdaId: params.id, error });

    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to fetch MDA",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// PUT /api/mdas/[id] - Update MDA
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate input
    const validationResult = mdaSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn("MDA update validation failed", { errors: validationResult.error.issues });
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const { name, content, author, thumbnail } = validationResult.data;

    const mda = await prisma.MDA.update({
      where: { id },
      data: {
        name,
        content,
        author,
        thumbnail
      },
    });

    logger.info("MDA updated successfully", { mdaId: id });

    return NextResponse.json(mda);
  } catch (error) {
    logger.error("Error updating MDA", { mdaId: params.id, error });

    // Handle Prisma not found error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'MDA not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to update MDA",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE /api/mdas/[id] - Delete MDA
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    await prisma.MDA.delete({
      where: { id }
    });

    logger.info("MDA deleted successfully", { mdaId: id });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error deleting MDA", { mdaId: params.id, error });

    // Handle Prisma not found error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'MDA not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to delete MDA",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}
