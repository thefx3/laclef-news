"use client";

import { useState, type ReactNode } from "react";
import type { Post } from "@/lib/types";

type Props = {
  posts: Post[];
};

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatDuration(start: Date, end?: Date) {
  const today = startOfDay(new Date());
  const startDay = startOfDay(start);
  const endDay = end ? startOfDay(end) : startDay;

  const msPerDay = 1000 * 60 * 60 * 24;
  const remaining = Math.max(
    0,
    Math.floor((endDay.getTime() - today.getTime()) / msPerDay) + 1
  );

  if (remaining === 1) return "Dernier jour d'affichage";
  return `${remaining} jours restants`;
}

export function FeaturedSidebar({ posts }: Props) {
  const [selected, setSelected] = useState<Post | null>(null);
  const sorted = [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <nav className="p-4 py-6 rounded-xl bg-white shadow-sm w-full lg:w-64">
      <div className="font-bold tracking-[0.25em] text-xl uppercase text-center mb-4">
        A la une
      </div>
      {sorted.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">Rien pour le moment</p>
      ) : (
        <ul className="space-y-3">
          {sorted.map((post) => (
            <li
              key={post.id}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setSelected(post)}
            >
              <div className="font-semibold text-gray-900 leading-snug">
                {post.title}
              </div>
              <div className="text-xs text-gray-600">
                {formatDuration(post.startAt, post.endAt)}
              </div>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs font-semibold text-gray-500">
                {selected.type}
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {selected.title}
              </div>
            </div>
          </div>
          <dl className="space-y-2 text-sm text-gray-700">
            <div className="flex gap-2">
              <dt className="w-28 text-gray-500">Posté par</dt>
              <dd className="font-medium">{selected.authorName}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 text-gray-500">Type</dt>
              <dd className="font-medium">{selected.type}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 text-gray-500">Début</dt>
              <dd>{formatDuration(selected.startAt, selected.startAt)}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 text-gray-500">Fin</dt>
              <dd>
                {selected.endAt ? formatDuration(selected.startAt, selected.endAt) : "Même jour"}
              </dd>
            </div>
          </dl>
        </Modal>
      )}
    </nav>
  );
}

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
};

function Modal({ children, onClose }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-xl bg-white p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Fermer la fenêtre"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
