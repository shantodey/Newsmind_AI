import { Router } from "express";
import {
  getArticleStats,
  getArticles,
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  bookmarkArticleByBody,
  getBookmarkStatus,
  toggleBookmark,
  toggleLike,
  getComments,
  createComment,
} from "../controllers/article.controller";

const router = Router();

// Stats
router.get("/stats", getArticleStats);

// Bookmarks (direct route)
router.post("/bookmark", bookmarkArticleByBody);

// Articles list & create
router.get("/", getArticles);
router.post("/", createArticle);

// Single article operations
router.get("/:id", getArticleById);
router.patch("/:id", updateArticle);
router.delete("/:id", deleteArticle);

// Article likes
router.post("/:id/like", toggleLike);

// Article bookmarks
router.get("/:id/bookmark", getBookmarkStatus);
router.post("/:id/bookmark", toggleBookmark);

// Article comments
router.get("/:id/comments", getComments);
router.post("/:id/comments", createComment);

export default router;
