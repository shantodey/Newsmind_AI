import { Router } from "express";
import { updateUserProfile, getUserBookmarks } from "../controllers/user.controller";

const router = Router();

// /api/user/update
router.put("/user/update", updateUserProfile);

// /api/users/bookmarks
router.post("/users/bookmarks", getUserBookmarks);

export default router;
