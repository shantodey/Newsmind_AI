"use client";

import * as React from "react";
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
  onTriggerAi: () => void;
}

export function ArticleSidebar({
  author,
  tags,
  topPosts,
  onTriggerAi,
}: ArticleSidebarProps) {
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [followerCount, setFollowerCount] = React.useState(author.followers);
  const [isLiked, setIsLiked] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  const handleFollowToggle = () => {
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
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-rose-500 transition-colors"
          >
            {isLiked ? (
              <FaHeart className="size-5 text-rose-500" />
            ) : (
              <FaRegHeart className="size-5" />
            )}
            <span className="text-[10px] font-bold">1.2K Likes</span>
          </button>

          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-teal-600 transition-colors"
          >
            {isBookmarked ? (
              <FaBookmark className="size-5 text-teal-600" />
            ) : (
              <FaRegBookmark className="size-5" />
            )}
            <span className="text-[10px] font-bold">Bookmark</span>
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Article link copied to clipboard!");
            }}
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            <FaShareNodes className="size-5" />
            <span className="text-[10px] font-bold">Share</span>
          </button>

          <button
            onClick={onTriggerAi}
            className="flex flex-col items-center gap-1 text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
          >
            <FaRobot className="size-5 animate-pulse" />
            <span className="text-[10px] font-extrabold text-center">Run AI Agent</span>
          </button>
        </CardContent>
      </Card>

      {/* 2. Author Profile Status */}
      <Card className="border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative size-12 overflow-hidden rounded-full bg-zinc-100">
              <Image
                src={author.avatar}
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
                {followerCount.toLocaleString()} followers
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

      {/* 4. Top Posts Feed */}
      <Card className="border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <CardContent className="p-5 space-y-4">
          <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">
            Top Articles
          </h4>
          <div className="space-y-4">
            {topPosts.map((post) => (
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
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 5. Advertisement / Promo block */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-6 text-center text-white space-y-4">
        <Badge className="bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold border-none uppercase tracking-widest text-[9px]">
          Sponsor
        </Badge>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white leading-snug">
            NewsMind AI Pro
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-[200px] mx-auto">
            Get unlimited summarizations and chat histories. Start your 7-day trial today!
          </p>
        </div>
        <Button size="sm" render={<Link href="#">Subscribe Now</Link>} className="w-full text-xs font-bold bg-teal-500 hover:bg-teal-400 text-zinc-950 rounded cursor-pointer" />
      </div>
    </div>
  );
}
