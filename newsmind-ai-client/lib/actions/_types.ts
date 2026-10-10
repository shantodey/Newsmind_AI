export type ArticleStatus = "published" | "draft" | "all";

export interface ArticlePayload {
  title: string;
  excerpt?: string;
  content: string;
  category: string;
  tags?: string[];
  imageUrl?: string;
  status?: "published" | "draft";
  [key: string]: any;
}

export interface UpdateProfilePayload {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export interface SyncAuthPayload {
  action: "login" | "register";
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export type SummaryLength = "short" | "medium" | "long";
