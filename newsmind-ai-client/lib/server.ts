"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const BACKEND_URL = process.env.SERVER_URL || "http://localhost:5001";

async function getAuthHeaders() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const reqHeaders = new Headers({
    "Content-Type": "application/json",
  });

  if (session?.user) {
    reqHeaders.set("x-user-id", session.user.id);
    reqHeaders.set("x-user-role", (session.user as { role?: string }).role || "user");
  }

  return { reqHeaders, session };
}

export async function getArticles(category?: string) {
  try {
    const url = category && category !== "ALL"
      ? `${BACKEND_URL}/api/articles?category=${encodeURIComponent(category)}`
      : `${BACKEND_URL}/api/articles`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch articles");
    const data = await res.json();
    return data.articles || [];
  } catch (error) {
    console.error("Server Action getArticles error:", error);
    return [];
  }
}

export async function getArticleById(id: string) {
  try {
    const { reqHeaders } = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/articles/${id}`, {
      headers: reqHeaders,
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch article details");
    const data = await res.json();
    return data.article || null;
  } catch (error) {
    console.error("Server Action getArticleById error:", error);
    return null;
  }
}

export async function getArticleStats() {
  try {
    const { reqHeaders } = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/articles/stats`, {
      headers: reqHeaders,
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch stats");
    return await res.json();
  } catch (error) {
    console.error("Server Action getArticleStats error:", error);
    return null;
  }
}

export async function createArticle(payload: any) {
  try {
    const { reqHeaders, session } = await getAuthHeaders();
    if (!session) {
      return { error: "You must be logged in to publish an article." };
    }

    const res = await fetch(`${BACKEND_URL}/api/articles`, {
      method: "POST",
      headers: reqHeaders,
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    if (!res.ok) {
      try {
        const errJson = JSON.parse(text);
        return { error: errJson.error || "Failed to create article" };
      } catch {
        return { error: text || "Failed to create article" };
      }
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Server Action createArticle error:", error);
    return { error: error instanceof Error ? error.message : "Network error" };
  }
}

export async function generateAiTagsAndSummary(title: string, content: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/ai/tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) throw new Error("Failed to generate tags");
    return await res.json();
  } catch (error) {
    console.error("Server Action generateAiTagsAndSummary error:", error);
    return { tags: ["General"], confidence: 1.0 };
  }
}

export async function syncExpressAuth(action: "login" | "register", name?: string, email?: string, password?: string) {
  try {
    const endpoint = action === "login" ? "/api/auth/login" : "/api/auth/register";
    const res = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Server Action syncExpressAuth error:", error);
    return null;
  }
}

export async function getRandomDoctors(limit: number = 7) {
  try {
    const response = await fetch(`${BACKEND_URL}/doctors/random?limit=${limit}`, { cache: "no-store" });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Server Action getRandomDoctors error:", error);
    return [];
  }
}
