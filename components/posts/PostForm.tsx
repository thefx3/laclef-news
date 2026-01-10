"use client";

import { Calendar } from "lucide-react";
import { useState } from "react";
import type { Post, PostType } from "@/lib/types";
import { sortByCreatedDesc, startOfDay } from "@/lib/calendarUtils";
import { TYPE_OPTIONS } from "./types";

type Props = {
  onAdd: (posts: Post[]) => void;
  posts: Post[];
};

export function PostForm({ onAdd, posts }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<PostType>("EVENT");
  const [isFeatured, setIsFeatured] = useState(false);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState("");
  const [author, setAuthor] = useState("Vous");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !startDate) return;

    const startAt = startOfDay(new Date(startDate));
    const endAt = endDate ? startOfDay(new Date(endDate)) : undefined;
    const finalType = isFeatured ? "A_LA_UNE" : type;

    const newPost: Post = {
      id: `local-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      type: finalType,
      startAt,
      endAt,
      authorName: author.trim() || "Inconnu",
      createdAt: new Date(),
      lastEditedAt: new Date(),
    };

    const next = sortByCreatedDesc([newPost, ...posts]);
    onAdd(next);

    setTitle("");
    setDescription("");
    setEndDate("");
    setIsFeatured(false);
  }

  return (
    <section className="bg-[linear-gradient(100deg,#D2F3FC,#FACFCE)] p-4 rounded-xl">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">Poster un évènement</h1>
      </header>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>

      <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-800" htmlFor="type">
            Type d&apos;évènement
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as PostType)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
            disabled={isFeatured}
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700 mt-1">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-200"
            />
            Mettre l&apos;évènement à la une
          </label>
        </div>

        <div className="flex flex-row gap-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-800" htmlFor="start-date">
              Date de début
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-800" htmlFor="end-date">
            Date de fin (optionnel)
          </label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>



        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-800" htmlFor="description">
            Détails
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description, lieu, intervenants..."
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* <div className="md:col-span-2 flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-800" htmlFor="author">
            Auteur
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div> */}

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
          >
            <Calendar className="h-4 w-4" aria-hidden />
            Publier l&apos;évènement
          </button>
        </div>
      </form>
    </section>
  );
}
