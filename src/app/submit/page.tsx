import { getDashboard } from "@/lib/dashboard";

export default async function StandingsPage() {
  const dashboard = await getDashboard();

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6">
      <section className="rounded-3xl bg-gradient-to-r from-green-800 via-green-700 to-green-900 p-10 text-white shadow-xl">
        <h1 className="text-5xl font-black">
          Season Standings
        </h1>

        <p className="mt-4 text-lg text-green-100">
          Current GOTECH Weekly Football Contest rankings.
        </p>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-lg">
        <div className="space-y-4">
          {dashboard.seasonLeaderboard.length === 0 && (
            <p className="text-slate-500">
              No standings available yet.
            </p>
          )}

          {dashboard.seasonLeaderboard.map(
            (player) => (
              <div
                key={player.rank}
                className="flex items-center justify-between rounded-xl border p-5"
              >
                <div className="flex items-center gap-5">
                  <div className="text-3xl font-black text-green-700">
                    #{player.rank}
                  </div>

                  <div className="text-xl font-bold">
                    {player.name}
                  </div>
                </div>

                <div className="text-2xl font-black">
                  {player.score}
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </main>
  );
}