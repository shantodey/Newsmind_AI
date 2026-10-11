import { Router, Request, Response } from "express";
import articleRoutes from "./article.routes";
import userRoutes from "./user.routes";
import aiRoutes from "./ai.routes";

const router = Router();

router.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "NewsMind AI API is running" });
});

router.use("/api/articles", articleRoutes);
router.use("/api", userRoutes);
router.use("/api/ai", aiRoutes);

export default router;
