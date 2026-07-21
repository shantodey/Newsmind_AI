"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";
import { getArticles } from "@/lib/server";

export type HistoryItem = {
  id: string;
  title: string;
  time: string;
  category: string;
};

interface ProfileHistoryProps {
  onCountChange?: (count: number) => void;
}

export function ProfileHistory({ onCountChange }: ProfileHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      try {
        const articlesData = await getArticles();
        if (!isMounted) return;

        if (Array.isArray(articlesData)) {
          const mappedHistory: HistoryItem[] = articlesData.slice(0, 5).map((a) => ({
            id: a._id || a.id || String(Math.random()),
            title: a.title || "Untitled Article",
            time: a.createdAt
              ? new Date(a.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "Recently",
            category: a.category || "General",
          }));
          setHistory(mappedHistory);
          onCountChange?.(mappedHistory.length);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    };

    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, [onCountChange]);

  return (
    <div className="space-y-4">
      <h2 className="font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
        Reading History
      </h2>
      {history.length === 0 ? (
        <div className="p-8 text-center text-sm text-zinc-500 font-medium bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          No recent reading history.
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm divide-y divide-zinc-100 dark:divide-zinc-800">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group"
            >
              <div className="flex-1 min-w-0 space-y-0.5">
                <Badge className="text-[9px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-none font-bold uppercase tracking-wider">
                  {item.category}
                </Badge>
                <Link href={`/article/${item.id}`}>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 hover:underline group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {item.title}
                  </p>
                </Link>
                <p className="text-[10px] text-zinc-400 font-medium">{item.time}</p>
              </div>
              <FaChevronRight className="size-3 text-zinc-400 shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}