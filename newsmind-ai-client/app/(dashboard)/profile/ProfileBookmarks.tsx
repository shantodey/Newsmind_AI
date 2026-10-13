"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  Bookmark, 
  Trash2, 
  Compass, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  ExternalLink
} from "lucide-react";
import { getUserBookmarks } from "@/lib/actions/user";
import { toggleBookmark } from "@/lib/actions/interactions";
import { useCurrentUser } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Article {
  _id: string;
  id?: string;
  title: string;
  category: string;
  imageUrl: string;
  readTime?: string;
  author?: any;
  publishedAt?: string;
  createdAt?: string;
}

const PAGE_SIZE = 6;

export function ProfileBookmarks({
  onCountChange,
}: {
  onCountChange?: (count: number) => void;
}) {
  const { user, isPending } = useCurrentUser();
  const userId = user?.id;

  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookmarkedArticles = async () => {
      if (!userId) {
        setBookmarks([]);
        setLoading(false);
        onCountChange?.(0);
        return;
      }

      try {
        setLoading(true);
        const fetchedArticles = await getUserBookmarks();
        const list = Array.isArray(fetchedArticles) ? fetchedArticles : [];
        setBookmarks(list);
        onCountChange?.(list.length);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isPending) {
      fetchBookmarkedArticles();
    }
  }, [isPending, userId, onCountChange]);

  const removeBookmark = async (articleId: string) => {
    if (!userId) return;

    try {
      setRemovingId(articleId);
      const result = await toggleBookmark(articleId);
      if (result?.bookmarked !== false) {
        throw new Error(result?.error || "Failed to remove bookmark");
      }
      const updated = bookmarks.filter((bookmark) => (bookmark._id || bookmark.id) !== articleId);
      setBookmarks(updated);
      onCountChange?.(updated.length);
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
    } finally {
      setRemovingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(bookmarks.length / PAGE_SIZE));
  const paginatedBookmarks = bookmarks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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

      <CardContent className="p-0">
        {loading || isPending ? (
          <div className="py-16 text-center">
            <Loader2 className="size-7 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-[#64748B]">Loading your saved stories...</p>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center max-w-sm mx-auto">
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
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F7F9FC] text-[#64748B] font-semibold">
                  <th className="py-3 px-4 sm:px-6">Article</th>
                  <th className="py-3 px-4 sm:px-6 hidden md:table-cell">Category</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {paginatedBookmarks.map((b) => {
                  const articleId = (b._id || b.id || "").toString();
                  const isRemoving = removingId === articleId;

                  return (
                    <tr key={articleId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative size-10 sm:size-11 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                            <Image
                              src={b.imageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400"}
                              alt={b.title}
                              fill
                              className="object-cover"
                              sizes="44px"
                            />
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/article/${articleId}`}
                              className="font-semibold text-[#14213D] hover:text-blue-600 transition-colors line-clamp-1 block text-xs sm:text-sm"
                            >
                              {b.title}
                            </Link>
                            <span className="text-[11px] text-[#64748B] md:hidden block mt-0.5">
                              {b.category || "General"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 hidden md:table-cell">
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-semibold text-[11px]">
                          {b.category || "General"}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <Link
                            href={`/article/${articleId}`}
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                            title="Read Article"
                          >
                            <ExternalLink className="size-3.5" />
                            <span className="hidden sm:inline">Read</span>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isRemoving}
                            onClick={() => removeBookmark(articleId)}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Remove from bookmarks"
                          >
                            {isRemoving ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="size-3.5" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-[#E2E8F0] bg-[#F7F9FC]">
            <span className="text-xs text-[#64748B]">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 text-xs border-[#E2E8F0]"
              >
                <ChevronLeft className="size-3.5 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="h-8 text-xs border-[#E2E8F0]"
              >
                Next
                <ChevronRight className="size-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ProfileBookmarks;