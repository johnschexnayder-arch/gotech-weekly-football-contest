type PerfectSlateCardProps = {
  players: {
    name: string;
    score: number;
  }[];
  totalGames: number;
};


export default function PerfectSlateCard({
  players = [],
  totalGames,
}: PerfectSlateCardProps) {


  const hasWinner = players.length > 0;


  return (
    <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">


      <div className="bg-green-900 px-6 py-5 text-white">


        <h2 className="text-xl font-black">
          Perfect Slate Bonus
        </h2>


        <p className="mt-1 text-sm text-green-200">
          Pick every game correctly
        </p>


      </div>




      <div className="p-6">


        <div className="rounded-2xl bg-gradient-to-br from-green-50 to-white p-6 text-center">


          <div className="text-xs font-black uppercase tracking-[0.25em] text-green-700">
            Perfect Score
          </div>



          <div className="mt-3 text-5xl font-black text-green-900">
            {totalGames}/{totalGames}
          </div>



          <div className="mt-2 text-sm font-bold text-slate-500">
            Correct picks required
          </div>



        </div>




        <div className="mt-5">


          {hasWinner ? (

            <div className="space-y-3">


              {players.map((player) => (

                <div
                  key={player.name}
                  className="flex items-center justify-between rounded-xl bg-green-50 px-4 py-3"
                >

                  <span className="font-black text-green-900">
                    {player.name}
                  </span>


                  <span className="text-sm font-bold text-green-700">
                    Perfect
                  </span>


                </div>

              ))}


            </div>


          ) : (


            <div className="rounded-xl bg-slate-50 p-5 text-center">


              <div className="font-black text-slate-700">
                No perfect slate yet
              </div>


              <div className="mt-1 text-sm font-semibold text-slate-500">
                Will anyone conquer all {totalGames} games?
              </div>


            </div>


          )}


        </div>


      </div>


    </section>
  );
}