"use client";

import { useState, useEffect } from "react";
import { getArticles } from "@/lib/actions/articles";
import { CategoryPill } from "@/components/shared/CategoryPill";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { WeatherWidget } from "@/components/shared/WeatherWidget";
import { SportsWidget } from "@/components/shared/SportsWidget";
import { AiSimulator } from "@/components/shared/AiSimulator";
import Hero from "@/components/shared/Hero";
import { Article } from "@/schema/artcle";
import { SectionHeader } from "@/components/shared/SectionHeader";
import CatBlock from "@/components/shared/CatBlock";

const CATEGORIES = ["ALL", "TECHNOLOGY", "WORLD", "BUSINESS", "SPORT", "SCIENCE"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    getArticles()
      .then((data) => {
        const validArticles = (data ?? []).flatMap((raw: unknown) => {
          const result = Article.safeParse(raw);
          if (!result.success) {
            console.warn("Skipping invalid article:", result.error.message);
            return [];
          }
          return [result.data];
        });

        setArticles(validArticles);
        setSelectedArticle(validArticles[0] ?? null);
      })
      .catch((err) => console.error("Error fetching homepage articles:", err));
  }, []);

  const filteredArticles = articles.filter(
    (article) => selectedCategory === "ALL" || article.category.toUpperCase() === selectedCategory
  );

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 antialiased">
      <Hero articles={articles.slice(0, 3)} />

      <main className="mx-auto container w-full px-4 sm:px-6 lg:px-8 py-12 space-y-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <SectionHeader title="Popular Articles" subtitle="The most read articles globally, curated and reviewed by AI" badge="TRENDING TOPICS" />

            <div className="flex flex-wrap gap-2 pb-2">
              {CATEGORIES.map((cat) => (
                <CategoryPill key={cat} label={cat} active={selectedCategory === cat} onClick={() => setSelectedCategory(cat)} />
              ))}
            </div>

            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article._id} article={article}
                    onSelectForAi={(art) => {
                      setSelectedArticle(art);
                      document.getElementById("ai-workroom")?.scrollIntoView({ behavior: "smooth" });
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

          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24 lg:self-start  lg:overflow-y-auto">
            <WeatherWidget />
            <SportsWidget />
            <div id="ai-workroom" className="scroll-mt-20">
              <AiSimulator selectedArticle={selectedArticle} />
            </div>
          </div>
        </div>

        <CatBlock />
      </main>
    </div>
  );
}
