import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { usersCollection, db } from "../config/db";

export async function updateUserProfile(req: Request, res: Response) {
  try {
    const { name, email, image } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required to update profile" });
    }

    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.avatar = image;
    if (image !== undefined) updateData.image = image;

    await usersCollection.updateOne(
      { email: String(email).toLowerCase() },
      { $set: updateData },
      { upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
}

export async function getUserBookmarks(req: Request, res: Response) {
  try {
    const { bookmarkIds } = req.body;
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
