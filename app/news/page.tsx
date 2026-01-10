import { Calendar } from "lucide-react";

export default function NewsPage() {
    return (
        <div className="flex flex-col w-full px-4 py-4 h-max rounded-xl transition-colors text-gray-900 bg-[linear-gradient(100deg,#D2F3FC,#FACFCE)] shadow-sm">
        <h1 className="w-full rounded-full text-xl font-bold">
          Poster un évènement
        </h1>

        <form className="flex flex-col gap-2 w-full">

          <label className="text-sm font-medium text-gray-800 mt-4" htmlFor="event-details">
            Détails
          </label>
          <textarea
            id="event-details"
            name="details"
            rows={3}
            placeholder="Description, lieu, intervenants..."
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </form>

        <div className="flex flex-row mt-2 gap-4">
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-700">
            <Calendar className="w-5 h-5" aria-hidden />
            <span>Date à définir</span>
          </div>
          <label className="mt-4 font-bold flex items-center gap-2 text-sm text-red-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-200"
              aria-label="Mettre l'évènement à la une"
            />
            A la une
          </label>
        </div>
      </div>
    )
}