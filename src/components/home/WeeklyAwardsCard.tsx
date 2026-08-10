type WeeklyAwardsCardProps = {
  winner?: {
    name: string;
    score: number;
  };

  lastPlace?: {
    name: string;
    score: number;
  };
};


export default function WeeklyAwardsCard({
  winner,
  lastPlace,
}: WeeklyAwardsCardProps) {

  return (
    <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">


      <div className="bg-green-900 px-6 py-5 text-white">


        <h2 className="text-xl font-black">
          Weekly Awards
        </h2>


        <p className="mt-1 text-sm text-green-200">
          Weekly bragging rights
        </p>


      </div>




      <div className="space-y-4 p-6">


        <div className="rounded-2xl bg-green-50 p-5">


          <div className="text-xs font-black uppercase tracking-widest text-green-700">
            Weekly Winner
          </div>


          <div className="mt-3 text-xl font-black text-green-900">
            {winner?.name ?? "No winner yet"}
          </div>


          <div className="mt-1 text-sm font-bold text-slate-500">
            {winner
              ? `${winner.score} correct picks`
              : "Scores pending"}
          </div>


        </div>





        <div className="rounded-2xl bg-slate-50 p-5">


          <div className="text-xs font-black uppercase tracking-widest text-slate-400">
            Last Place
          </div>


          <div className="mt-3 text-xl font-black text-slate-900">
            {lastPlace?.name ?? "No results yet"}
          </div>


          <div className="mt-1 text-sm font-bold text-slate-500">
            {lastPlace
              ? `${lastPlace.score} correct picks`
              : "Scores pending"}
          </div>


        </div>



      </div>


    </section>
  );
}