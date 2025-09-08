// GET /api/mdas, POST /api/mdas
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { mdaSchema } from '@/lib/validations';

// GET /api/mdas - Get all MDAs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('_page') || '1');
    const limit = parseInt(searchParams.get('_limit') || '10');
    const skip = (page - 1) * limit;

    const mdas = await prisma.mDA.findMany({
      skip,
      take: limit,
      orderBy: { date: 'desc' },
    });

    logger.info("MDAs fetched successfully", { count: mdas.length, page, limit });

    return NextResponse.json(mdas);
  } catch (error) {
    logger.error("Error fetching MDAs", { error });

    return NextResponse.json(
      {
        error: "Failed to fetch MDAs",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// POST /api/mdas - Create new MDA
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = mdaSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn("MDA validation failed", { errors: validationResult.error.issues });
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const { name, content, author, thumbnail } = validationResult.data;

    const mda = await prisma.mDA.create({
      data: {
        name,
        content,
        author,
        date: new Date(),
        thumbnail
      },
    });

    logger.info("MDA created successfully", { mdaId: mda.id, name });

    return NextResponse.json(mda, { status: 201 });
  } catch (error) {
    logger.error("Error creating MDA", { error });

    return NextResponse.json(
      {
        error: "Failed to create MDA",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}
