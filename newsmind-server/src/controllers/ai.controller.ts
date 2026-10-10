import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { articlesCollection } from "../config/db";
import { normalizeArticle } from "../utils/helpers";

export async function summarize(req: Request, res: Response) {
  try {
    const { articleId, text, length = "medium" } = req.body;
    let content = String(text || "");

    if (articleId) {
      const article = await articlesCollection.findOne({ _id: new ObjectId(articleId) });
      if (article) content = article.content;
    }

    const sentences = content
      .split(/[.!?]+/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 5);
    const bulletCount = length === "short" ? 3 : length === "long" ? 7 : 5;
    const bullets = sentences.slice(0, bulletCount).map((s: string) => `${s}.`);

    res.json({
      tldr: bullets.slice(0, 2).join(" "),
      bulletPoints: bullets,
      takeaways: [
        "AI models are moving from pilots to real workflows.",
        "Ethics and trust remain central to adoption.",
        "Automation is improving speed and consistency.",
      ],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to summarize" });
  }
}

export async function chat(req: Request, res: Response) {
  try {
    const { messages, articleId } = req.body;
    const lastUserMessage = messages?.[messages.length - 1]?.content || "";
    const q = String(lastUserMessage).toLowerCase();

    let responseText = "That is a thoughtful question about the article.";
    if (q.includes("summary") || q.includes("summarize")) {
      responseText = "The core story focuses on practical impact, measurable outcomes, and clear tradeoffs.";
    } else if (q.includes("sentiment") || q.includes("bias")) {
      responseText = "The content looks mostly balanced with a slightly positive tone.";
    }

    if (articleId) {
      const article = await articlesCollection.findOne({ _id: new ObjectId(articleId) });
      if (article) {
        responseText += ` This is about ${article.title}.`;
      }
    }

    res.json({ role: "assistant", content: responseText, timestamp: new Date() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to chat" });
  }
}

export async function generateTags(req: Request, res: Response) {
  try {
    const { title, content } = req.body;
    const text = `${title || ""} ${content || ""}`.toLowerCase();
    const tagOptions = [
      { key: "ai", tag: "AI" },
      { key: "quantum", tag: "Quantum" },
      { key: "climate", tag: "Climate" },
      { key: "energy", tag: "Energy" },
      { key: "football", tag: "Sport" },
      { key: "market", tag: "Finance" },
      { key: "cancer", tag: "Health" },
    ];

    const detectedTags = tagOptions.filter((opt) => text.includes(opt.key)).map((opt) => opt.tag);
    const tags = detectedTags.length > 0 ? Array.from(new Set(detectedTags)) : ["General", "Intelligence", "News"];

    res.json({ tags, confidence: 0.92 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate tags" });
  }
}

export async function analyzeSentiment(req: Request, res: Response) {
  try {
    const { text } = req.body;
    const t = String(text || "").toLowerCase();
    const positiveWords = ["growth", "success", "breakthrough", "winning", "agreement", "surged"];
    const negativeWords = ["risk", "threat", "conflict", "collapse", "freeze", "layoffs"];
    const posCount = positiveWords.filter((word) => t.includes(word)).length;
    const negCount = negativeWords.filter((word) => t.includes(word)).length;

    let sentiment: "positive" | "neutral" | "negative" = "neutral";
    let score = 0.5;

    if (posCount > negCount) {
      sentiment = "positive";
      score = 0.5 + (posCount - negCount) * 0.1;
    } else if (negCount > posCount) {
      sentiment = "negative";
      score = 0.5 - (negCount - posCount) * 0.1;
    }

    res.json({ sentiment, score: Math.max(0.05, Math.min(0.95, score)), confidence: 0.89 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to analyze sentiment" });
  }
}

export async function getRecommendations(_req: Request, res: Response) {
  try {
    const data = await articlesCollection
      .find({ status: "published" })
      .sort({ views: -1, createdAt: -1 })
      .limit(3)
      .toArray();
    res.json({ recommendations: data.map(normalizeArticle) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
}
