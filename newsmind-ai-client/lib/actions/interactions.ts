"use server";

import { BACKEND_URL, getAuthHeaders } from "./_client";

export async function toggleBookmark(articleId: string, userId?: string) {
  // If userId provided, direct route /api/articles/bookmark
  if (userId) {
    const res = await fetch(`${BACKEND_URL}/api/articles/bookmark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, articleId }),
    });
    return res.ok ? res.json() : null;
  }

  // Session-based toggle
  try {
    const { reqHeaders } = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/articles/${articleId}/bookmark`, {
      method: "POST",
      headers: reqHeaders,
    });
    if (!res.ok) throw new Error("Failed to toggle bookmark");
    return await res.json();
  } catch (error) {
    console.error("Server Action toggleBookmark error:", error);
    return { error: "Network error" };
  }
}

export async function getBookmarkStatus(id: string) {
  try {
    const { reqHeaders } = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/articles/${id}/bookmark`, {
      headers: reqHeaders,
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch bookmark status");
    return await res.json();
  } catch (error) {
    console.error("Server Action getBookmarkStatus error:", error);
    return { bookmarked: false };
  }
}

export async function likeArticle(id: string) {
  try {
    const { reqHeaders } = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/articles/${id}/like`, {
      method: "POST",
      headers: reqHeaders,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to like article");
    }

    return await res.json();
  } catch (error) {
    console.error("Server Action likeArticle error:", error);
    return { error: error instanceof Error ? error.message : "Network error" };
  }
}

export async function getLikeStatus(id: string) {
  try {
    const { reqHeaders } = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/articles/${id}/like-status`, {
      method: "GET",
      headers: reqHeaders,
    });

    if (!res.ok) return { liked: false };
    return await res.json();
  } catch (error) {
    return { liked: false };
  }
}

export async function getComments(articleId: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/articles/${articleId}/comments`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch comments");
    const data = await res.json();
    return data.comments || [];
  } catch (error) {
    console.error("Server Action getComments error:", error);
    return [];
  }
}

export async function postComment(
  articleId: string,
  body: string,
  parentId: string | null = null
) {
  try {
    const { reqHeaders } = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/articles/${articleId}/comments`, {
      method: "POST",
      headers: reqHeaders,
      body: JSON.stringify({ body, parentId }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to post comment");
    }
    return await res.json();
  } catch (error) {
    console.error("Server Action postComment error:", error);
    return { error: error instanceof Error ? error.message : "Network error" };
  }
}
