type ContestStatsCardProps = {
  players: number;
  games: number;
  weeklyPrize: number;
  seasonPot: number;
};


export default function ContestStatsCard({
  players,
  games,
  weeklyPrize,
  seasonPot,
}: ContestStatsCardProps) {

  const stats = [
    {
      label: "Players",
      value: players,
      accent: true,
    },
    {
      label: "Games",
      value: games,
      accent: false,
    },
    {
      label: "Weekly Prize",
      value: `$${weeklyPrize}`,
      accent: false,
    },
    {
      label: "Season Pot",
      value: `$${seasonPot}`,
      accent: true,
    },
  ];


  return (
    <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">


      <div className="bg-green-900 px-6 py-5 text-white">


        <h2 className="text-xl font-black">
          Contest Overview
        </h2>


        <p className="mt-1 text-sm text-green-200">
          2026 season statistics
        </p>


      </div>




      <div className="grid grid-cols-2 gap-4 p-6">


        {stats.map((stat) => (

          <div
            key={stat.label}
            className={`rounded-2xl p-5 ${
              stat.accent
                ? "bg-green-50"
                : "bg-slate-50"
            }`}
          >


            <div className="text-xs font-black uppercase tracking-widest text-slate-400">
              {stat.label}
            </div>


            <div
              className={`mt-3 text-4xl font-black ${
                stat.accent
                  ? "text-green-900"
                  : "text-slate-900"
              }`}
            >
              {stat.value}
            </div>


          </div>

        ))}


      </div>


    </section>
  );
}