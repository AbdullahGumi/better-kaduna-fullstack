// GET /api/posts/[id], PUT /api/posts/[id], DELETE /api/posts/[id]
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { postSchema } from '@/lib/validations';
import { NotFoundError } from '@/lib/errors';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/posts/[id] - Get single post
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    logger.info("Post fetched successfully", { postId: id });

    return NextResponse.json(post);
  } catch (error) {
    logger.error("Error fetching post", { postId: params.id, error });

    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to fetch post",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - Update post
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate input
    const validationResult = postSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn("Post update validation failed", { errors: validationResult.error.issues });
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const { title, content, author, thumbnail } = validationResult.data;

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        author,
        thumbnail
      },
    });

    logger.info("Post updated successfully", { postId: id });

    return NextResponse.json(post);
  } catch (error) {
    logger.error("Error updating post", { postId: params.id, error });

    // Handle Prisma not found error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to update post",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Delete post
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    await prisma.post.delete({
      where: { id }
    });

    logger.info("Post deleted successfully", { postId: id });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error deleting post", { postId: params.id, error });

    // Handle Prisma not found error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to delete post",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}
