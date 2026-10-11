import { z } from "zod";

export const Article = z.object({
  _id: z.string(), // use z.ulid() only if your IDs are ULIDs; Mongo ObjectIds are not
  title: z.string().min(10, "Title must be at least 10 characters"),
  content: z.string().min(100, "Content must be at least 100 characters"),
  excerpt: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional().default([]),
  imageUrl: z.string().url().optional().or(z.literal("")),
  author: z.object({
    authorId: z.string(),
    authorName: z.string(),
    authorImage: z.string(),
  }),
  status: z.enum(["draft", "published"]).optional().default("published"),
  views: z.number(),
  likes: z.number(),
  sentiment: z.string().optional(),
  sentimentScore: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});

export type Article = z.infer<typeof Article>;
