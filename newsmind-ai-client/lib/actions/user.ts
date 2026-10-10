"use server";

import { BACKEND_URL } from "./_client";

export async function updateProfile(
  id: string,
  name: string,
  email: string,
  image: string | null
) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, email, image }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return { success: false, message: "Failed to update profile" };
  }
}

export async function getUserBookmarks(bookmarkIds: string[]) {
  const res = await fetch(`${BACKEND_URL}/api/users/bookmarks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bookmarkIds }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch bookmarks");
  }

  const data = await res.json();
  return data.bookmarks;
}
