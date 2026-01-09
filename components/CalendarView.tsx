"use client";

import { useMemo, useState } from "react";

type Mode = "3 jours" | "1 semaine" | "1 mois";

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

/** Ajoute N mois (utile pour les flèches en mode "1 mois") */
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

export default function CalendarView() {
  const [mode, setMode] = useState<Mode>("1 semaine");
  const [cursor, setCursor] = useState<Date>(() => startOfDay(new Date()));
  const today = startOfDay(new Date());

  // 1) Calcul de la période (start/end) en fonction du mode + cursor
  const { periodStart, periodEnd } = useMemo(() => {
    if (mode === "3 jours") {
      const start = startOfDay(cursor);
      const end = addDays(start, 2);
      return { periodStart: start, periodEnd: end };
    }

    if (mode === "1 semaine") {
      const start = startOfWeekMonday(cursor);
      const end = addDays(start, 6);
      return { periodStart: start, periodEnd: end };
    }

    // mode === "1 mois"
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
    if (mode === "3 jours") setCursor((c) => addDays(c, -3));
    else if (mode === "1 semaine") setCursor((c) => addDays(c, -7));
    else setCursor((c) => addMonths(c, -1));
  }

  function goNext() {
    if (mode === "3 jours") setCursor((c) => addDays(c, 3));
    else if (mode === "1 semaine") setCursor((c) => addDays(c, 7));
    else setCursor((c) => addMonths(c, 1));
  }

  // 4) Quand on change de mode, on se recale sur "aujourd’hui" (comportement MVP simple)
  function setModeAndReset(newMode: Mode) {
    setMode(newMode);
    setCursor(startOfDay(new Date()));
  }

  // 5) Grille responsive
  const gridCols =
    mode === "3 jours"
      ? "grid-cols-1 sm:grid-cols-3"
      : mode === "1 semaine"
      ? "grid-cols-2 sm:grid-cols-4 lg:grid-cols-7"
      : "grid-cols-2 sm:grid-cols-4 lg:grid-cols-6";

  function formatLabelByMode(day: Date) {
    if (mode === "3 jours") {
      const label = formatDayLabelFR(day);
      return label.charAt(0).toUpperCase() + label.slice(1);
    }
    if (mode === "1 semaine") {
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

  const buttonBase =
    "px-3 py-2 rounded-lg border text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

  return (
    <section className="w-full">
      {/* Choix du mode */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={`${buttonBase} ${
            mode === "3 jours"
              ? "bg-blue-100 text-blue-800 border-blue-200"
              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
          }`}
          onClick={() => setModeAndReset("3 jours")}
        >
          3 jours
        </button>
        <button
          className={`${buttonBase} ${
            mode === "1 semaine"
              ? "bg-blue-100 text-blue-800 border-blue-200"
              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
          }`}
          onClick={() => setModeAndReset("1 semaine")}
        >
          1 semaine
        </button>
        <button
          className={`${buttonBase} ${
            mode === "1 mois"
              ? "bg-blue-100 text-blue-800 border-blue-200"
              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
          }`}
          onClick={() => setModeAndReset("1 mois")}
        >
          1 mois
        </button>
      </div>

      {/* Récap période + flèches */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={goPrev}
          className={`${buttonBase} bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100`}
          aria-label="Période précédente"
        >
          ←
        </button>

        <div className="text-sm font-semibold text-gray-900">
          {mode} : du {formatShortFR(periodStart)} au {formatShortFR(periodEnd)}
        </div>

        <button
          onClick={goNext}
          className={`${buttonBase} bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100`}
          aria-label="Période suivante"
        >
          →
        </button>
      </div>

      {/* Grille des jours */}
      <div className={`mt-4 grid ${gridCols} gap-2`}>
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className="border rounded-lg bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md"
          >
            <div
              className={`px-3 py-2 font-semibold ${
                isSameDay(day, today)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {formatLabelByMode(day)}
            </div>
            <div className="p-4 text-sm text-gray-600">Évènements du jour...</div>
          </div>
        ))}
      </div>
    </section>
  );
}
