"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import {
  FaNewspaper, FaBookmark, FaRobot, FaRegEye,
  FaArrowTrendUp, FaArrowTrendDown, FaChevronRight,
  FaRegClock, FaBell,
} from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { useSession } from "@/lib/auth-client";
import { getArticleStats } from "@/app/actions";
// ─── Mock data ────────────────────────────────────────────────────────────────

const ACTIVITY_DATA = [
  { day: "Mon", articles: 12, ai: 4 },
  { day: "Tue", articles: 19, ai: 7 },
  { day: "Wed", articles: 8, ai: 3 },
  { day: "Thu", articles: 24, ai: 11 },
  { day: "Fri", articles: 17, ai: 8 },
  { day: "Sat", articles: 6, ai: 2 },
  { day: "Sun", articles: 9, ai: 5 },
];

const CATEGORY_DATA = [
  { category: "Technology", count: 48 },
  { category: "Sport", count: 36 },
  { category: "Business", count: 29 },
  { category: "Science", count: 21 },
  { category: "Health", count: 18 },
  { category: "World", count: 14 },
  { category: "AI", count: 34 },
];

const SENTIMENT_DATA = [
  { name: "Positive", value: 54, color: "#10b981" },
  { name: "Neutral", value: 31, color: "#f59e0b" },
  { name: "Negative", value: 15, color: "#f43f5e" },
];

const MONTHLY_DATA = [
  { month: "Jan", reads: 340, bookmarks: 28 },
  { month: "Feb", reads: 410, bookmarks: 35 },
  { month: "Mar", reads: 390, bookmarks: 31 },
  { month: "Apr", reads: 520, bookmarks: 49 },
  { month: "May", reads: 480, bookmarks: 44 },
  { month: "Jun", reads: 610, bookmarks: 58 },
  { month: "Jul", reads: 570, bookmarks: 62 },
];

const RECENT_ACTIVITY = [
  { id: "a1", action: "Read", title: "How AI Is Reshaping Sports Analytics", time: "2 min ago", category: "Sport" },
  { id: "a2", action: "Bookmarked", title: "Federal Reserve Signals Rate Cuts in 2027", time: "18 min ago", category: "Business" },
  { id: "a3", action: "AI Summary", title: "Climate Summit Ends in Landmark Accord", time: "1 hr ago", category: "Climate" },
  { id: "a4", action: "Read", title: "The Quantum Computing Encryption Problem", time: "2 hr ago", category: "Technology" },
  { id: "a5", action: "Commented", title: "Olympics 2028 Infrastructure Ready", time: "3 hr ago", category: "Sport" },
];

const STATS = [
  { label: "Articles Read", value: "1,247", delta: "+12%", up: true, icon: <FaNewspaper className="size-5 text-sky-500" />, bg: "bg-sky-50 dark:bg-sky-950/30" },
  { label: "Bookmarks", value: "83", delta: "+5%", up: true, icon: <FaBookmark className="size-5 text-teal-500" />, bg: "bg-teal-50 dark:bg-teal-950/30" },
  { label: "AI Analyses", value: "248", delta: "+31%", up: true, icon: <FaRobot className="size-5 text-violet-500" />, bg: "bg-violet-50 dark:bg-violet-950/30" },
  { label: "Avg. Daily Reads", value: "17.8", delta: "-3%", up: false, icon: <FaRegEye className="size-5 text-amber-500" />, bg: "bg-amber-50 dark:bg-amber-950/30" },
];

// ─── Reusable chart card ──────────────────────────────────────────────────────

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm space-y-4">
      <div>
        <h3 className="font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ─── Custom Tooltip ────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg p-3 text-xs space-y-1">
      <p className="font-bold text-zinc-900 dark:text-zinc-50">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [activeTab, setActiveTab] = React.useState<"week" | "month">("week");
  const { data: session } = useSession();
  const userName = (session?.user as any)?.name || "Reader";
  const userAvatar = (session?.user as any)?.image || null;
  const userRole = (session?.user as any)?.role;

  const [liveStats, setLiveStats] = React.useState<{ totalPublished?: number; totalViews?: number; totalLikes?: number } | null>(null);

  React.useEffect(() => {
    getArticleStats()
      .then((data) => { if (data) setLiveStats(data); })
      .catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const STATS = [
    { label: "Published Articles", value: liveStats?.totalPublished?.toLocaleString() ?? "—", delta: "+—", up: true, icon: <FaNewspaper className="size-5 text-sky-500" />, bg: "bg-sky-50 dark:bg-sky-950/30" },
    { label: "Total Views", value: liveStats?.totalViews?.toLocaleString() ?? "—", delta: "+—", up: true, icon: <FaRegEye className="size-5 text-amber-500" />, bg: "bg-amber-50 dark:bg-amber-950/30" },
    { label: "Total Likes", value: liveStats?.totalLikes?.toLocaleString() ?? "—", delta: "+—", up: true, icon: <FaBookmark className="size-5 text-teal-500" />, bg: "bg-teal-50 dark:bg-teal-950/30" },
    { label: "AI Analyses", value: "—", delta: "—", up: true, icon: <FaRobot className="size-5 text-violet-500" />, bg: "bg-violet-50 dark:bg-violet-950/30" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative size-12 rounded-full overflow-hidden ring-2 ring-teal-500/30 bg-zinc-200">
                {userAvatar ? (
                  <Image src={userAvatar} alt="User avatar" fill className="object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center bg-teal-500 text-zinc-950 font-extrabold text-lg">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  {greeting}, {userName} 👋
                  {userRole === "admin" && <span className="ml-2 text-xs font-bold text-teal-500 uppercase tracking-widest">Admin</span>}
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                  Here&apos;s your reading intelligence summary.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative flex size-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <FaBell className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-teal-500" />
              </button>
              <Link
                href="/profile"
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                View Profile <FaChevronRight className="size-2.5" />
              </Link>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className={`flex size-10 items-center justify-center rounded-xl ${stat.bg}`}>
                    {stat.icon}
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-bold ${stat.up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}`}>
                    {stat.up ? <FaArrowTrendUp className="size-3" /> : <FaArrowTrendDown className="size-3" />}
                    {stat.delta}
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">{stat.value}</p>
                  <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main charts grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Weekly activity */}
            <ChartCard
              title="Reading Activity"
              subtitle="Articles read vs AI analyses this week"
            >
              <div className="flex gap-2 mb-2">
                {(["week", "month"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                      activeTab === t
                        ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200"
                    }`}
                  >
                    {t === "week" ? "This Week" : "This Month"}
                  </button>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={220}>
                {activeTab === "week" ? (
                  <BarChart data={ACTIVITY_DATA} barSize={14} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-zinc-800" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 600 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
                    <Bar dataKey="articles" name="Articles" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="ai" name="AI Uses" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <AreaChart data={MONTHLY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-zinc-800" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 600 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
                    <Area type="monotone" dataKey="reads" name="Total Reads" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.08} strokeWidth={2} />
                    <Area type="monotone" dataKey="bookmarks" name="Bookmarks" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.08} strokeWidth={2} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </ChartCard>

            {/* Category breakdown */}
            <ChartCard title="Category Breakdown" subtitle="Articles read per topic category">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={CATEGORY_DATA} layout="vertical" barSize={12}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-zinc-800" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fontWeight: 600 }} tickLine={false} axisLine={false} width={90} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Articles" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Sentiment distribution */}
            <ChartCard title="Sentiment Distribution" subtitle="Breakdown of AI-analyzed article sentiments">
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={SENTIMENT_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                      {SENTIMENT_DATA.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`, "Share"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {SENTIMENT_DATA.map((s) => (
                    <div key={s.name} className="flex items-center gap-3">
                      <div className="size-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{s.value}%</p>
                        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{s.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>

            {/* Monthly trend line */}
            <ChartCard title="Monthly Trend" subtitle="Your 7-month reading trajectory">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={MONTHLY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-zinc-800" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 600 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
                  <Line type="monotone" dataKey="reads" name="Total Reads" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 4, fill: "#0ea5e9" }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="bookmarks" name="Bookmarks" stroke="#14b8a6" strokeWidth={2.5} dot={{ r: 4, fill: "#14b8a6" }} activeDot={{ r: 6 }} strokeDasharray="5 3" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Recent activity feed */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Recent Activity</h3>
              <Link href="#" className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {RECENT_ACTIVITY.map((item) => (
                <div key={item.id} className="flex items-center gap-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors">
                  <div className="shrink-0">
                    <Badge
                      className={`text-[9px] font-bold border-none uppercase tracking-widest ${
                        item.action === "Read" ? "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400"
                        : item.action === "Bookmarked" ? "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400"
                        : item.action === "AI Summary" ? "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                      }`}
                    >
                      {item.action}
                    </Badge>
                  </div>
                  <p className="flex-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">{item.title}</p>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium shrink-0">
                    <FaRegClock className="size-3" />
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
