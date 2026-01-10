"use client";

import type { Post } from "@/lib/types";

type Props = {
  posts: Post[];
  remaining: number;
  onSelectPost: (post: Post) => void;
  onShowMore: () => void;
};

export function PostList({ posts, remaining, onSelectPost, onShowMore }: Props) {
  return (
    <ul className="space-y-2">
      {posts.map((post) => (
        <li
          key={post.id}
          className="rounded border bg-gray-50 px-2 py-1 cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => onSelectPost(post)}
          role="button"
        >
          <div className="text-xs font-semibold text-gray-500">{post.type}</div>
          <div className="font-medium">{post.title}</div>
        </li>
      ))}

      {remaining > 0 && (
        <li
          className="text-xs text-gray-500 cursor-pointer underline"
          onClick={onShowMore}
        >
          +{remaining} autres
        </li>
      )}
    </ul>
  );
}
