
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("newsmind-ai");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
    strategy: "jwt",
  },

  plugins: [
    jwt({
      jwt: {
        expirationTime: "15m",
      },
    }),
  ],

    user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false,
      },
      // Bookmarks Field (String Array)
      bookmarks: {
        type: "string[]",
        defaultValue: [],
        input: false,
      },
      // Liked Posts Field (String Array)
      likedPosts: {
        type: "string[]",
        defaultValue: [],
        input: false,
      },
    },
  },
});