import { Router } from "express";
import {
  getArticleStats,
  getArticles,
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  getBookmarkStatus,
  toggleBookmark,
  toggleLike,
  getComments,
  createComment,
} from "../controllers/article.controller";

const router = Router();

// Stats
router.get("/stats", getArticleStats);

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
