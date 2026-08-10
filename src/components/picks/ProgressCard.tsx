type ProgressCardProps = {
  selected: number;
  total: number;
};


export default function ProgressCard({
  selected,
  total,
}: ProgressCardProps) {


  const percentage =
    total === 0
      ? 0
      : Math.round((selected / total) * 100);



  const remaining = total - selected;



  return (

    <div className="rounded-2xl bg-white px-6 py-4 shadow-sm">


      <div className="flex items-center justify-between">


        <div>


          <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Pick Progress
          </div>


          <div className="mt-1 text-lg font-bold text-green-900">

            {selected} of {total} games selected

          </div>


        </div>





        <div className="text-right">


          <div className="text-2xl font-bold text-green-900">

            {percentage}%

          </div>


          <div className="text-xs font-semibold text-slate-500">

            Complete

          </div>


        </div>


      </div>





      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">


        <div
          className="h-full rounded-full bg-green-900 transition-all duration-300"
          style={{
            width: `${percentage}%`,
          }}
        />


      </div>





      <div className="mt-3 text-sm font-medium text-slate-600">


        {selected === total
          ? "All picks complete. Ready to submit!"
          : `${remaining} pick${remaining === 1 ? "" : "s"} remaining`
        }


      </div>



    </div>

  );
}