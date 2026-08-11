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
  const [gameId, setGameId] = useState(existingGameId ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!gameId) {
      alert("Select a tiebreaker game.");
      return;
    }

    setSaving(true);

    try {
      await updateTiebreaker(weekId, {
        tiebreaker_game_id: gameId,
        tiebreaker_winner: existingWinner ?? null,
        tiebreaker_total_points:
          existingTotalPoints ?? null,
        tiebreaker_home_points:
          existingHomePoints ?? null,
      });

      alert("Tiebreaker game saved successfully!");

      window.location.reload();
    } catch (error) {
      console.error("SAVE TIEBREAKER GAME ERROR:", error);

      alert("Unable to save tiebreaker game.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-3xl border border-yellow-400/30 bg-yellow-50/50 p-6 shadow-sm">
      <div className="mb-4">
        <div className="text-xs font-black uppercase tracking-[0.25em] text-green-700">
          Weekly Setup
        </div>

        <h2 className="mt-2 text-2xl font-black text-green-950">
          Tiebreaker Game
        </h2>

        <p className="mt-2 text-sm font-medium text-slate-600">
          Select which game will be used as this week's tiebreaker.
        </p>
      </div>

      {games.length === 0 ? (
        <div className="rounded-xl bg-white p-4 font-semibold text-slate-500">
          Add games before selecting a tiebreaker.
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label
              htmlFor="tiebreaker-game"
              className="mb-2 block text-sm font-bold text-green-950"
            >
              Tiebreaker Game
            </label>

            <select
              id="tiebreaker-game"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              className="w-full rounded-xl border-2 border-green-100 bg-white px-4 py-3 font-semibold text-green-950 outline-none focus:border-yellow-400"
            >
              <option value="">
                Select Tiebreaker Game
              </option>

              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  Game {game.game_number}: {game.away_team} vs{" "}
                  {game.home_team}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !gameId}
            className="rounded-xl bg-green-950 px-6 py-3 font-black text-white shadow-lg transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Tiebreaker Game"}
          </button>
        </div>
      )}

      {gameId && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-900">
          Selected tiebreaker:{" "}
          {games.find((game) => game.id === gameId)?.away_team} vs{" "}
          {games.find((game) => game.id === gameId)?.home_team}
        </div>
      )}
    </section>
  );
}