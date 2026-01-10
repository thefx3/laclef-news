"use client";

import type { Post } from "@/lib/types";
import { formatShortFR } from "@/lib/calendarUtils";

type Props = {
  posts: Post[];
  onSelect: (post: Post) => void;
};

export function PostList({ posts, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {posts.map((post) => (
        <button
          key={post.id}
          className="text-left rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
          onClick={() => onSelect(post)}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">{post.type}</span>
            <span className="text-xs text-gray-500">Créé le {formatShortFR(post.createdAt)}</span>
          </div>
          <div className="font-semibold text-gray-900 leading-snug">{post.title}</div>
          <div className="text-xs text-gray-600 mt-2">
            Période : {formatShortFR(post.startAt)}
            {post.endAt ? ` → ${formatShortFR(post.endAt)}` : ""}
          </div>
          <div className="text-xs text-gray-600">Par : {post.authorName}</div>
        </button>
      ))}
    </div>
  );
}
