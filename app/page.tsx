import CalendarView from "@/components/CalendarView";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 w-full mx-auto font-sans p-2">
      <main className="flex w-full flex-col justify-between py-2 items-start">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
          Calendrier des évènements
        </h1>
      </main>

      <CalendarView />
    
    </div>
  );
}
