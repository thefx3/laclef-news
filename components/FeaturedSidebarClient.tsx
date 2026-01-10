"use client";

import { useMemo, useState } from "react";
import { FeaturedSidebar } from "./FeaturedSidebar";
import { usePostsContext } from "@/components/PostsProvider";
import { PostModal } from "@/components/calendar/PostModal";
import { PostEditModal } from "@/components/posts/PostEditModal";
import { useAuth } from "@/components/AuthGate";
import type { Post } from "@/lib/types";

export function FeaturedSidebarClient() {
  const { posts, loading, error, updatePost, deletePost } = usePostsContext();
  const { isGuest } = useAuth();
  const [selected, setSelected] = useState<Post | null>(null);
  const [editing, setEditing] = useState<Post | null>(null);

  const featured = useMemo(
    () => posts.filter((post) => post.type === "A_LA_UNE"),
    [posts]
  );

  return (
    <div className="w-full lg:w-64">
      {loading && <p className="text-sm text-gray-500 p-4">Chargement...</p>}
      {error && (
        <p className="text-sm text-red-600 p-4">
          Erreur lors du chargement.
        </p>
      )}
      <FeaturedSidebar posts={featured} onSelect={setSelected} />

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
