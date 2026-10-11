import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { articlesCollection, commentsCollection, client, userCollection } from "../config/db";
import { buildUserFilter, getAuthUser, getOrCreateUser, normalizeArticle } from "../utils/helpers";

export async function getArticleStats(_req: Request, res: Response) {
  try {
    const [totalArticles, totalPublished, totalDraft, totalViews, totalLikes] = await Promise.all([
      articlesCollection.countDocuments(),
      articlesCollection.countDocuments({ status: "published" }),
      articlesCollection.countDocuments({ status: "draft" }),
      articlesCollection.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]).toArray(),
      articlesCollection.aggregate([{ $group: { _id: null, total: { $sum: "$likes" } } }]).toArray(),
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
}

export async function getArticles(req: Request, res: Response) {
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

    const total = await articlesCollection.countDocuments(filter);
    const data = await articlesCollection
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
}

export async function createArticle(req: Request, res: Response) {
  try {
    const { title, content, category, tags, imageUrl, status } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: "Title, content, and category are required" });
    }

    const wordCount = String(content).trim().split(/\s+/).filter(Boolean).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min`;
    const normalizedStatus = String(status || "published").toLowerCase() === "draft" ? "draft" : "published";

    const result = await articlesCollection.insertOne({
      title,
      content,
      category,
      tags: tags || [],
      imageUrl: imageUrl || "",
      author: {
        authorId: String(req.headers["x-user-id"] || "system"),
        authorName: String(req.headers["x-user-name"] || "Unknown"),
        authorImage: String(req.headers["x-user-img"] || ""),
      },
      status: normalizedStatus,
      views: 0,
      likes: 0,
      sentiment: "neutral",
      sentimentScore: 0.5,
      createdAt: new Date(),
    });

    const inserted = await articlesCollection.findOne({ _id: result.insertedId });
    res.status(201).json({ article: normalizeArticle(inserted) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create article" });
  }
}

export async function getArticleById(req: Request, res: Response) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid article id" });
    }

    const article = await articlesCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    await articlesCollection.updateOne({ _id: article._id }, { $inc: { views: 1 } });
    const authUser = getAuthUser(req);
    const [comments, user] = await Promise.all([
      commentsCollection.find({ article: req.params.id }).sort({ createdAt: -1 }).toArray(),
      authUser
        ? userCollection.findOne(buildUserFilter(authUser.userId, authUser.email))
        : Promise.resolve(null),
    ]);
    res.json({
      article: normalizeArticle(article),
      comments,
      interaction: {
        liked: Boolean(user?.likedPosts?.some((id: unknown) => String(id) === req.params.id)),
        bookmarked: Boolean(user?.bookmarks?.some((id: unknown) => String(id) === req.params.id)),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch article" });
  }
}

export async function updateArticle(req: Request, res: Response) {
  try {
    const result = await articlesCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...req.body, updatedAt: new Date() } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    const updated = await articlesCollection.findOne({ _id: new ObjectId(req.params.id) });
    res.json({ article: normalizeArticle(updated) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update article" });
  }
}

export async function deleteArticle(req: Request, res: Response) {
  try {
    const result = await articlesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    await commentsCollection.deleteMany({ article: req.params.id });
    res.json({ message: "Article deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete article" });
  }
}

export async function getBookmarkStatus(req: Request, res: Response) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser?.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await getOrCreateUser(authUser.userId, authUser.email, authUser.name);
    const isBookmarked = Array.isArray(user?.bookmarks) && user.bookmarks.includes(req.params.id);

    res.json({ bookmarked: isBookmarked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch bookmark state" });
  }
}

export async function toggleBookmark(req: Request, res: Response) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser?.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const articleId = req.params.id;
    if (!ObjectId.isValid(articleId)) {
      return res.status(400).json({ error: "Invalid article id" });
    }

    const user = await getOrCreateUser(authUser.userId, authUser.email, authUser.name);
    if (!user) return res.status(404).json({ error: "User not found" });
    const session = client.startSession();
    let bookmarked = false;
    try {
      await session.withTransaction(async () => {
        const currentUser = await userCollection.findOne({ _id: user._id }, { session });
        if (!currentUser) throw new Error("User not found");
        const isBookmarked = currentUser.bookmarks?.some(
          (id: unknown) => String(id) === articleId
        ) ?? false;
        await userCollection.updateOne(
          { _id: user._id },
          isBookmarked
            ? { $pull: { bookmarks: articleId } }
            : { $addToSet: { bookmarks: articleId } },
          { session }
        );
        bookmarked = !isBookmarked;
      });
      return res.json({ bookmarked });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error("Bookmark Toggle Error:", error);
    if (error instanceof Error && error.message === "User not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to toggle bookmark" });
  }
}

export async function toggleLike(req: Request, res: Response) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser?.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const articleId = req.params.id;
    const userId = authUser.userId;

    if (!ObjectId.isValid(articleId)) {
      return res.status(400).json({ error: "Invalid article id" });
    }

    const user = await getOrCreateUser(userId, authUser.email, authUser.name);
    if (!user) return res.status(404).json({ error: "User not found" });

    const articleFilter = { _id: new ObjectId(articleId) };
    const session = client.startSession();
    let response: { liked: boolean; likes: number } | undefined;
    try {
      await session.withTransaction(async () => {
        const currentUser = await userCollection.findOne({ _id: user._id }, { session });
        if (!currentUser) throw new Error("User not found");
        const hasLiked = currentUser.likedPosts?.some(
          (id: unknown) => String(id) === articleId
        ) ?? false;
        const article = await articlesCollection.findOne(articleFilter, { session });
        if (!article) throw new Error("Article not found");

        await userCollection.updateOne(
          { _id: user._id },
          hasLiked
            ? { $pull: { likedPosts: articleId } }
            : { $addToSet: { likedPosts: articleId } },
          { session }
        );
        const likes = Math.max(0, Number(article.likes || 0) + (hasLiked ? -1 : 1));
        await articlesCollection.updateOne(articleFilter, { $set: { likes } }, { session });
        response = { liked: !hasLiked, likes };
      });
    } finally {
      await session.endSession();
    }
    return res.json(response);
  } catch (error) {
    console.error("Like Toggle Error:", error);
    if (error instanceof Error && error.message === "Article not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to toggle like" });
  }
}

export async function getComments(req: Request, res: Response) {
  try {
    const data = await commentsCollection.find({ article: req.params.id }).sort({ createdAt: -1 }).toArray();
    res.json({ comments: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
}

export async function createComment(req: Request, res: Response) {
  try {
    const { body, parentId } = req.body;
    if (!body?.trim()) {
      return res.status(400).json({ error: "Comment body is required" });
    }

    const inserted = await commentsCollection.insertOne({
      article: req.params.id,
      author: req.headers["x-user-id"] || "anonymous",
      body: String(body).trim(),
      parentId: parentId || null,
      likes: 0,
      createdAt: new Date(),
    });

    const comment = await commentsCollection.findOne({ _id: inserted.insertedId });
    res.status(201).json({ comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create comment" });
  }
}
