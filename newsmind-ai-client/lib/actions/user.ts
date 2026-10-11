"use server";

import { BACKEND_URL, getAuthHeaders } from "./_client";

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

export async function requestJournalist(userId: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/users/${userId}/journalist-request`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserBookmarks() {
  const { reqHeaders } = await getAuthHeaders();
  const res = await fetch(`${BACKEND_URL}/api/users/bookmarks`, {
    method: "POST",
    headers: reqHeaders,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch bookmarks");
  }

  const data = await res.json();
  return data.bookmarks;
}

export async function getAllUsers(page: number = 1, limit: number = 8) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/users?page=${page}&limit=${limit}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    return await res.json();
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return { users: [], pagination: { total: 0, page: 1, limit: 8, totalPages: 1 } };
  }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/users/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update role");
    return { success: true, ...data };
  } catch (error: any) {
    console.error("Error in updateUserRole:", error);
    return { success: false, error: error.message || "Failed to update role" };
  }
}
