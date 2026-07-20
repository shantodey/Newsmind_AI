"use client";

import * as React from "react";
import {
  FaMagnifyingGlass,
  FaSliders,
  FaChevronLeft,
  FaChevronRight,
  FaXmark,
  FaArrowUpWideShort,
  FaRegClock,
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ArticleCard, type Article } from "@/components/shared/ArticleCard";
import { getArticles } from "@/lib/server";

const CATEGORIES = [
  "All", "Technology", "Sport", "Politics", "Business", "Science",
  "Health", "Entertainment", "World", "Climate", "AI",
];

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Most Viewed", value: "views" },
  { label: "Trending", value: "trending" },
  { label: "Top Rated", value: "rated" },
];

const PAGE_SIZE = 6;

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden animate-pulse">
      <div className="aspect-video bg-zinc-200 dark:bg-zinc-800" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
        <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
        <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
        <div className="flex justify-between">
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const [query, setQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [activeSentiment, setActiveSentiment] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("newest");
  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [articles, setArticles] = React.useState<Article[]>([]);

  React.useEffect(() => {
    setIsLoading(true);
    getArticles(activeCategory)
      .then((data) => {
        const dbArticles = (data || []).map((a: any) => ({
          id: a._id?.["$oid"] || a._id || a.id,
          title: a.title,
          excerpt: a.excerpt,
          content: a.content,
          category: a.category,
          readTime: a.readTime || "5 min",
          publishedAt: a.createdAt?.["$date"] 
            ? new Date(a.createdAt["$date"]).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          imageUrl: a.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800",
          likes: a.likes || 0,
          views: a.views || 0,
          sentiment: a.sentiment || "neutral",
          author: a.author || { name: "NewsMind Agent", avatar: "" },
          tags: a.tags || [],
          sentimentScore: a.sentimentScore || 0.5
        }));
        setArticles(dbArticles);
      })
      .catch((err) => console.error("Error fetching explore articles:", err))
      .finally(() => setIsLoading(false));
  }, [activeCategory]);

  React.useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = React.useMemo(() => {
    let result = [...articles];
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (activeSentiment !== "All") result = result.filter((a) => a.sentiment === activeSentiment.toLowerCase());
    if (sortBy === "rated") result = [...result].sort((a, b) => b.sentimentScore - a.sentimentScore);
    if (sortBy === "trending") result = [...result].sort(() => Math.random() - 0.5);
    return result;
  }, [articles, debouncedQuery, activeSentiment, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearFilters = () => {
    setQuery("");
    setActiveCategory("All");
    setActiveSentiment("All");
    setSortBy("newest");
    setPage(1);
  };

  const hasActiveFilters = query || activeCategory !== "All" || activeSentiment !== "All" || sortBy !== "newest";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <section className="bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center space-y-5">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore the World&apos;s News
            </h1>
            <p className="text-zinc-400 font-medium text-base sm:text-lg">
              Search, filter, and discover AI-analyzed articles from every corner of the globe.
            </p>
            <div className="relative max-w-2xl mx-auto">
              <FaMagnifyingGlass className="absolute top-1/2 -translate-y-1/2 left-4 size-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, topic, or keyword..."
                className="w-full h-12 rounded-xl border border-zinc-700 bg-zinc-800 pl-12 pr-12 text-sm font-medium text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute top-1/2 -translate-y-1/2 right-4 text-zinc-400 hover:text-white transition-colors"
                >
                  <FaXmark className="size-4" />
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setPage(1); }}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 shadow-sm"
                      : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setFiltersOpen((p) => !p)}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <FaSliders className="size-3.5" />
                Filters
              </button>

              <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2">
                <FaArrowUpWideShort className="size-3.5 text-zinc-400" />
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  className="text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-transparent focus:outline-none cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
                >
                  <FaXmark className="size-3" /> Clear
                </button>
              )}
            </div>
          </div>

          {filtersOpen && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="space-y-2">
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Sentiment</p>
                <div className="flex flex-wrap gap-2">
                  {["All", "Positive", "Neutral", "Negative"].map((s) => (
                    <button
                      key={s}
                      onClick={() => { setActiveSentiment(s); setPage(1); }}
                      className={`rounded-full px-3 py-1 text-xs font-bold border transition-all ${
                        activeSentiment === s
                          ? s === "Positive" ? "bg-emerald-500 border-emerald-500 text-white"
                            : s === "Negative" ? "bg-rose-500 border-rose-500 text-white"
                            : s === "Neutral" ? "bg-amber-500 border-amber-500 text-white"
                            : "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-900"
                          : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-zinc-400"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              {isLoading ? "Searching..." : `${filtered.length} article${filtered.length !== 1 ? "s" : ""} found`}
            </p>
            {debouncedQuery && (
              <p className="text-sm font-medium text-zinc-500">
                Results for: <span className="font-bold text-zinc-900 dark:text-zinc-50">&ldquo;{debouncedQuery}&rdquo;</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)
              : paginated.length > 0
              ? paginated.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))
              : (
                <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4 text-center">
                  <FaMagnifyingGlass className="size-12 text-zinc-300 dark:text-zinc-700" />
                  <p className="text-lg font-bold text-zinc-500">No articles found</p>
                  <p className="text-sm text-zinc-400 max-w-xs">
                    Try different keywords or clear your filters.
                  </p>
                  <Button onClick={clearFilters} variant="outline" size="sm" className="rounded-lg cursor-pointer font-bold">
                    Clear All Filters
                  </Button>
                </div>
              )
            }
          </div>

          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex size-8 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <FaChevronLeft className="size-3" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`flex size-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    page === i + 1
                      ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 shadow-sm"
                      : "border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex size-8 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <FaChevronRight className="size-3" />
              </button>
            </div>
          )}

          {!isLoading && filtered.length > 0 && (
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 font-medium pt-2">
              <FaRegClock className="size-3" />
              <span>Total reading time for current results: ~{filtered.reduce((acc, a) => acc + parseInt(a.readTime), 0)} min</span>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}