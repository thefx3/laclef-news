"use client";

import type { Post } from "@/lib/types";
import { formatShortFR } from "@/lib/calendarUtils";
import { Modal } from "./Modal";

type Props = {
  post: Post;
  onClose: () => void;
};

export function PostModal({ post, onClose }: Props) {
  return (
    <Modal onClose={onClose}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs font-semibold text-gray-500">{post.type}</div>
          <div className="text-lg font-semibold text-gray-900">{post.title}</div>
        </div>
      </div>
      <dl className="space-y-2 text-sm text-gray-700">
        <div className="flex gap-2">
          <dt className="w-28 text-gray-500">Posté par</dt>
          <dd className="font-medium">{post.authorName}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-28 text-gray-500">Type</dt>
          <dd className="font-medium">{post.type}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-28 text-gray-500">Début</dt>
          <dd>{formatShortFR(post.startAt)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-28 text-gray-500">Fin</dt>
          <dd>{post.endAt ? formatShortFR(post.endAt) : "Même jour"}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-28 text-gray-500">Créé le</dt>
          <dd>{formatShortFR(post.createdAt)}</dd>
        </div>
      </dl>
    </Modal>
  );
}
