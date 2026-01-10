"use client";

import { useMemo } from "react";
import { usePosts } from "@/lib/usePosts";
import { FeaturedSidebar } from "./FeaturedSidebar";

export function FeaturedSidebarClient() {
  const { posts, loading, error } = usePosts();

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
      <FeaturedSidebar posts={featured} />
    </div>
  );
}
