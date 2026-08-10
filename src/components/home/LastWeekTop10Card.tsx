export default function LastWeekTop10Card() {

  return (

    <section className="overflow-hidden rounded-3xl bg-white shadow-lg">


      <div className="bg-green-900 px-6 py-5 text-white">


        <h2 className="text-xl font-semibold">
          Last Week Top 10
        </h2>


        <p className="mt-1 text-sm text-green-200">
          Weekly leaderboard results
        </p>


      </div>





      <div className="px-6 py-10 text-center">


        <div className="text-4xl">
          🏆
        </div>


        <p className="mt-4 text-sm font-semibold text-slate-700">

          Results will appear after the first week is completed.

        </p>


        <p className="mt-2 text-sm text-slate-500">

          Check back after scoring is finalized.

        </p>


      </div>





      <div className="border-t border-slate-100 px-6 py-4">


        <button
          className="text-sm font-semibold text-green-900 hover:underline"
        >

          View Full Results →

        </button>


      </div>



    </section>

  );

}