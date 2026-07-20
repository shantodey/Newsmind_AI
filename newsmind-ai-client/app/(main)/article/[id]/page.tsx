"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation"; // dynamic ID নেওয়ার জন্য
import { 
  FaChevronRight, FaRegClock, FaRegCalendar, FaRegEye, FaRegCommentDots, FaShareNodes, 
  FaTwitter, FaFacebookF, FaLinkedinIn, FaLink, FaRobot, FaCircleCheck,
  FaArrowLeft, FaArrowRight, FaBrain, FaHeart
} from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ArticleSidebar } from "@/components/shared/ArticleSidebar";
import { CommentSection } from "@/components/shared/CommentSection";
import { ArticleCard, type Article } from "@/components/shared/ArticleCard";
import { getArticleById, likeArticle, aiSummarize, aiSentiment, aiRecommendations } from "@/lib/server"; // আপনার সার্ভার অ্যাকশন

// sidebar এর ডেটা স্ট্রাকচার ঠিক রাখার জন্য static fallback
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

const RELATED_ARTICLES: Article[] = [
  {
    id: "ra1",
    title: "Machine Vision in Basketball: Reading the Court Before the Play Happens",
    excerpt: "A look at how NBA teams use computer vision to pre-read offensive sets in real time.",
    category: "Basketball",
    imageUrl: "https://images.unsplash.com/photo-1546519638405-a9f6a2ed95b3?w=600&h=400&fit=crop",
    author: { name: "Aisha Patel", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop" },
    publishedAt: "Jul 16, 2026",
    readTime: "6 min",
    sentiment: "positive",
    sentimentScore: 0.91,
    tags: ["Basketball", "ComputerVision", "NBA"],
  }
];

function AiInsightPanel({ 
  onClose, 
  articleId, 
  content 
}: { 
  onClose: () => void; 
  articleId: string; 
  content: string 
}) {
  const [phase, setPhase] = React.useState<"idle" | "loading" | "done">("idle");
  const [dots, setDots] = React.useState("");
  const [summaryData, setSummaryData] = React.useState<any>(null);
  const [sentimentData, setSentimentData] = React.useState<any>(null);

  React.useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (phase === "loading") {
      timer = setInterval(() => setDots((d) => (d.length >= 3 ? "" : d + ".")), 400);
    }
    return () => clearInterval(timer);
  }, [phase]);

  const handleAnalyze = async () => {
    setPhase("loading");
    try {
      const [summary, sentiment] = await Promise.all([
        aiSummarize(articleId, content, "medium"),
        aiSentiment(content),
      ]);
      setSummaryData(summary);
      setSentimentData(sentiment);
      setPhase("done");
    } catch (err) {
      console.error("AI Analysis failed:", err);
      setPhase("idle");
    }
  };

  const getSentimentColor = (s: string) => {
    if (s === "positive") return "text-emerald-600 dark:text-emerald-400";
    if (s === "negative") return "text-rose-600 dark:text-rose-400";
    return "text-amber-600 dark:text-amber-400";
  };

  return (
    <div className="rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-gradient-to-br from-teal-50/80 to-cyan-50/60 dark:from-teal-950/40 dark:to-zinc-950 p-6 space-y-4 shadow-lg animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaBrain className="size-5 text-teal-600 dark:text-teal-400 animate-pulse" />
          <h3 className="text-sm font-extrabold text-teal-900 dark:text-teal-300 tracking-tight">
            NewsMind AI Analysis
          </h3>
        </div>
        <button onClick={onClose} className="text-xs font-bold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
          ✕ Close
        </button>
      </div>

      {phase === "idle" && (
        <div className="text-center py-4 space-y-3">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium"> Run a deep AI analysis on this article. </p>
          <Button onClick={handleAnalyze} className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg px-6 cursor-pointer">
            <FaRobot className="mr-2 size-4" /> Analyze Now
          </Button>
        </div>
      )}

      {phase === "loading" && (
        <div className="text-center py-6 space-y-2">
          <FaRobot className="size-8 text-teal-500 mx-auto animate-bounce" />
          <p className="text-sm font-bold text-teal-700 dark:text-teal-400"> Analyzing article{dots}</p>
        </div>
      )}

      {phase === "done" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-white/80 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 px-3 py-2">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">Sentiment</span>
              <span className={`text-xs font-extrabold capitalize ${getSentimentColor(sentimentData?.sentiment || "neutral")}`}>
                {sentimentData?.sentiment || "neutral"} ({Math.round((sentimentData?.score || 0.5) * 100)}%)
              </span>
            </div>
            <div className="rounded-lg bg-white/80 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 px-3 py-2">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">AI Confidence</span>
              <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400">
                {Math.round((sentimentData?.confidence || 0.9) * 100)}%
              </span>
            </div>
          </div>

          {summaryData?.tldr && (
            <div className="rounded-lg bg-white/80 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 p-3 space-y-1">
              <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block">TL;DR Summary</span>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                {summaryData.tldr}
              </p>
            </div>
          )}

          {summaryData?.bulletPoints && summaryData.bulletPoints.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block">Key Points</span>
              <ul className="space-y-1.5 pl-1.5">
                {summaryData.bulletPoints.map((bp: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <span className="text-teal-500 mt-0.5">•</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {summaryData?.takeaways && summaryData.takeaways.length > 0 && (
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block">AI Takeaways</span>
              <ul className="space-y-1 pl-1.5">
                {summaryData.takeaways.map((tw: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    <span className="text-teal-400 mt-0.5">✓</span>
                    <span>{tw}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ShareBar() {
  const handleCopy = () => {
    if (typeof window !== "undefined") navigator.clipboard.writeText(window.location.href);
  };
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button onClick={handleCopy} className="flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-2.5 py-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 transition-all">
        <FaLink className="size-3.5" /> <span>Copy link</span>
      </button>
    </div>
  );
}

export default function ArticleDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [article, setArticle] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showAiPanel, setShowAiPanel] = React.useState(false);
  const [recommendationsList, setRecommendationsList] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getArticleById(id)
      .then((data) => {
        if (data) {
          // ডেটাবেজ স্কিমা অনুযায়ী ফিল্ড ম্যাপ করে নেওয়া হলো
          setArticle({
            id: data.id || data._id,
            title: data.title,
            excerpt: data.excerpt,
            content: data.content,
            category: data.category || "General",
            subcategory: data.subcategory || "News",
            imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1551958219-acbc595e6d88?w=1400",
            publishedAt: data.publishedAt || new Date().toLocaleDateString(),
            readTime: data.readTime || "5 min",
            views: data.views || 0,
            commentCount: data.commentCount || 0,
            likes: data.likes || 0,
            sentiment: data.sentiment || "neutral",
            sentimentScore: data.sentimentScore || 0.5,
            author: data.author || { name: "NewsMind Agent", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100", bio: "Staff writer", role: "Author", followers: 100 },
            tags: data.tags || []
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));

    aiRecommendations()
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.slice(0, 3).map((a: any) => ({
            id: a.id || a._id,
            title: a.title,
            imageUrl: a.imageUrl || "https://images.unsplash.com/photo-1551958219-acbc595e6d88?w=1400",
            category: a.category || "General",
            readTime: a.readTime || "5 min",
          }));
          setRecommendationsList(mapped);
        }
      })
      .catch((err) => console.error("Error loading recommendations:", err));
  }, [id]);

  const handleLikeClick = async () => {
    if (!article?.id) return;
    setArticle((prev: any) => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null);
    const res = await likeArticle(article.id);
    if (res && res.likes !== undefined) {
      setArticle((prev: any) => prev ? { ...prev, likes: res.likes } : null);
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

  // Sidebar এবং internals কনফিগারেশন
  const sidebarAuthor = {
    name: article.author.name,
    avatar: article.author.avatar,
    bio: article.author.bio,
    followers: article.author.followers || 0,
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        {/* Hero Banner */}
        <div className="relative w-full h-[52vh] min-h-[360px] max-h-[560px] overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-900/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8 max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight max-w-4xl">
              {article.title}
            </h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 xl:gap-14">
            <article className="min-w-0 space-y-8">
              {/* Meta information grid */}
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
                <AiInsightPanel 
                  onClose={() => setShowAiPanel(false)} 
                  articleId={article.id} 
                  content={article.content} 
                />
              )}

              <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 leading-relaxed border-l-4 border-teal-500 pl-5 py-1">
                {article.excerpt}
              </p>

              {/* Dynamic Content Handler (String বা Paragraph parsing) */}
              <div className="text-base text-zinc-700 dark:text-zinc-300 leading-8 space-y-5">
                {typeof article.content === "string" ? (
                  article.content.split("\n\n").map((para: string, idx: number) => (
                    <p key={idx}>{para}</p>
                  ))
                ) : (
                  <p>{article.content}</p>
                )}
              </div>

              {/* Dynamic Tags */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                {article.tags.map((tag: string) => (
                  <Link key={tag} href={`/explore?tag=${encodeURIComponent(tag)}`} className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    #{tag}
                  </Link>
                ))}
              </div>

              <div className="pt-4">
                <CommentSection articleId={article.id} />
              </div>
            </article>

            {/* Sidebar component wrapper */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                <ArticleSidebar
                  author={sidebarAuthor}
                  tags={article.tags}
                  topPosts={recommendationsList.length > 0 ? recommendationsList : SIDEBAR_TOP_POSTS}
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