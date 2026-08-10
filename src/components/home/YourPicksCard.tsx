type Game = {
  id: number;
  away: string;
  home: string;
  kickoff: string;
};


type YourPicksCardProps = {
  games: Game[];
};



export default function YourPicksCard({
  games = [],
}: YourPicksCardProps) {


  return (

    <section className="overflow-hidden rounded-3xl border border-yellow-500/20 bg-white shadow-xl">


      <div className="flex items-center justify-between bg-gradient-to-r from-green-950 via-green-900 to-green-800 px-6 py-5 text-white">


        <div>


          <h2 className="text-xl font-black tracking-tight">
            Week Picks
          </h2>


          <p className="mt-1 text-sm font-medium text-yellow-200">
            Select the winner of each matchup
          </p>


        </div>





        <div className="rounded-full border border-yellow-400/50 bg-yellow-500/20 px-4 py-2 text-sm font-black text-yellow-200">

          {games.length} Games

        </div>


      </div>





      <div className="divide-y divide-slate-100">


        {games.map((game, index) => (


          <div
            key={game.id}
            className="flex items-center justify-between px-6 py-4 transition hover:bg-green-50/40"
          >



            <div className="flex items-center gap-4">


              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-900 text-xs font-black text-white shadow">

                {index + 1}

              </div>





              <div>


                <div className="text-sm font-black text-slate-900">

                  {game.away}

                  <span className="mx-2 text-yellow-600">
                    @
                  </span>

                  {game.home}

                </div>


                <div className="mt-1 text-xs font-medium text-slate-400">

                  {game.kickoff}

                </div>


              </div>


            </div>






            <div className="flex gap-2">


              <button
                className="rounded-lg border border-green-900 px-3 py-1.5 text-xs font-black uppercase text-green-900 transition hover:bg-green-900 hover:text-white"
              >
                {game.away}
              </button>



              <button
                className="rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 px-3 py-1.5 text-xs font-black uppercase text-green-950 shadow transition hover:-translate-y-0.5 hover:from-yellow-400 hover:to-yellow-500"
              >
                {game.home}
              </button>


            </div>



          </div>


        ))}


      </div>



    </section>

  );

}