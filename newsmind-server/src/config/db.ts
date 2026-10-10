import { MongoClient, ServerApiVersion, Db, Collection } from "mongodb";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not defined");
}

export const client = new MongoClient(mongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const db: Db = client.db(process.env.MONGO_DB_NAME || "newsmind-ai");
export const userCollection: Collection = db.collection("user");
export const usersCollection: Collection = db.collection("users");
export const articlesCollection: Collection = db.collection("articles");
export const commentsCollection: Collection = db.collection("comments");
export const analyticsCollection: Collection = db.collection("analytics");

let isConnected = false;

export async function connectToMongoDB() {
  if (!isConnected) {
    try {
      await client.connect();
      isConnected = true;
      console.log("[server]: Connected to MongoDB successfully");
    } catch (error) {
      console.error("[server]: Failed to connect to MongoDB", error);
      throw error;
    }
  }
  return client;
}

export async function disconnectFromMongoDB() {
  await client.close();
  isConnected = false;
}
