type TiebreakerCardProps = {
  awayTeam: string;
  homeTeam: string;
  winner?: string;
  awayScore?: string;
  homeScore?: string;
  onWinnerChange: (team: string) => void;
  onAwayScoreChange: (score: string) => void;
  onHomeScoreChange: (score: string) => void;
  disabled?: boolean;
};


export default function TiebreakerCard({
  awayTeam,
  homeTeam,
  winner = "",
  awayScore = "",
  homeScore = "",
  onWinnerChange,
  onAwayScoreChange,
  onHomeScoreChange,
  disabled = false,
}: TiebreakerCardProps) {


  const buttonClasses = (team: string) =>

    winner === team

      ? `
        rounded-xl
        border-2
        border-yellow-400
        bg-gradient-to-r
        from-yellow-400
        to-yellow-600
        px-6
        py-3
        text-sm
        font-black
        uppercase
        text-green-950
        shadow-lg
      `

      : `
        rounded-xl
        border
        border-green-900
        px-6
        py-3
        text-sm
        font-black
        uppercase
        text-green-900
        transition
        hover:bg-green-900
        hover:text-white
      `;



  return (

    <section className="overflow-hidden rounded-3xl border border-yellow-500/20 bg-white shadow-xl">


      <div className="bg-gradient-to-r from-green-950 via-green-900 to-green-800 px-6 py-5 text-white">


        <h2 className="text-xl font-black tracking-tight">
          🏆 Tiebreaker Challenge
        </h2>


        <p className="mt-1 text-sm font-medium text-yellow-200">
          Predict the final score of the tiebreaker game
        </p>


      </div>







      <div className="space-y-6 p-6">



        <div>


          <div className="mb-3 text-sm font-black uppercase tracking-wide text-green-700">
            Who wins?
          </div>



          <div className="flex gap-3">


            <button
              type="button"
              disabled={disabled}
              onClick={() => onWinnerChange(awayTeam)}
              className={buttonClasses(awayTeam)}
            >

              {awayTeam}

            </button>



            <button
              type="button"
              disabled={disabled}
              onClick={() => onWinnerChange(homeTeam)}
              className={buttonClasses(homeTeam)}
            >

              {homeTeam}

            </button>


          </div>


        </div>







        <div>


          <div className="mb-3 text-sm font-black uppercase tracking-wide text-green-700">
            Predict Final Score
          </div>





          <div className="grid gap-4 md:grid-cols-2">



            <div>


              <label className="text-sm font-black text-slate-700">
                {awayTeam}
              </label>


              <input
                type="number"
                value={awayScore}
                disabled={disabled}
                onChange={(e) =>
                  onAwayScoreChange(e.target.value)
                }
                placeholder="27"
                className="mt-2 w-full rounded-xl border-2 border-green-100 bg-green-50 px-4 py-3 text-center text-xl font-black text-green-950 outline-none transition focus:border-yellow-400"
              />


            </div>







            <div>


              <label className="text-sm font-black text-slate-700">
                {homeTeam}
              </label>


              <input
                type="number"
                value={homeScore}
                disabled={disabled}
                onChange={(e) =>
                  onHomeScoreChange(e.target.value)
                }
                placeholder="24"
                className="mt-2 w-full rounded-xl border-2 border-green-100 bg-green-50 px-4 py-3 text-center text-xl font-black text-green-950 outline-none transition focus:border-yellow-400"
              />


            </div>



          </div>


        </div>







        <div className="rounded-2xl border border-yellow-400/30 bg-gradient-to-r from-green-50 to-yellow-50 p-5 text-sm font-semibold text-green-950">


          <div className="mb-2 font-black uppercase tracking-wide text-green-800">
            Tiebreaker Rules
          </div>


          1. Correct tiebreaker game winner
          <br />
          2. Closest to total points scored
          <br />
          3. Closest to home team's points
          <br />
          4. Previous week's tiebreaker if still tied


        </div>



      </div>


    </section>

  );

}