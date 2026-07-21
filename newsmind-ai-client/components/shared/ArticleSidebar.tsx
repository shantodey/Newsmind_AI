"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaRegHeart,
  FaHeart,
  FaRegBookmark,
  FaBookmark,
  FaShareNodes,
  FaRobot,
} from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { likeArticle, toggleBookmark, } from "@/lib/server";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Author {
  name: string;
  avatar: string;
  bio: string;
  followers: number;
}

interface CompactPost {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  readTime: string;
}

interface ArticleSidebarProps {
  articleId: string;
  author: Author;
  tags: string[];
  topPosts: CompactPost[];
  likesCount?: number;
  initialIsLiked?: boolean;
  onTriggerAi: () => void;
}

export function ArticleSidebar({
  articleId,
  author,
  tags,
  topPosts,
  likesCount = 0,
  initialIsLiked = false,
  onTriggerAi,
}: ArticleSidebarProps) {
  const router = useRouter();




  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(author.followers);

const { data: session } = authClient.useSession();

type SessionUser = NonNullable<typeof session>["user"] & {
  likedPosts?: string[];
  bookmarks?: string[];
};

const user = session?.user as SessionUser | undefined;

const userId = user?.id;
const isLoggedIn = Boolean(userId);

  // Like state
const [liked, setLiked] = useState(
  !!articleId && !!user?.likedPosts?.includes(articleId)
);
  const [currentLikes, setCurrentLikes] = useState(likesCount);
  const [isLiking, setIsLiking] = useState(false);

  const handleLikeToggle = async () => {
    if (!user?.id) return router.push("/login");
    if (liked || !articleId || isLiking) return;

    setIsLiking(true);
    setLiked(true);
    setCurrentLikes((n) => n + 1);

    const res = await likeArticle(articleId);
    if (res?.likes !== undefined) {
      setCurrentLikes(res.likes);
    } else {
      setLiked(false);
      setCurrentLikes((n) => n - 1);
    }
    setIsLiking(false);
  };

const [isBookmarked, setIsBookmarked] = useState(
  Boolean(articleId && user?.bookmarks?.includes(articleId))
);

const isAlreadyBookmarked =
  isBookmarked || Boolean(articleId && user?.bookmarks?.includes(articleId));
  const isButtonDisabled = !isLoggedIn || isAlreadyBookmarked;
 const handleBookmarkToggle = async () => {
  if (!userId) {
    router.push("/login");
    return;
  }

  if (isAlreadyBookmarked) return;

  const res = await toggleBookmark(articleId, userId);

  if (res && typeof res.bookmarked === "boolean") {
    setIsBookmarked(res.bookmarked);
    toast.success(res.bookmarked ? "Bookmarked!" : "Removed from bookmarks");
  } else {
    toast.error("Failed to update bookmark");
  }
};
  const handleFollowToggle = () => {
    if (!userId) {
      router.push("/login");
      return;
    }
    if (isFollowing) {
      setFollowerCount((prev) => prev - 1);
    } else {
      setFollowerCount((prev) => prev + 1);
    }
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="space-y-8">
      {/* 1. Quick Engagement Box */}
      <Card className="border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <CardContent className="p-4 flex items-center justify-around">
          {/* Like Button */}
          <button
            onClick={handleLikeToggle}
            disabled={!user?.id || liked || isLiking}
            className={`flex flex-col items-center gap-1 transition-colors ${!user?.id
              ? "opacity-50 cursor-not-allowed text-zinc-400"
              : liked
                ? "text-rose-500 cursor-default"
                : "text-zinc-500 hover:text-rose-500 cursor-pointer disabled:opacity-50"
              }`}
          >
            {liked ? <FaHeart className="size-5 text-rose-500" /> : <FaRegHeart className="size-5" />}
            <span className="text-[10px] font-bold">{currentLikes.toLocaleString()} Likes</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkToggle}
            disabled={isButtonDisabled}
            className={`flex flex-col items-center gap-1 transition-colors ${!isLoggedIn
              ? "text-zinc-400 cursor-not-allowed opacity-50" // ১. লগইন না থাকলে গ্রে ও নট-ক্লিকেবল
              : isAlreadyBookmarked
                ? "text-emerald-600 cursor-default"             // ২. বুকমার্ক করা থাকলে গ্রিন ও নট-ক্লিকেবল
                : "text-zinc-500 hover:text-teal-600 cursor-pointer" // নরমাল স্টেট
              }`}
          >
            {isAlreadyBookmarked ? (
              <FaBookmark className="size-5 text-emerald-600" />
            ) : (
              <FaRegBookmark className="size-5" />
            )}
            <span className="text-[10px] font-bold">
              {isAlreadyBookmarked ? "Saved" : "Bookmark"}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                navigator.clipboard.writeText(window.location.href);
                alert("Article link copied to clipboard!");
              }
            }}
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
          >
            <FaShareNodes className="size-5" />
            <span className="text-[10px] font-bold">Share</span>
          </button>

          {/* AI Agent Button */}
          <button
            onClick={onTriggerAi}
            className="flex flex-col items-center gap-1 text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors cursor-pointer"
          >
            <FaRobot className="size-5 animate-pulse" />
            <span className="text-[10px] font-extrabold text-center">
              Run AI Agent
            </span>
          </button>
        </CardContent>
      </Card>

      {/* 2. Author Profile Status */}
      <Card className="border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative size-12 overflow-hidden rounded-full bg-zinc-100">
              <Image
                src={
                  author.avatar ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
                }
                alt={author.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50">
                {author.name}
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                {(followerCount || 0).toLocaleString()} followers
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            {author.bio}
          </p>

          <Button
            onClick={handleFollowToggle}
            variant={isFollowing ? "outline" : "default"}
            size="sm"
            className="w-full text-xs font-bold rounded cursor-pointer"
          >
            {isFollowing ? "Following" : "Follow Author"}
          </Button>
        </CardContent>
      </Card>

      {/* 3. Dynamic Tag Cloud */}
      {tags && tags.length > 0 && (
        <Card className="border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <CardContent className="p-5 space-y-3">
            <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              Topic Keywords
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-[10px] h-5 py-0 px-2 font-semibold bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 border-none transition-colors cursor-pointer"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4. Top Posts Feed */}
      <Card className="border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <CardContent className="p-5 space-y-4">
          <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">
            Top Articles
          </h4>
          <div className="space-y-4">
            {topPosts && topPosts.length > 0 ? (
              topPosts.map((post) => (
                <div key={post.id} className="flex gap-3 group">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded bg-zinc-100 dark:bg-zinc-900">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-350 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <Badge className="bg-zinc-900/5 text-zinc-700 dark:bg-zinc-100/10 dark:text-zinc-300 text-[8px] h-3.5 px-1 py-0 border-none font-bold uppercase tracking-wider">
                      {post.category}
                    </Badge>
                    <Link
                      href={`/article/${post.id}`}
                      className="block group-hover:underline"
                    >
                      <h5 className="line-clamp-2 text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-tight">
                        {post.title}
                      </h5>
                    </Link>
                    <span className="text-[10px] text-zinc-400 font-medium">
                      {post.readTime}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-400">
                No recommended articles found.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}