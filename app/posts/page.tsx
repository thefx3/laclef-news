"use client";

import { useMemo, useState } from "react";

import { PostModal } from "@/components/calendar/PostModal";
import { PostFilters } from "@/components/posts/PostFilters";
import { PostForm } from "@/components/posts/PostForm";
import { PostList } from "@/components/posts/PostList";
import { type FilterMode } from "@/components/posts/types";
import { PostEditModal } from "@/components/posts/PostEditModal";
import { usePostStore } from "@/lib/postStore";
import type { Post } from "@/lib/types";
import {
  addDays,
  isSameDay,
  sortByCreatedDesc,
  startOfDay,
} from "@/lib/calendarUtils";

export default function PostsPage() {
  const { posts, setPosts } = usePostStore();
  const [selected, setSelected] = useState<Post | null>(null);
  const [editing, setEditing] = useState<Post | null>(null);
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
      return base.filter((p) => startOfDay(p.createdAt) >= from);
    }

    if (filterMode === "sinceWeek") {
      const from = startOfDay(addDays(today, -7));
      return base.filter((p) => startOfDay(p.createdAt) >= from);
    }

    if (filterMode === "onDate" && filterDate) {
      const target = startOfDay(new Date(filterDate));
      return base.filter((p) => isSameDay(p.createdAt, target));
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

        <PostList
          posts={filteredPosts}
          onSelect={setSelected}
          onEdit={(post) => {
            setEditing(post);
            setSelected(null);
          }}
          onDelete={(post) => {
            setPosts((prev) => prev.filter((p) => p.id !== post.id));
            if (selected?.id === post.id) setSelected(null);
            if (editing?.id === post.id) setEditing(null);
          }}
        />
      </section>

      {selected && (
        <PostModal
          post={selected}
          onClose={() => setSelected(null)}
          onEdit={(post) => {
            setEditing(post);
            setSelected(null);
          }}
          onDelete={(post) => {
            setPosts((prev) => prev.filter((p) => p.id !== post.id));
            setSelected(null);
          }}
        />
      )}
      {editing && (
        <PostEditModal
          post={editing}
          allPosts={posts}
          onSave={(updated) => {
            setPosts((prev) =>
              sortByCreatedDesc(prev.map((p) => (p.id === updated.id ? updated : p)))
            );
            setEditing(null);
          }}
          onDelete={(post) => {
            setPosts((prev) => prev.filter((p) => p.id !== post.id));
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
