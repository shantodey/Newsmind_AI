"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import {
  FaEnvelope,
  FaPhone,
  FaLocationDot,
  FaCircleCheck,
  FaXTwitter,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

type ContactValues = { name: string; email: string; subject: string; message: string };

const CONTACT_INFO = [
  { icon: <FaEnvelope className="size-5 text-teal-500" />, label: "Email", value: "hello@newsmind.ai", href: "mailto:hello@newsmind.ai" },
  { icon: <FaPhone className="size-5 text-teal-500" />, label: "Phone", value: "+1 (555) 012-3456", href: "tel:+15550123456" },
  { icon: <FaLocationDot className="size-5 text-teal-500" />, label: "Office", value: "350 5th Avenue, New York, NY 10118" },
];

const FAQ = [
  { q: "Is NewsMind AI free to use?", a: "Yes — our core features are completely free. A Pro tier unlocks unlimited AI summaries, advanced analytics, and priority chat access." },
  { q: "Which news sources do you cover?", a: "We index 180+ sources across 40 countries, including major international outlets, regional papers, and specialist publications." },
  { q: "How does the sentiment analysis work?", a: "Our NLP pipeline is fine-tuned on 12M+ labeled news articles and outputs Positive / Neutral / Negative scores with confidence percentages." },
  { q: "Is my reading data private?", a: "Absolutely. All reading history and bookmark data is encrypted at rest and never sold to third parties. See our Privacy Policy for full details." },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactValues>();

  const onSubmit = async (data: ContactValues) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    console.log("Contact form:", data);
    setLoading(false);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <Navbar />
      <main className="bg-zinc-50 dark:bg-zinc-950">
        {/* Hero */}
        <section className="bg-zinc-900 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,184,166,0.1),transparent)]" />
          <div className="relative mx-auto max-w-3xl text-center space-y-4">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Get in Touch</h1>
            <p className="text-zinc-400 text-lg font-medium">
              Have a question, feature request, or partnership inquiry? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-[1fr_420px] gap-12 xl:gap-16">
            {/* Left — form */}
            <div className="space-y-8">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-sm">
                <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-6 tracking-tight">Send a Message</h2>

                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4 text-center animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <FaCircleCheck className="size-12 text-teal-500" />
                    <h3 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">Message sent!</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium max-w-xs">
                      Thanks for reaching out. We typically respond within 24 hours on business days.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Full Name *</label>
                        <input
                          placeholder="Jane Doe"
                          className={`w-full h-10 rounded-lg border bg-zinc-50 dark:bg-zinc-900 px-3 text-sm font-medium text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all ${errors.name ? "border-rose-400" : "border-zinc-200 dark:border-zinc-700"}`}
                          {...register("name", { required: "Name is required" })}
                        />
                        {errors.name && <p className="text-xs font-medium text-rose-500">{errors.name.message}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Email *</label>
                        <input
                          type="email"
                          placeholder="jane@example.com"
                          className={`w-full h-10 rounded-lg border bg-zinc-50 dark:bg-zinc-900 px-3 text-sm font-medium text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all ${errors.email ? "border-rose-400" : "border-zinc-200 dark:border-zinc-700"}`}
                          {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                        />
                        {errors.email && <p className="text-xs font-medium text-rose-500">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Subject *</label>
                      <input
                        placeholder="General inquiry / Bug report / Partnership"
                        className={`w-full h-10 rounded-lg border bg-zinc-50 dark:bg-zinc-900 px-3 text-sm font-medium text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all ${errors.subject ? "border-rose-400" : "border-zinc-200 dark:border-zinc-700"}`}
                        {...register("subject", { required: "Subject is required" })}
                      />
                      {errors.subject && <p className="text-xs font-medium text-rose-500">{errors.subject.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Message *</label>
                      <Textarea
                        placeholder="Tell us how we can help..."
                        rows={5}
                        className={`resize-none rounded-lg bg-zinc-50 dark:bg-zinc-900 text-sm font-medium text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all ${errors.message ? "border-rose-400" : "border-zinc-200 dark:border-zinc-700"}`}
                        {...register("message", { required: "Message is required", minLength: { value: 20, message: "Please write at least 20 characters" } })}
                      />
                      {errors.message && <p className="text-xs font-medium text-rose-500">{errors.message.message}</p>}
                    </div>

                    <Button type="submit" disabled={loading} className="w-full h-11 font-bold rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </div>

              {/* FAQ */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-sm space-y-6">
                <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Frequently Asked</h2>
                <div className="space-y-5">
                  {FAQ.map((item) => (
                    <div key={item.q} className="space-y-1.5 pb-5 border-b border-zinc-100 dark:border-zinc-800 last:border-0 last:pb-0">
                      <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50">{item.q}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — contact info */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-sm space-y-6">
                <h2 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Contact Details</h2>
                <div className="space-y-5">
                  {CONTACT_INFO.map((info) => (
                    <div key={info.label} className="flex gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950/30">
                        {info.icon}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{info.label}</p>
                        {"href" in info && info.href ? (
                          <a href={info.href} className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{info.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-5 space-y-3">
                  <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Follow Us</p>
                  <div className="flex gap-3">
                    {[
                      { icon: <FaXTwitter className="size-4" />, label: "Twitter" },
                      { icon: <FaLinkedinIn className="size-4" />, label: "LinkedIn" },
                      { icon: <FaGithub className="size-4" />, label: "GitHub" },
                    ].map(({ icon, label }) => (
                      <button
                        key={label}
                        aria-label={label}
                        className="flex size-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50 transition-all"
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Response time badge */}
              <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 p-6 text-white space-y-3">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-teal-300 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-teal-200">Team Status</span>
                </div>
                <p className="text-lg font-extrabold">We&apos;re Online</p>
                <p className="text-sm text-teal-100 font-medium">
                  Average response time: <span className="font-bold text-white">{"<"} 4 hours</span> on business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
