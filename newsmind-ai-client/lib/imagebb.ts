/**
 * ImageBB upload utility
 * API key is read from NEXT_PUBLIC_IMG_UPLOAD_API env variable
 */

export interface ImageBBResponse {
  data: {
    id: string;
    url: string;
    display_url: string;
    thumb: { url: string };
    delete_url: string;
  };
  success: boolean;
  status: number;
}

/**
 * Upload a file (or base64 string) to ImageBB and return the public URL.
 */
export async function uploadToImageBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMG_UPLOAD_API;
  if (!apiKey) throw new Error("ImageBB API key not configured");

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error(`ImageBB upload failed: ${res.statusText}`);

  const json: ImageBBResponse = await res.json();
  if (!json.success) throw new Error("ImageBB returned failure");

  return json.data.display_url;
}
