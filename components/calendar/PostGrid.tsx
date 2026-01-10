"use client";

import type { Post } from "@/lib/types";

type Props = {
  posts: Post[];
  onSelectPost: (post: Post) => void;
};

export function PostGrid({ posts, onSelectPost }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
      {posts.map((post) => (
        <div
          key={post.id}
          className="rounded border bg-gray-50 px-2 py-2 h-full cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => onSelectPost(post)}
        >
          <div className="text-xs font-semibold text-gray-500">{post.type}</div>
          <div className="font-medium">{post.title}</div>
        </div>
      ))}
    </div>
  );
}
