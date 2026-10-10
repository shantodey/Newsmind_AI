import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { connectToMongoDB } from "./src/config/db";
import { ensureDbMiddleware } from "./src/middleware/db.middleware";
import routes from "./src/routes";

const app = express();
const port = Number(process.env.PORT || 5001);

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Database connection middleware (lazy connection support for serverless/Vercel)
app.use(ensureDbMiddleware);

// Base route
app.get("/", (_req: Request, res: Response) => {
  res.send("NewsMind AI server is running fine!");
});

// Modular Routes
app.use(routes);

// Server startup
if (process.env.NODE_ENV !== "production") {
  connectToMongoDB()
    .then(() => {
      app.listen(port, () => {
        console.log(`[server]: Server is running on port ${port}`);
      });
    })
    .catch((error) => {
      console.error("[server]: Failed to start server", error);
    });
}

export { connectToMongoDB, disconnectFromMongoDB } from "./src/config/db";
export default app;