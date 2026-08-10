type GameCardProps = {
  gameNumber: number;
  awayTeam: string;
  homeTeam: string;
  selectedTeam?: string;
  onSelect?: (team: string) => void;
  disabled?: boolean;
};


export default function GameCard({
  gameNumber,
  awayTeam,
  homeTeam,
  selectedTeam,
  onSelect,
  disabled = false,
}: GameCardProps) {



  const teamButtonClasses = (team: string) => {

    const selected =
      selectedTeam === team;


    if (selected) {

      return `
        rounded-xl
        border-2
        border-yellow-400
        bg-gradient-to-r
        from-yellow-400
        to-yellow-600
        px-4
        py-2
        text-xs
        font-black
        uppercase
        text-green-950
        shadow-lg
        transition
      `;

    }


    if (disabled) {

      return `
        rounded-xl
        border
        border-slate-200
        px-4
        py-2
        text-xs
        font-bold
        text-slate-400
      `;

    }


    return `
      rounded-xl
      border
      border-green-900
      px-4
      py-2
      text-xs
      font-black
      uppercase
      text-green-900
      transition
      hover:-translate-y-0.5
      hover:bg-green-900
      hover:text-white
    `;

  };





  return (

    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 transition hover:bg-green-50/40 last:border-0">


      <div className="flex items-center gap-4">


        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-yellow-400 bg-green-950 text-sm font-black text-yellow-300 shadow">

          {gameNumber}

        </div>





        <div>


          <div className="text-sm font-black text-slate-900">


            {awayTeam}


            <span className="mx-2 text-yellow-600">

              @

            </span>


            {homeTeam}


          </div>


          <div className="mt-1 text-xs font-medium text-slate-400">

            Choose your winner

          </div>


        </div>


      </div>







      <div className="flex gap-2">


        <button
          type="button"
          disabled={disabled}
          className={teamButtonClasses(awayTeam)}
          onClick={() => onSelect?.(awayTeam)}
        >

          {awayTeam}

        </button>





        <button
          type="button"
          disabled={disabled}
          className={teamButtonClasses(homeTeam)}
          onClick={() => onSelect?.(homeTeam)}
        >

          {homeTeam}

        </button>


      </div>



    </div>

  );

}