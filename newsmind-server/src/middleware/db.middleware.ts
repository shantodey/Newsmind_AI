import { Request, Response, NextFunction } from "express";
import { connectToMongoDB } from "../config/db";

export async function ensureDbMiddleware(_req: Request, _res: Response, next: NextFunction) {
  try {
    await connectToMongoDB();
    next();
  } catch (error) {
    next(error);
  }
}
