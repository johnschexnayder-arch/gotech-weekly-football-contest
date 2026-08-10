import { getCurrentWeek } from "@/lib/games";
import YourResults from "@/components/results/YourResults";


export default async function ResultsPage() {


  const week =
    await getCurrentWeek();



  if (!week) {

    return (

      <main className="mx-auto max-w-7xl p-6">

        <section className="rounded-3xl bg-white p-6 shadow-lg">

          <h1 className="text-2xl font-black text-green-900">
            Results
          </h1>

          <p className="mt-3 text-slate-600">
            No active week found.
          </p>

        </section>

      </main>

    );

  }





  return (

    <main className="mx-auto max-w-7xl space-y-6 p-6">

      <h1 className="text-4xl font-black text-green-950">
        Results
      </h1>


      <YourResults
        week={week}
      />


    </main>

  );

}