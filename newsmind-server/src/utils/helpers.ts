import { Request } from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { usersCollection } from "../config/db";

export function getJwtSecret() {
  return process.env.JWT_SECRET || "dev-secret";
}

export function getAuthToken(req: Request) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.replace("Bearer ", "").trim();
}

export type AuthUser = {
  userId: string;
  role: string;
  email?: string;
  name?: string;
};

export function getAuthUser(req: Request): AuthUser | null {
  const token = getAuthToken(req);
  if (token) {
    try {
      return jwt.verify(token, getJwtSecret()) as AuthUser;
    } catch {
      return null;
    }
  }

  const userIdHeader = req.headers["x-user-id"];
  const roleHeader = req.headers["x-user-role"];
  const emailHeader = req.headers["x-user-email"];
  const nameHeader = req.headers["x-user-name"];

  if (typeof userIdHeader === "string" && userIdHeader.trim()) {
    return {
      userId: userIdHeader,
      role: typeof roleHeader === "string" && roleHeader.trim() ? roleHeader : "user",
      email: typeof emailHeader === "string" && emailHeader.trim() ? emailHeader : undefined,
      name: typeof nameHeader === "string" && nameHeader.trim() ? nameHeader : undefined,
    };
  }

  return null;
}

export function buildUserFilter(userId: string, email?: string) {
  const filter: any = { $or: [{ _id: userId }] };
  if (ObjectId.isValid(userId)) {
    filter.$or.push({ _id: new ObjectId(userId) });
  }
  if (email) {
    filter.$or.push({ email: String(email).toLowerCase() });
  }
  return filter;
}

export async function getOrCreateUser(userId: string, email?: string, name?: string) {
  if (!userId) return null;

  const filter = buildUserFilter(userId, email);
  let user = await usersCollection.findOne(filter);

  if (user) {
    return user;
  }

  await usersCollection.insertOne({
    _id: new ObjectId(userId),
    name: name || email || "User",
    email: email ? String(email).toLowerCase() : "",
    role: "user",
    avatar: "",
    bio: "",
    bookmarks: [],
    likedPosts: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return usersCollection.findOne(filter);
}

export function normalizeArticle(article: any) {
  return {
    ...article,
    id: article._id?.toString() || article.id,
    _id: article._id?.toString() || article.id,
    author: article.author || { name: "NewsMind Agent", avatar: "" },
  };
}
