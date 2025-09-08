import { prisma } from "../../../lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import MDADetailClient from "./MDADetailClient";

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
  const mda = await prisma.mDA.findUnique({
    where: { id: params.id },
  });

  if (!mda) {
    return {
      title: "MDA Not Found",
    };
  }

  const imageUrl =
    mda.thumbnail ||
    "https://res.cloudinary.com/dob19lapx/image/upload/v1756322927/logo_pvnwq1.png";

  return {
    title: mda.name,
    description: `Learn about ${mda.name} in Kaduna State. By ${
      mda.author
    }. Updated on ${new Date(mda.date).toLocaleDateString()}`,
    openGraph: {
      title: mda.name,
      description: `Learn about ${mda.name} in Kaduna State. By ${
        mda.author
      }. Updated on ${new Date(mda.date).toLocaleDateString()}`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: mda.name,
        },
      ],
    },
  };
}

export default async function MDADetail({
  params,
}: {
  params: { id: string };
}) {
  const mda = await prisma.mDA.findUnique({
    where: { id: params.id },
  });

  if (!mda) {
    notFound();
  }

  return <MDADetailClient mda={mda} />;
}
