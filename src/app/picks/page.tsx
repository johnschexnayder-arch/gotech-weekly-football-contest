import HeroBanner from "@/components/home/HeroBanner";
import DeadlineBanner from "@/components/picks/DeadlineBanner";
import SubmitPicksForm from "@/components/picks/SubmitPicksForm";

import { getCurrentWeek } from "@/lib/games";

export const dynamic = "force-dynamic";

export default async function PicksPage() {
  const week = await getCurrentWeek();

  if (!week) {
    return (
      <main className="space-y-8">
        <section className="rounded-3xl border border-yellow-500/20 bg-white p-8 shadow-xl">
          <div className="text-xs font-black uppercase tracking-[0.35em] text-green-700">
            GOTECH Weekly Football Contest
          </div>

          <h1 className="mt-2 text-3xl font-black text-green-950">
            Picks
          </h1>

          <p className="mt-3 text-slate-500">
            The next contest week has not been created yet.
          </p>
        </section>
      </main>
    );
  }

  const isLocked =
    week.status !== "OPEN" ||
    new Date(week.deadline).getTime() <= Date.now();

  const games = week.games.map((game, index) => ({
    id: game.id,
    game_number: index + 1,
    sport: "Football",
    away_team: game.awayTeam,
    home_team: game.homeTeam,
  }));

  return (
    <main className="space-y-8">
      <HeroBanner
        weekNumber={week.weekNumber}
        deadline={week.deadline}
        gameCount={games.length}
      />

      <DeadlineBanner
        deadline={week.deadline}
        isLocked={isLocked}
      />

      <SubmitPicksForm
        games={games}
        weekId={week.id}
        weekNumber={week.weekNumber}
        tiebreakerGameId={week.tiebreakerGameId}
        isLocked={isLocked}
      />
    </main>
  );
}