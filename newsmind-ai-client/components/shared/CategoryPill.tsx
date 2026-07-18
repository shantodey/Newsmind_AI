"use client";

import * as React from "react";

interface CategoryPillProps {
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function CategoryPill({
  label,
  count,
  active = false,
  onClick,
  className = "",
}: CategoryPillProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer ${
        active
          ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
          : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300"
      } ${className}`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`inline-flex items-center justify-center min-w-4 h-4 text-[10px] px-1 rounded-full ${
            active
              ? "bg-zinc-700 text-zinc-50 dark:bg-zinc-300 dark:text-zinc-900"
              : "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
