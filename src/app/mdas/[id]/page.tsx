import { prisma } from "../../../lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import MDADetailClient from "./MDADetailClient";
import { cleanOpenGraphDescription } from "../../../utils/opengraph";

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

  const cleanedDescription = cleanOpenGraphDescription(mda.content);

  return {
    title: mda.name,
    description: cleanedDescription,
    openGraph: {
      title: mda.name,
      description: cleanedDescription,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: mda.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: mda.name,
      description: cleanedDescription,
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
