import Link from "next/link";

import { getWeeks } from "@/lib/weeks";
import { getGames } from "@/lib/games";

import CreateGameDialog from "@/components/games/CreateGameDialog";
import EditGameDialog from "@/components/games/EditGameDialog";
import DeleteGameButton from "@/components/games/DeleteGameButton";
import TiebreakerGameSelector from "@/components/games/TiebreakerGameSelector";

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{
    week?: string;
  }>;
}) {
  const params = await searchParams;

  const weeks = await getWeeks();

  const selectedWeek =
    weeks.find((w) => w.id === params.week) ??
    weeks[0] ??
    null;

  const games = selectedWeek
    ? await getGames(selectedWeek.id)
    : [];

  return (
    <main className="mx-auto w-full max-w-7xl min-w-0 space-y-8 px-4 py-8 sm:px-6 sm:py-12">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-green-950 via-green-900 to-green-800 p-5 text-white shadow-xl sm:p-8">
        <div className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400 sm:tracking-[0.35em]">
          Commissioner Tools
        </div>

        <div className="mt-3 flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-black sm:text-4xl">
              Games Management
            </h1>

            <p className="mt-2 text-sm leading-6 text-green-100 sm:text-base">
              Create and manage the weekly football slate.
            </p>
          </div>

          {selectedWeek && (
            <div className="shrink-0">
              <CreateGameDialog
                weekId={selectedWeek.id}
              />
            </div>
          )}
        </div>
      </section>

      <section className="min-w-0 rounded-3xl border border-yellow-400/20 bg-white p-4 shadow-xl sm:p-6">
        <form method="GET">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <label
              htmlFor="week"
              className="font-black uppercase tracking-wide text-green-950"
            >
              Week
            </label>

            <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
              <select
                id="week"
                name="week"
                defaultValue={selectedWeek?.id}
                className="min-w-0 rounded-xl border-2 border-green-100 bg-green-50 px-4 py-2 font-semibold text-green-950 outline-none focus:border-yellow-400 sm:w-auto"
              >
                {weeks.map((week) => (
                  <option
                    key={week.id}
                    value={week.id}
                  >
                    Week {week.week_number}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="w-full rounded-xl bg-green-900 px-4 py-2 font-bold text-white hover:bg-green-800 sm:w-auto"
              >
                Load
              </button>
            </div>
          </div>
        </form>
      </section>

      {selectedWeek && (
        <div className="min-w-0 overflow-hidden">
          <TiebreakerGameSelector
            weekId={selectedWeek.id}
            games={games}
            existingGameId={
              selectedWeek.tiebreaker_game_id
            }
            existingWinner={
              selectedWeek.tiebreaker_winner
            }
            existingTotalPoints={
              selectedWeek.tiebreaker_total_points
            }
            existingHomePoints={
              selectedWeek.tiebreaker_home_points
            }
          />
        </div>
      )}

      <section className="min-w-0 overflow-hidden rounded-3xl border border-yellow-400/20 bg-white shadow-xl">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-green-950 text-white">
              <tr>
                <th className="px-5 py-4 text-left text-sm font-black uppercase tracking-wide">
                  #
                </th>

                <th className="px-5 py-4 text-left text-sm font-black uppercase tracking-wide">
                  Sport
                </th>

                <th className="px-5 py-4 text-left text-sm font-black uppercase tracking-wide">
                  Away Team
                </th>

                <th className="px-5 py-4 text-left text-sm font-black uppercase tracking-wide">
                  Home Team
                </th>

                <th className="px-5 py-4 text-left text-sm font-black uppercase tracking-wide">
                  Kickoff
                </th>

                <th className="px-5 py-4 text-left text-sm font-black uppercase tracking-wide">
                  Winner
                </th>

                <th className="px-5 py-4 text-center text-sm font-black uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {games.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center font-semibold text-slate-500"
                  >
                    No games have been added for this week.
                  </td>
                </tr>
              ) : (
                games.map((game) => (
                  <tr
                    key={game.id}
                    className="border-t border-slate-100 transition hover:bg-green-50/40"
                  >
                    <td className="px-5 py-4 font-black text-green-950">
                      {game.game_number}
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-700">
                      {game.sport}
                    </td>

                    <td className="px-5 py-4 font-bold text-slate-900">
                      {game.away_team}
                    </td>

                    <td className="px-5 py-4 font-bold text-slate-900">
                      {game.home_team}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {new Date(
                        game.kickoff
                      ).toLocaleString()}
                    </td>

                    <td className="px-5 py-4">
                      {game.winner ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-black text-green-800">
                          {game.winner}
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          -
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        <EditGameDialog
                          game={game}
                        />

                        <DeleteGameButton
                          gameId={game.id}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div>
        <Link
          href="/admin"
          className="font-bold text-green-900 hover:text-yellow-600"
        >
          ← Back to Admin Dashboard
        </Link>
      </div>
    </main>
  );
}