"use server";

import { BACKEND_URL, getAuthHeaders } from "./_client";
import { ArticleStatus, ArticlePayload } from "./_types";

export async function getArticles(
  category?: string,
  status: ArticleStatus = "published"
) {
  try {
    const params = new URLSearchParams();
    if (category && category !== "ALL") {
      params.set("category", category);
    }
    params.set("status", status);

    const url = `${BACKEND_URL}/api/articles?${params.toString()}`;

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

export async function getAllArticlesForManage() {
  try {
    const { reqHeaders } = await getAuthHeaders();
    const url = `${BACKEND_URL}/api/articles?status=all&limit=100`;
    const res = await fetch(url, { headers: reqHeaders, cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch all articles for management");
    const data = await res.json();
    return data.articles || [];
  } catch (error) {
    console.error("Server Action getAllArticlesForManage error:", error);
    return [];
  }
}

export async function createArticle(payload: ArticlePayload) {
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

export async function updateArticle(id: string, payload: any) {
  try {
    const { reqHeaders } = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/articles/${id}`, {
      method: "PATCH",
      headers: reqHeaders,
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to update article");
    }
    return await res.json();
  } catch (error) {
    console.error("Server Action updateArticle error:", error);
    return { error: error instanceof Error ? error.message : "Network error" };
  }
}

export async function deleteArticle(id: string) {
  try {
    const { reqHeaders } = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/articles/${id}`, {
      method: "DELETE",
      headers: reqHeaders,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to delete article");
    }
    return await res.json();
  } catch (error) {
    console.error("Server Action deleteArticle error:", error);
    return { error: error instanceof Error ? error.message : "Network error" };
  }
}
