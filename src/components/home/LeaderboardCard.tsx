import Link from "next/link";

type LeaderboardPlayer = {
  rank: number;
  name: string;
  score: number;
};

type LeaderboardCardProps = {
  players: LeaderboardPlayer[];
};

export default function LeaderboardCard({
  players = [],
}: LeaderboardCardProps) {
  const rankedPlayers = players.map(
    (player, index) => {
      if (index === 0) {
        return {
          ...player,
          rank: 1,
        };
      }

      const previousPlayer =
        players[index - 1];

      return {
        ...player,
        rank:
          player.score ===
          previousPlayer.score
            ? previousPlayer.rank
            : index + 1,
      };
    }
  );

  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-lg">
      <div className="flex items-center justify-between bg-green-900 px-6 py-5 text-white">
        <div>
          <h2 className="text-xl font-semibold">
            Season Standings
          </h2>

          <p className="mt-1 text-sm text-green-200">
            Current leaderboard
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-100 px-6">
        {rankedPlayers
          .slice(0, 5)
          .map((player) => (
            <div
              key={player.name}
              className="flex items-center justify-between py-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                    player.rank === 1
                      ? "bg-green-50 text-green-900"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {player.rank}
                </div>

                <div className="text-sm font-semibold text-slate-900">
                  {player.name}
                </div>
              </div>

              <div className="text-sm font-semibold text-green-900">
                {player.score} pts
              </div>
            </div>
          ))}
      </div>

      <div className="border-t border-slate-100 px-6 py-4">
        <Link
          href="/standings"
          className="text-sm font-semibold text-green-900 hover:underline"
        >
          View Full Standings →
        </Link>
      </div>
    </section>
  );
}