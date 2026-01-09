

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 w-full mx-auto font-sans">
      <main className="flex w-full flex-col items-center justify-between bg-white rounded-xl shadow-sm p-6 sm:items-start">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
          Welcome to La CLEF News
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
          Stay updated with the latest news from La CLEF.
        </p>
      </main>
    </div>
  );
}
