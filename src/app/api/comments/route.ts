// GET /api/comments, POST /api/comments
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { commentSchema } from '@/lib/validations';

// GET /api/comments - Get all comments (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const eventId = searchParams.get('eventId');

    const where: Record<string, string | string> = {};
    if (postId) where.postId = postId;
    if (eventId) where.eventId = eventId;

    const comments = await prisma.comment.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });

    logger.info("Comments fetched successfully", { count: comments.length, postId, eventId });

    return NextResponse.json(comments);
  } catch (error) {
    logger.error("Error fetching comments", { error });

    return NextResponse.json(
      {
        error: "Failed to fetch comments",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// POST /api/comments - Create new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = commentSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn("Comment validation failed", { errors: validationResult.error.issues });
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const { content, userId, userName, postId, eventId } = validationResult.data;
    let { parentId } = validationResult.data;

    // Convert null values to undefined for database operations
    if (parentId === null) {
      parentId = undefined;
    }

    // Validate required fields and user existence for non-guest users
    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (!userName || !userName.trim()) {
      return NextResponse.json({ error: "User name is required" }, { status: 400 });
    }

    // Check if user exists (only if not a guest)
    if (userId !== "guest") {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, name: true },
        });

        if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 400 });
        }
      } catch (userError) {
        logger.error("Error checking user existence:", userError);
        return NextResponse.json({ error: "Failed to validate user" }, { status: 500 });
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId,
        userName: userName.trim(),
        postId,
        eventId,
        parentId,
        createdAt: new Date(),
      },
    });

    logger.info("Comment created successfully", { commentId: comment.id, userId });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    logger.error("Error creating comment", { error });

    return NextResponse.json(
      {
        error: "Failed to create comment",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}
