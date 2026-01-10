"use client";

import type { ArchiveFilterMode } from "./types";
import { cn } from "@/components/posts/cn";

type Props = {
  mode: ArchiveFilterMode;
  onChange: (mode: ArchiveFilterMode) => void;
};

export function MyPostsFilters({ mode, onChange }: Props) {
  const base =
    "px-3 py-2 rounded-lg border text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

  const button = (label: string, value: ArchiveFilterMode) => {
    const isActive = mode === value;
    return (
      <button
        key={value}
        className={cn(
          base,
          isActive
            ? "bg-blue-100 text-blue-800 border-blue-200"
            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
        )}
        onClick={() => onChange(value)}
      >
        <span className="whitespace-nowrap">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm font-semibold text-gray-800">Filtrer :</span>
      {button("Toutes", "all")}
      {button("Passées", "past")}
      {button("Programmées", "scheduled")}
    </div>
  );
}
