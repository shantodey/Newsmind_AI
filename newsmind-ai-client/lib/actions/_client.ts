import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const BACKEND_URL = process.env.SERVER_URL || "http://localhost:5001";

export async function getAuthHeaders() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const reqHeaders = new Headers({
    "Content-Type": "application/json",
  });

  if (session?.user) {
    reqHeaders.set("x-user-id", session.user.id);
    reqHeaders.set("x-user-role", (session.user as { role?: string }).role || "user");
    reqHeaders.set("x-user-email", session.user.email || "");
    reqHeaders.set("x-user-name", session.user.name || "");
    reqHeaders.set("x-user-img", session.user.image || "");
  }

  return { reqHeaders, session };
}

export async function fetchJson<T = any>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = path.startsWith("http") ? path : `${BACKEND_URL}${path}`;
  const res = await fetch(url, init);

  if (!res.ok) {
    const text = await res.text();
    let errMsg = text;
    try {
      const errJson = JSON.parse(text);
      errMsg = errJson.error || errJson.message || text;
    } catch {
      // ignore json parse error
    }
    throw new Error(errMsg || `Request failed with status ${res.status}`);
  }

  return res.json();
}
