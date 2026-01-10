"use client";

import { useMemo, useState } from "react";

import { PostModal } from "@/components/calendar/PostModal";
import { PostFilters } from "@/components/posts/PostFilters";
import { PostForm } from "@/components/posts/PostForm";
import { PostList } from "@/components/posts/PostList";
import { type FilterMode } from "@/components/posts/types";
import { PostEditModal } from "@/components/posts/PostEditModal";
import { usePostsContext } from "@/components/PostsProvider";

import type { Post } from "@/lib/types";
import {
  addDays,
  isSameDay,
  sortByCreatedDesc,
  startOfDay,
  toDateInputValue,
} from "@/lib/calendarUtils";

export default function PostsPage() {
  const { posts, loading, error, createPost, updatePost, deletePost } =
    usePostsContext();
  const [selected, setSelected] = useState<Post | null>(null);
  const [editing, setEditing] = useState<Post | null>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [filterDate, setFilterDate] = useState(() => toDateInputValue(new Date()));

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
      <PostForm onCreate={createPost} />

      <section>
        <PostFilters
          filterMode={filterMode}
          filterDate={filterDate}
          onChangeMode={setFilterMode}
          onChangeDate={setFilterDate}
        />

        {loading && <p className="text-sm text-gray-500">Chargement...</p>}
        {error && (
          <p className="text-sm text-red-600">
            Erreur lors du chargement des posts.
          </p>
        )}
        <PostList
          posts={filteredPosts}
          onSelect={setSelected}
          onEdit={(post) => {
            setEditing(post);
            setSelected(null);
          }}
          onDelete={(post) => {
            void deletePost(post);
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
            void deletePost(post);
            setSelected(null);
          }}
        />
      )}
      {editing && (
        <PostEditModal
          key={editing.id}
          post={editing}
          onSave={(updated) => {
            void updatePost(updated);
            setEditing(null);
          }}
          onDelete={(post) => {
            void deletePost(post);
            setEditing(null);
          }}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}
