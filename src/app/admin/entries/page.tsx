export const dynamic = "force-dynamic";
import Link from "next/link";
import { supabase } from "@/lib/supabase";


export default async function EntriesPage() {


  const { data: entries, error } = await supabase
    .from("entries")
    .select(`
      id,
      submitted_at,
      score,
      week_id,
      players (
        name,
        email
      ),
      weeks (
        week_number
      )
    `)
    .order("submitted_at", {
      ascending: false,
    });



  if (error) {

    throw new Error(error.message);

  }






  return (

    <main className="mx-auto max-w-6xl space-y-8 px-6 py-12">



      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-green-950 via-green-900 to-green-800 p-8 text-white shadow-xl">


        <div className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">

          Commissioner Tools

        </div>


        <h1 className="mt-3 text-4xl font-black">

          Entries Management

        </h1>


        <p className="mt-2 text-green-100">

          Review player submissions and contest entries.

        </p>


      </section>








      <section className="overflow-hidden rounded-3xl border border-yellow-400/20 bg-white shadow-xl">


        <div className="overflow-x-auto">


          <table className="w-full">


            <thead className="bg-green-950 text-white">


              <tr>


                <th className="px-5 py-4 text-left text-sm font-black uppercase tracking-wide">
                  Player
                </th>


                <th className="px-5 py-4 text-left text-sm font-black uppercase tracking-wide">
                  Email
                </th>


                <th className="px-5 py-4 text-left text-sm font-black uppercase tracking-wide">
                  Week
                </th>


                <th className="px-5 py-4 text-left text-sm font-black uppercase tracking-wide">
                  Submitted
                </th>


                <th className="px-5 py-4 text-left text-sm font-black uppercase tracking-wide">
                  Score
                </th>


              </tr>


            </thead>








            <tbody>


              {!entries || entries.length === 0 ? (


                <tr>

                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center font-semibold text-slate-500"
                  >

                    No entries have been submitted yet.

                  </td>

                </tr>



              ) : (


                entries.map((entry: any) => (


                  <tr
                    key={entry.id}
                    className="border-t border-slate-100 transition hover:bg-green-50/40"
                  >



                    <td className="px-5 py-4 font-black text-green-950">

                      {entry.players?.name ?? "-"}

                    </td>





                    <td className="px-5 py-4 text-sm text-slate-600">

                      {entry.players?.email ?? "-"}

                    </td>





                    <td className="px-5 py-4 font-semibold text-slate-700">

                      Week {entry.weeks?.week_number ?? "-"}

                    </td>





                    <td className="px-5 py-4 text-sm text-slate-600">

                      {new Date(
                        entry.submitted_at
                      ).toLocaleString()}

                    </td>





                    <td className="px-5 py-4">


                      <span className="rounded-full bg-green-100 px-4 py-2 font-black text-green-900">

                        {entry.score ?? 0}

                      </span>


                    </td>


                  </tr>


                ))


              )}


            </tbody>


          </table>


        </div>


      </section>








      <div>

        <Link
          href="/admin"
          className="font-bold text-green-900 hover:text-yellow-600"
        >

          ← Back to Admin Dashboard

        </Link>


      </div>


    </main>

  );

}