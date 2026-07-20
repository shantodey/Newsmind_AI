import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ------------------------------
// 1) App setup
// ------------------------------
const app = express();
const port = Number(process.env.PORT || 5001);
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not defined");
}

// ------------------------------
// 2) MongoDB setup
// ------------------------------
const client = new MongoClient(mongoUri);
const db = client.db(process.env.MONGO_DB_NAME || "newsmind-ai");
const users = db.collection("users");
const articles = db.collection("articles");
const comments = db.collection("comments");
const analytics = db.collection("analytics");

// ------------------------------
// 3) Middleware
// ------------------------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// ------------------------------
// 4) Helper functions
// ------------------------------
function getJwtSecret() {
  return process.env.JWT_SECRET || "dev-secret";
}

function getAuthToken(req: Request) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.replace("Bearer ", "").trim();
}

function getAuthUser(req: Request) {
  const token = getAuthToken(req);
  if (!token) return null;

  try {
    return jwt.verify(token, getJwtSecret()) as { userId: string; role: string };
  } catch {
    return null;
  }
}

function normalizeArticle(article: any) {
  return {
    ...article,
    id: article._id?.toString() || article.id,
    _id: article._id?.toString() || article.id,
    author: article.author || { name: "NewsMind Agent", avatar: "" },
  };
}

// ------------------------------
// 5) MongoDB connection helpers
// ------------------------------
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("[server]: Connected to MongoDB successfully");
    return client;
  } catch (error) {
    console.error("[server]: Failed to connect to MongoDB", error);
    throw error;
  }
}

export async function disconnectFromMongoDB() {
  await client.close();
}

// ------------------------------
// 6) Basic routes
// ------------------------------
app.get("/health", (_req: Request, res: Response) => {
  // This route checks if the server is alive.
  res.json({ status: "ok", message: "NewsMind AI API is running" });
});

// ------------------------------
// 7) Authentication routes
// ------------------------------
app.post("/api/auth/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const existing = await users.findOne({ email: String(email).toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    const passwordHash = await bcrypt.hash(String(password), 12);
    const role = String(email).toLowerCase().includes("admin") ? "admin" : "user";

    const result = await users.insertOne({
      name,
      email: String(email).toLowerCase(),
      passwordHash,
      role,
      avatar: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user = await users.findOne({ _id: result.insertedId });
    const token = jwt.sign({ userId: user?._id.toString(), role }, getJwtSecret(), { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: {
        id: user?._id.toString(),
        name: user?.name,
        email: user?.email,
        role: user?.role,
        avatar: user?.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await users.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(String(password), user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id.toString(), role: user.role }, getJwtSecret(), { expiresIn: "7d" });

    res.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to login" });
  }
});

app.get("/api/auth/me", async (req: Request, res: Response) => {
  try {
    const authUser = getAuthUser(req);
    if (!authUser?.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await users.findOne({ _id: new ObjectId(authUser.userId) });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// ------------------------------
// 8) Article routes
// ------------------------------
app.get("/api/articles/stats", async (_req: Request, res: Response) => {
  try {
    const [totalArticles, totalPublished, totalDraft, totalViews, totalLikes] = await Promise.all([
      articles.countDocuments(),
      articles.countDocuments({ status: "published" }),
      articles.countDocuments({ status: "draft" }),
      articles.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]).toArray(),
      articles.aggregate([{ $group: { _id: null, total: { $sum: "$likes" } } }]).toArray(),
    ]);

    res.json({
      totalArticles,
      totalPublished,
      totalDraft,
      totalViews: totalViews[0]?.total || 0,
      totalLikes: totalLikes[0]?.total || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});



// for getting articles data form database
app.get("/api/articles", async (req: Request, res: Response) => {
  try {
    const q = String(req.query.q || "");
    const category = String(req.query.category || "");
    const sentiment = String(req.query.sentiment || "");
    const sort = String(req.query.sort || "newest");
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 12)));
    const status = String(req.query.status || "published").toLowerCase();

    const filter: any = {};
    if (status === "draft") {
      filter.status = "draft";
    } else if (status === "all") {
      // keep all statuses visible for admin or debugging views
    } else {
      filter.$or = [{ status: "published" }, { status: { $exists: false } }];
    }

    if (category && category !== "All") filter.category = category;
    if (sentiment && sentiment !== "All") filter.sentiment = sentiment.toLowerCase();
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { excerpt: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ];
    }

    const sortMap: Record<string, any> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      views: { views: -1 },
      likes: { likes: -1 },
    };

    const total = await articles.countDocuments(filter);
    const data = await articles
      .find(filter)
      .sort(sortMap[sort] || sortMap.newest)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    res.json({
      articles: data.map(normalizeArticle),
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});


// for adding new articles data to database 
  app.post("/api/articles", async (req: Request, res: Response) => {
    try {
      const { title, excerpt, content, category, tags, imageUrl, status } = req.body;

      if (!title || !excerpt || !content || !category) {
        return res.status(400).json({ error: "Title, excerpt, content, and category are required" });
      }

      const wordCount = String(content).trim().split(/\s+/).filter(Boolean).length;
      const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min`;
      const normalizedStatus = String(status || "published").toLowerCase() === "draft" ? "draft" : "published";

      const result = await articles.insertOne({
        title,
        excerpt,
        content,
        category,
        tags: tags || [],
        imageUrl: imageUrl || "",
        author: req.headers["x-user-id"] || "system",
        status: normalizedStatus,
        views: 0,
        likes: 0,
        sentiment: "neutral",
        sentimentScore: 0.5,
        readTime,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const inserted = await articles.findOne({ _id: result.insertedId });
      res.status(201).json({ article: normalizeArticle(inserted) });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create article" });
    }
  });

// for getting singile articles data 
  app.get("/api/articles/:id", async (req: Request, res: Response) => {
    try {
      const article = await articles.findOne({ _id: new ObjectId(req.params.id) });
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      await articles.updateOne({ _id: article._id }, { $inc: { views: 1 } });
      res.json({ article: normalizeArticle(article) });
    }
    catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

app.patch("/api/articles/:id", async (req: Request, res: Response) => {
  try {
    const result = await articles.updateOne({ _id: new ObjectId(req.params.id) }, { $set: { ...req.body, updatedAt: new Date() } });
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    const updated = await articles.findOne({ _id: new ObjectId(req.params.id) });
    res.json({ article: normalizeArticle(updated) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update article" });
  }
});

app.delete("/api/articles/:id", async (req: Request, res: Response) => {
  try {
    const result = await articles.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    await comments.deleteMany({ article: req.params.id });
    res.json({ message: "Article deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete article" });
  }
});

app.post("/api/articles/:id/like", async (req: Request, res: Response) => {
  try {
    const article = await articles.findOne({ _id: new ObjectId(req.params.id) });
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    const updated = await articles.findOneAndUpdate(
      { _id: article._id },
      { $inc: { likes: 1 } },
      { returnDocument: "after" }
    );

    await analytics.insertOne({
      user: req.headers["x-user-id"] || "anonymous",
      article: req.params.id,
      event: "like",
      createdAt: new Date(),
    });

    res.json({ likes: updated?.likes || 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to like article" });
  }
});

app.get("/api/articles/:id/comments", async (req: Request, res: Response) => {
  try {
    const data = await comments.find({ article: req.params.id }).sort({ createdAt: -1 }).toArray();
    res.json({ comments: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

app.post("/api/articles/:id/comments", async (req: Request, res: Response) => {
  try {
    const { body, parentId } = req.body;
    if (!body?.trim()) {
      return res.status(400).json({ error: "Comment body is required" });
    }

    const inserted = await comments.insertOne({
      article: req.params.id,
      author: req.headers["x-user-id"] || "anonymous",
      body: String(body).trim(),
      parentId: parentId || null,
      likes: 0,
      createdAt: new Date(),
    });

    const comment = await comments.findOne({ _id: inserted.insertedId });
    res.status(201).json({ comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// ------------------------------
// 9) AI routes
// ------------------------------
app.post("/api/ai/summarize", async (req: Request, res: Response) => {
  try {
    const { articleId, text, length = "medium" } = req.body;
    let content = String(text || "");

    if (articleId) {
      const article = await articles.findOne({ _id: new ObjectId(articleId) });
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
});

app.post("/api/ai/chat", async (req: Request, res: Response) => {
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
      const article = await articles.findOne({ _id: new ObjectId(articleId) });
      if (article) {
        responseText += ` This is about ${article.title}.`;
      }
    }

    res.json({ role: "assistant", content: responseText, timestamp: new Date() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to chat" });
  }
});

app.post("/api/ai/tags", async (req: Request, res: Response) => {
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
});

app.post("/api/ai/sentiment", async (req: Request, res: Response) => {
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
});

app.get("/api/ai/recommendations", async (_req: Request, res: Response) => {
  try {
    const data = await articles.find({ status: "published" }).sort({ views: -1, createdAt: -1 }).limit(3).toArray();
    res.json({ recommendations: data.map(normalizeArticle) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

// ------------------------------
// 10) Start server
// ------------------------------
connectToMongoDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`[server]: Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("[server]: Failed to start server", error);
  });

export default app;


