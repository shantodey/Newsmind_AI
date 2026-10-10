import { Router } from "express";
import {
  summarize,
  chat,
  generateTags,
  analyzeSentiment,
  getRecommendations,
} from "../controllers/ai.controller";

const router = Router();

router.post("/summarize", summarize);
router.post("/chat", chat);
router.post("/tags", generateTags);
router.post("/sentiment", analyzeSentiment);
router.get("/recommendations", getRecommendations);

export default router;
