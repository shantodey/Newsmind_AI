import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { articlesCollection, commentsCollection, usersCollection, db, analyticsCollection } from "../config/db";
import { getAuthUser, getOrCreateUser, normalizeArticle } from "../utils/helpers";

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
    const { title, excerpt, content, category, tags, imageUrl, status } = req.body;

    if (!title || !excerpt || !content || !category) {
      return res.status(400).json({ error: "Title, excerpt, content, and category are required" });
    }

    const wordCount = String(content).trim().split(/\s+/).filter(Boolean).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min`;
    const normalizedStatus = String(status || "published").toLowerCase() === "draft" ? "draft" : "published";

    const result = await articlesCollection.insertOne({
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

    const inserted = await articlesCollection.findOne({ _id: result.insertedId });
    res.status(201).json({ article: normalizeArticle(inserted) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create article" });
  }
}

export async function getArticleById(req: Request, res: Response) {
  try {
    const article = await articlesCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    await articlesCollection.updateOne({ _id: article._id }, { $inc: { views: 1 } });
    res.json({ article: normalizeArticle(article) });
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

export async function bookmarkArticleByBody(req: Request, res: Response) {
  const { userId, articleId } = req.body;
  if (!userId || !articleId) return res.status(400).json({ error: "Missing ids" });

  const filter = ObjectId.isValid(userId) ? { _id: new ObjectId(userId) } : { _id: userId };
  const foundUser = await usersCollection.findOne(filter);

  if (!foundUser) return res.status(404).json({ error: "User not found" });

  const isBookmarked = foundUser.bookmarks?.includes(articleId);
  const update = isBookmarked ? { $pull: { bookmarks: articleId } } : { $addToSet: { bookmarks: articleId } };

  await usersCollection.updateOne(filter, update);
  res.json({ bookmarked: !isBookmarked });
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
    const userId = authUser.userId;

    const user = await getOrCreateUser(userId, authUser.email, authUser.name);
    const isBookmarked = user?.bookmarks?.includes(articleId);

    if (isBookmarked) {
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { bookmarks: articleId } } as any
      );
      return res.json({ bookmarked: false });
    } else {
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $addToSet: { bookmarks: articleId } }
      );
      return res.json({ bookmarked: true });
    }
  } catch (error) {
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

    const user = await getOrCreateUser(userId, authUser.email, authUser.name);

    const likedPosts: string[] = (user?.likedPosts || []).map((id: any) => id.toString());
    const hasLiked = likedPosts.includes(articleId.toString());

    if (hasLiked) {
      // Unlike Operation
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { likedPosts: articleId } } as any
      );

      const updatedArticle = await articlesCollection.findOneAndUpdate(
        { _id: new ObjectId(articleId) },
        { $inc: { likes: -1 } },
        { returnDocument: "after" }
      );

      return res.json({ liked: false, likes: updatedArticle?.likes || 0 });
    } else {
      // Like Operation
      const userUpdateResult = await usersCollection.updateOne(
        { _id: new ObjectId(userId), likedPosts: { $ne: articleId } },
        { $addToSet: { likedPosts: articleId } }
      );

      if (userUpdateResult.modifiedCount > 0) {
        const updatedArticle = await articlesCollection.findOneAndUpdate(
          { _id: new ObjectId(articleId) },
          { $inc: { likes: 1 } },
          { returnDocument: "after" }
        );

        await analyticsCollection.insertOne({
          user: userId,
          article: articleId,
          event: "like",
          createdAt: new Date(),
        });

        return res.json({ liked: true, likes: updatedArticle?.likes || 0 });
      }

      const currentArticle = await articlesCollection.findOne({ _id: new ObjectId(articleId) });
      return res.json({ liked: true, likes: currentArticle?.likes || 0 });
    }
  } catch (error) {
    console.error("Like Toggle Error:", error);
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
