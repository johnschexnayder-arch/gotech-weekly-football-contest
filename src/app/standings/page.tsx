import { Trophy, Medal, Crown, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function StandingsPage() {
  const { data: entries, error } = await supabase
    .from("entries")
    .select(
      `
      id,
      score,
      players (
        name
      )
    `
    )
    .order("score", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

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
            See who's leading the season and chasing the championship.
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
            {entries?.length ?? 0} Players
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
                  Score
                </th>
              </tr>
            </thead>

            <tbody>
              {!entries || entries.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-16 text-center text-lg font-semibold text-slate-500"
                  >
                    No standings available yet.
                  </td>
                </tr>
              ) : (
                entries.map((entry: any, index: number) => (
                  <tr
                    key={entry.id}
                    className="border-t border-slate-100 transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center text-lg">
                          {index === 0 ? (
                            "🥇"
                          ) : index === 1 ? (
                            "🥈"
                          ) : index === 2 ? (
                            "🥉"
                          ) : (
                            <span className="text-sm font-bold text-slate-500">
                              {index + 1}
                            </span>
                          )}
                        </div>

                        {index === 0 && (
                          <Crown className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-bold text-green-900">
                          {(entry.players?.name ?? "?")
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>

                        <div>
                          <div className="font-bold text-slate-900">
                            {entry.players?.name ?? "Unknown"}
                          </div>

                          <div className="text-xs text-slate-500">
                            Season Competitor
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 font-bold text-green-900">
                        <Medal className="h-4 w-4 text-yellow-500" />
                        {entry.score ?? 0} pts
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}