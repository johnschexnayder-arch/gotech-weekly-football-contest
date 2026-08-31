import HeroBanner from "@/components/home/HeroBanner";
import SubmitPicksForm from "@/components/picks/SubmitPicksForm";

import { getActiveWeek } from "@/lib/weeks";
import { getGames } from "@/lib/games";

export const dynamic = "force-dynamic";

export default async function PicksPage() {
  const week = await getActiveWeek();

  if (!week) {
    return (
      <main className="space-y-8">
        <div className="rounded-3xl border border-yellow-400/20 bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-black text-green-950">
            No Open Week
          </h1>

          <p className="mt-2 text-slate-500">
            There is currently no open week available for picks.
          </p>
        </div>
      </main>
    );
  }

  const games = await getGames(week.id);

  const isLocked =
    week.status !== "OPEN" ||
    new Date(week.deadline).getTime() <= Date.now();

  return (
    <main className="space-y-8">
      <HeroBanner
        weekNumber={week.week_number}
        deadline={week.deadline}
        gameCount={games.length}
        weekId={week.id}
      />

      <SubmitPicksForm
        games={games}
        weekId={week.id}
        weekNumber={week.week_number}
        tiebreakerGameId={
          week.tiebreaker_game_id
        }
        isLocked={isLocked}
      />
    </main>
  );
}