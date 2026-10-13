"use client";

import Image from "next/image";
import Link from "next/link";
import { FaRegHeart, FaHeart, FaRegBookmark, FaBookmark, FaShareNodes, FaRobot, } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button";
import { Attachment, AttachmentContent, AttachmentGroup, AttachmentMedia, AttachmentTitle } from "@/components/ui/attachment"
import { useCurrentUser } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  author: Author;
  tags: string[];
  topPosts: CompactPost[];
  likesCount?: number;
  isLiked: boolean;
  isLiking: boolean;
  isBookmarked: boolean;
  isBookmarking: boolean;
  onLikeToggle: () => void;
  onBookmarkToggle: () => void;
  onTriggerAi: () => void;
}

export function ArticleSidebar({ author, topPosts, likesCount = 0, isLiked, isLiking, isBookmarked, isBookmarking, onLikeToggle, onBookmarkToggle, onTriggerAi }: ArticleSidebarProps) {

  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(author.followers);
  const { user } = useCurrentUser();
  const userId = user?.id;
  const isLoggedIn = Boolean(userId);

  // Like state
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
            onClick={() => user?.id ? onLikeToggle() : router.push("/login")}
            disabled={!user?.id || isLiking}
            className={`flex flex-col items-center gap-1 transition-colors ${!user?.id
              ? "opacity-50 cursor-not-allowed text-zinc-400"
              : isLiked
                ? "text-rose-500 cursor-default"
                : "text-zinc-500 hover:text-rose-500 cursor-pointer disabled:opacity-50"
              }`}
          >
            {isLiked ? <FaHeart className="size-5 text-rose-500" /> : <FaRegHeart className="size-5" />}
            <span className="text-[10px] font-bold">{likesCount.toLocaleString()} Likes</span>
          </button>

          {/* Bookmark Button */}
          <Toggle aria-label="Toggle bookmark" size="sm" variant="ghost" pressed={isBookmarked}
            onPressedChange={() => { if (!userId) return router.push("/login"); if (isBookmarking) return; onBookmarkToggle(); }}
            disabled={!isLoggedIn || isBookmarking} className={isBookmarked ? "data-[state=on]:text-teal-600" : "hover:text-teal-600"}>
            <FaBookmark className="group-aria-pressed/toggle:fill-foreground" />
            <span className="ml-1.5">{isBookmarked ? "Saved" : "Bookmark"}</span>
          </Toggle>
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
          <button onClick={onTriggerAi}
            className="flex flex-col items-center gap-1 text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors cursor-pointer">
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
              <Image src={ author.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"} alt={author.name} fill className="object-cover" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50">  {author.name} </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                {(followerCount || 0).toLocaleString()} followers
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            {author.bio}
          </p>

          <Button onClick={handleFollowToggle} variant={isFollowing ? "outline" : "default"} size="sm" className="w-full text-xs font-bold rounded cursor-pointer">
            {isFollowing ? "Following" : "Follow Author"}
          </Button>
        </CardContent>
      </Card>


      {/* 4. Top Posts Feed */}
      <Card className="border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <CardContent className="p-5 space-y-4">
          <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">
            Top Articles
          </h4>
          <div className="space-y-4">
            {topPosts && topPosts.length > 0 ? (
              <AttachmentGroup className="w-full flex flex-col space-y-2">
                {topPosts.map((post) => (
                  <Attachment key={post.id} className="w-full">
                    <AttachmentMedia variant="image">
                      <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
                    </AttachmentMedia>

                    <AttachmentContent>
                      <Link href={`/article/${post.id}`}>
                        <AttachmentTitle className="line-clamp-2">{post.title}</AttachmentTitle>
                      </Link>
                      <Badge variant="secondary">{post.category}</Badge>
                    </AttachmentContent>
                  </Attachment>
                ))}
              </AttachmentGroup>
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