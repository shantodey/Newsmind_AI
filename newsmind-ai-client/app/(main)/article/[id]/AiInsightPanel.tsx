"use client";

import { useState } from "react";
import { FaBrain, FaRobot } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { aiSummarize, aiSentiment } from "@/lib/server";

const SENTIMENT_COLOR: Record<string, string> = {
  positive: "text-emerald-600 dark:text-emerald-400",
  negative: "text-rose-600 dark:text-rose-400",
  neutral: "text-amber-600 dark:text-amber-400",
};

export function AiInsightPanel({
  onClose,
  articleId,
  content,
}: {
  onClose: () => void;
  articleId: string;
  content: string;
}) {
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const [summary, setSummary] = useState<any>(null);
  const [sentiment, setSentiment] = useState<any>(null);

  const handleAnalyze = async () => {
    setPhase("loading");
    try {
      const [s, sen] = await Promise.all([
        aiSummarize(articleId, content, "medium"),
        aiSentiment(content),
      ]);
      setSummary(s);
      setSentiment(sen);
      setPhase("done");
    } catch (err) {
      console.error("AI Analysis failed:", err);
      setPhase("idle");
    }
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
        <button
          onClick={onClose}
          className="text-xs font-bold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
        >
          ✕ Close
        </button>
      </div>

      {phase === "idle" && (
        <div className="text-center py-4 space-y-3">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            Run a deep AI analysis on this article.
          </p>
          <Button
            onClick={handleAnalyze}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg px-6 cursor-pointer"
          >
            <FaRobot className="mr-2 size-4" /> Analyze Now
          </Button>
        </div>
      )}

      {phase === "loading" && (
        <div className="text-center py-6 space-y-2">
          <FaRobot className="size-8 text-teal-500 mx-auto animate-bounce" />
          <p className="text-sm font-bold text-teal-700 dark:text-teal-400">
            Analyzing article...
          </p>
        </div>
      )}

      {phase === "done" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-white/80 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 px-3 py-2">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                Sentiment
              </span>
              <span className={`text-xs font-extrabold capitalize ${SENTIMENT_COLOR[sentiment?.sentiment] ?? SENTIMENT_COLOR.neutral}`}>
                {sentiment?.sentiment || "neutral"} ({Math.round((sentiment?.score || 0.5) * 100)}%)
              </span>
            </div>
            <div className="rounded-lg bg-white/80 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 px-3 py-2">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                AI Confidence
              </span>
              <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400">
                {Math.round((sentiment?.confidence || 0.9) * 100)}%
              </span>
            </div>
          </div>

          {summary?.tldr && (
            <div className="rounded-lg bg-white/80 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 p-3 space-y-1">
              <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block">
                TL;DR Summary
              </span>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                {summary.tldr}
              </p>
            </div>
          )}

          {summary?.bulletPoints?.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block">
                Key Points
              </span>
              <ul className="space-y-1.5 pl-1.5">
                {summary.bulletPoints.map((bp: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <span className="text-teal-500 mt-0.5">•</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {summary?.takeaways?.length > 0 && (
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block">
                AI Takeaways
              </span>
              <ul className="space-y-1 pl-1.5">
                {summary.takeaways.map((tw: string, idx: number) => (
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