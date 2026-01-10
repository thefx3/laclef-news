"use client";

import type { Post } from "@/lib/types";
import { formatShortFR } from "@/lib/calendarUtils";
import { Modal } from "./Modal";

type Props = {
  post: Post;
  onClose: () => void;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
};

export function PostModal({ post, onClose, onEdit, onDelete }: Props) {
  return (
    <Modal onClose={onClose}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs font-semibold text-gray-500">{post.type}</div>
          <div className="text-lg font-semibold text-gray-900">{post.title}</div>
        </div>
        {(onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 underline"
                onClick={() => onEdit(post)}
              >
                Modifier
              </button>
            )}
            {onDelete && (
              <button
                className="text-xs font-semibold text-red-600 hover:text-red-700 underline"
                onClick={() => onDelete(post)}
              >
                Supprimer
              </button>
            )}
          </div>
        )}
      </div>
      {post.description && (
        <p className="text-sm text-gray-700 mb-3 whitespace-pre-line">
          {post.description}
        </p>
      )}
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
        {post.lastEditedAt && post.lastEditedAt.getTime() !== post.createdAt.getTime() && (
          <div className="flex gap-2">
            <dt className="w-28 text-gray-500">Modifié le</dt>
            <dd>{formatShortFR(post.lastEditedAt)}</dd>
          </div>
        )}
      </dl>
    </Modal>
  );
}
