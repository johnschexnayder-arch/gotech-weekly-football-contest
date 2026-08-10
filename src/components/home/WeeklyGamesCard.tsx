type Game = {
  id: number;
  away: string;
  home: string;
  kickoff: string;
};


type WeeklyGamesCardProps = {
  games: Game[];
};



export default function WeeklyGamesCard({
  games = [],
}: WeeklyGamesCardProps) {


  return (

    <section className="overflow-hidden rounded-3xl bg-white shadow-lg">


      <div className="flex items-center justify-between bg-green-900 px-6 py-5 text-white">


        <div>

          <h2 className="text-xl font-semibold">
            Week Picks
          </h2>


          <p className="mt-1 text-sm font-medium text-green-200">
            Select the winner for each matchup
          </p>


        </div>



        <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">

          {games.length} Games

        </div>


      </div>





      <div className="divide-y divide-slate-100 px-6">


        {games.length > 0 ? (


          games.map((game, index) => (


            <div
              key={game.id}
              className="flex items-center justify-between gap-4 py-4"
            >



              <div className="flex min-w-0 items-center gap-4">


                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-sm font-semibold text-green-900">

                  {index + 1}

                </div>





                <div className="min-w-0">


                  <div className="flex items-center gap-2 text-base font-semibold text-slate-900">


                    <span className="truncate">
                      {game.away}
                    </span>


                    <span className="text-slate-400">
                      @
                    </span>


                    <span className="truncate">
                      {game.home}
                    </span>


                  </div>




                  <div className="mt-1 text-xs font-medium text-slate-400">

                    {game.kickoff}

                  </div>



                </div>


              </div>





              <button
                className="shrink-0 rounded-lg bg-green-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
              >

                Pick

              </button>



            </div>


          ))



        ) : (


          <div className="py-8 text-center text-sm font-medium text-slate-500">

            No games scheduled yet

          </div>


        )}



      </div>



    </section>

  );

}