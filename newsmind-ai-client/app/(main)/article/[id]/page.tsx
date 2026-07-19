"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaChevronRight, FaRegClock, FaRegCalendar, FaRegEye, FaRegCommentDots, FaShareNodes, FaTwitter, FaFacebookF, FaLinkedinIn, FaLink, FaRobot,  FaCircleCheck,
  FaArrowLeft,
  FaArrowRight,
  FaBrain,
} from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ArticleSidebar } from "@/components/shared/ArticleSidebar";
import { CommentSection } from "@/components/shared/CommentSection";
import { ArticleCard, type Article } from "@/components/shared/ArticleCard";



const ARTICLE = {
  id: "sport-ai-data-revolution",
  category: "Sport",
  subcategory: "Technology",
  title: "How Artificial Intelligence Is Quietly Revolutionizing Modern Sports Data Analytics",
  excerpt:
    "From predictive injury prevention to real-time tactical insights, AI is reshaping the competitive sports landscape at an unprecedented pace.",
  heroImage:
    "https://images.unsplash.com/photo-1551958219-acbc595e6d88?w=1400&h=750&fit=crop",
  bodyImage:
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=600&fit=crop",
  publishedAt: "July 18, 2026",
  updatedAt: "July 18, 2026 · 14:35 UTC",
  readTime: "8 min read",
  views: "24.5K",
  commentCount: 3,
  sentiment: "positive" as const,
  sentimentScore: 0.88,
  author: {
    name: "Marcus Elliot",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    bio:
      "Senior correspondent covering the intersection of technology and elite sport. Based in London, formerly at The Athletic and Reuters Sports.",
    followers: 21400,
    role: "Senior Sports Correspondent",
  },
  tags: [
    "Artificial Intelligence", "SportsTech", "DataAnalytics", "MachineLearning",
    "Basketball", "Football", "Olympics", "Wearables", "Biomechanics", "Coaching",
  ],
  paragraphs: [
    `The transformation is subtle but seismic. Walk into any elite sports franchise's analytics department today and you'll find something that looks less like a traditional scouting room and more like a Silicon Valley engineering floor — rows of monitors displaying real-time biomechanical overlays, predictive fatigue indices, and live sentiment feeds from fan-facing platforms.`,
    `Artificial intelligence has moved from buzzword to infrastructure. The NBA's Second Spectrum system, for instance, processes over 3.2 million data points per game — from player micro-movements to defensive rotation angles — feeding coaches a granular tactical picture that would have been science fiction a decade ago. This isn't an emerging trend. It's already the new normal.`,
    `But the most profound impact isn't on game-day strategy. It's in injury prevention. Teams like Manchester City and the San Francisco 49ers have deployed machine learning pipelines that monitor athlete load data across weeks of training, flagging statistical anomalies that correlate with soft-tissue injury risk. When the algorithm raises a flag, training intensity is adjusted. Careers are being extended by data.`,
    `The ethical dimensions are equally significant. Who owns the biometric data of a professional athlete? When an AI system recommends benching a star player, how much weight should that carry over a coach's instinct? These questions sit at the frontier of sports law and are only beginning to surface in collective bargaining agreements.`,
    `Looking ahead, the next frontier is real-time in-game decision support — an AI co-pilot in the dugout that synthesizes everything from weather conditions to opponent fatigue models, offering probabilistic play recommendations. Some leagues already have experimental implementations. The era of the AI-assisted coach is not coming. It's here.`,
  ],
};

const SIDEBAR_AUTHOR = {
  name: ARTICLE.author.name,
  avatar: ARTICLE.author.avatar,
  bio: ARTICLE.author.bio,
  followers: ARTICLE.author.followers,
};

const SIDEBAR_TAGS = ARTICLE.tags;

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
  {
    id: "p3",
    title: "How the Premier League's Expected Goals Model Reshaped Transfer Policy",
    imageUrl: "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=200&h=200&fit=crop",
    category: "Football",
    readTime: "7 min",
  },
  {
    id: "p4",
    title: "Olympic 2028: When AI Coaches Meet Human Champions",
    imageUrl: "https://images.unsplash.com/photo-1567519836512-1ab09a09c86a?w=200&h=200&fit=crop",
    category: "Olympics",
    readTime: "4 min",
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
  },
  {
    id: "ra2",
    title: "Football's Data Divide: How Analytics Separate Champions from the Rest",
    excerpt: "Top clubs are doubling down on data infrastructure while others fall behind.",
    category: "Football",
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=400&fit=crop",
    author: { name: "Carlos Romero", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop" },
    publishedAt: "Jul 14, 2026",
    readTime: "5 min",
    sentiment: "neutral",
    sentimentScore: 0.72,
    tags: ["Football", "Analytics", "Strategy"],
  },
  {
    id: "ra3",
    title: "The Ethical Case Against Algorithmic Athlete Selection",
    excerpt: "Should machines have veto power over a coach's gut call? Experts weigh in.",
    category: "Ethics",
    imageUrl: "https://images.unsplash.com/photo-1568209865332-a15790aed756?w=600&h=400&fit=crop",
    author: { name: "Dr. Yuki Tanaka", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&h=60&fit=crop" },
    publishedAt: "Jul 12, 2026",
    readTime: "9 min",
    sentiment: "negative",
    sentimentScore: 0.41,
    tags: ["Ethics", "AI", "SportsTech"],
  },
];



function AiInsightPanel({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = React.useState<"idle" | "loading" | "done">("idle");
  const [dots, setDots] = React.useState("");

  const insights = [
    { label: "Sentiment", value: "Strongly Positive (88%)", color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Bias Score", value: "Low (0.12)", color: "text-teal-600 dark:text-teal-400" },
    { label: "Readability", value: "Grade 12 · Expert", color: "text-zinc-600 dark:text-zinc-400" },
    { label: "Key Topic", value: "AI in Sport", color: "text-violet-600 dark:text-violet-400" },
    { label: "Credibility", value: "95 / 100", color: "text-sky-600 dark:text-sky-400" },
  ];

  React.useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (phase === "loading") {
      timer = setInterval(() => setDots((d) => (d.length >= 3 ? "" : d + ".")), 400);
      setTimeout(() => {
        setPhase("done");
        clearInterval(timer);
      }, 2200);
    }
    return () => clearInterval(timer);
  }, [phase]);

  return (
    <div className="rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-gradient-to-br from-teal-50/80 to-cyan-50/60 dark:from-teal-950/40 dark:to-zinc-950 p-6 space-y-4 shadow-lg">
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
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium"> Run a deep AI analysis on this article: sentiment, bias, readability, and more. </p>
          <Button  onClick={() => setPhase("loading")}  className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg px-6 cursor-pointer">
            <FaRobot className="mr-2 size-4" /> Analyze Now
          </Button>
        </div>
      )}

      {phase === "loading" && (
        <div className="text-center py-6 space-y-2">
          <FaRobot className="size-8 text-teal-500 mx-auto animate-bounce" />
          <p className="text-sm font-bold text-teal-700 dark:text-teal-400"> Analyzing article{dots}</p>
          <p className="text-xs text-zinc-400 font-medium">  Running NLP pipeline · Checking sources · Scoring bias</p>
        </div>
      )}

      {phase === "done" && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-widest"> Analysis Complete</p>
          <div className="space-y-2">
            {insights.map((item) => (
              <div key={item.label}
                className="flex items-center justify-between rounded-lg bg-white/80 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <FaCircleCheck className="size-3.5 text-teal-500 shrink-0" />
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    {item.label}
                  </span>
                </div>
                <span className={`text-xs font-extrabold ${item.color}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-zinc-400 font-medium text-center pt-1">
            Powered by NewsMind AI · Results are illustrative
          </p>
        </div>
      )}
    </div>
  );
}


function ShareBar() {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    if (typeof window !== "undefined") navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mr-1">
        Share:
      </span>
      {[
        { icon: <FaTwitter className="size-3.5" />, label: "Twitter", color: "hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-950/30 dark:hover:text-sky-400" },
        { icon: <FaFacebookF className="size-3.5" />, label: "Facebook", color: "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/30 dark:hover:text-blue-400" },
        { icon: <FaLinkedinIn className="size-3.5" />, label: "LinkedIn", color: "hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-950/30 dark:hover:text-sky-500" },
      ].map(({ icon, label, color }) => (
        <button
          key={label}
          aria-label={`Share on ${label}`}
          className={`flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-2.5 py-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 transition-all ${color}`}
        >
          {icon}
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-2.5 py-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-all"
      >
        <FaLink className="size-3.5" />
        <span>{copied ? "Copied!" : "Copy link"}</span>
      </button>
    </div>
  );
}

export default function ArticleDetailPage() {
  const [showAiPanel, setShowAiPanel] = React.useState(false);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        {/* ── Hero Banner ── */}
        <div className="relative w-full h-[52vh] min-h-[360px] max-h-[560px] overflow-hidden">
          <Image
            src={ARTICLE.heroImage}
            alt={ARTICLE.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-900/40 to-transparent" />

          {/* Hero content overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8 max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-4">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <FaChevronRight className="size-2.5 text-zinc-500" />
              <Link href="/explore" className="hover:text-white transition-colors">Explore</Link>
              <FaChevronRight className="size-2.5 text-zinc-500" />
              <span className="text-teal-400">{ARTICLE.category}</span>
            </nav>

            {/* Category pill */}
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-teal-500 text-zinc-950 font-extrabold uppercase tracking-widest text-[10px] border-none shadow-sm">
                {ARTICLE.category}
              </Badge>
              <Badge className="bg-white/10 text-white font-semibold text-[10px] border border-white/20 backdrop-blur-sm">
                {ARTICLE.subcategory}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight max-w-4xl drop-shadow-sm">
              {ARTICLE.title}
            </h1>
          </div>
        </div>

        {/* ── Article Body + Sidebar ── */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 xl:gap-14">
            {/* ── LEFT: Main content ── */}
            <article className="min-w-0 space-y-8">
              {/* Meta row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                {/* Author block */}
                <div className="flex items-center gap-3">
                  <div className="relative size-10 rounded-full overflow-hidden ring-2 ring-teal-500/30 shrink-0">
                    <Image
                      src={ARTICLE.author.avatar}
                      alt={ARTICLE.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                      {ARTICLE.author.name}
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                      {ARTICLE.author.role}
                    </p>
                  </div>
                </div>

                {/* Date, read time, views, comments */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <FaRegCalendar className="size-3.5" />
                    {ARTICLE.publishedAt}
                  </span>
                  <span className="w-px h-4 bg-zinc-200 dark:bg-zinc-700" />
                  <span className="flex items-center gap-1.5">
                    <FaRegClock className="size-3.5" />
                    {ARTICLE.readTime}
                  </span>
                  <span className="w-px h-4 bg-zinc-200 dark:bg-zinc-700" />
                  <span className="flex items-center gap-1.5">
                    <FaRegEye className="size-3.5" />
                    {ARTICLE.views} views
                  </span>
                  <span className="w-px h-4 bg-zinc-200 dark:bg-zinc-700" />
                  <span className="flex items-center gap-1.5">
                    <FaRegCommentDots className="size-3.5" />
                    {ARTICLE.commentCount} comments
                  </span>
                </div>
              </div>

              {/* Share bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <ShareBar />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAiPanel((p) => !p)}
                  className="flex items-center gap-2 text-xs font-bold border-teal-300 dark:border-teal-800 text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/30 rounded-lg cursor-pointer"
                >
                  <FaRobot className="size-3.5 animate-pulse" />
                  {showAiPanel ? "Close AI Panel" : "Run AI Analysis"}
                </Button>
              </div>

              {/* AI Panel */}
              {showAiPanel && (
                <AiInsightPanel onClose={() => setShowAiPanel(false)} />
              )}

              {/* Excerpt / Lead paragraph */}
              <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 leading-relaxed border-l-4 border-teal-500 pl-5 py-1">
                {ARTICLE.excerpt}
              </p>

              {/* Article Body paragraphs */}
              <div className="prose-like space-y-5">
                {ARTICLE.paragraphs.slice(0, 2).map((para, i) => (
                  <p key={i} className="text-base text-zinc-700 dark:text-zinc-300 leading-8 font-normal">
                    {para}
                  </p>
                ))}
              </div>

              {/* In-body image */}
              <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden shadow-md bg-zinc-100 dark:bg-zinc-900">
                <Image
                  src={ARTICLE.bodyImage}
                  alt="Sports analytics visualization"
                  fill
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-5 py-4">
                  <p className="text-xs text-zinc-300 font-medium">
                    AI-powered biomechanical overlays are now standard in elite sports facilities worldwide.
                  </p>
                </div>
              </div>

              {/* Remaining body paragraphs */}
              <div className="space-y-5">
                {ARTICLE.paragraphs.slice(2).map((para, i) => (
                  <p key={i} className="text-base text-zinc-700 dark:text-zinc-300 leading-8 font-normal">
                    {para}
                  </p>
                ))}
              </div>

              {/* Pull quote */}
              <blockquote className="relative rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-900 dark:to-zinc-950 border border-zinc-700 p-8 my-8">
                <div className="absolute top-4 left-6 text-6xl text-teal-500/30 font-black leading-none select-none">
                  &ldquo;
                </div>
                <p className="relative text-xl font-bold text-white leading-relaxed text-center">
                  The era of the AI-assisted coach is not coming. It&apos;s here.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="h-px w-8 bg-teal-500/50" />
                  <p className="text-xs font-bold text-teal-400 uppercase tracking-widest">
                    {ARTICLE.author.name}
                  </p>
                  <div className="h-px w-8 bg-teal-500/50" />
                </div>
              </blockquote>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider pt-0.5 mr-1">
                  Tags:
                </span>
                {ARTICLE.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/explore?tag=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center rounded-full bg-zinc-100 hover:bg-teal-50 hover:text-teal-700 dark:bg-zinc-800 dark:hover:bg-teal-950/30 dark:hover:text-teal-400 border border-transparent hover:border-teal-200 dark:hover:border-teal-900/50 px-3 py-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300 transition-all"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              {/* Share footer row */}
              <div className="flex items-center gap-2 pt-2">
                <FaShareNodes className="size-4 text-zinc-400" />
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Enjoyed this article?
                </span>
                <ShareBar />
              </div>

              {/* Author info card (bottom of article) */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 flex gap-5 items-start shadow-sm">
                <div className="relative size-16 rounded-full overflow-hidden ring-4 ring-zinc-100 dark:ring-zinc-800 shrink-0">
                  <Image
                    src={ARTICLE.author.avatar}
                    alt={ARTICLE.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-50">
                      {ARTICLE.author.name}
                    </h3>
                    <Badge className="bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400 border-none text-[9px] font-bold uppercase tracking-widest">
                      Verified Author
                    </Badge>
                  </div>
                  <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    {ARTICLE.author.followers.toLocaleString()} followers
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                    {ARTICLE.author.bio}
                  </p>
                </div>
              </div>

              {/* ── Comment Section ── */}
              <div className="pt-4">
                <CommentSection />
              </div>

              {/* ── Related Articles ── */}
              <section className="pt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    Related Articles
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      aria-label="Previous"
                      className="flex size-8 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <FaArrowLeft className="size-3" />
                    </button>
                    <button
                      aria-label="Next"
                      className="flex size-8 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <FaArrowRight className="size-3" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {RELATED_ARTICLES.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            </article>

            {/* ── RIGHT: Sidebar ── */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                <ArticleSidebar
                  author={SIDEBAR_AUTHOR}
                  tags={SIDEBAR_TAGS}
                  topPosts={SIDEBAR_TOP_POSTS}
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
