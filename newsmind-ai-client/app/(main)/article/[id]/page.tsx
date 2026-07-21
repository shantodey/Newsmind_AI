"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  FaRegClock,
  FaRegCalendar,
  FaRegEye,
  FaRobot,
  FaHeart,
  FaLink,
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ArticleSidebar } from "@/components/shared/ArticleSidebar";
import { CommentSection } from "@/components/shared/CommentSection";
import { AiInsightPanel } from "./AiInsightPanel";
import {
  getArticleById,
  likeArticle,
  aiRecommendations,
} from "@/lib/server";
import { useEffect, useState } from "react";

const FALLBACK_ARTICLE_IMAGE = "https://images.unsplash.com/photo-1551958219-acbc595e6d88?w=1400";
const FALLBACK_AVATAR = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100";

const SIDEBAR_TOP_POSTS = [
  {
    id: "p1",
    title: "The Wearable Revolution: How Biometric Sensors Changed Pro Training",
    imageUrl: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=200&h=200&fit=crop",
    category: "Health",
    readTime: "5 min",
  },
  {
    id: "p2",
    title: "Data Brokers in the Locker Room: Privacy in Modern Sport",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=200&fit=crop",
    category: "Tech",
    readTime: "6 min",
  },
];

function ShareBar() {
  const handleCopy = () => navigator.clipboard.writeText(window.location.href);
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-2.5 py-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 transition-all cursor-pointer"
    >
      <FaLink className="size-3.5" /> <span>Copy link</span>
    </button>
  );
}

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);

    getArticleById(id)
      .then((data) => {
        if (!data) return;
        setArticle({
          id: data.id || data._id,
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          category: data.category || "General",
          subcategory: data.subcategory || "News",
          imageUrl: data.imageUrl && data.imageUrl.trim() !== "" ? data.imageUrl : FALLBACK_ARTICLE_IMAGE,
          publishedAt: data.publishedAt || new Date().toLocaleDateString(),
          readTime: data.readTime || "5 min",
          views: data.views || 0,
          commentCount: data.commentCount || 0,
          likes: data.likes || 0,
          sentiment: data.sentiment || "neutral",
          sentimentScore: data.sentimentScore || 0.5,
          author: {
            name: data.author?.name || "NewsMind Agent",
            avatar: data.author?.avatar && data.author.avatar.trim() !== "" ? data.author.avatar : FALLBACK_AVATAR,
            bio: data.author?.bio || "Staff writer",
            role: data.author?.role || "Author",
            followers: data.author?.followers || 100,
          },
          tags: data.tags || [],
        });
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));

    aiRecommendations()
      .then((data) => {
        setRecommendations(
          (data ?? []).slice(0, 3).map((a: any) => ({
            id: a.id || a._id,
            title: a.title,
            imageUrl: a.imageUrl && a.imageUrl.trim() !== "" ? a.imageUrl : FALLBACK_ARTICLE_IMAGE,
            category: a.category || "General",
            readTime: a.readTime || "5 min",
          }))
        );
      })
      .catch((err) => console.error("Error loading recommendations:", err));
  }, [id]);

  const handleLikeClick = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (!article?.id) return;
    setArticle((prev: any) => ({ ...prev, likes: (prev.likes || 0) + 1 }));
    const res = await likeArticle(article.id);
    if (res?.likes !== undefined) {
      setArticle((prev: any) => ({ ...prev, likes: res.likes }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <FaRobot className="size-8 text-teal-500 animate-bounce" />
          <span className="text-sm font-bold text-zinc-500">Loading Article Details...</span>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-zinc-500 font-bold">Article not found.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="relative w-full h-[52vh] min-h-[360px] max-h-[560px] overflow-hidden">
          <Image src={article.imageUrl} alt={article.title} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-900/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8 max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight max-w-4xl">
              {article.title}
            </h1>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 xl:gap-14">
            <article className="min-w-0 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="relative size-10 rounded-full overflow-hidden shrink-0">
                    <Image src={article.author.avatar} alt={article.author.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{article.author.name}</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">{article.author.role}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  <span className="flex items-center gap-1.5"><FaRegCalendar /> {article.publishedAt}</span>
                  <span className="w-px h-4 bg-zinc-200 dark:bg-zinc-700" />
                  <span className="flex items-center gap-1.5"><FaRegClock /> {article.readTime}</span>
                  <span className="w-px h-4 bg-zinc-200 dark:bg-zinc-700" />
                  <span className="flex items-center gap-1.5"><FaRegEye /> {article.views} views</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <ShareBar />
                  <button
                    onClick={handleLikeClick}
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-2.5 py-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 hover:text-rose-500 hover:border-rose-200 transition-all cursor-pointer"
                  >
                    <FaHeart className="size-3.5 text-rose-500" />
                    <span>{(article.likes || 0).toLocaleString()} Likes</span>
                  </button>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowAiPanel((p) => !p)} className="rounded-lg cursor-pointer">
                  <FaRobot className="size-3.5 mr-1" /> {showAiPanel ? "Close AI Panel" : "Run AI Analysis"}
                </Button>
              </div>

              {showAiPanel && (
                <AiInsightPanel onClose={() => setShowAiPanel(false)} articleId={article.id} content={article.content} />
              )}

              <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 leading-relaxed border-l-4 border-teal-500 pl-5 py-1">
                {article.excerpt}
              </p>

              <div className="text-base text-zinc-700 dark:text-zinc-300 leading-8 space-y-5">
                {typeof article.content === "string"
                  ? article.content.split("\n\n").map((para: string, idx: number) => <p key={idx}>{para}</p>)
                  : <p>{article.content}</p>}
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                {article.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/explore?tag=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              <div className="pt-4">
                <CommentSection articleId={article.id} />
              </div>
            </article>

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                <ArticleSidebar
                  articleId={article.id}
                  author={{
                    name: article.author.name,
                    avatar: article.author.avatar,
                    bio: article.author.bio,
                    followers: article.author.followers || 0,
                  }}
                  tags={article.tags}
                  topPosts={recommendations.length > 0 ? recommendations : SIDEBAR_TOP_POSTS}
                  likesCount={article.likes}
                  onTriggerAi={() => {
                    setShowAiPanel(true);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}