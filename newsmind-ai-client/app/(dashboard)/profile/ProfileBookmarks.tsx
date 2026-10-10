"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  Bookmark, 
  Clock, 
  Trash2, 
  Compass, 
  ExternalLink 
} from "lucide-react";
import { getUserBookmarks } from "@/lib/actions/user";
import { toggleBookmark } from "@/lib/actions/interactions";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Article {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
  readTime: string;
}

export function ProfileBookmarks({
  onCountChange,
}: {
  onCountChange?: (count: number) => void;
}) {
  const { data: session, isPending } = authClient.useSession();
  type SessionUser = NonNullable<typeof session>["user"] & {
    id?: string;
    bookmarks?: string[];
  };

  const user = session?.user as SessionUser | undefined;
  const userId = user?.id;

  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const userBookmarkIds = user?.bookmarks ?? [];

    const fetchBookmarkedArticles = async () => {
      if (userBookmarkIds.length === 0) {
        setBookmarks([]);
        setLoading(false);
        onCountChange?.(0);
        return;
      }

      try {
        const fetchedArticles = await getUserBookmarks(userBookmarkIds);
        setBookmarks(fetchedArticles || []);
        onCountChange?.(fetchedArticles?.length || 0);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isPending) {
      fetchBookmarkedArticles();
    }
  }, [isPending, onCountChange, user?.bookmarks]);

  const removeBookmark = async (articleId: string) => {
    if (!userId) return;

    try {
      const updatedBookmarks = bookmarks.filter((b) => b._id !== articleId);
      setBookmarks(updatedBookmarks);
      onCountChange?.(updatedBookmarks.length);
      await toggleBookmark(articleId, userId);
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
    }
  };

  return (
    <Card className="border border-[#E2E8F0] shadow-sm rounded-2xl bg-white overflow-hidden">
      <CardHeader className="border-b border-[#E2E8F0] bg-slate-50/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Bookmark className="size-4" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-[#14213D] flex items-center gap-2">
                Saved Articles
                <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-0.5 rounded-full font-semibold">
                  {bookmarks.length}
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs text-[#64748B]">
                Articles and stories you have bookmarked for later reading.
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 sm:p-8">
        {loading || isPending ? (
          <div className="py-16 text-center">
            <div className="size-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-[#64748B]">Loading your saved stories...</p>
          </div>
        ) : bookmarks.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 text-center max-w-sm mx-auto">
            <div className="size-14 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4 border border-blue-100">
              <Bookmark className="size-6" />
            </div>
            <h3 className="text-base font-bold text-[#14213D] mb-1">
              No saved stories yet
            </h3>
            <p className="text-xs text-[#64748B] mb-5 leading-relaxed">
              When you find articles you would like to revisit, tap the bookmark icon on any story to save it here.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center justify-center bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs h-9 px-4 rounded-lg font-semibold gap-1.5 transition-colors"
            >
              <Compass className="size-3.5" />
              <span>Explore articles</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bookmarks.map((b) => (
              <div
                key={b._id}
                className="group flex gap-4 p-3.5 rounded-xl border border-[#E2E8F0] hover:border-blue-200 hover:shadow-xs transition-all bg-white"
              >
                <div className="relative size-20 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
                  <Image
                    src={b.imageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400"}
                    alt={b.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="80px"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {b.category || "General"}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeBookmark(b._id)}
                        aria-label="Remove bookmark"
                        title="Remove bookmark"
                        className="text-slate-400 hover:text-red-500 p-1 transition-colors rounded"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>

                    <Link href={`/article/${b._id}`}>
                      <h4 className="text-xs sm:text-sm font-semibold text-[#14213D] group-hover:text-blue-600 line-clamp-2 transition-colors">
                        {b.title}
                      </h4>
                    </Link>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] pt-1">
                    <Clock className="size-3 text-slate-400" />
                    <span>{b.readTime || "3 min read"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}