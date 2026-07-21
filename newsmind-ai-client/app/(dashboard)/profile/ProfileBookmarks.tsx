
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBookmark, FaRegClock, FaTrash } from "react-icons/fa6";
import { getUserBookmarks, toggleBookmark } from "@/lib/server";
import { authClient } from "@/lib/auth-client";

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
  const user = session?.user as
    | (typeof session.user & { bookmarks?: string[] })
    | undefined;

  const userBookmarkIds = user?.bookmarks ?? [];

  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookmarkedArticles = async () => {
      if (userBookmarkIds.length === 0) {
        setBookmarks([]);
        setLoading(false);
        onCountChange?.(0);
        return;
      }

      try {
        const fetchedArticles = await getUserBookmarks(userBookmarkIds);

        setBookmarks(fetchedArticles);
        onCountChange?.(fetchedArticles.length);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (!isPending) {
      fetchBookmarkedArticles();
    }
  }, [isPending, userBookmarkIds]);

  const removeBookmark = async (articleId: string) => {
    try {
      const updatedBookmarks = bookmarks.filter((b) => b._id !== articleId);
      setBookmarks(updatedBookmarks);
      if (onCountChange) onCountChange(updatedBookmarks.length);
      await toggleBookmark(articleId);
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
    }
  };

  if (isPending || loading) {
    return (
      <div className="py-10 text-center text-sm font-semibold text-zinc-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          Saved Articles{" "}
          <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
            {bookmarks.length}
          </span>
        </h2>
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <FaBookmark className="size-12 text-zinc-300 dark:text-zinc-700" />
          <p className="font-bold text-zinc-500">No bookmarks saved yet</p>
          <Link
            href="/"
            className="text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline"
          >
            Explore articles
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {bookmarks.map((b) => (
            <div
              key={b._id}
              className="flex gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-sm group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="relative size-16 shrink-0 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                {b.imageUrl && (
                  <Image
                    src={b.imageUrl}
                    alt={b.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <span className="inline-block text-[9px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  {b.category}
                </span>

                <Link href={`/article/${b._id}`}>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 line-clamp-2 hover:underline group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {b.title}
                  </h3>
                </Link>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                    <FaRegClock className="size-2.5" /> {b.readTime}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeBookmark(b._id)}
                    aria-label="Remove bookmark"
                    className="text-zinc-300 hover:text-rose-500 dark:text-zinc-700 dark:hover:text-rose-500 transition-colors p-1"
                  >
                    <FaTrash className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );


}