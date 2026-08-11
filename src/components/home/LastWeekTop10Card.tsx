type LastWeekTop10Player = {
  rank: number;
  name: string;
  score: number;
};

type LastWeekTop10CardProps = {
  weekNumber?: number;
  players?: LastWeekTop10Player[];
};

export default function LastWeekTop10Card({
  weekNumber,
  players = [],
}: LastWeekTop10CardProps) {
  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-lg">
      <div className="bg-green-900 px-6 py-5 text-white">
        <h2 className="text-xl font-semibold">
          Last Week Top 10
        </h2>

        <p className="mt-1 text-sm text-green-200">
          {weekNumber
            ? `Week ${weekNumber} leaderboard results`
            : "Weekly leaderboard results"}
        </p>
      </div>

      {players.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {players.map((player) => (
            <div
              key={`${player.rank}-${player.name}`}
              className="flex items-center justify-between px-6 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 text-center text-sm font-black text-slate-400">
                  {player.rank}
                </div>

                <div className="text-sm font-semibold text-slate-800">
                  {player.name}
                </div>
              </div>

              <div className="text-sm font-black text-green-900">
                {player.score}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-6 py-10 text-center">
          <div className="text-4xl">
            🏆
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700">
            No completed week results yet.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Results will appear here after scoring is finalized.
          </p>
        </div>
      )}

      <div className="border-t border-slate-100 px-6 py-4">
        <a
          href="/results"
          className="text-sm font-semibold text-green-900 hover:underline"
        >
          View Full Results →
        </a>
      </div>
    </section>
  );
}