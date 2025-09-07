import { z } from 'zod';

// Validation schemas (migrated from Joi to Zod)
export const postSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  author: z.string().min(1).max(100),
  thumbnail: z.string().url().optional(),
});

export const eventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  date: z.string(),
  location: z.string().min(1).max(200),
});

export const mdaSchema = z.object({
  name: z.string().min(1).max(200),
  content: z.string().min(1),
  author: z.string().min(1).max(100),
  thumbnail: z.string().url().optional(),
});

export const commentSchema = z.object({
  content: z.string().min(1).max(1000),
  userId: z.string(),
  userName: z.string().min(1).max(100),
  postId: z.string().optional(),
  eventId: z.string().optional(),
  parentId: z.string().nullable().optional(),
});

export const userSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "editor", "registered"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6),
});
