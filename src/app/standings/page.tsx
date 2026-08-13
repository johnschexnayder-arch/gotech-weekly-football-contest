import {
  Trophy,
  Medal,
  Crown,
  Users,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type PlayerStanding = {
  playerId: string;
  playerName: string;
  totalScore: number;
  weeksPlayed: number;
};

export default async function StandingsPage() {
  const {
    data: players,
    error: playersError,
  } = await supabase
    .from("players")
    .select("id, name")
    .order("name");

  if (playersError) {
    throw new Error(playersError.message);
  }

  const {
    data: entries,
    error: entriesError,
  } = await supabase
    .from("entries")
    .select(
      `
      id,
      player_id,
      score,
      weeks (
        id,
        week_number,
        status
      )
      `
    );

  if (entriesError) {
    throw new Error(entriesError.message);
  }

  const completedEntries =
    (entries ?? []).filter(
      (entry: any) =>
        entry.weeks?.status ===
        "COMPLETED"
    );

  const standings: PlayerStanding[] =
    (players ?? []).map((player) => {
      const playerEntries =
        completedEntries.filter(
          (entry: any) =>
            entry.player_id ===
            player.id
        );

      const totalScore =
        playerEntries.reduce(
          (total, entry: any) =>
            total +
            (entry.score ?? 0),
          0
        );

      return {
        playerId: player.id,
        playerName: player.name,
        totalScore,
        weeksPlayed:
          playerEntries.length,
      };
    });

  standings.sort((a, b) => {
    if (
      b.totalScore !==
      a.totalScore
    ) {
      return (
        b.totalScore -
        a.totalScore
      );
    }

    if (
      b.weeksPlayed !==
      a.weeksPlayed
    ) {
      return (
        b.weeksPlayed -
        a.weeksPlayed
      );
    }

    return a.playerName.localeCompare(
      b.playerName
    );
  });

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <section className="overflow-hidden rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-white shadow-2xl">
        <div className="p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-500/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-yellow-300">
            <Trophy className="h-4 w-4" />

            GOTECH Weekly Football Contest
          </div>

          <h1 className="mt-5 text-5xl font-black tracking-tight">
            Season Standings
          </h1>

          <p className="mt-3 max-w-2xl text-green-100">
            See who's leading the
            season and chasing the
            championship.
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-yellow-500" />

            <h2 className="text-xl font-bold text-green-900">
              Leaderboard
            </h2>
          </div>

          <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-900">
            {standings.length} Players
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
                  Weeks
                </th>

                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide">
                  Season Score
                </th>
              </tr>
            </thead>

            <tbody>
              {standings.length ===
              0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-16 text-center text-lg font-semibold text-slate-500"
                  >
                    No players
                    available.
                  </td>
                </tr>
              ) : (
                standings.map(
                  (
                    player,
                    index
                  ) => (
                    <tr
                      key={
                        player.playerId
                      }
                      className="border-t border-slate-100 transition-colors hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center text-lg">
                            {index ===
                            0 ? (
                              "🥇"
                            ) : index ===
                              1 ? (
                              "🥈"
                            ) : index ===
                              2 ? (
                              "🥉"
                            ) : (
                              <span className="text-sm font-bold text-slate-500">
                                {index +
                                  1}
                              </span>
                            )}
                          </div>

                          {index ===
                            0 && (
                            <Crown className="h-5 w-5 text-yellow-500" />
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-bold text-green-900">
                            {player.playerName
                              .split(
                                " "
                              )
                              .map(
                                (
                                  name
                                ) =>
                                  name[0]
                              )
                              .join(
                                ""
                              )
                              .substring(
                                0,
                                2
                              )
                              .toUpperCase()}
                          </div>

                          <div>
                            <div className="font-bold text-slate-900">
                              {
                                player.playerName
                              }
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="font-semibold text-slate-700">
                          {
                            player.weeksPlayed
                          }
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 font-bold text-green-900">
                          <Medal className="h-4 w-4 text-yellow-500" />

                          {
                            player.totalScore
                          }{" "}
                          pts
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}