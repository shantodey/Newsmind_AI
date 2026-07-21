import Image from "next/image";
import Link from "next/link";
import {
  FaRegLightbulb,
  FaBrain,
  FaRobot,
  FaNewspaper,
  FaChartLine,
  FaShieldHalved,
  FaBolt,
} from "react-icons/fa6";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "About — NewsMind AI",
  description: "Learn about the mission, team, and technology behind NewsMind AI.",
};


const VALUES = [
  { icon: <FaBrain className="size-6 text-teal-500" />, title: "AI-First Thinking", desc: "Every feature is designed around AI augmentation, not automation for its own sake." },
  { icon: <FaShieldHalved className="size-6 text-violet-500" />, title: "Transparency", desc: "We surface bias scores, sentiment confidence, and source credibility alongside every article." },
  { icon: <FaBolt className="size-6 text-amber-500" />, title: "Speed", desc: "Real-time analysis — from raw article ingestion to AI summary in under 3 seconds." },
  { icon: <FaNewspaper className="size-6 text-sky-500" />, title: "Editorial Integrity", desc: "Our AI assists; it never fabricates. We are a tool for journalists, not a replacement." },
];

const TECH_STACK = [
  { name: "Next.js 15", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "shadcn/ui", category: "Frontend" },
  { name: "TanStack Query", category: "Frontend" },
  { name: "Recharts", category: "Frontend" },
  { name: "Express.js", category: "Backend" },
  { name: "MongoDB Atlas", category: "Backend" },
  { name: "Mongoose", category: "Backend" },
  { name: "JWT Auth", category: "Backend" },
  { name: "NLP Pipeline", category: "AI" },
  { name: "Sentiment Engine", category: "AI" },
  { name: "Vector Search", category: "AI" },
  { name: "Auto-Tagger", category: "AI" },
];

const categoryColors: Record<string, string> = {
  Frontend: "bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400 border-sky-200/50",
  Backend: "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400 border-violet-200/50",
  AI: "bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400 border-teal-200/50",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-zinc-50 dark:bg-zinc-950">
        {/* Hero */}
        <section className="relative overflow-hidden bg-zinc-900 py-20 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,184,166,0.12),transparent)]" />
          <div className="relative mx-auto max-w-4xl text-center space-y-6">
            <div className="flex items-center justify-center gap-2.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 text-zinc-900 shadow-sm">
                <FaRegLightbulb className="size-6" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                NewsMind<span className="text-teal-400">.AI</span>
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              We believe everyone deserves<br />
              <span className="text-teal-400">smarter news.</span>
            </h1>
            <p className="text-zinc-300 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              NewsMind AI is an AI-powered news intelligence platform that helps you cut through the noise,
              understand bias, and consume information more intentionally.
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-zinc-300 text-sm font-semibold">
                <FaRobot className="size-4 text-teal-400" />
                Founded in 2026
              </div>
              <span className="text-zinc-600">·</span>
              <div className="flex items-center gap-2 text-zinc-300 text-sm font-semibold">
                <FaChartLine className="size-4 text-teal-400" />
                50K+ Active Users
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge className="bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400 border-none font-bold uppercase tracking-widest text-[10px]">
                  Our Mission
                </Badge>
                <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
                  Making news intelligence<br />accessible to everyone
                </h2>
                <p className="text-zinc-600 dark:text-zinc-300 text-base leading-relaxed font-medium">
                  In a world drowning in information, we built NewsMind AI to be your intelligent reading companion.
                  We process thousands of articles daily, analyze sentiment, detect bias, extract key insights, and
                  surface what actually matters to you — powered by a fine-tuned NLP pipeline.
                </p>
                <p className="text-zinc-600 dark:text-zinc-300 text-base leading-relaxed font-medium">
                  We are not building a replacement for journalism. We are building a tool that makes every
                  reader smarter, faster, and more media-literate.
                </p>
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-video shadow-xl bg-zinc-200 dark:bg-zinc-800">
                <Image
                  src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop"
                  alt="NewsMind AI mission"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-zinc-950/50">
          <div className="mx-auto max-w-7xl space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Our Core Values</h2>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-xl mx-auto">
                Principles that guide every product decision we make.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-900 group-hover:scale-110 transition-transform">
                    {v.icon}
                  </div>
                  <h3 className="font-extrabold text-zinc-900 dark:text-zinc-50">{v.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Tech Stack */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-zinc-950/50">
          <div className="mx-auto max-w-5xl space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Built With</h2>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                Modern, production-grade technology powering every feature.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {TECH_STACK.map((tech) => (
                <span
                  key={tech.name}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-bold ${categoryColors[tech.category]}`}
                >
                  <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-60">{tech.category}</span>
                  <span className="w-px h-3 bg-current opacity-30" />
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-900">
          <div className="mx-auto max-w-2xl text-center space-y-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Ready to read smarter?</h2>
            <p className="text-zinc-400 text-base font-medium">Join thousands of curious readers already using NewsMind AI every day.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center h-11 rounded-lg px-6 font-bold text-sm bg-teal-500 hover:bg-teal-400 text-zinc-950 transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center justify-center h-11 rounded-lg px-6 font-bold text-sm border border-zinc-700 text-white hover:bg-zinc-800 transition-colors"
              >
                Explore Articles
              </Link>
            </div>
          </div>
          
        </section>
      </main>
      <Footer />
    </>
  );
}
