type PerfectSlatePlayer = {
  name: string;
  weekNumber: number;
  score: number;
};

type PerfectSlateCardProps = {
  players: PerfectSlatePlayer[];
};

export default function PerfectSlateCard({
  players = [],
}: PerfectSlateCardProps) {
  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-lg">
      <div className="bg-green-900 px-6 py-5 text-white">
        <h2 className="text-xl font-semibold">
          🏆 Perfect Slates
        </h2>

        <p className="mt-1 text-sm text-green-200">
          12 / 12 correct picks
        </p>
      </div>

      <div className="px-6 py-5">
        {players.length === 0 ? (
          <div className="text-center">
            <div className="text-lg font-bold text-slate-900">
              No perfect slates yet.
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Who's going to have the first perfect slate of the season?
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {players.map((player) => (
              <div
                key={`${player.weekNumber}-${player.name}`}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
              >
                <div>
                  <div className="font-semibold text-slate-900">
                    {player.name}
                  </div>

                  <div className="text-xs text-slate-500">
                    Week {player.weekNumber}
                  </div>
                </div>

                <div className="text-sm font-bold text-green-900">
                  {player.score} / 12
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}