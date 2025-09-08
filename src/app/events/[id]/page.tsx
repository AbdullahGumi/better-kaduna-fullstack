import { prisma } from "../../../lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import EventDetailClient from "./EventDetailClient";

async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("host");
  if (host) {
    const protocol = h.get("x-forwarded-proto") || "http";
    return `${protocol}://${host}`;
  }
  return "http://localhost:3000";
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
  });

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  const imageUrl =
    "https://res.cloudinary.com/dob19lapx/image/upload/v1756322927/logo_pvnwq1.png";

  return {
    title: event.title,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: event.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.description,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: event.title,
        },
      ],
    },
  };
}

export default async function EventDetail({
  params,
}: {
  params: { id: string };
}) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
  });

  if (!event) {
    notFound();
  }

  const comments = await prisma.comment.findMany({
    where: { eventId: params.id },
    orderBy: { createdAt: "asc" },
  });

  return <EventDetailClient event={event} initialComments={comments} />;
}
