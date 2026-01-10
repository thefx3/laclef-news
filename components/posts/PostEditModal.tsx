"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import type { Post, PostType } from "@/lib/types";
import { TYPE_OPTIONS } from "./types";
import { Modal } from "../calendar/Modal";
import { startOfDay } from "@/lib/calendarUtils";

type Props = {
  post: Post;
  onSave: (updated: Post) => void;
  onDelete: (post: Post) => void;
};

export function PostEditModal({ post, onSave, onDelete }: Props) {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description ?? "");
  const [type, setType] = useState<PostType>(
    post.type === "A_LA_UNE" ? "EVENT" : post.type
  );
  const [isFeatured, setIsFeatured] = useState(post.type === "A_LA_UNE");
  const [startDate, setStartDate] = useState(() => toInputDate(post.startAt));
  const [endDate, setEndDate] = useState(() =>
    post.endAt ? toInputDate(post.endAt) : ""
  );
  const [author, setAuthor] = useState(post.authorName);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !startDate) return;

    const startAt = startOfDay(new Date(startDate));
    const endAt = endDate ? startOfDay(new Date(endDate)) : undefined;
    const finalType = isFeatured ? "A_LA_UNE" : type;

    const updated: Post = {
      ...post,
      title: title.trim(),
      description: description.trim() || undefined,
      type: finalType,
      startAt,
      endAt,
      authorName: author.trim() || "Inconnu",
      lastEditedAt: new Date(),
    };

    onSave(updated);
  }

  return (
    <Modal onClose={() => onSave(post)}>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-800" htmlFor="edit-title">
            Titre
          </label>
          <input
            id="edit-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>

        {/* <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-800" htmlFor="edit-author">
            Auteur
          </label>
          <input
            id="edit-author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div> */}

        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-800" htmlFor="edit-description">
            Evènement
          </label>
          <textarea
            id="edit-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-800" htmlFor="edit-type">
            Type d&apos;évènement
          </label>
          <select
            id="edit-type"
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

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-800" htmlFor="edit-start-date">
            Date de début
          </label>
          <input
            id="edit-start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-800" htmlFor="edit-end-date">
            Date de fin (optionnel)
          </label>
          <input
            id="edit-end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="md:col-span-2 flex justify-between">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
            onClick={() => onDelete(post)}
          >
            Supprimer
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              onClick={() => onSave(post)}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
            >
              <Calendar className="h-4 w-4" aria-hidden />
              Mettre à jour
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

function toInputDate(d: Date) {
  return new Date(d).toISOString().slice(0, 10);
}
