"use server";

import { BACKEND_URL } from "./_client";

export async function syncExpressAuth(
  action: "login" | "register",
  name?: string,
  email?: string,
  password?: string,
  avatar?: string
) {
  try {
    const endpoint = action === "login" ? "/api/auth/login" : "/api/auth/register";
    const res = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, avatar }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Server Action syncExpressAuth error:", error);
    return null;
  }
}
