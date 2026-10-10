import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { usersCollection } from "../config/db";
import { getAuthUser, getJwtSecret } from "../utils/helpers";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const existing = await usersCollection.findOne({ email: String(email).toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    const passwordHash = await bcrypt.hash(String(password), 12);
    const role = String(email).toLowerCase().includes("admin") ? "admin" : "user";

    const result = await usersCollection.insertOne({
      name,
      email: String(email).toLowerCase(),
      passwordHash,
      role,
      avatar: avatar || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user = await usersCollection.findOne({ _id: result.insertedId });
    const token = jwt.sign({ userId: user?._id.toString(), role }, getJwtSecret(), { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: {
        id: user?._id.toString(),
        name: user?.name,
        email: user?.email,
        role: user?.role,
        avatar: user?.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register user" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await usersCollection.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(String(password), user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id.toString(), role: user.role }, getJwtSecret(), { expiresIn: "7d" });

    res.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to login" });
  }
}

export async function me(req: Request, res: Response) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser?.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await usersCollection.findOne({ _id: new ObjectId(authUser.userId) });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
}
