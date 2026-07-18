"use client";

import * as React from "react";
import Link from "next/link";
import {
  FaRegLightbulb,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaPaperPlane,
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const footerLinks = [
    {
      title: "Platform",
      links: [
        { label: "Overview", href: "/about" },
        { label: "Explore News", href: "/explore" },
        { label: "AI Dashboard", href: "/dashboard" },
        { label: "Pricing", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#" },
        { label: "Community", href: "#" },
        { label: "AI Prompts Guide", href: "#" },
        { label: "API References", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Contact Us", href: "/contact" },
        { label: "Careers", href: "#" },
        { label: "Privacy Policy", href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Info & Newsletter */}
          <div className="space-y-6 xl:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950">
                <FaRegLightbulb className="size-4.5" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                NewsMind<span className="text-teal-600 dark:text-teal-400">.AI</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
              Agentic news analysis, summaries, sentiment modeling, and recommendations. Read less, understand more.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-zinc-400 hover:text-zinc-500 transition-colors">
                <FaTwitter className="size-5" />
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-zinc-500 transition-colors">
                <FaGithub className="size-5" />
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-zinc-500 transition-colors">
                <FaLinkedin className="size-5" />
              </Link>
            </div>
          </div>

          {/* Links Grid */}
          <div className="mt-12 grid grid-cols-3 gap-8 xl:col-span-2 xl:mt-0">
            <div className="grid grid-cols-3 gap-8 col-span-3 sm:col-span-2">
              {footerLinks.map((section) => (
                <div key={section.title} className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Newsletter Subscription Card */}
            <div className="col-span-3 sm:col-span-1 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Subscribe to AI Digest
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Receive weekly automated summaries of the most important global news trends directly in your inbox.
              </p>
              {subscribed ? (
                <div className="rounded-lg bg-teal-50 dark:bg-teal-950/20 p-3 text-xs text-teal-800 dark:text-teal-400 font-semibold text-center border border-teal-100/50">
                  Subscribed successfully!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 w-full rounded border border-zinc-200 bg-white px-3 text-xs font-semibold focus:border-zinc-300 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                  />
                  <Button type="submit" size="icon" className="size-9 cursor-pointer">
                    <FaPaperPlane className="size-3.5" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-100 pt-8 dark:border-zinc-800">
          <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} NewsMind AI. All rights reserved. Built with pnpm, Next.js, and shadcn/ui.
          </p>
        </div>
      </div>
    </footer>
  );
}
