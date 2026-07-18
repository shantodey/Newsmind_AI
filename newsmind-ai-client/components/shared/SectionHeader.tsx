"use client";

import * as React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  onPrev?: () => void;
  onNext?: () => void;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  badge,
  onPrev,
  onNext,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-100 pb-4 dark:border-zinc-800 ${className}`}>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {badge && (
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30 px-2 py-0.5 rounded">
              {badge}
            </span>
          )}
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {subtitle}
          </p>
        )}
      </div>

      {(onPrev || onNext) && (
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onPrev && (
            <button
              onClick={onPrev}
              className="flex items-center justify-center h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
              aria-label="Previous"
            >
              <FaChevronLeft className="size-3.5" />
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              className="flex items-center justify-center h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
              aria-label="Next"
            >
              <FaChevronRight className="size-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
