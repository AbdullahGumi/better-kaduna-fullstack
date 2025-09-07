// GET /api/users/[id], PUT /api/users/[id], DELETE /api/users/[id]
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { userSchema } from '@/lib/validations';
import { NotFoundError } from '@/lib/errors';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/users/[id] - Get single user
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    logger.info("User fetched successfully", { userId: id });

    return NextResponse.json(user);
  } catch (error) {
    logger.error("Error fetching user", { userId: params.id, error });

    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to fetch user",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();

    // Create a partial schema for updates (password is optional)
    const updateUserSchema = userSchema.partial().extend({
      password: userSchema.shape.password.optional()
    });

    // Validate input
    const validationResult = updateUserSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn("User update validation failed", { errors: validationResult.error.issues });
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const { name, email, password, role } = validationResult.data;
    const data: { name?: string; email?: string; role?: string; password?: string } = { name, email, role };

    // Hash password if provided
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    logger.info("User updated successfully", { userId: id });

    return NextResponse.json(user);
  } catch (error) {
    logger.error("Error updating user", { userId: params.id, error });

    // Handle Prisma not found error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Handle unique constraint error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to update user",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // First, delete all comments by this user to avoid foreign key constraint
    await prisma.comment.deleteMany({
      where: { userId: id },
    });

    // Then delete the user
    await prisma.user.delete({
      where: { id }
    });

    logger.info("User deleted successfully", { userId: id });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error deleting user", { userId: params.id, error });

    // Handle Prisma not found error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to delete user",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}
