"use client";

import { useState } from "react";
import { updateGame } from "@/lib/games";


interface Game {
  id: string;
  game_number: number;
  sport: string;
  away_team: string;
  home_team: string;
  kickoff: string;
  winner: string | null;
}



export default function SaveWinnersButton({
  games,
}: {
  games: Game[];
}) {


  const [winners, setWinners] =
    useState<Record<string, string>>(
      games.reduce(
        (acc, game) => ({
          ...acc,
          [game.id]: game.winner ?? "",
        }),
        {}
      )
    );



  const [saving, setSaving] =
    useState(false);





  function handleWinnerChange(
    gameId: string,
    winner: string
  ) {

    setWinners((current) => ({
      ...current,
      [gameId]: winner,
    }));

  }







  async function handleSave() {


    setSaving(true);



    try {


      for (const game of games) {


        await updateGame(game.id, {

          sport: game.sport,

          away_team: game.away_team,

          home_team: game.home_team,

          kickoff: game.kickoff,

          winner: winners[game.id] || null,

        });


      }



      alert("Winners saved successfully!");

      window.location.reload();



    } catch (error) {


      console.error(
        "SAVE WINNER ERROR:",
        error
      );


      alert("Unable to save winners.");



    } finally {


      setSaving(false);


    }


  }








  return (

    <div>


      <div className="space-y-5">


        {games.map((game) => (


          <div
            key={game.id}
            className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm"
          >


            <div className="mb-2 text-lg font-black text-green-950">

              Game {game.game_number}

            </div>




            <div className="mb-4 font-semibold text-slate-700">

              {game.away_team}

              <span className="mx-2 text-slate-400">
                vs
              </span>

              {game.home_team}

            </div>






            <select
              value={winners[game.id] ?? ""}
              onChange={(e) =>
                handleWinnerChange(
                  game.id,
                  e.target.value
                )
              }
              className="rounded-xl border-2 border-green-100 bg-green-50 px-4 py-2 font-semibold text-green-950 outline-none focus:border-yellow-400"
            >


              <option value="">
                Select Winner
              </option>



              <option value={game.away_team}>
                {game.away_team}
              </option>



              <option value={game.home_team}>
                {game.home_team}
              </option>


            </select>


          </div>


        ))}


      </div>








      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-8 rounded-xl border-2 border-yellow-400 bg-green-950 px-8 py-3 font-black uppercase tracking-wide text-white shadow-lg transition hover:bg-green-900 disabled:opacity-50"
      >

        {saving
          ? "Saving..."
          : "Save Winners"}

      </button>



    </div>


  );

}