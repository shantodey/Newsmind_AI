"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaRegHeart,
  FaHeart,
  FaRegBookmark,
  FaBookmark,
  FaRegClock,
  FaFaceSmile,
  FaFaceMeh,
  FaFaceFrown,
} from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  sentiment: "positive" | "neutral" | "negative";
  sentimentScore: number;
  tags: string[];
}

interface ArticleCardProps {
  article: Article;
  onSelectForAi?: (article: Article) => void;
  className?: string;
}

// ডিফল্ট ইমেজ প্লেসহোল্ডার যা ইউআরএল ইনভ্যালিড হলে ব্যবহৃত হবে
const DEFAULT_ARTICLE_IMAGE = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600";
const DEFAULT_AVATAR_IMAGE = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100";

export function ArticleCard({
  article,
  onSelectForAi,
  className = "",
}: ArticleCardProps) {
  const [isLiked, setIsLiked] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  // সেফটি চেক: ইউআরএল সঠিকভাবে স্ট্রিং কিনা তা যাচাই করা
  const validImageUrl = (typeof article?.imageUrl === 'string' && article.imageUrl.trim() !== '') 
    ? article.imageUrl 
    : DEFAULT_ARTICLE_IMAGE;

  const validAvatarUrl = (typeof article?.author?.avatar === 'string' && article.author.avatar.trim() !== '') 
    ? article.author.avatar 
    : DEFAULT_AVATAR_IMAGE;

  const getSentimentDetails = (sentiment: "positive" | "neutral" | "negative") => {
    switch (sentiment) {
      case "positive":
        return {
          color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200/50",
          icon: <FaFaceSmile className="size-3.5" />,
          label: "Positive",
        };
      case "neutral":
        return {
          color: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200/50",
          icon: <FaFaceMeh className="size-3.5" />,
          label: "Neutral",
        };
      case "negative":
        return {
          color: "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border-rose-200/50",
          icon: <FaFaceFrown className="size-3.5" />,
          label: "Negative",
        };
    }
  };

  const sentiment = getSentimentDetails(article?.sentiment || "neutral");

  return (
    <Card
      className={`group flex flex-col overflow-hidden border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 ${className}`}
    >
      {/* Image container */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        <Image 
          src={validImageUrl} 
          alt={article?.title || "News Image"} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge className="bg-zinc-900/90 text-zinc-50 border-none shadow-sm dark:bg-zinc-100 dark:text-zinc-900">
            {article?.category || "General"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
          <div className="flex items-center gap-1.5">
            <FaRegClock className="size-3" />
            <span>{article?.readTime || "1 min read"}</span>
          </div>
          <span>{article?.publishedAt}</span>
        </div>

        <Link
          href={`/article/${article?.id}`}
          className="mb-2 block group-hover:text-zinc-900 dark:group-hover:text-zinc-50"
        >
          <h3 className="line-clamp-2 text-lg font-bold leading-tight text-zinc-800 transition-colors dark:text-zinc-100 group-hover:underline decoration-zinc-400">
            {article?.title || "No Title Available"}
          </h3>
        </Link>

        <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400 mb-4 flex-1">
          {article?.excerpt || "No summary available for this article."}
        </p>

        {/* AI Metrics Overlay */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${sentiment.color}`}
          >
            {sentiment.icon}
            <span>
              {sentiment.label} ({Math.round((article?.sentimentScore || 0) * 100)}%)
            </span>
          </span>

          {onSelectForAi && (
            <button
              onClick={() => onSelectForAi(article)}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
            >
              Analyze AI
            </button>
          )}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-950/50">
        <div className="flex items-center gap-2">
          <div className="relative size-6 overflow-hidden rounded-full">
            <Image
              src={validAvatarUrl}
              alt={article?.author?.name || "Author"}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            {article?.author?.name || "Unknown"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="flex items-center justify-center p-1.5 text-zinc-400 hover:text-rose-500 transition-colors"
            aria-label={isLiked ? "Unlike" : "Like"}
          >
            {isLiked ? (
              <FaHeart className="size-4 text-rose-500" />
            ) : (
              <FaRegHeart className="size-4" />
            )}
          </button>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="flex items-center justify-center p-1.5 text-zinc-400 hover:text-teal-600 transition-colors"
            aria-label={isBookmarked ? "Remove Bookmark" : "Bookmark"}
          >
            {isBookmarked ? (
              <FaBookmark className="size-4 text-teal-600" />
            ) : (
              <FaRegBookmark className="size-4" />
            )}
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}