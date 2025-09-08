import { prisma } from "../../../lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import PostDetailClient from "./PostDetailClient";

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
  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const imageUrl =
    post.thumbnail ||
    "https://res.cloudinary.com/dob19lapx/image/upload/v1756322927/logo_pvnwq1.png";

  return {
    title: post.title,
    description: post.content,
    openGraph: {
      title: post.title,
      description: post.content,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.content,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    notFound();
  }

  const comments = await prisma.comment.findMany({
    where: { postId: params.id },
    orderBy: { createdAt: "asc" },
  });

  return <PostDetailClient post={post} initialComments={comments} />;
}
