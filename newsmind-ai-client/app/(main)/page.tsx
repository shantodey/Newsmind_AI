"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getArticles } from "@/lib/server";
import { FaRegClock, FaPlay, FaRegLightbulb } from "react-icons/fa6";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { CategoryPill } from "@/components/shared/CategoryPill";
import { ArticleCard, Article } from "@/components/shared/ArticleCard";
import { WeatherWidget } from "@/components/shared/WeatherWidget";
import { SportsWidget } from "@/components/shared/SportsWidget";
import { VideoCard, VideoItem } from "@/components/shared/VideoCard";
import { AiSimulator } from "@/components/shared/AiSimulator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock Videos
const MOCK_VIDEOS: VideoItem[] = [
  {
    id: "1",
    title: "Inside the AI Lab: Building Tomorrow's Newsroom Intelligence",
    duration: "12:15",
    views: "124K views",
    imageUrl:
      "https://storage.ghost.io/c/9f/98/9f98c569-396e-485a-be2d-9d9c9af5e0bb/content/images/size/w1200/2025/09/AI-research-labs.jpg",
    category: "Technology",
    publishedAt: "2 days ago",
  },
  {
    id: "2",
    title: "Climate Summit Highlights: Delegates Agree on Renewable Accords",
    duration: "08:42",
    views: "45K views",
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    category: "World",
    publishedAt: "3 days ago",
  },
  {
    id: "3",
    title: "Euro Cup Final Moments: Underdog FC Lift the Historic Trophy",
    duration: "15:20",
    views: "89K views",
    imageUrl:
      "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&q=80&w=800",
    category: "Sports",
    publishedAt: "5 days ago",
  },
  {
    id: "4",
    title: "Market Analysis: Understanding Stabilizing Interest Rates",
    duration: "10:05",
    views: "150K views",
    imageUrl:
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800",
    category: "Business",
    publishedAt: "1 week ago",
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState<VideoItem>(MOCK_VIDEOS[0]);

  useEffect(() => {
    getArticles()
      .then((data) => {
        if (data && data?.length > 0) {
          const dbArticles = data.map((a: any) => ({
            id: a._id || a.id,
            title: a.title,
            excerpt: a.excerpt,
            content: a.content,
            category: a.category,
            readTime: a.readTime || "5 min",
            publishedAt: new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            imageUrl: a.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800",
            likes: a.likes || 0,
            views: a.views || 0,
            sentiment: a.sentiment || "neutral",
            author: a.author || { name: "NewsMind Agent", avatar: "" }
          }));
          setArticles(dbArticles);
          setSelectedArticle(dbArticles[0]);
        }
      })
      .catch((err) => console.error("Error fetching homepage articles:", err));
  }, []);

  const categories = ["ALL", "TECHNOLOGY", "WORLD", "BUSINESS", "SPORT", "SCIENCE"];

  const filteredArticles =
    selectedCategory === "ALL"
      ? articles
      : articles.filter(
          (article) =>
            article.category.toUpperCase() === selectedCategory.toUpperCase()
        );

  const handleHeroNext = () => {
    setHeroIndex((prev) => (prev + 1) % 3);
  };

  const handleHeroPrev = () => {
    setHeroIndex((prev) => (prev - 1 + 3) % 3);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 antialiased">
      <Navbar />

      {/* Hero section */}
      <section className="relative w-full overflow-hidden bg-zinc-900 py-12 md:py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left featured info slide */}
            <div className="lg:col-span-6 space-y-6 animate-fade-in">
              <div className="flex items-center gap-2">
                <Badge className="bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold uppercase tracking-wider text-xs">
                  {articles[heroIndex]?.category || "General"}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <FaRegClock className="size-3" />
                  <span>{articles[heroIndex]?.readTime || "5 min"}</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white transition-all duration-300">
                {articles[heroIndex]?.title || ""}
              </h1>

              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-xl">
                {articles[heroIndex]?.excerpt || ""}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button variant="default" render={<Link href={`/article/${articles[heroIndex]?.id || "e1"}`}>Read Full Story</Link>} className="rounded-md hover:bg-teal-600 bg-teal-500 text-zinc-950 font-bold px-6 h-11 cursor-pointer" />
                <Button
                  variant="outline"
                  onClick={() => setSelectedArticle(articles[heroIndex] || null)}
                  className="rounded-md border-zinc-700 bg-transparent text-white hover:bg-zinc-800 h-11 px-5 font-semibold cursor-pointer"
                >
                  Simulate AI Analysis
                </Button>
              </div>

              {/* Slide Navigation controls */}
              <div className="flex items-center gap-4 pt-4 border-t border-zinc-800/80">
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setHeroIndex(idx)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        heroIndex === idx ? "w-6 bg-teal-500" : "w-2.5 bg-zinc-700"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button onClick={handleHeroPrev} className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                    ←
                  </button>
                  <button
                    onClick={handleHeroNext}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            {/* Right featured image showcase */}
            <div className="lg:col-span-6 relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-800 border border-zinc-800 shadow-2xl">
              <Image
                src={articles[heroIndex]?.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800"}
                alt="Featured News"
                fill
                priority
                className="object-cover transition-all duration-500 brightness-95 hover:brightness-100"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid content */}
      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12 space-y-12 flex-1">
        
        {/* Popular posts, category selections & widgets grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left section (Popular Posts) */}
          <div className="lg:col-span-8 space-y-6">
            <SectionHeader
              title="Popular Articles"
              subtitle="The most read articles globally, curated and reviewed by AI"
              badge="TRENDING TOPICS"
            />

            {/* Categories pills filter */}
            <div className="flex flex-wrap gap-2 pb-2">
              {categories.map((cat) => (
                <CategoryPill
                  key={cat}
                  label={cat}
                  active={selectedCategory === cat}
                  onClick={() => setSelectedCategory(cat)}
                />
              ))}
            </div>

            {/* Grid of articles */}
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onSelectForAi={(art) => {
                      setSelectedArticle(art);
                      const el = document.getElementById("ai-workroom");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800 text-center text-zinc-400">
                <span>No articles found in this category.</span>
              </div>
            )}
          </div>

          {/* Right section (Widgets: Weather, Scoreboard, AI simulator) */}
          <div className="lg:col-span-4 space-y-8">
            <WeatherWidget />
            <SportsWidget />
            <div id="ai-workroom" className="scroll-mt-20">
              <AiSimulator selectedArticle={selectedArticle} />
            </div>
          </div>
        </div>

        {/* Video Theatre Hub */}
        <section className="rounded-2xl bg-zinc-900 border border-zinc-800/80 p-6 md:p-8 text-white space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded border border-teal-500/20 uppercase tracking-widest">
                Media Hub
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight text-white font-sans">
                Featured Video Briefings
              </h2>
              <p className="text-sm text-zinc-400">
                Real-time video updates and auto-generated transcripts with visual indicators
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-950 border border-zinc-800 shadow-lg">
                <Image
                  src={activeVideo.imageUrl}
                  alt={activeVideo.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-500 text-zinc-950 shadow-2xl hover:scale-110 transition-transform cursor-pointer">
                    <FaPlay className="size-6 ml-1" />
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-teal-500 text-zinc-950 font-bold uppercase hover:bg-teal-400 border-none shadow-sm">
                    {activeVideo.category}
                  </Badge>
                </div>
                <div className="absolute bottom-4 right-4 rounded bg-black/80 px-2 py-0.5 text-xs font-semibold text-white">
                  {activeVideo.duration}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white leading-snug">
                  {activeVideo.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <span>{activeVideo.views}</span>
                  <span>•</span>
                  <span>Published {activeVideo.publishedAt}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block px-2 mb-1">
                Up Next ({MOCK_VIDEOS.length - 1})
              </span>
              {MOCK_VIDEOS.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  layout="list"
                  active={activeVideo.id === video.id}
                  onClick={() => setActiveVideo(video)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Scientific Breakthroughs section */}
        <div className="space-y-6">
          <SectionHeader
            title="Scientific Breakthroughs & Insights"
            subtitle="The latest advancements across medical, biology, and environment sectors analyzed by AI agents"
            badge="SCIENCE & MEDICINE"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.slice(4, 7).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onSelectForAi={(art) => {
                  setSelectedArticle(art);
                  const el = document.getElementById("ai-workroom");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              />
            ))}
          </div>
        </div>

        {/* CTA block */}
        <section className="relative rounded-2xl bg-zinc-900 border border-zinc-800 text-white p-8 md:p-12 overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 h-48 w-48 bg-teal-500/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 h-48 w-48 bg-zinc-800/20 rounded-full blur-2xl -z-10" />
          
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500 text-zinc-950 mx-auto shadow-md">
              <FaRegLightbulb className="size-6" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Unlock the Power of AI-News Intelligence
            </h2>
            <p className="text-zinc-300 text-base md:text-lg leading-relaxed">
              Join thousands of researchers, media analysts, and decision-makers. Recieve real-time summaries, personalized recommendation streams, and advanced sentiment modeling for all global trends.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="default" render={<Link href="/register">Get Started Free</Link>} className="rounded-md bg-teal-500 text-zinc-950 font-bold hover:bg-teal-400 px-6 h-11 cursor-pointer" />
              <Button variant="outline" render={<Link href="/about">Learn More</Link>} className="rounded-md border-zinc-700 hover:bg-zinc-800 text-white h-11 px-6 font-semibold cursor-pointer" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}