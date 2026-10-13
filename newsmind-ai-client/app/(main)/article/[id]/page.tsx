"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/auth-client";
import { FaRegClock, FaRegCalendar, FaRegEye, FaRobot, FaHeart, FaLink } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { ArticleSidebar } from "@/components/shared/ArticleSidebar";
import { CommentSection } from "@/components/shared/CommentSection";
import { AiInsightPanel } from "./AiInsightPanel";
import { getArticleById } from "@/lib/actions/articles";
import { likeArticle, toggleBookmark } from "@/lib/actions/interactions";
import { aiRecommendations } from "@/lib/actions/ai";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Article } from "@/schema/artcle";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const FALLBACK_ARTICLE_IMAGE = "https://images.unsplash.com/photo-1551958219-acbc595e6d88?w=1400";
const FALLBACK_AVATAR = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100";

function ShareBar() {
  const handleCopy = () => navigator.clipboard.writeText(window.location.href);
  return (
    <button onClick={handleCopy} className="flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-2.5 py-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 transition-all cursor-pointer">
      <FaLink className="size-3.5" /> <span>Copy link</span>
    </button>
  );
}

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useCurrentUser();
  const isLoggedIn = !!user;

  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    getArticleById(id)
      .then((data) => {
        if (cancelled || !data) return;
        const result = Article.safeParse(data);
        if (!result.success) {
          console.error("Invalid article response:", result.error.message);
          return;
        }
        setArticle({
          ...result.data,
          comments: data.comments || [],
          interaction: data.interaction,
        });
        setIsLiked(Boolean(data.interaction?.liked));
        setIsBookmarked(Boolean(data.interaction?.bookmarked));
      })
      .catch((err) => console.error("Article fetch failed:", err))
      .finally(() => !cancelled && setIsLoading(false));

    aiRecommendations()
      .then((data) => !cancelled && setRecommendations((data || []).slice(0, 3)))
      .catch(() => !cancelled && setRecommendations([]));

    return () => { cancelled = true; };
  }, [id]);

  const handleLikeClick = async () => {
    if (!isLoggedIn) return router.push("/login");
    if (!article?._id || isLiking) return;

    setIsLiking(true);
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setArticle((p: any) => ({
      ...p,
      likes: nextLiked ? (p.likes || 0) + 1 : Math.max(0, (p.likes || 0) - 1),
    }));

    const res = await likeArticle(article._id);
    if (res?.likes !== undefined && typeof res.liked === "boolean") {
      setArticle((p: any) => ({ ...p, likes: res.likes }));
      setIsLiked(res.liked);
    } else {
      setIsLiked(!nextLiked);
      setArticle((p: any) => ({
        ...p,
        likes: Math.max(0, (p.likes || 0) + (nextLiked ? -1 : 1)),
      }));
      toast.error(res?.error || "Failed to update like");
    }
    setIsLiking(false);
  };

  const handleBookmarkClick = async () => {
    if (!isLoggedIn) return router.push("/login");
    if (isBookmarking) return;
    setIsBookmarking(true);
    const result = await toggleBookmark(article._id);
    if (typeof result?.bookmarked === "boolean") {
      setIsBookmarked(result.bookmarked);
      toast.success(result.bookmarked ? "Bookmarked!" : "Removed from bookmarks");
    } else {
      toast.error(result?.error || "Failed to update bookmark");
    }
    setIsBookmarking(false);
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


  return (
    <>

      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <AspectRatio ratio={16 / 9} className="relative w-full h-[52vh]  overflow-hidden">
          <Image src={article.imageUrl || FALLBACK_ARTICLE_IMAGE} alt={article.title} fill className="rounded-lg object-cover  dark:brightness-20" />
        </AspectRatio>
        {/* <div className="relative w-full h-[52vh] min-h-90 max-h-140 overflow-hidden">
          <Image src={article.imageUrl || FALLBACK_ARTICLE_IMAGE} alt={article.title} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-900/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8 max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight max-w-4xl">{article.title}</h1>
          </div>
        </div> */}



        <div className="mx-auto container px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 xl:gap-14">
            <article className="min-w-0 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <Avatar size="lg">
                    <AvatarImage src={article.author.authorImage} alt={article.author.authorName} />
                    <AvatarFallback>{FALLBACK_AVATAR}</AvatarFallback>
                  </Avatar>


                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 capitalize">{article.author.authorName}</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Author</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  <span className="flex items-center gap-1.5"><FaRegCalendar /> {article.createdAt.toLocaleDateString()}</span>
                  <span className="w-px h-4 bg-zinc-200 dark:bg-zinc-700" />
                  <span className="w-px h-4 bg-zinc-200 dark:bg-zinc-700" />
                  <span className="flex items-center gap-1.5"><FaRegEye /> {article.views} views</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <ShareBar />
                  <button onClick={handleLikeClick} disabled={isLiking}
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${isLiked
                      ? "border-rose-200 bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:border-rose-900/50"
                      : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 hover:text-rose-500 hover:border-rose-200"
                      }`}
                  >
                    <FaHeart className={`size-3.5 ${isLiked ? "text-rose-500" : "text-zinc-400 group-hover:text-rose-500"}`} />
                    <span>{article.likes || 0} Likes</span>
                  </button>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowAiPanel((p) => !p)} className="rounded-lg cursor-pointer">
                  <FaRobot className="size-3.5 mr-1" /> {showAiPanel ? "Close AI Panel" : "Run AI Analysis"}
                </Button>
              </div>

              {showAiPanel && (
                <AiInsightPanel
                  onClose={() => setShowAiPanel(false)}
                  articleId={article._id}
                  content={article.content}
                  likesCount={article.likes || 0}
                  isLiked={isLiked}
                  isLiking={isLiking}
                  onLikeToggle={handleLikeClick}
                  isBookmarked={isBookmarked}
                  isBookmarking={isBookmarking}
                  onBookmarkToggle={handleBookmarkClick}
                />
              )}

              <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 leading-relaxed border-l-4 border-teal-500 pl-5 py-1">{article.excerpt || `${article.content.slice(0, 160).trimEnd()}…`}</p>

              <div className="text-base text-zinc-700 dark:text-zinc-300 leading-8 space-y-5">
                {article.content.split("\n\n").map((para: string, idx: number) => <p key={idx}>{para}</p>)}
              </div>

              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  {article.tags.map((tag: string) => (
                    <Link key={tag} href={`/explore?tag=${encodeURIComponent(tag)}`} className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">#{tag}</Link>
                  ))}
                </div>
              )}

              <CommentSection key={article._id} articleId={article._id} initialComments={article.comments} />
            </article>

            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <ArticleSidebar author={{ name: article.author.authorName, avatar: article.author.authorImage || FALLBACK_AVATAR, bio: "Staff writer", followers: 100 }} tags={article.tags} topPosts={recommendations} likesCount={article.likes} isLiked={isLiked} isLiking={isLiking} isBookmarked={isBookmarked} isBookmarking={isBookmarking} onLikeToggle={handleLikeClick} onBookmarkToggle={handleBookmarkClick} onTriggerAi={() => { setShowAiPanel(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
              </div>
            </aside>
          </div>
        </div>
      </main>

    </>
  );
}