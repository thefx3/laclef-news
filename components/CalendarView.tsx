"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import type { Post } from "@/lib/types";
import { getPostsForDay } from "@/lib/getPostsForDay";

type CalendarViewProps = {
  posts?: Post[];
};

type Mode = "day" | "3days" | "week" | "month";

const MODES = [
  { key: "day", label: "Aujourd'hui" },
  { key: "3days", label: "3 jours" },
  { key: "week", label: "1 semaine" },
  { key: "month", label: "1 mois" },
] as const;


/** Met une date à 00:00:00 pour éviter les bugs d'heures */
function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Ajoute N jours (sans modifier la date d'origine) */
function addDays(d: Date, days: number) {
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}

/** Lundi = début de semaine (FR) */
function startOfWeekMonday(d: Date) {
  const x = startOfDay(d);
  const dayIndex = (x.getDay() + 6) % 7; // dim(0)->6, lun(1)->0, mar(2)->1...
  return addDays(x, -dayIndex);
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date) {
  // jour 0 du mois suivant = dernier jour du mois courant
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

/** Ajoute N mois (utile pour les flèches en mode "month") */
function addMonths(d: Date, months: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + months);
  return x;
}

/** Format date: 18/01 */
function formatShortFR(d: Date) {
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** Format jour: lun. 18 janv. */
function formatDayLabelFR(d: Date) {
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function sortByCreatedDesc(list: Post[]) {
  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}


export default function CalendarView({ posts = [] }: CalendarViewProps) {
  const [mode, setMode] = useState<Mode>("day");
  const [cursor, setCursor] = useState<Date>(() => startOfDay(new Date()));
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [expandedDay, setExpandedDay] = useState<Date | null>(null);
  const today = startOfDay(new Date());
  const calendarPosts = useMemo(
    () => posts.filter((p) => p.type !== "A_LA_UNE"),
    [posts]
  );

  // 1) Calcul de la période (start/end) en fonction du mode + cursor
  const { periodStart, periodEnd } = useMemo(() => {
    if (mode === "day") {
      const start = startOfDay(cursor);
      return { periodStart: start, periodEnd: start };
    }

    if (mode === "3days") {
      const start = startOfDay(cursor);
      const end = addDays(start, 2);
      return { periodStart: start, periodEnd: end };
    }

    if (mode === "week") {
      const start = startOfWeekMonday(cursor);
      const end = addDays(start, 6);
      return { periodStart: start, periodEnd: end };
    }

    // mode === "month"
    const start = startOfMonth(cursor);
    const end = endOfMonth(cursor);
    return { periodStart: start, periodEnd: end };
  }, [mode, cursor]);

  // 2) Génération des jours à afficher (tous les jours entre start et end)
  const days = useMemo(() => {
    const result: Date[] = [];
    for (let d = periodStart; d <= periodEnd; d = addDays(d, 1)) {
      result.push(d);
    }
    return result;
  }, [periodStart, periodEnd]);

  // 3) Navigation (flèches) : on décale cursor selon le mode
  function goPrev() {
    if (mode === "day") setCursor((c) => addDays(c, -1));
    else if (mode === "3days") setCursor((c) => addDays(c, -3));
    else if (mode === "week") setCursor((c) => addDays(c, -7));
    else setCursor((c) => addMonths(c, -1));
  }

  function goNext() {
    if (mode === "day") setCursor((c) => addDays(c, 1));
    else if (mode === "3days") setCursor((c) => addDays(c, 3));
    else if (mode === "week") setCursor((c) => addDays(c, 7));
    else setCursor((c) => addMonths(c, 1));
  }

  // 4) Quand on change de mode, on se recale sur "aujourd’hui" (comportement MVP simple)
  function setModeAndReset(newMode: Mode) {
    setMode(newMode);
    setCursor(startOfDay(new Date()));
    setExpandedDay(null);
  }

  // 5) Grille responsive
const gridCols =
  mode === "day"
    ? "grid-cols-1"
    : mode === "3days"
    ? "grid-cols-1 sm:grid-cols-3"
    : mode === "week"
    ? "grid-cols-2 sm:grid-cols-4 lg:grid-cols-7"
    : "grid-cols-2 sm:grid-cols-4 lg:grid-cols-6";

  function formatLabelByMode(day: Date) {
    if (mode === "day") {
      const label = formatDayLabelFR(day);
      return label.charAt(0).toUpperCase() + label.slice(1);
    }
    if (mode === "3days") {
      const label = formatDayLabelFR(day);
      return label.charAt(0).toUpperCase() + label.slice(1);
    }
    if (mode === "week") {
      const label = day.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
      });
      return label.charAt(0).toUpperCase() + label.slice(1);
    }
    return day.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    });
  }

  const modeLabel = MODES.find((m) => m.key === mode)?.label ?? mode;

  const isDayMode = mode === "day";

  const buttonBase =
    "px-3 py-2 rounded-lg border text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer";

  const arrowBase =
    "h-10 w-10 pb-2 flex items-center justify-center shrink-0 rounded-lg text-4xl leading-none hover:scale-95 transition-colors cursor-pointer";

  function modeButtonClass(active: boolean) {
    return `${buttonBase} ${
      active
        ? "bg-blue-100 text-blue-800 border-blue-200"
        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:scale-95"
    }`;
  }

  return (
    <section className="w-full">
      
        {/* Choix du mode */}
        <div className="flex flex-wrap gap-2 mb-4">
          {MODES.map((m) => (
            <button
              key={m.key}
              className={modeButtonClass(mode === m.key)}
              onClick={() => setModeAndReset(m.key)}
              >
              {m.label}
            </button>
          ))}
        </div>


        {/* Récap période + flèches */}
        <div className="flex items-center justify-between gap-3 w-full">
          <button
            onClick={goPrev}
            className={`${arrowBase}`}
            aria-label="Période précédente"
          >
            ←
          </button>
          <div className="text-sm font-semibold text-gray-900">
          {modeLabel} : du {formatShortFR(periodStart)} au {formatShortFR(periodEnd)}
          </div>

          <button
            onClick={goNext}
            className={`${arrowBase}`}
            aria-label="Période suivante"
          >
            →
          </button>
        </div>

      {/* Grille des jours */}
      <div className={`mt-4 grid ${gridCols} gap-2`}>
        {days.map((day) => {
          const dayPosts = sortByCreatedDesc(getPostsForDay(calendarPosts, day));
          const postsToShow = isDayMode ? dayPosts : dayPosts.slice(0, 3);
          const remaining = Math.max(0, dayPosts.length - postsToShow.length);

          return (
            <div
              key={day.toISOString()}
              className="border rounded-lg bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md"
            >
              <div
                className={`px-3 py-2 font-semibold cursor-pointer ${
                  isSameDay(day, today)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
                onClick={() => {
                  setMode("day");
                  setCursor(startOfDay(day));
                  setExpandedDay(null);
                }}
              >
                {formatLabelByMode(day)}
              </div>

              <div className="p-2 text-sm text-gray-600">
                {dayPosts.length === 0 ? (
                  <div className="text-gray-400">Aucune publication</div>
                ) : (
                  <>
                    {isDayMode ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                        {postsToShow.map((post) => (
                          <div
                            key={post.id}
                            className="rounded border bg-gray-50 px-2 py-2 h-full cursor-pointer hover:bg-gray-100"
                            onClick={() => setSelectedPost(post)}
                          >
                            <div className="text-xs font-semibold text-gray-500">
                              {post.type}
                            </div>
                            <div className="font-medium">
                              {post.title}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ul className="space-y-2">
                    {postsToShow.map((post) => (
                      <li
                        key={post.id}
                        className="rounded border bg-gray-50 px-2 py-1"
                        onClick={() => setSelectedPost(post)}
                        role="button"
                      >
                        <div className="text-xs font-semibold text-gray-500">
                          {post.type}
                        </div>
                        <div className="font-medium">
                              {post.title}
                            </div>
                          </li>
                        ))}

                        {remaining > 0 && (
                          <li
                            className="text-xs text-gray-500 cursor-pointer underline"
                            onClick={() => setExpandedDay(day)}
                          >
                            +{remaining} autres
                          </li>
                        )}
                      </ul>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal liste des posts pour un jour */}
      {expandedDay && (
        <Modal onClose={() => setExpandedDay(null)}>
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold text-gray-900">
              Évènements du {formatLabelByMode(expandedDay)}
            </div>
          </div>
          <div className="space-y-2">
            {sortByCreatedDesc(getPostsForDay(calendarPosts, expandedDay)).map((post) => (
              <div
                key={post.id}
                className="rounded border bg-gray-50 px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSelectedPost(post);
                  setExpandedDay(null);
                }}
              >
                <div className="text-xs font-semibold text-gray-500">
                  {post.type}
                </div>
                <div className="font-medium text-gray-900">{post.title}</div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Modal détail d’un post */}
      {selectedPost && (
        <Modal onClose={() => setSelectedPost(null)}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs font-semibold text-gray-500">
                {selectedPost.type}
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {selectedPost.title}
              </div>
            </div>
          </div>
          <dl className="space-y-2 text-sm text-gray-700">
            <div className="flex gap-2">
              <dt className="w-28 text-gray-500">Posté par</dt>
              <dd className="font-medium">{selectedPost.authorName}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 text-gray-500">Type</dt>
              <dd className="font-medium">{selectedPost.type}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 text-gray-500">Début</dt>
              <dd>{formatShortFR(selectedPost.startAt)}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 text-gray-500">Fin</dt>
              <dd>
                {selectedPost.endAt
                  ? formatShortFR(selectedPost.endAt)
                  : "Même jour"}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 text-gray-500">Créé le</dt>
              <dd>{formatShortFR(selectedPost.createdAt)}</dd>
            </div>
          </dl>
        </Modal>
      )}

    </section>
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
