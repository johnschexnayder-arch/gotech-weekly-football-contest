"use client";

import { useState } from "react";
import { updateTiebreaker } from "@/lib/weeks";


type Game = {
  id: string;
  away_team: string;
  home_team: string;
  winner?: string | null;
};



type Props = {
  weekId: string;
  games: Game[];
  existingGameId?: string | null;
  existingWinner?: string | null;
  existingTotalPoints?: number | null;
  existingHomePoints?: number | null;
};



export default function TiebreakerResultForm({
  weekId,
  games,
  existingGameId = "",
  existingWinner = "",
  existingTotalPoints = null,
  existingHomePoints = null,
}: Props) {


  const [gameId, setGameId] =
    useState(existingGameId ?? "");


  const [winner, setWinner] =
    useState(existingWinner ?? "");


  const [totalPoints, setTotalPoints] =
    useState(
      existingTotalPoints?.toString() ?? ""
    );


  const [homePoints, setHomePoints] =
    useState(
      existingHomePoints?.toString() ?? ""
    );


  const [saving, setSaving] =
    useState(false);





  const selectedGame =
    games.find(
      (game) => game.id === gameId
    );







  async function handleSave() {


    if (!gameId) {

      alert("Select a tiebreaker game.");

      return;

    }



    setSaving(true);



    try {


      await updateTiebreaker(
        weekId,
        {
          tiebreaker_game_id: gameId,

          tiebreaker_winner:
            winner || null,

          tiebreaker_total_points:
            totalPoints
              ? Number(totalPoints)
              : null,

          tiebreaker_home_points:
            homePoints
              ? Number(homePoints)
              : null,
        }
      );



      alert(
        "Tiebreaker result saved successfully!"
      );


      window.location.reload();



    } catch (error) {


      console.error(
        "SAVE TIEBREAKER ERROR:",
        error
      );


      alert(
        "Unable to save tiebreaker."
      );


    } finally {


      setSaving(false);


    }


  }








  return (

    <div className="mt-8 rounded-xl border p-6">


      <h3 className="mb-4 text-xl font-bold text-green-900">

        Tiebreaker Result

      </h3>





      <div className="space-y-4">



        <div>


          <label className="mb-1 block text-sm font-semibold">

            Tiebreaker Game

          </label>


          <select
            value={gameId}
            onChange={(e) => {

              setGameId(e.target.value);

              setWinner("");

            }}
            className="w-full rounded border px-3 py-2"
          >

            <option value="">
              Select Game
            </option>


            {games.map((game) => (

              <option
                key={game.id}
                value={game.id}
              >

                {game.away_team}
                {" vs "}
                {game.home_team}

              </option>

            ))}


          </select>


        </div>








        {selectedGame && (


          <div>


            <label className="mb-1 block text-sm font-semibold">

              Winner

            </label>



            <select
              value={winner}
              onChange={(e) =>
                setWinner(e.target.value)
              }
              className="w-full rounded border px-3 py-2"
            >

              <option value="">
                Select Winner
              </option>


              <option value={selectedGame.away_team}>
                {selectedGame.away_team}
              </option>


              <option value={selectedGame.home_team}>
                {selectedGame.home_team}
              </option>


            </select>


          </div>


        )}








        <div>


          <label className="mb-1 block text-sm font-semibold">

            Total Points

          </label>


          <input
            type="number"
            value={totalPoints}
            onChange={(e) =>
              setTotalPoints(e.target.value)
            }
            className="w-full rounded border px-3 py-2"
          />


        </div>








        <div>


          <label className="mb-1 block text-sm font-semibold">

            Home Team Points

          </label>


          <input
            type="number"
            value={homePoints}
            onChange={(e) =>
              setHomePoints(e.target.value)
            }
            className="w-full rounded border px-3 py-2"
          />


        </div>







        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-50"
        >

          {saving
            ? "Saving..."
            : "Save Tiebreaker Result"}

        </button>



      </div>


    </div>

  );

}