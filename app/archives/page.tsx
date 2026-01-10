"use client";

import { useMemo, useState } from "react";

import { useAuth } from "@/components/AuthGate";
import { usePostsContext } from "@/components/PostsProvider";
import { MyPostsFilters } from "@/components/archives/MyPostsFilters";
import type { ArchiveFilterMode } from "@/components/archives/types";
import { PostList } from "@/components/posts/PostList";
import { PostModal } from "@/components/calendar/PostModal";
import { PostEditModal } from "@/components/posts/PostEditModal";
import { sortByCreatedDesc, startOfDay } from "@/lib/calendarUtils";

import type { Post } from "@/lib/types";

export default function MyPostsPage() {
  const { posts, loading, error, updatePost, deletePost } = usePostsContext();
  const { isGuest, session } = useAuth();
  const [filterMode, setFilterMode] = useState<ArchiveFilterMode>("all");
  const [selected, setSelected] = useState<Post | null>(null);
  const [editing, setEditing] = useState<Post | null>(null);

  const filteredPosts = useMemo(() => {
    const userEmail = session?.user?.email?.toLowerCase().trim();
    if (!userEmail) return [];
    const userName = session?.user?.user_metadata?.full_name
      ?.toString()
      .toLowerCase()
      .trim();
    const userHandle = userEmail.split("@")[0];

    const base = sortByCreatedDesc(posts).filter(
      (post) => {
        const email = post.authorEmail?.toLowerCase().trim();
        if (email) return email === userEmail;
        const name = post.authorName.toLowerCase().trim();
        if (name === userHandle) return true;
        if (userName && name === userName) return true;
        return name === "vous";
      }
    );
    const today = startOfDay(new Date());

    if (filterMode === "past") {
      return base.filter((post) => {
        const end = post.endAt ? startOfDay(post.endAt) : startOfDay(post.startAt);
        return end < today;
      });
    }

    if (filterMode === "scheduled") {
      return base.filter((post) => startOfDay(post.startAt) > today);
    }

    return base;
  }, [filterMode, posts, session?.user?.email, session?.user?.user_metadata?.full_name]);

  return (
    <div className="flex flex-1 flex-col gap-4 w-full mx-auto font-sans p-2">
      <main className="flex w-full flex-col justify-between py-2 items-start">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
          Historiques des publications
        </h1>
      </main>

      {isGuest && (
        <p className="text-sm text-amber-700">
          Mode invité : tu ne peux pas accéder à tes publications personnelles.
        </p>
      )}

      <section>
        <MyPostsFilters mode={filterMode} onChange={setFilterMode} />

        {loading && <p className="text-sm text-gray-500">Chargement...</p>}
        {error && (
          <p className="text-sm text-red-600">
            Erreur lors du chargement des posts.
          </p>
        )}
        <PostList
          posts={filteredPosts}
          onSelect={setSelected}
          onEdit={isGuest ? () => {} : (post) => {
            setEditing(post);
            setSelected(null);
          }}
          onDelete={isGuest ? () => {} : (post) => {
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
          onEdit={isGuest ? undefined : (post) => {
            setEditing(post);
            setSelected(null);
          }}
          onDelete={isGuest ? undefined : (post) => {
            void deletePost(post);
            setSelected(null);
          }}
        />
      )}
      {editing && !isGuest && (
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
