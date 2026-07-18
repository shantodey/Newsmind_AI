"use client";

import * as React from "react";
import Image from "next/image";
import { FaPlay, FaEye } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";

export interface VideoItem {
  id: string;
  title: string;
  duration: string;
  views: string;
  imageUrl: string;
  category: string;
  publishedAt: string;
}

interface VideoCardProps {
  video: VideoItem;
  active?: boolean;
  onClick?: () => void;
  layout?: "grid" | "list";
}

export function VideoCard({
  video,
  active = false,
  onClick,
  layout = "grid",
}: VideoCardProps) {
  if (layout === "list") {
    return (
      <div
        onClick={onClick}
        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
          active
            ? "bg-zinc-800 text-white"
            : "hover:bg-zinc-800/40 text-zinc-300"
        }`}
      >
        <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-zinc-900">
          <Image
            src={video.imageUrl}
            alt={video.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <FaPlay className="size-3 text-white" />
          </div>
        </div>
        <div className="flex-1 space-y-1 overflow-hidden">
          <Badge className="bg-teal-500/20 text-teal-300 border-none text-[9px] h-4 py-0 px-1 hover:bg-teal-500/30">
            {video.category}
          </Badge>
          <h4 className="line-clamp-2 text-xs font-bold leading-tight truncate-two-lines text-zinc-100">
            {video.title}
          </h4>
          <div className="flex items-center gap-2 text-[10px] text-zinc-400">
            <span>{video.duration}</span>
            <span>•</span>
            <span>{video.views}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 transition-all duration-300 hover:border-zinc-700 cursor-pointer"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
        <Image
          src={video.imageUrl}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-90 transition-opacity duration-300 group-hover:bg-black/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
            <FaPlay className="size-4 ml-0.5" />
          </div>
        </div>

        <div className="absolute top-3 left-3">
          <Badge className="bg-teal-500 text-zinc-950 border-none hover:bg-teal-400 font-bold uppercase tracking-wider text-[10px]">
            {video.category}
          </Badge>
        </div>

        <div className="absolute bottom-3 right-3 rounded bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white">
          {video.duration}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h4 className="line-clamp-2 text-sm font-bold text-white mb-2 group-hover:text-teal-400 transition-colors leading-tight">
          {video.title}
        </h4>
        <div className="mt-auto flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1">
            <FaEye className="size-3" />
            <span>{video.views}</span>
          </div>
          <span>{video.publishedAt}</span>
        </div>
      </div>
    </div>
  );
}
