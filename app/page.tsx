"use client";

import dynamic from "next/dynamic";
import { usePostsContext } from "@/components/PostsProvider";
import { useAuth } from "@/components/AuthGate";

const CalendarView = dynamic(() => import("@/components/CalendarView"), {
  ssr: false,
});

export default function Home() {
  const { posts, updatePost, deletePost } = usePostsContext();
  const { isGuest } = useAuth();

  return (
    <div className="flex flex-1 flex-col gap-4 w-full mx-auto font-sans p-2">
      <main className="flex w-full flex-col justify-between py-2 items-start">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
          Calendrier des évènements
        </h1>
      </main>

      <CalendarView
        posts={posts}
        onUpdatePost={isGuest ? undefined : updatePost}
        onDeletePost={isGuest ? undefined : deletePost}
      />
    </div>
  );
}
