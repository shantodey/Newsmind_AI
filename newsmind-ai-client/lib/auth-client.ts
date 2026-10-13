

"use client";

import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [jwtClient()],
});

export const { signIn, signOut, signUp } = authClient;

type AuthSession = NonNullable<ReturnType<typeof authClient.useSession>["data"]>;

export type CurrentUser = AuthSession["user"] & {
  role?: string;
  bookmarks?: string[];
  likedPosts?: string[];
};

export function useCurrentUser() {
  const { data: session, isPending } = authClient.useSession();
  return { user: session?.user as CurrentUser | undefined, isPending };
}

// google
export const googleSignIn = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
  });
  return data;
};
