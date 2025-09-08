// POST /api/auth/login - User Login
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { loginSchema } from '@/lib/validations';
import { AuthenticationError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn("Login validation failed", { errors: validationResult.error.issues });
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        createdAt: true
      }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      logger.warn("Login failed: Invalid credentials", { email });
      throw new AuthenticationError("Invalid email or password");
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    logger.info("User logged in successfully", { userId: user.id, email });

    return NextResponse.json({
      ...userWithoutPassword,
      message: "Login successful"
    });

  } catch (error) {
    logger.error("Login error", {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
