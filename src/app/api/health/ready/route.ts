/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

// GET /api/health/ready - Readiness Check
export async function GET(request: NextRequest) {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    const readyData = {
      status: "Ready",
      database: "Connected",
      timestamp: new Date().toISOString(),
    };

    logger.info("Readiness check passed", readyData);

    return NextResponse.json(readyData);
  } catch (error) {
    logger.error("Readiness check failed", { error });

    return NextResponse.json(
      {
        status: "Not Ready",
        database: "Disconnected",
        error: process.env.NODE_ENV === "development"
          ? (error as Error).message
          : "Service unavailable"
      },
      { status: 503 }
    );
  }
}
