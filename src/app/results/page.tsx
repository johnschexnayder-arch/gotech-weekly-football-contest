import { Trophy, BarChart3 } from "lucide-react";

import { getCurrentWeek } from "@/lib/games";
import YourResults from "@/components/results/YourResults";

export default async function ResultsPage() {
  const week = await getCurrentWeek();

  if (!week) {
    return (
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <section className="overflow-hidden rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-white shadow-2xl">
          <div className="p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-500/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-yellow-300">
              <Trophy className="h-4 w-4" />
              GOTECH Weekly Football Contest
            </div>

            <h1 className="mt-5 text-5xl font-black tracking-tight">
              Results
            </h1>

            <p className="mt-3 text-green-100">
              Weekly scores, rankings, and performance.
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-6 py-5">
            <BarChart3 className="h-5 w-5 text-yellow-500" />

            <h2 className="text-xl font-bold text-green-900">
              Results
            </h2>
          </div>

          <div className="p-10 text-center">
            <p className="text-lg font-semibold text-slate-600">
              No active week found.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <section className="overflow-hidden rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-white shadow-2xl">
        <div className="p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-500/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-yellow-300">
            <Trophy className="h-4 w-4" />
            GOTECH Weekly Football Contest
          </div>

          <h1 className="mt-5 text-5xl font-black tracking-tight">
            Results
          </h1>

          <p className="mt-3 text-green-100">
            Track your weekly performance and season progress.
          </p>
        </div>
      </section>

      <YourResults week={week} />
    </main>
  );
}