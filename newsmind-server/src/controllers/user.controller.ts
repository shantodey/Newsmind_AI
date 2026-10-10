import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { userCollection, db } from "../config/db";

export async function requestJournalist(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Valid userId required" });
    }
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.role === "journalist" || user.role === "admin") {
      return res.status(400).json({ error: "Already a journalist or admin" });
    }
    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { wantsJournalist: true, updatedAt: new Date() } }
    );
    res.json({ success: true });
  } catch (error) {
    console.error("requestJournalist error:", error);
    res.status(500).json({ error: "Failed to submit request" });
  }
}

export async function updateUserProfile(req: Request, res: Response) {
  try {
    const { id, name, image } = req.body;
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Valid user id is required" });
    }

    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image;

    const result = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
}

export async function getUserBookmarks(req: Request, res: Response) {
  try {
    let { bookmarkIds, userId } = req.body;

    if ((!bookmarkIds || !Array.isArray(bookmarkIds) || bookmarkIds.length === 0) && userId) {
      const filter = ObjectId.isValid(userId) ? { _id: new ObjectId(userId) } : { _id: userId };
      const u = await userCollection.findOne(filter) || await db.collection("users").findOne(filter);
      if (u?.bookmarks && Array.isArray(u.bookmarks)) {
        bookmarkIds = u.bookmarks;
      }
    }

    if (!bookmarkIds || !Array.isArray(bookmarkIds) || bookmarkIds.length === 0) {
      return res.json({ bookmarks: [] });
    }
    const objectIds = bookmarkIds
      .filter((id: string) => ObjectId.isValid(id))
      .map((id: string) => new ObjectId(id));
    const bookmarkedArticles = await db
      .collection("articles")
      .find({ _id: { $in: objectIds } })
      .toArray();
    res.json({ bookmarks: bookmarkedArticles });
  } catch (error) {
    console.error("Fetch bookmarks error:", error);
    res.status(500).json({ error: "Failed to fetch bookmarked articles" });
  }
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 8)));

    const total = await userCollection.countDocuments();
    const rawUsers = await userCollection
      .find({}, { projection: { passwordHash: 0 } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const users = rawUsers.map((u: any) => ({
      id: u._id.toString(),
      name: u.name || "Unnamed User",
      email: u.email || "",
      avatar: u.image || u.avatar || "",
      role: u.role || "user",
      createdAt: u.createdAt,
      wantsJournalist: u.wantsJournalist === true,
    }));

    res.json({
      users,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

export async function updateUserRole(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["user", "creator", "journalist"].includes(role)) {
      return res.status(400).json({ error: "Invalid role target. Cannot set to admin." });
    }

    const filter: any = ObjectId.isValid(userId) ? { _id: new ObjectId(userId) } : { _id: userId };
    const targetUser = await userCollection.findOne(filter);

    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (targetUser.role === "admin") {
      return res.status(403).json({ error: "Admin role cannot be changed." });
    }

    const unset: any = role === "journalist" ? { wantsJournalist: "" } : {};
    await userCollection.updateOne(filter, {
      $set: { role, updatedAt: new Date() },
      ...(role === "journalist" ? { $unset: unset } : {}),
    });
    res.json({ success: true, role });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ error: "Failed to update role" });
  }
}
