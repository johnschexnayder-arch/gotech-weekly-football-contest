type SubmitBarProps = {
  selected: number;
  total: number;
  onSubmit: () => void;
  disabled?: boolean;
};


export default function SubmitBar({
  selected,
  total,
  onSubmit,
  disabled = false,
}: SubmitBarProps) {


  const incomplete = selected !== total;
  const isDisabled = incomplete || disabled;



  return (

    <div className="flex items-center justify-between rounded-3xl border border-yellow-400/30 bg-white px-6 py-5 shadow-xl">


      <div>


        <div className="text-xs font-black uppercase tracking-[0.25em] text-green-700">

          Picks Ready

        </div>


        <div className="mt-1 text-2xl font-black text-green-950">

          {selected}/{total} selected

        </div>


        <div className="mt-1 text-sm font-semibold text-slate-400">

          {incomplete
            ? `${total - selected} picks remaining`
            : "All picks are ready to submit"}

        </div>


      </div>







      <button
        type="button"
        onClick={onSubmit}
        disabled={isDisabled}
        className={`group relative overflow-hidden rounded-2xl border-2 px-10 py-5 text-sm font-black uppercase tracking-wide transition-all duration-200 ${
          isDisabled

            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"

            : "border-yellow-400 bg-gradient-to-r from-green-950 via-green-900 to-green-800 text-white shadow-xl hover:-translate-y-1 hover:shadow-2xl"
        }`}
      >


        {!isDisabled && (

          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

        )}



        <span className="relative">

          {disabled
            ? "Picks Locked"
            : incomplete
            ? "Complete Picks"
            : "Submit Picks"}

        </span>


      </button>



    </div>

  );

}