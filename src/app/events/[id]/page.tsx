import { prisma } from "../../../lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import EventDetailClient from "./EventDetailClient";
import { cleanOpenGraphDescription } from "../../../utils/opengraph";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id: id },
  });

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  const imageUrl =
    "https://res.cloudinary.com/dob19lapx/image/upload/v1756322927/logo_pvnwq1.png";

  const cleanedDescription = cleanOpenGraphDescription(event.description);

  return {
    title: event.title,
    description: cleanedDescription,
    openGraph: {
      title: event.title,
      description: cleanedDescription,
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
      description: cleanedDescription,
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
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id: id },
  });

  if (!event) {
    notFound();
  }

  const comments = await prisma.comment.findMany({
    where: { eventId: id },
    orderBy: { createdAt: "asc" },
  });

  return <EventDetailClient event={event} initialComments={comments} />;
}
