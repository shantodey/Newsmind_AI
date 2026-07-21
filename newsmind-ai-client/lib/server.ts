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
    reqHeaders.set("x-user-email", session.user.email || "");
    reqHeaders.set("x-user-name", session.user.name || "");
  }

  return { reqHeaders, session };
}

export async function getArticles(category?: string, status: "published" | "draft" | "all" = "published") {
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


export async function updateProfile(
  id: string, 
  name: string, 
  email: string, 
  image: string | null
) {
  try {
    

    const response = await fetch(`${BACKEND_URL}/api/user/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, email, image }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return { success: false, message: "Failed to update profile" };
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

export async function toggleBookmark(articleId: string, userId: string) {
  const backendUrl = process.env.SERVER_URL || "http://localhost:5001";
  
  const res = await fetch(`${backendUrl}/api/articles/bookmark`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, articleId }),
  });

  return res.ok ? res.json() : null;
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

export async function syncExpressAuth(action: "login" | "register", name?: string, email?: string, password?: string, avatar?: string) {
  try {
    const endpoint = action === "login" ? "/api/auth/login" : "/api/auth/register";
    const res = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, avatar }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Server Action syncExpressAuth error:", error);
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

// ইনিশিয়াল লাইক স্ট্যাটাস চেক করার জন্য হেল্পার অ্যাকশন
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
export async function getUserBookmarks() {
  try {
    const { reqHeaders } = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/users/bookmarks`, {
      headers: reqHeaders,
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch bookmarks");
    const data = await res.json();
    return data.bookmarks || [];
  } catch (error) {
    console.error("Server Action getUserBookmarks error:", error);
    return [];
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

export async function postComment(articleId: string, body: string, parentId: string | null = null) {
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

export async function aiSummarize(articleId?: string, text?: string, length: "short" | "medium" | "long" = "medium") {
  try {
    const res = await fetch(`${BACKEND_URL}/api/ai/summarize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId, text, length }),
    });
    if (!res.ok) throw new Error("Failed to summarize");
    return await res.json();
  } catch (error) {
    console.error("Server Action aiSummarize error:", error);
    return null;
  }
}

export async function aiSentiment(text: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/ai/sentiment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("Failed to analyze sentiment");
    return await res.json();
  } catch (error) {
    console.error("Server Action aiSentiment error:", error);
    return null;
  }
}
export async function aiRecommendations() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/ai/recommendations`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch recommendations");
    const data = await res.json();
    return data.recommendations || [];
  } catch (error) {
    console.error("Server Action aiRecommendations error:", error);
    return [];
  }
}

export async function aiChat(messages: any[], articleId?: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, articleId }),
    });
    if (!res.ok) throw new Error("Failed to chat with AI");
    return await res.json();
  } catch (error) {
    console.error("Server Action aiChat error:", error);
    return null;
  }
}

// export async function toggleBookmark(articleId: string) {
//   try {
//     const { reqHeaders } = await getAuthHeaders();
//     const res = await fetch(`${BACKEND_URL}/api/articles/${articleId}/bookmark`, {
//       method: "POST",
//       headers: reqHeaders,
//     });
//     if (!res.ok) throw new Error("Failed to toggle bookmark");
//     return await res.json();
//   } catch (error) {
//     console.error("Server Action toggleBookmark error:", error);
//     return { error: "Network error" };
//   }
// }


