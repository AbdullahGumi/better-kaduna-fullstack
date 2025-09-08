// DELETE /api/comments/[id]
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// DELETE /api/comments/[id] - Delete comment
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    await prisma.comment.delete({
      where: { id }
    });

    logger.info("Comment deleted successfully", { commentId: id });

    return NextResponse.json({ success: true });
  } catch (error) {
    const { id: commentId } = await params;
    logger.error("Error deleting comment", { commentId, error });

    // Handle Prisma not found error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to delete comment",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}
