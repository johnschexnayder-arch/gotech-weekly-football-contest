"use client";

import { useState } from "react";
import { savePicks } from "@/lib/picks";

interface Game {
  id: string;
  game_number: number;
  sport: string;
  away_team: string;
  home_team: string;
}

export default function SubmitPicksForm({
  games,
  weekId,
}: {
  games: Game[];
  weekId: string;
}) {
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const [tiebreaker, setTiebreaker] = useState({
    winner: "",
    totalPoints: "",
    homePoints: "",
  });


  function selectWinner(gameId: string, team: string) {
    setPicks((current) => ({
      ...current,
      [gameId]: team,
    }));
  }


  async function handleSubmit() {
    const storedPlayer =
      localStorage.getItem("gotech_player");


    if (!storedPlayer) {
      alert("Please log in first.");
      return;
    }


    const player = JSON.parse(storedPlayer);


    if (Object.keys(picks).length !== games.length) {
      alert("Please select a winner for every game.");
      return;
    }


    setSubmitting(true);


    try {
      await savePicks(
        player.id,
        weekId,
        picks,
        {
          winner: tiebreaker.winner,
          totalPoints: Number(
            tiebreaker.totalPoints
          ),
          homePoints: Number(
            tiebreaker.homePoints
          ),
        }
      );


      alert("Picks submitted successfully!");


    } catch (error) {

      console.error(error);

      alert("Error submitting picks.");

    } finally {

      setSubmitting(false);

    }
  }


  return (
    <div>

      <div className="mb-6 rounded-xl bg-green-50 p-4">
        Logged in as{" "}
        <strong>
          {
            JSON.parse(
              localStorage.getItem("gotech_player") || "{}"
            ).name
          }
        </strong>
      </div>


      <div className="space-y-5">

        {games.map((game) => (

          <div
            key={game.id}
            className="rounded-lg border p-5"
          >

            <div className="mb-3 font-semibold">
              Game {game.game_number}:{" "}
              {game.away_team} vs {game.home_team}
            </div>


            <div className="grid gap-3 md:grid-cols-2">

              <button
                type="button"
                onClick={() =>
                  selectWinner(
                    game.id,
                    game.away_team
                  )
                }
                className={`rounded border px-4 py-3 ${
                  picks[game.id] === game.away_team
                    ? "bg-green-700 text-white"
                    : ""
                }`}
              >
                {game.away_team}
              </button>


              <button
                type="button"
                onClick={() =>
                  selectWinner(
                    game.id,
                    game.home_team
                  )
                }
                className={`rounded border px-4 py-3 ${
                  picks[game.id] === game.home_team
                    ? "bg-green-700 text-white"
                    : ""
                }`}
              >
                {game.home_team}
              </button>

            </div>

          </div>

        ))}

      </div>


      <div className="mt-8 rounded-xl border p-5">

        <h3 className="mb-4 font-bold">
          Tiebreaker
        </h3>


        <div className="grid gap-4 md:grid-cols-3">

          <input
            value={tiebreaker.winner}
            onChange={(e) =>
              setTiebreaker((current) => ({
                ...current,
                winner: e.target.value,
              }))
            }
            placeholder="Winning Team"
            className="rounded border px-4 py-3"
          />


          <input
            type="number"
            value={tiebreaker.totalPoints}
            onChange={(e) =>
              setTiebreaker((current) => ({
                ...current,
                totalPoints: e.target.value,
              }))
            }
            placeholder="Total Points"
            className="rounded border px-4 py-3"
          />


          <input
            type="number"
            value={tiebreaker.homePoints}
            onChange={(e) =>
              setTiebreaker((current) => ({
                ...current,
                homePoints: e.target.value,
              }))
            }
            placeholder="Home Team Points"
            className="rounded border px-4 py-3"
          />

        </div>

      </div>


      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="mt-8 rounded bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
      >
        {submitting
          ? "Submitting..."
          : "Submit Picks"}
      </button>

    </div>
  );
}