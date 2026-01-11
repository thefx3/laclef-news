"use client";

import type { FilterMode } from "./types";
import { cn } from "./cn";

type Props = {
  filterMode: FilterMode;
  filterDate: string;
  onChangeMode: (mode: FilterMode) => void;
  onChangeDate: (date: string) => void;
};

export function PostFilters({ filterMode, filterDate, onChangeMode, onChangeDate }: Props) {
  const base =
    "px-3 py-2 rounded-lg border text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:shadow-md cursor-pointer";

  const button = (label: string, mode: FilterMode) => {
    const isActive = filterMode === mode;
    return (
      <button
        key={mode}
        className={cn(
          base,
          isActive
            ? "bg-blue-100 text-blue-800 border-blue-200"
            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
        )}
        onClick={() => onChangeMode(mode)}
      >
        <span className="whitespace-nowrap">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm font-semibold text-gray-800">Filtrer :</span>
      {button("Tous", "all")}
      {button("Aujourd'hui", "today")}
      {button("Depuis hier", "sinceYesterday")}
      {button("Depuis 7 jours", "sinceWeek")}
      <div className="flex items-center gap-2">
        {button("À une date", "onDate")}
        <input
          type="date"
          value={filterDate}
          onChange={(e) => {
            onChangeDate(e.target.value);
            onChangeMode("onDate");
          }}
          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>
    </div>
  );
}
