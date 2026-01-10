"use client";

import { useMemo, useState } from "react";

import { PostModal } from "@/components/calendar/PostModal";
import { PostFilters } from "@/components/posts/PostFilters";
import { PostForm } from "@/components/posts/PostForm";
import { PostList } from "@/components/posts/PostList";
import { TYPE_OPTIONS, type FilterMode } from "@/components/posts/types";
import { mockPosts } from "@/lib/mockPosts";
import type { Post, PostType } from "@/lib/types";
import {
  addDays,
  isSameDay,
  sortByCreatedDesc,
  startOfDay,
} from "@/lib/calendarUtils";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>(() => sortByCreatedDesc(mockPosts));
  const [selected, setSelected] = useState<Post | null>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [filterDate, setFilterDate] = useState(() => new Date().toISOString().slice(0, 10));

  const filteredPosts = useMemo(() => {
    const base = sortByCreatedDesc(posts);
    const today = startOfDay(new Date());

    if (filterMode === "today") {
      return base.filter((p) => isSameDay(p.startAt, today));
    }

    if (filterMode === "sinceYesterday") {
      const from = startOfDay(addDays(today, -1));
      return base.filter((p) => startOfDay(p.startAt) >= from);
    }

    if (filterMode === "sinceWeek") {
      const from = startOfDay(addDays(today, -7));
      return base.filter((p) => startOfDay(p.startAt) >= from);
    }

    if (filterMode === "onDate" && filterDate) {
      const target = startOfDay(new Date(filterDate));
      return base.filter((p) => isSameDay(p.startAt, target));
    }

    return base;
  }, [filterMode, filterDate, posts]);

  return (
    <div className="flex flex-col gap-12 w-full mx-auto font-sans">
      <PostForm posts={posts} onAdd={setPosts} />

      <section>
        <PostFilters
          filterMode={filterMode}
          filterDate={filterDate}
          onChangeMode={setFilterMode}
          onChangeDate={setFilterDate}
        />

        <PostList posts={filteredPosts} onSelect={setSelected} />
      </section>

      {selected && <PostModal post={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
