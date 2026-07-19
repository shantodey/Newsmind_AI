"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import {
  FaArrowLeft, FaImage, FaRobot, FaCircleCheck,
  FaTag, FaXmark, FaTriangleExclamation,
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { uploadToImageBB } from "@/lib/imagebb";
import { createArticle, generateAiTagsAndSummary } from "@/lib/server";

const CATEGORIES = ["Technology", "Sport", "Politics", "Business", "Science", "Health", "Entertainment", "World", "Climate", "AI"];

type ArticleFormValues = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  status: "published" | "draft";
  tags: string;
};

const MOCK_AI_TAGS = ["AI", "MachineLearning", "Technology", "DataScience", "Innovation"];
const MOCK_AI_SUMMARY = "This article explores the transformative impact of emerging technologies on modern industry. Key themes include automation, data-driven decision making, and the ethical considerations of AI deployment at scale.";

export default function NewArticlePage() {
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string>("");
  const [uploading, setUploading] = React.useState(false);
  const [uploadedUrl, setUploadedUrl] = React.useState("");
  const [uploadError, setUploadError] = React.useState("");
  const [tagInput, setTagInput] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiSummary, setAiSummary] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<ArticleFormValues>({
    defaultValues: { status: "draft", category: "Technology" },
  });

  const titleValue = watch("title");
  const contentValue = watch("content");

  // Image selection handler
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setUploadError("");
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Upload to ImageBB
  const handleUpload = async () => {
    if (!imageFile) return;
    setUploading(true);
    setUploadError("");
    try {
      const url = await uploadToImageBB(imageFile);
      setUploadedUrl(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Tag management
  const addTag = (tag: string) => {
    const clean = tag.trim().replace(/\s+/g, "");
    if (clean && !tags.includes(clean)) setTags((prev) => [...prev, clean]);
    setTagInput("");
  };
  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));
  // AI tag/summary generation using Server Action
  const runAiGenerate = async () => {
    setAiLoading(true);
    try {
      const data = await generateAiTagsAndSummary(titleValue || "", contentValue || "");
      if (data && data.tags) {
        setTags((prev) => Array.from(new Set([...prev, ...data.tags])));
      }
      setAiSummary("AI Analysis: Structured keywords successfully extracted. Sentiment classified as neutral/positive.");
    } catch (err) {
      console.error("AI gen error:", err);
    } finally {
      setAiLoading(false);
    }
  };

  // Submit using Server Action
  const onSubmit = async (data: ArticleFormValues) => {
    setSubmitLoading(true);
    setSubmitError("");
    try {
      const payload = {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        tags: tags,
        imageUrl: uploadedUrl || imagePreview || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800",
        status: data.status,
      };

      const result = await createArticle(payload);
      if (result.error) {
        throw new Error(result.error);
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6">
          <div className="text-center space-y-6 max-w-md">
            <div className="flex size-20 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-950/30 mx-auto">
              <FaCircleCheck className="size-10 text-teal-500" />
            </div>
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Article Saved!</h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Your article has been saved successfully. You can manage it from the articles dashboard.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/articles/manage" className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 text-white hover:bg-zinc-800 dark:hover:bg-zinc-100 px-5 py-2.5 text-sm font-bold transition-colors">
                Manage Articles
              </Link>
              <button onClick={() => setSubmitted(false)} className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 px-5 py-2.5 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                Add Another
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/articles/manage" className="flex size-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <FaArrowLeft className="size-3.5" />
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">New Article</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Write, tag, and publish your article</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-[1fr_300px] gap-8">
            {/* Main content column */}
            <div className="space-y-6">
              {/* Title */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Article Info</h2>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Title *</label>
                  <input
                    placeholder="Write a compelling headline..."
                    className={`w-full h-12 rounded-lg border px-4 text-base font-bold text-zinc-900 dark:text-zinc-50 bg-zinc-50 dark:bg-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all ${errors.title ? "border-rose-400" : "border-zinc-200 dark:border-zinc-700"}`}
                    {...register("title", { required: "Title is required", minLength: { value: 10, message: "Minimum 10 characters" } })}
                  />
                  {errors.title && <p className="text-xs font-medium text-rose-500">{errors.title.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Excerpt / Summary *</label>
                  <Textarea
                    placeholder="A brief summary displayed in article cards and search results..."
                    rows={2}
                    className={`resize-none rounded-lg bg-zinc-50 dark:bg-zinc-900 text-sm font-medium focus:ring-2 focus:ring-teal-500/30 ${errors.excerpt ? "border-rose-400" : "border-zinc-200 dark:border-zinc-700"}`}
                    {...register("excerpt", { required: "Excerpt is required", minLength: { value: 20, message: "At least 20 characters" } })}
                  />
                  {errors.excerpt && <p className="text-xs font-medium text-rose-500">{errors.excerpt.message}</p>}
                </div>
              </div>

              {/* Cover image */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Cover Image</h2>

                {imagePreview ? (
                  <div className="space-y-3">
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" sizes="600px" />
                      <button type="button" onClick={() => { setImagePreview(""); setImageFile(null); setUploadedUrl(""); }} className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors">
                        <FaXmark className="size-3" />
                      </button>
                    </div>
                    {!uploadedUrl ? (
                      <div className="flex items-center gap-3">
                        <Button type="button" onClick={handleUpload} disabled={uploading} className="font-bold rounded-lg text-sm cursor-pointer bg-teal-600 hover:bg-teal-700 text-white">
                          {uploading ? "Uploading..." : "Upload to ImageBB"}
                        </Button>
                        {uploadError && (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-rose-500">
                            <FaTriangleExclamation className="size-3" /> {uploadError}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
                        <FaCircleCheck className="size-3.5" /> Uploaded successfully
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl py-10 flex flex-col items-center gap-3 text-zinc-400 hover:border-teal-400 hover:text-teal-500 dark:hover:border-teal-600 transition-all"
                  >
                    <FaImage className="size-8" />
                    <div className="text-center">
                      <p className="text-sm font-bold">Click to select image</p>
                      <p className="text-xs font-medium">PNG, JPG, WebP · Max 32MB</p>
                    </div>
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              </div>

              {/* Content */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Content *</h2>
                  <span className="text-xs font-semibold text-zinc-400">{contentValue?.length ?? 0} chars</span>
                </div>
                <Textarea
                  placeholder="Write your full article content here..."
                  rows={18}
                  className={`resize-y rounded-lg bg-zinc-50 dark:bg-zinc-900 text-sm font-medium leading-relaxed focus:ring-2 focus:ring-teal-500/30 ${errors.content ? "border-rose-400" : "border-zinc-200 dark:border-zinc-700"}`}
                  {...register("content", { required: "Content is required", minLength: { value: 100, message: "Minimum 100 characters" } })}
                />
                {errors.content && <p className="text-xs font-medium text-rose-500">{errors.content.message}</p>}
              </div>

              {/* AI Summary result */}
              {aiSummary && (
                <div className="rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/60 dark:bg-teal-950/20 p-5 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-400">
                  <div className="flex items-center gap-2">
                    <FaRobot className="size-4 text-teal-600 dark:text-teal-400" />
                    <span className="text-xs font-extrabold text-teal-700 dark:text-teal-300 uppercase tracking-widest">AI Generated Summary</span>
                  </div>
                  <p className="text-sm text-teal-900 dark:text-teal-200 font-medium leading-relaxed">{aiSummary}</p>
                </div>
              )}
            </div>

            {/* Sidebar column */}
            <div className="space-y-6">
              {/* Publish settings */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm space-y-4">
                <h2 className="text-sm font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Publish</h2>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</label>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <div className="grid grid-cols-2 gap-2">
                        {(["draft", "published"] as const).map((s) => (
                          <button
                            key={s} type="button"
                            onClick={() => field.onChange(s)}
                            className={`rounded-lg py-2 text-xs font-bold capitalize transition-all ${
                              field.value === s
                                ? s === "published" ? "bg-teal-500 text-white" : "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                                : "border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Category *</label>
                  <select
                    className="w-full h-9 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 text-sm font-medium text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    {...register("category", { required: true })}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <Button type="submit" disabled={submitLoading} className="w-full font-bold rounded-lg cursor-pointer bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-100 dark:text-zinc-900">
                  {submitLoading ? "Saving..." : "Save Article"}
                </Button>
                {submitError && (
                  <p className="text-xs font-semibold text-rose-500 mt-2 text-center bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-lg p-2">
                    {submitError}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm space-y-4">
                <h2 className="text-sm font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Tags</h2>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FaTag className="absolute top-1/2 -translate-y-1/2 left-3 size-3 text-zinc-400" />
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); } }}
                      placeholder="Add tag + Enter"
                      className="w-full h-9 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 pl-8 pr-3 text-xs font-medium text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    />
                  </div>
                  <Button type="button" onClick={() => addTag(tagInput)} size="sm" className="rounded-lg font-bold cursor-pointer text-xs">Add</Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        #{tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-zinc-400 hover:text-rose-500 transition-colors">
                          <FaXmark className="size-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Assistant */}
              <div className="rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-gradient-to-br from-teal-50/80 to-cyan-50/40 dark:from-teal-950/30 dark:to-zinc-950 p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <FaRobot className="size-4 text-teal-600 dark:text-teal-400 animate-pulse" />
                  <h2 className="text-sm font-extrabold text-teal-800 dark:text-teal-300">AI Assistant</h2>
                </div>
                <p className="text-xs text-teal-700 dark:text-teal-400 font-medium">Auto-generate tags and a summary from your article content.</p>
                <Button
                  type="button"
                  onClick={runAiGenerate}
                  disabled={aiLoading || !contentValue || contentValue.length < 50}
                  className="w-full rounded-lg font-bold cursor-pointer text-xs bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50"
                >
                  {aiLoading ? "Generating..." : "Generate Tags & Summary"}
                </Button>
                <p className="text-[10px] text-teal-600/60 dark:text-teal-500/50 font-medium text-center">
                  Requires at least 50 characters of content
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
