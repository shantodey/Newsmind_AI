"use server";

import { BACKEND_URL } from "./_client";
import { SummaryLength, ChatMessage } from "./_types";

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

export async function aiSummarize(
  articleId?: string,
  text?: string,
  length: SummaryLength = "medium"
) {
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

export async function aiChat(messages: ChatMessage[] | any[], articleId?: string) {
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
