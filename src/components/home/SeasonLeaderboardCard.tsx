type SeasonLeaderboardCardProps = {
  players: {
    rank: number;
    name: string;
    score: number;
  }[];
};

export default function SeasonLeaderboardCard({
  players = [],
}: SeasonLeaderboardCardProps) {
  return (
    <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">


      <div className="bg-green-900 px-6 py-5 text-white">

        <h2 className="text-xl font-black">
          Season Championship
        </h2>

        <p className="mt-1 text-sm text-green-200">
          Overall leaderboard standings
        </p>

      </div>



      <div className="p-6">


        {players.length > 0 ? (

          <div className="space-y-3">


            {players.map((player) => (

              <div
                key={player.rank}
                className={`flex items-center justify-between rounded-2xl px-5 py-4 ${
                  player.rank === 1
                    ? "border border-green-200 bg-green-50 shadow-sm"
                    : "bg-slate-50"
                }`}
              >


                <div className="flex items-center gap-4">


                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-black ${
                      player.rank === 1
                        ? "bg-green-900 text-white"
                        : "bg-white text-slate-700"
                    }`}
                  >
                    {player.rank}
                  </div>



                  <div>

                    <div className="font-black text-slate-900">
                      {player.name}
                    </div>


                    <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      {player.rank === 1
                        ? "Current Champion"
                        : "Season Competitor"}
                    </div>


                  </div>


                </div>



                <div className="text-right">

                  <div className="text-3xl font-black text-green-900">
                    {player.score}
                  </div>


                  <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Points
                  </div>


                </div>


              </div>

            ))}


          </div>


        ) : (

          <div className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
            No season standings available yet
          </div>

        )}


      </div>


    </section>
  );
}