import { useEffect, useState } from "react";
import { mockPosts } from "./mockPosts";
import { sortByCreatedDesc } from "./calendarUtils";
import type { Post } from "./types";

const STORAGE_KEY = "laclef-posts-v1";
const subscribers = new Set<(posts: Post[]) => void>();
let cache: Post[] | null = null;

function revive(posts: any[]): Post[] {
  return posts.map((p) => ({
    ...p,
    startAt: new Date(p.startAt),
    endAt: p.endAt ? new Date(p.endAt) : undefined,
    createdAt: new Date(p.createdAt),
    lastEditedAt: p.lastEditedAt ? new Date(p.lastEditedAt) : undefined,
  }));
}

function loadInitial(): Post[] {
  if (cache) return cache;
  if (typeof window !== "undefined") {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        cache = revive(JSON.parse(raw));
        return cache;
      } catch (_e) {
        // ignore parse errors and fall back to mocks
      }
    }
  }
  cache = sortByCreatedDesc(mockPosts);
  return cache;
}

function persist(posts: Post[]) {
  cache = posts;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }
  subscribers.forEach((fn) => fn(posts));
}

export function usePostStore() {
  const [posts, setPosts] = useState<Post[]>(() => loadInitial());

  useEffect(() => {
    const listener = (next: Post[]) => setPosts(next);
    subscribers.add(listener);
    return () => subscribers.delete(listener);
  }, []);

  const updatePosts = (next: Post[] | ((prev: Post[]) => Post[])) => {
    const value = typeof next === "function" ? (next as (prev: Post[]) => Post[])(cache ?? loadInitial()) : next;
    const sorted = sortByCreatedDesc(value);
    persist(sorted);
  };

  return { posts, setPosts: updatePosts };
}
