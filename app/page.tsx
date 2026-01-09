import Image from "next/image";
import { Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto font-sans">
      <header className="flex w-full border px-4 py-3 rounded-xl bg-white shadow-sm">
        Something to write here !
      </header>

      <div className="flex flex-col w-full px-4 py-4 rounded-xl transition-colors text-gray-900 bg-[linear-gradient(100deg,#D2F3FC,#FACFCE)] shadow-sm">
        <h1 className="w-full rounded-full text-xl font-bold mb-3">
          Poster un évènement
        </h1>

        <form className="flex flex-col gap-3 w-full">
          <label className="text-sm font-medium text-gray-800" htmlFor="event-title">
            Titre de l&#39;évènement
          </label>
          <input
            id="event-title"
            type="text"
            name="title"
            placeholder="Ex: Assemblée générale"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          <label className="text-sm font-medium text-gray-800" htmlFor="event-details">
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

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="w-5 h-5" aria-hidden />
          <span>Date à définir</span>
        </div>
      </div>

      <main className="flex w-full flex-col items-center justify-between bg-white rounded-xl shadow-sm p-6 sm:items-start">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white sm:text-6xl">
          Welcome to La CLEF News
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
          Stay updated with the latest news from La CLEF.
        </p>
        <Image
          src="/logo.png"
          alt="La CLEF Logo"
          width={200}
          height={200}
          className="mt-8"
        />
      </main>
    </div>
  );
}
