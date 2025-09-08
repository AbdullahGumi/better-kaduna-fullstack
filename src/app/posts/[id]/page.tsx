import { prisma } from "../../../lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetailClient from "./PostDetailClient";
import { cleanOpenGraphDescription } from "../../../utils/opengraph";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id: id },
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const imageUrl =
    post.thumbnail ||
    "https://res.cloudinary.com/dob19lapx/image/upload/v1756322927/logo_pvnwq1.png";

  const cleanedDescription = cleanOpenGraphDescription(post.content);

  return {
    title: post.title,
    description: cleanedDescription,
    openGraph: {
      title: post.title,
      description: cleanedDescription,
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
      description: cleanedDescription,
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
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id: id },
  });

  if (!post) {
    notFound();
  }

  const comments = await prisma.comment.findMany({
    where: { postId: id },
    orderBy: { createdAt: "asc" },
  });

  return <PostDetailClient post={post} initialComments={comments} />;
}
