import Link from "next/link";
import { getWeeks } from "@/lib/weeks";
import { getGames } from "@/lib/games";
import CreateGameDialog from "@/components/games/CreateGameDialog";
import EditGameDialog from "@/components/games/EditGameDialog";
import DeleteGameButton from "@/components/games/DeleteGameButton";

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

  const games = selectedWeek ? await getGames(selectedWeek.id) : [];

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-12">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-green-950 via-green-900 to-green-800 p-8 text-white shadow-xl">
        <div className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
          Commissioner Tools
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-5">
          <div>
            <h1 className="text-4xl font-black">
              Games Management
            </h1>

            <p className="mt-2 text-green-100">
              Create and manage the weekly football slate.
            </p>
          </div>

          {selectedWeek && (
            <CreateGameDialog weekId={selectedWeek.id} />
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-yellow-400/20 bg-white p-6 shadow-xl">
        <form method="GET">
          <div className="flex flex-wrap items-center gap-3">
            <label
              htmlFor="week"
              className="font-black uppercase tracking-wide text-green-950"
            >
              Week
            </label>

            <select
              id="week"
              name="week"
              defaultValue={selectedWeek?.id}
              className="rounded-xl border-2 border-green-100 bg-green-50 px-4 py-2 font-semibold text-green-950 outline-none focus:border-yellow-400"
            >
              {weeks.map((week) => (
                <option key={week.id} value={week.id}>
                  Week {week.week_number}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="rounded-xl bg-green-900 px-4 py-2 font-bold text-white hover:bg-green-800"
            >
              Load
            </button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-3xl border border-yellow-400/20 bg-white shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
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
                      {new Date(game.kickoff).toLocaleString()}
                    </td>

                    <td className="px-5 py-4">
                      {game.winner ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-black text-green-800">
                          {game.winner}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        <EditGameDialog game={game} />
                        <DeleteGameButton gameId={game.id} />
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