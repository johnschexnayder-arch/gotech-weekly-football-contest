import { Trophy, BarChart3 } from "lucide-react";

import { supabase } from "@/lib/supabase";
import YourResults from "@/components/results/YourResults";
import { CurrentWeek } from "@/lib/games";

export const dynamic = "force-dynamic";

type WeeklyResult = {
  playerId: string;
  playerName: string;
  score: number;
  correct: number;
  hasEntry: boolean;
};

export default async function ResultsPage() {
  const { data: completedWeek, error: weekError } =
    await supabase
      .from("weeks")
      .select(
        "id, week_number, deadline, status, tiebreaker_game_id, tiebreaker_winner, tiebreaker_total_points, tiebreaker_home_points"
      )
      .eq("status", "COMPLETED")
      .order("week_number", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

  if (weekError) {
    throw new Error(
      weekError.message
    );
  }

  if (!completedWeek) {
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
              No completed weeks yet.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const { data: games, error: gamesError } =
    await supabase
      .from("games")
      .select(
        "id, game_number, away_team, home_team, winner"
      )
      .eq(
        "week_id",
        completedWeek.id
      )
      .order(
        "game_number"
      );

  if (gamesError) {
    throw new Error(
      gamesError.message
    );
  }

  const tiebreakerGame =
    (games ?? []).find(
      (game) =>
        game.id ===
        completedWeek.tiebreaker_game_id
    ) ?? null;

  const { data: players, error: playersError } =
    await supabase
      .from("players")
      .select(
        "id, name"
      )
      .order(
        "name"
      );

  if (playersError) {
    throw new Error(
      playersError.message
    );
  }

  const { data: entries, error: entriesError } =
    await supabase
      .from("entries")
      .select(
        "id, player_id, score"
      )
      .eq(
        "week_id",
        completedWeek.id
      );

  if (entriesError) {
    throw new Error(
      entriesError.message
    );
  }

  const entryIds =
    (entries ?? []).map(
      (entry) => entry.id
    );

  let picks: {
    entry_id: string;
    game_id: string;
    is_correct: boolean | null;
  }[] = [];

  if (entryIds.length > 0) {
    const {
      data: pickData,
      error: picksError,
    } = await supabase
      .from("picks")
      .select(
        "entry_id, game_id, is_correct"
      )
      .in(
        "entry_id",
        entryIds
      );

    if (picksError) {
      throw new Error(
        picksError.message
      );
    }

    picks =
      pickData ?? [];
  }

  const results: WeeklyResult[] =
    (players ?? []).map(
      (player) => {
        const entry =
          (entries ?? []).find(
            (item) =>
              item.player_id ===
              player.id
          );

        const playerPicks =
          entry
            ? picks.filter(
                (pick) =>
                  pick.entry_id ===
                  entry.id
              )
            : [];

        const correct =
          playerPicks.filter(
            (pick) =>
              pick.is_correct === true
          ).length;

        return {
          playerId:
            player.id,

          playerName:
            player.name,

          score:
            entry?.score ?? 0,

          correct,

          hasEntry:
            !!entry,
        };
      }
    );

  results.sort(
    (a, b) => {
      if (
        b.score !==
        a.score
      ) {
        return (
          b.score -
          a.score
        );
      }

      if (
        b.correct !==
        a.correct
      ) {
        return (
          b.correct -
          a.correct
        );
      }

      return a.playerName.localeCompare(
        b.playerName
      );
    }
  );

  const week: CurrentWeek = {
    id:
      completedWeek.id,

    weekNumber:
      completedWeek.week_number,

    deadline:
      completedWeek.deadline,

    status:
      "COMPLETED",

    tiebreakerGameId:
      completedWeek.tiebreaker_game_id ??
      null,

    games:
      (games ?? []).map(
        (game) => ({
          id:
            game.id,

          awayTeam:
            game.away_team,

          homeTeam:
            game.home_team,

          winner:
            game.winner ??
            null,
        })
      ),
  };

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
            Week{" "}
            {completedWeek.week_number}{" "}
            results and player performance.
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-yellow-500/20 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-yellow-500" />

            <h2 className="text-xl font-bold text-green-900">
              Week{" "}
              {completedWeek.week_number}{" "}
              Results
            </h2>
          </div>

          <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-900">
            {results.length} Players
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-950 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide">
                  Rank
                </th>

                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide">
                  Player
                </th>

                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide">
                  Correct
                </th>

                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide">
                  Score
                </th>
              </tr>
            </thead>

            <tbody>
              {results.map(
                (result, index) => (
                  <tr
                    key={
                      result.playerId
                    }
                    className="border-t border-slate-100 transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">
                      <span className="font-black text-green-950">
                        {index + 1}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-900">
                        {result.playerName}
                      </div>

                      {!result.hasEntry && (
                        <div className="text-xs font-semibold text-slate-400">
                          No entry submitted
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <span className="font-semibold text-slate-700">
                        {result.correct}/
                        {games?.length ?? 0}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-full bg-green-50 px-4 py-2 font-bold text-green-900">
                        {result.score}{" "}
                        pts
                      </span>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      <YourResults
        week={week}
        tiebreakerGame={
          tiebreakerGame
            ? {
                awayTeam:
                  tiebreakerGame.away_team,

                homeTeam:
                  tiebreakerGame.home_team,

                winner:
                  tiebreakerGame.winner ??
                  null,

                totalPoints:
                  completedWeek.tiebreaker_total_points,

                homePoints:
                  completedWeek.tiebreaker_home_points,
              }
            : null
        }
      />
    </main>
  );
}