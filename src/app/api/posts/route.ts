// GET /api/posts, POST /api/posts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { postSchema } from '@/lib/validations';

// GET /api/posts - Get all posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('_page') || '1');
    const limit = parseInt(searchParams.get('_limit') || '10');
    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      skip,
      take: limit,
      orderBy: { date: 'desc' },
    });

    logger.info("Posts fetched successfully", { count: posts.length, page, limit });

    return NextResponse.json(posts);
  } catch (error) {
    logger.error("Error fetching posts", { error });

    return NextResponse.json(
      {
        error: "Failed to fetch posts",
        details: (error as Error).message
      },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = postSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn("Post validation failed", { errors: validationResult.error.issues });
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const { title, content, author, thumbnail } = validationResult.data;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        author,
        date: new Date(),
        thumbnail
      },
    });

    logger.info("Post created successfully", { postId: post.id, author });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    logger.error("Error creating post", { error });

    return NextResponse.json(
      {
        error: "Failed to create post",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}
