"use client";

import * as React from "react";
import {
  FaRobot,
  FaArrowRight,
  FaCheck,
  FaCircleNotch,
  FaFaceSmile,
  FaFaceMeh,
  FaFaceFrown,
} from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Article } from "./ArticleCard";

interface AiSimulatorProps {
  selectedArticle: Article | null;
}

interface Step {
  id: number;
  label: string;
  status: "idle" | "running" | "completed";
}

export function AiSimulator({ selectedArticle }: AiSimulatorProps) {
  const [currentStep, setCurrentStep] = React.useState<number>(-1);
  const [steps, setSteps] = React.useState<Step[]>([
    { id: 0, label: "Extracting content & cleaning HTML", status: "idle" },
    { id: 1, label: "Generating bullet-point summary", status: "idle" },
    { id: 2, label: "Evaluating sentiment analysis", status: "idle" },
    { id: 3, label: "Generating SEO tags & categories", status: "idle" },
    { id: 4, label: "Updating recommendation vectors", status: "idle" },
    { id: 5, label: "Saving results to database", status: "idle" },
  ]);

  React.useEffect(() => {
    if (!selectedArticle) {
      setCurrentStep(-1);
      setSteps((s) => s.map((step) => ({ ...step, status: "idle" })));
      return;
    }

    // Reset and start simulation
    setCurrentStep(0);
    setSteps((s) =>
      s.map((step, idx) => ({
        ...step,
        status: idx === 0 ? "running" : "idle",
      }))
    );

    let stepIndex = 0;
    const interval = setInterval(() => {
      setSteps((prevSteps) => {
        const nextSteps = [...prevSteps];
        // Complete current step
        nextSteps[stepIndex] = { ...nextSteps[stepIndex], status: "completed" };

        stepIndex++;
        if (stepIndex < nextSteps.length) {
          // Start next step
          nextSteps[stepIndex] = { ...nextSteps[stepIndex], status: "running" };
          setCurrentStep(stepIndex);
        } else {
          // Finished all steps
          clearInterval(interval);
          setCurrentStep(nextSteps.length);
        }
        return nextSteps;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [selectedArticle]);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <FaFaceSmile className="size-4 text-emerald-500" />;
      case "neutral":
        return <FaFaceMeh className="size-4 text-amber-500" />;
      case "negative":
        return <FaFaceFrown className="size-4 text-rose-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200/50";
      case "neutral":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200/50";
      case "rose":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border-rose-200/50";
      default:
        return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
    }
  };

  return (
    <Card className="border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-teal-500 text-zinc-950">
            <FaRobot className="size-4" />
          </div>
          <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50">
            Agentic AI Workroom
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-5 flex-1 flex flex-col space-y-4">
        {!selectedArticle ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center p-6 space-y-3">
            <FaRobot className="size-10 text-zinc-300 dark:text-zinc-700 animate-bounce" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                No Article Selected
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[240px]">
                Click <span className="font-semibold text-teal-600">"Analyze AI"</span> on any article card to start the real-time agent workflow simulation.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 space-y-4">
            {/* Selected Info Header */}
            <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-900/30">
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20 px-2 py-0.5 rounded">
                SIMULATION TARGET
              </span>
              <h4 className="line-clamp-1 text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-1.5 leading-tight">
                {selectedArticle.title}
              </h4>
            </div>

            {/* Workflow steps */}
            {currentStep < steps.length ? (
              <div className="space-y-3 flex-1 justify-center flex flex-col">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className="flex items-center justify-between text-xs font-semibold"
                  >
                    <div className="flex items-center gap-2">
                      {step.status === "completed" ? (
                        <div className="flex size-4.5 items-center justify-center rounded-full bg-teal-500 text-white">
                          <FaCheck className="size-2.5" />
                        </div>
                      ) : step.status === "running" ? (
                        <div className="flex size-4.5 items-center justify-center text-teal-600 dark:text-teal-400">
                          <FaCircleNotch className="size-3.5 animate-spin" />
                        </div>
                      ) : (
                        <div className="size-4.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900" />
                      )}
                      <span
                        className={
                          step.status === "running"
                            ? "text-teal-600 dark:text-teal-400 font-bold"
                            : step.status === "completed"
                            ? "text-zinc-800 dark:text-zinc-200 font-medium"
                            : "text-zinc-400 dark:text-zinc-600"
                        }
                      >
                        {step.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Report outputs when done */
              <div className="flex-1 space-y-4 animate-fade-in">
                {/* Sentiment & reading time */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/30">
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                      Sentiment
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      {getSentimentIcon(selectedArticle.sentiment)}
                      <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-200 capitalize">
                        {selectedArticle.sentiment} (
                        {Math.round(selectedArticle.sentimentScore * 100)}%)
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/30">
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                      Reading Time
                    </span>
                    <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-200 block mt-1">
                      {selectedArticle.readTime}
                    </span>
                  </div>
                </div>

                {/* Bullet summaries */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                    AI Bullet Summary
                  </span>
                  <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                    <li className="flex items-start gap-1.5">
                      <FaArrowRight className="size-2 text-teal-600 dark:text-teal-400 mt-1 shrink-0" />
                      <span>{selectedArticle.excerpt}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <FaArrowRight className="size-2 text-teal-600 dark:text-teal-400 mt-1 shrink-0" />
                      <span>
                        Key takeaway: Critical impact analyzed on {selectedArticle.category.toLowerCase()}{" "}
                        and surrounding news vectors.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Generated Keywords/Tags */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                    Extracted Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedArticle.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-[10px] h-5 py-0 px-2 font-semibold bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-none"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-teal-500/10 p-2 text-center text-[10px] font-bold text-teal-600 dark:text-teal-400">
                  Analysis completed! Database synced successfully.
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
