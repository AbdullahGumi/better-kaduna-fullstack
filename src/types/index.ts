export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  date: Date;
  thumbnail: string | null;
}

export interface MDA {
  id: string;
  name: string;
  content: string;
  author: string;
  date: Date;
  thumbnail: string | null;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: Date;
  parentId: string | null;
  postId: string | null;
  eventId: string | null;
  replies?: Comment[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
}

export type CommentWithReplies = Comment & { replies: Comment[]; };
