import { z } from "zod";


export const newArticleSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  content: z.string().min(100, "Content must be at least 100 characters"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional().default([]), 
  imageUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).optional().default("draft"),
  excerpt: z.string().optional(),
});

