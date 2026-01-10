"use client";

import CalendarView from "@/components/CalendarView";
import { usePostStore } from "@/lib/postStore";

export default function Home() {
  const { posts, setPosts } = usePostStore();

  return (
    <div className="flex flex-1 flex-col gap-4 w-full mx-auto font-sans p-2">
      <main className="flex w-full flex-col justify-between py-2 items-start">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
          Calendrier des évènements
        </h1>
      </main>

      <CalendarView posts={posts} setPosts={setPosts} />
    </div>
  );
}
