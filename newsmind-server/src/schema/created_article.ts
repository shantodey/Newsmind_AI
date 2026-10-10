import z from "zod";

export const newSrticle= z.object({
    title:z.string(),
    excerpt:z.string(),
    content:z.string(),
    category:z.string(),
    tags:z.array({
        
    }),
    imageUrl:z.string(),
    author:z.string(),
    status:z.string(),
    views:z.number(),
    likes:z.number(),
    sentiment:z.string(),
    sentimentScore:z.number(),
    readTime:z.string(),
    createdAt:z.date(),
    updatedAt:z.date(),
})