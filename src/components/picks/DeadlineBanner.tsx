type DeadlineBannerProps = {
  deadline: string;
  isLocked: boolean;
};

export default function DeadlineBanner({
  deadline,
  isLocked,
}: DeadlineBannerProps) {

  const formatted = new Date(deadline).toLocaleString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );


  return (

    <div className="flex items-center justify-between rounded-2xl bg-green-50 px-5 py-4">


      <div>

        <div className="text-xs font-bold uppercase tracking-widest text-green-700">
          Contest Status
        </div>


        <div className="mt-1 text-lg font-bold text-green-900">

          {isLocked
            ? "Picks Locked"
            : "Picks Open"}

        </div>


        <div className="text-sm font-medium text-slate-600">

          Closes {formatted}

        </div>


      </div>





      <div
        className={`rounded-lg px-4 py-2 text-sm font-bold ${
          isLocked
            ? "bg-red-600 text-white"
            : "bg-green-900 text-white"
        }`}
      >

        {isLocked ? "Closed" : "Open"}

      </div>



    </div>

  );
}