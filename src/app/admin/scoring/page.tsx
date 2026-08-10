import { getWeeks } from "@/lib/weeks";
import { supabase } from "@/lib/supabase";

import SaveWinnersButton from "@/components/scoring/SaveWinnersButton";
import CalculateScoresButton from "@/components/scoring/CalculateScoresButton";
import TiebreakerResultForm from "@/components/scoring/TiebreakerResultForm";
import WeekSelector from "@/components/scoring/WeekSelector";


export default async function ScoringPage({
  searchParams,
}: {
  searchParams: Promise<{
    week?: string;
  }>;
}) {


  const params = await searchParams;


  const weeks =
    await getWeeks();



  const selectedWeek =
    weeks.find(
      (week) =>
        week.id === params.week
    )
    ??
    weeks.find(
      (week) =>
        week.status === "LOCKED"
    )
    ??
    weeks[0];





  let games: any[] = [];





  if (selectedWeek) {


    const { data, error } =
      await supabase
        .from("games")
        .select("*")
        .eq(
          "week_id",
          selectedWeek.id
        )
        .order("game_number");



    if (error) {

      throw new Error(
        error.message
      );

    }



    games =
      data ?? [];

  }





  return (

    <main className="mx-auto max-w-6xl space-y-8 px-6 py-12">


      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-green-950 via-green-900 to-green-800 p-8 text-white shadow-xl">


        <div className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">

          Commissioner Tools

        </div>


        <h1 className="mt-3 text-4xl font-black">

          Scoring Management

        </h1>


        <p className="mt-2 text-green-100">

          Enter winners, update tiebreakers, and calculate contest results.

        </p>


      </section>







      <section className="rounded-3xl border border-yellow-400/20 bg-white p-8 shadow-xl">



        <div className="mb-8">


          <h2 className="text-2xl font-black text-green-950">

            Select Week

          </h2>



          <div className="mt-4">


            <WeekSelector

              weeks={weeks}

              selectedWeekId={
                selectedWeek?.id ?? ""
              }

            />


          </div>


        </div>







        <div className="mb-6">


          <h2 className="text-2xl font-black text-green-950">

            {selectedWeek
              ? `Week ${selectedWeek.week_number} Results`
              : "No Week Available"}

          </h2>


          <p className="mt-2 text-sm font-medium text-slate-500">

            Complete all scoring actions before publishing standings.

          </p>


        </div>







        {games.length === 0 ? (


          <div className="rounded-2xl bg-green-50 p-5 font-semibold text-green-900">

            No games available for scoring.

          </div>



        ) : (


          <div className="space-y-8">



            <div className="rounded-2xl border border-green-100 bg-green-50 p-5">


              <h3 className="mb-4 font-black uppercase tracking-wide text-green-950">

                Game Winners

              </h3>



              <SaveWinnersButton
                games={games}
              />


            </div>







            <div className="rounded-2xl border border-yellow-400/30 bg-yellow-50/50 p-5">


              <h3 className="mb-4 font-black uppercase tracking-wide text-green-950">

                Tiebreaker Result

              </h3>



              <TiebreakerResultForm

                weekId={
                  selectedWeek.id
                }

                games={
                  games
                }

                existingGameId={
                  selectedWeek.tiebreaker_game_id
                }

                existingWinner={
                  selectedWeek.tiebreaker_winner
                }

                existingTotalPoints={
                  selectedWeek.tiebreaker_total_points
                }

                existingHomePoints={
                  selectedWeek.tiebreaker_home_points
                }

              />


            </div>







            <div className="rounded-2xl border border-green-100 bg-white">


              <h3 className="px-5 pt-5 font-black uppercase tracking-wide text-green-950">

                Final Calculation

              </h3>



              <div className="p-5">


                <CalculateScoresButton

                  weekId={
                    selectedWeek.id
                  }

                />


              </div>


            </div>




          </div>


        )}



      </section>


    </main>

  );

}