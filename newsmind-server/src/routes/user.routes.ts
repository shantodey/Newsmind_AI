import { Router } from "express";
import { 
  updateUserProfile, 
  getUserBookmarks, 
  getAllUsers, 
  updateUserRole,
  requestJournalist
} from "../controllers/user.controller";

const router = Router();

// /api/user/update
router.put("/user/update", updateUserProfile);

// /api/users/bookmarks
router.post("/users/bookmarks", getUserBookmarks);

// /api/users (List all registered users with pagination)
router.get("/users", getAllUsers);

// /api/users/:userId/role (Update user role)
router.patch("/users/:userId/role", updateUserRole);

// /api/users/:userId/journalist-request
router.patch("/users/:userId/journalist-request", requestJournalist);

export default router;
