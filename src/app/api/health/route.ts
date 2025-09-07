import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

// GET /api/health - Health Check Endpoint
export async function GET(request: NextRequest) {
  try {
    const healthData = {
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      service: "better-kaduna-next"
    };

    logger.info("Health check requested", {
      status: healthData.status,
      uptime: healthData.uptime
    });

    return NextResponse.json(healthData);
  } catch (error) {
    logger.error("Health check error", { error });
    return NextResponse.json(
      { error: "Health check failed" },
      { status: 500 }
    );
  }
}
