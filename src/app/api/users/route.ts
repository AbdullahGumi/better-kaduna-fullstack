// GET /api/users, POST /api/users
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { userSchema } from '@/lib/validations';
import { User } from '@/types';

// GET /api/users - Get all users with optional email filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    const where = email ? { email } : {};

    const users = await prisma.user.findMany({ where });

    logger.info("Users fetched successfully", { count: users.length });

    // Remove passwords from response
    const usersWithoutPasswords = users.map((user: User) => {
      const { password, ...userWithoutPassword } = user;
      console.log('password', password)
      return userWithoutPassword;
    });

    return NextResponse.json(usersWithoutPasswords);
  } catch (error) {
    logger.error("Error fetching users", { error });

    return NextResponse.json(
      {
        error: "Failed to fetch users",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = userSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn("User validation failed", { errors: validationResult.error.issues });
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const { name, email, password, role = "registered" } = validationResult.data;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        createdAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    logger.info("User created successfully", { userId: user.id, email });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    logger.error("Error creating user", { error });

    // Handle Prisma unique constraint error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create user",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}
