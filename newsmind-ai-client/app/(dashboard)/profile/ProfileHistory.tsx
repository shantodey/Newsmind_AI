"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  History, 
  ChevronRight, 
  Calendar, 
  BookOpen, 
  Compass 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getArticles } from "@/lib/actions/articles";

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
  const [loading, setLoading] = useState(true);

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
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, [onCountChange]);

  return (
    <Card className="border border-[#E2E8F0] shadow-sm rounded-2xl bg-white overflow-hidden">
      <CardHeader className="border-b border-[#E2E8F0] bg-slate-50/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <History className="size-4" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-[#14213D] flex items-center gap-2">
                Reading History
                <Badge className="bg-teal-50 text-teal-700 border border-teal-200 text-xs px-2 py-0.5 rounded-full font-semibold">
                  {history.length}
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs text-[#64748B]">
                Your recent reading activity and discovered articles.
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 sm:p-8">
        {loading ? (
          <div className="py-16 text-center">
            <div className="size-7 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-[#64748B]">Loading your reading history...</p>
          </div>
        ) : history.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 text-center max-w-sm mx-auto">
            <div className="size-14 rounded-2xl bg-[#F0FDFA] text-[#0D9488] flex items-center justify-center mb-4 border border-teal-100">
              <BookOpen className="size-6" />
            </div>
            <h3 className="text-base font-bold text-[#14213D] mb-1">
              No reading history yet
            </h3>
            <p className="text-xs text-[#64748B] mb-5 leading-relaxed">
              Stories and editorials you read will automatically appear here for easy reference and revisiting.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center justify-center bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs h-9 px-4 rounded-lg font-semibold gap-1.5 transition-colors"
            >
              <Compass className="size-3.5" />
              <span>Explore stories</span>
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-[#E2E8F0] divide-y divide-[#E2E8F0] overflow-hidden">
            {history.map((item) => (
              <Link
                key={item.id}
                href={`/article/${item.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-[#64748B]">
                      <Calendar className="size-3 text-slate-400" />
                      {item.time}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#14213D] group-hover:text-blue-600 line-clamp-1 transition-colors">
                    {item.title}
                  </h4>
                </div>
                <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shrink-0">
                  <ChevronRight className="size-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}