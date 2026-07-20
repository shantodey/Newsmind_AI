"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaPlus, FaPen, FaTrash, FaRegEye, FaMagnifyingGlass,
  FaChevronLeft, FaChevronRight, FaArrowUpWideShort,
  FaCircleCheck, FaTriangleExclamation,
} from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { getArticleStats, getAllArticlesForManage, deleteArticle, updateArticle } from "@/lib/server";


interface ArticleRow {
  id: string;
  title: string;
  category: string;
  author: string;
  status: "published" | "draft";
  views: number;
  publishedAt: string;
  imageUrl: string;
  sentiment: "positive" | "neutral" | "negative";
}

const sentimentBadge = (s: ArticleRow["sentiment"]) => {
  if (s === "positive") return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-none";
  if (s === "negative") return "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-none";
  return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-none";
};

const PAGE_SIZE = 6;

export default function ManageArticlesPage() {
  const [articles, setArticles] = React.useState<ArticleRow[]>([]);
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "published" | "draft">("all");
  const [page, setPage] = React.useState(1);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState("");

  React.useEffect(() => {
    async function loadArticles() {
      const data = await getAllArticlesForManage();
      if (data) {
        const mapped = data.map((a: any) => ({
          id: a.id || a._id,
          title: a.title,
          category: a.category || "General",
          author: typeof a.author === "string" ? a.author : (a.author?.name || "NewsMind Agent"),
          status: a.status === "draft" ? "draft" : "published",
          views: a.views || 0,
          publishedAt: a.createdAt 
            ? new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : new Date().toLocaleDateString(),
          imageUrl: a.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800",
          sentiment: a.sentiment || "neutral",
        }));
        setArticles(mapped);
      }
    }
    loadArticles();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const confirmDelete = async (id: string) => {
    const res = await deleteArticle(id);
    if (res && !res.error) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      setDeleteTarget(null);
      showToast("Article deleted successfully.");
    } else {
      showToast(res?.error || "Failed to delete article.");
    }
  };

  const toggleStatus = async (id: string) => {
    const target = articles.find((a) => a.id === id);
    if (!target) return;
    const newStatus = target.status === "published" ? "draft" : "published";

    const res = await updateArticle(id, { status: newStatus });
    if (res && !res.error) {
      setArticles((prev) => prev.map((a) => a.id === id
        ? { ...a, status: newStatus }
        : a
      ));
      showToast("Article status updated.");
    } else {
      showToast(res?.error || "Failed to update article status.");
    }
  };

  const filtered = React.useMemo(() => {
    let result = [...articles];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((a) => a.title.toLowerCase().includes(q) || a.author.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
    }
    if (filter !== "all") result = result.filter((a) => a.status === filter);
    return result;
  }, [articles, query, filter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Manage Articles</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{articles.length} total · {articles.filter((a) => a.status === "published").length} published · {articles.filter((a) => a.status === "draft").length} drafts</p>
            </div>
            <Link
              href="/articles/new"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-100 dark:text-zinc-900 text-white px-4 py-2 text-sm font-bold transition-colors"
            >
              <FaPlus className="size-3.5" /> New Article
            </Link>
          </div>

          {/* Toast */}
          {toast && (
            <div className="flex items-center gap-2 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 px-4 py-3 text-sm font-semibold text-teal-700 dark:text-teal-400 animate-in fade-in slide-in-from-top-2 duration-300">
              <FaCircleCheck className="size-4" /> {toast}
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <FaMagnifyingGlass className="absolute top-1/2 -translate-y-1/2 left-3 size-3.5 text-zinc-400" />
              <input
                type="text" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search articles..."
                className="w-full h-9 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-9 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "published", "draft"] as const).map((f) => (
                <button key={f} onClick={() => { setFilter(f); setPage(1); }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition-all ${filter === f ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900" : "border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <th className="text-left px-5 py-3 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Article</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hidden md:table-cell">Category</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hidden lg:table-cell">
                      <span className="flex items-center gap-1"><FaArrowUpWideShort className="size-3" /> Views</span>
                    </th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hidden md:table-cell">Sentiment</th>
                    <th className="text-right px-5 py-3 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {paginated.map((article) => (
                    <tr key={article.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative size-10 shrink-0 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                            <Image src={article.imageUrl} alt={article.title} fill className="object-cover" sizes="40px" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1 text-sm">{article.title}</p>
                            <p className="text-xs text-zinc-400 font-medium">{article.author} · {article.publishedAt}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <Badge className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-none text-[10px] font-bold uppercase tracking-wider">{article.category}</Badge>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="flex items-center gap-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                          <FaRegEye className="size-3" /> {article.views.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button onClick={() => toggleStatus(article.id)} className="cursor-pointer">
                          <Badge className={`text-[10px] font-bold uppercase tracking-wider border-none ${
                            article.status === "published"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 hover:bg-emerald-200"
                              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200"
                          } transition-colors`}>
                            {article.status}
                          </Badge>
                        </button>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <Badge className={`text-[10px] font-bold capitalize ${sentimentBadge(article.sentiment)}`}>
                          {article.sentiment}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/article/${article.id}`} className="flex size-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors" title="View">
                            <FaRegEye className="size-3.5" />
                          </Link>
                          <Link href={`/articles/edit/${article.id}`} className="flex size-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-teal-600 dark:hover:text-teal-400 transition-colors" title="Edit">
                            <FaPen className="size-3" />
                          </Link>
                          <button onClick={() => setDeleteTarget(article.id)} className="flex size-7 items-center justify-center rounded-md text-zinc-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-500 transition-colors" title="Delete">
                            <FaTrash className="size-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center">
                        <p className="text-sm font-semibold text-zinc-400">No articles found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 px-5 py-3">
                <p className="text-xs font-semibold text-zinc-400">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex size-7 items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-500 disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    <FaChevronLeft className="size-2.5" />
                  </button>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex size-7 items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-500 disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    <FaChevronRight className="size-2.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDeleteTarget(null)}>
          <div className="rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 max-w-sm w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex size-12 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/30 mx-auto">
              <FaTriangleExclamation className="size-6 text-rose-500" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="font-extrabold text-zinc-900 dark:text-zinc-50">Delete Article?</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">This action cannot be undone. The article will be permanently removed.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setDeleteTarget(null)} className="flex-1 font-bold rounded-lg cursor-pointer">Cancel</Button>
              <Button onClick={() => confirmDelete(deleteTarget)} className="flex-1 font-bold rounded-lg bg-rose-500 hover:bg-rose-600 text-white cursor-pointer">Delete</Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}