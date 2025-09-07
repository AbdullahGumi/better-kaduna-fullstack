// GET /api/events/[id], PUT /api/events/[id], DELETE /api/events/[id]
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { eventSchema } from '@/lib/validations';
import { NotFoundError } from '@/lib/errors';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/events/[id] - Get single event
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    logger.info("Event fetched successfully", { eventId: id });

    return NextResponse.json(event);
  } catch (error) {
    logger.error("Error fetching event", { eventId: params.id, error });

    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to fetch event",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// PUT /api/events/[id] - Update event
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate input
    const validationResult = eventSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn("Event update validation failed", { errors: validationResult.error.issues });
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const { title, description, date, location } = validationResult.data;

    const event = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date: new Date(date),
        location
      },
    });

    logger.info("Event updated successfully", { eventId: id });

    return NextResponse.json(event);
  } catch (error) {
    logger.error("Error updating event", { eventId: params.id, error });

    // Handle Prisma not found error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to update event",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Delete event
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    await prisma.event.delete({
      where: { id }
    });

    logger.info("Event deleted successfully", { eventId: id });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error deleting event", { eventId: params.id, error });

    // Handle Prisma not found error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to delete event",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}
