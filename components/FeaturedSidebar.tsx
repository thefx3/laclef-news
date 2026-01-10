"use client";

import { useState } from "react";
import type { Post } from "@/lib/types";
import { formatRemainingDays, sortByCreatedDesc } from "@/lib/calendarUtils";
import { PostModal } from "./calendar/PostModal";

type Props = {
  posts: Post[];
};

export function FeaturedSidebar({ posts }: Props) {
  const [selected, setSelected] = useState<Post | null>(null);
  const sorted = sortByCreatedDesc(posts);

  return (
    <nav className="p-4 py-6 rounded-xl bg-white shadow-sm w-full lg:w-64">
      <div className="font-bold tracking-[0.25em] text-xl uppercase text-center mb-4">
        A la une
      </div>
      {sorted.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">Rien pour le moment</p>
      ) : (
        <ul className="space-y-3">
          {sorted.map((post) => (
            <li
              key={post.id}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setSelected(post)}
            >
              <div className="font-semibold text-gray-900 leading-snug">
                {post.title}
              </div>
              <div className="text-xs text-gray-600">
                {formatRemainingDays(post.startAt, post.endAt)}
              </div>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <PostModal post={selected} onClose={() => setSelected(null)} />
      )}
    </nav>
  );
}
