import { useEffect, useState } from "react";
import { mockPosts } from "./mockPosts";
import { sortByCreatedDesc } from "./calendarUtils";
import type { Post } from "./types";

const STORAGE_KEY = "laclef-posts-v1";
const subscribers = new Set<(posts: Post[]) => void>();
let cache: Post[] | null = null;

function revive(posts: unknown[]): Post[] {
  return posts
    .filter((post): post is Record<string, unknown> => typeof post === "object" && post !== null)
    .map((p) => ({
      ...(p as Post),
      startAt: new Date((p as Post).startAt),
      endAt: (p as Post).endAt ? new Date((p as Post).endAt!) : undefined,
      createdAt: new Date((p as Post).createdAt),
      lastEditedAt: (p as Post).lastEditedAt ? new Date((p as Post).lastEditedAt!) : undefined,
    }));
}

function loadInitial(): Post[] {
  if (cache) return cache;
  cache = sortByCreatedDesc(mockPosts);
  return cache;
}

function readFromStorage(): Post[] | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return revive(JSON.parse(raw));
  } catch {
    return null;
  }
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
    const stored = readFromStorage();
    if (stored) {
      persist(stored);
    }

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
