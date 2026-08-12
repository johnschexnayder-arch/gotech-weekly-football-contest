"use client";

import { useState } from "react";
import { updateTiebreaker } from "@/lib/weeks";

type Game = {
  id: string;
  game_number: number;
  away_team: string;
  home_team: string;
};

type Props = {
  weekId: string;
  games: Game[];
  existingGameId?: string | null;
  existingWinner?: string | null;
  existingTotalPoints?: number | null;
  existingHomePoints?: number | null;
};

export default function TiebreakerGameSelector({
  weekId,
  games,
  existingGameId = null,
  existingWinner = null,
  existingTotalPoints = null,
  existingHomePoints = null,
}: Props) {
  const [gameId, setGameId] =
    useState(existingGameId ?? "");

  const [saving, setSaving] =
    useState(false);

  async function handleSave() {
    if (!gameId) {
      alert(
        "Select a tiebreaker game."
      );
      return;
    }

    setSaving(true);

    try {
      await updateTiebreaker(
        weekId,
        {
          tiebreaker_game_id:
            gameId,

          tiebreaker_winner:
            existingWinner ?? null,

          tiebreaker_total_points:
            existingTotalPoints ?? null,

          tiebreaker_home_points:
            existingHomePoints ?? null,
        }
      );

      alert(
        "Tiebreaker game saved successfully!"
      );

      window.location.reload();
    } catch (error) {
      console.error(
        "SAVE TIEBREAKER GAME ERROR:",
        error
      );

      alert(
        "Unable to save tiebreaker game."
      );
    } finally {
      setSaving(false);
    }
  }

  const selectedGame =
    games.find(
      (game) =>
        game.id === gameId
    );

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-3xl border border-yellow-400/30 bg-yellow-50/50 p-4 shadow-sm sm:p-6">
      <div className="mb-4 min-w-0">
        <div className="text-xs font-black uppercase tracking-[0.2em] text-green-700 sm:tracking-[0.25em]">
          Weekly Setup
        </div>

        <h2 className="mt-2 text-xl font-black text-green-950 sm:text-2xl">
          Tiebreaker Game
        </h2>

        <p className="mt-2 break-words text-sm font-medium leading-6 text-slate-600">
          Select which game will be used as this week's tiebreaker.
        </p>
      </div>

      {games.length === 0 ? (
        <div className="w-full rounded-xl bg-white p-4 font-semibold text-slate-500">
          Add games before selecting a tiebreaker.
        </div>
      ) : (
        <div className="flex min-w-0 flex-col gap-4">
          <div className="min-w-0 w-full">
            <label
              htmlFor="tiebreaker-game"
              className="mb-2 block text-sm font-bold text-green-950"
            >
              Tiebreaker Game
            </label>

            <select
              id="tiebreaker-game"
              value={gameId}
              onChange={(e) =>
                setGameId(e.target.value)
              }
              className="block w-full min-w-0 max-w-full rounded-xl border-2 border-green-100 bg-white px-4 py-3 text-sm font-semibold text-green-950 outline-none focus:border-yellow-400 sm:text-base"
            >
              <option value="">
                Select Tiebreaker Game
              </option>

              {games.map(
                (game) => (
                  <option
                    key={game.id}
                    value={game.id}
                  >
                    Game{" "}
                    {game.game_number}:{" "}
                    {game.away_team} vs{" "}
                    {game.home_team}
                  </option>
                )
              )}
            </select>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              saving ||
              !gameId
            }
            className="w-full rounded-xl bg-green-950 px-6 py-3 font-black text-white shadow-lg transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:self-start"
          >
            {saving
              ? "Saving..."
              : "Save Tiebreaker Game"}
          </button>
        </div>
      )}

      {selectedGame && (
        <div className="mt-4 w-full min-w-0 break-words rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold leading-6 text-green-900">
          Selected tiebreaker:{" "}
          {selectedGame.away_team} vs{" "}
          {selectedGame.home_team}
        </div>
      )}
    </section>
  );
}