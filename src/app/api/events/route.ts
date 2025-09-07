// GET /api/events, POST /api/events
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { eventSchema } from '@/lib/validations';

// GET /api/events - Get all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('_page') || '1');
    const limit = parseInt(searchParams.get('_limit') || '10');
    const skip = (page - 1) * limit;

    const events = await prisma.event.findMany({
      skip,
      take: limit,
      orderBy: { date: 'desc' },
    });

    logger.info("Events fetched successfully", { count: events.length, page, limit });

    return NextResponse.json(events);
  } catch (error) {
    logger.error("Error fetching events", { error });

    return NextResponse.json(
      {
        error: "Failed to fetch events",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = eventSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn("Event validation failed", { errors: validationResult.error.issues });
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const { title, description, date, location } = validationResult.data;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location
      },
    });

    logger.info("Event created successfully", { eventId: event.id, title });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    logger.error("Error creating event", { error });

    return NextResponse.json(
      {
        error: "Failed to create event",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}
