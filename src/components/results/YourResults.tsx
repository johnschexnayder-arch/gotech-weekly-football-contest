"use client";

import { useEffect, useState } from "react";

import {
  getSavedPicks,
  SavedPicks,
} from "@/lib/picks";

import { CurrentWeek } from "@/lib/games";

type TiebreakerGame = {
  awayTeam: string;
  homeTeam: string;
  winner: string | null;
  totalPoints: number | null;
  homePoints: number | null;
};

type YourResultsProps = {
  week: CurrentWeek;
  tiebreakerGame: TiebreakerGame | null;
};

export default function YourResults({
  week,
  tiebreakerGame,
}: YourResultsProps) {
  const [saved, setSaved] =
    useState<SavedPicks | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadResults() {
      try {
        const storedPlayer =
          localStorage.getItem(
            "gotech_player"
          );

        if (!storedPlayer) {
          setLoading(false);
          return;
        }

        const player =
          JSON.parse(
            storedPlayer
          );

        const results =
          await getSavedPicks(
            player.id,
            week.id
          );

        setSaved(results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, [week.id]);

  if (loading) {
    return (
      <section className="rounded-3xl bg-white p-6 shadow-xl">
        Loading your results...
      </section>
    );
  }

  if (!saved) {
    return (
      <section className="rounded-3xl border border-yellow-500/20 bg-white p-6 shadow-xl">
        <h2 className="text-xl font-black text-green-950">
          Your Results
        </h2>

        <p className="mt-3 text-slate-600">
          Log in to view your picks.
        </p>
      </section>
    );
  }

  const correctCount =
    week.games.filter(
      (game) =>
        saved.picks[game.id] &&
        saved.picks[game.id] ===
          game.winner
    ).length;

  return (
    <section className="overflow-hidden rounded-3xl border border-yellow-500/20 bg-white shadow-xl">
      <div className="bg-gradient-to-r from-green-950 via-green-900 to-green-800 px-6 py-5 text-white">
        <h2 className="text-xl font-black tracking-tight">
          Your Results
        </h2>

        <p className="mt-1 text-sm font-medium text-yellow-200">
          Weekly performance summary
        </p>
      </div>

      <div className="p-6">
        <div className="mb-6 rounded-2xl border border-yellow-400/30 bg-gradient-to-r from-green-50 to-yellow-50 p-6">
          <div className="text-sm font-black uppercase tracking-wide text-green-700">
            Weekly Score
          </div>

          <div className="mt-2 text-6xl font-black text-green-950">
            {correctCount}/
            {week.games.length}
          </div>
        </div>

        <div className="space-y-4">
          {week.games.map(
            (game, index) => {
              const pick =
                saved.picks[
                  game.id
                ];

              const correct =
                pick &&
                pick ===
                  game.winner;

              return (
                <div
                  key={game.id}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-yellow-400/40"
                >
                  <div className="text-xs font-black uppercase tracking-wide text-green-700">
                    Game {index + 1}
                  </div>

                  <div className="mt-2 text-lg font-black text-green-950">
                    {game.awayTeam}

                    <span className="mx-2 text-yellow-600">
                      @
                    </span>

                    {game.homeTeam}
                  </div>

                  <div className="mt-4 grid gap-4 text-sm md:grid-cols-3">
                    <div>
                      <div className="font-black uppercase text-slate-400">
                        Your Pick
                      </div>

                      <div className="mt-1 font-bold text-slate-900">
                        {pick ??
                          "Not picked"}
                      </div>
                    </div>

                    <div>
                      <div className="font-black uppercase text-slate-400">
                        Winner
                      </div>

                      <div className="mt-1 font-bold text-slate-900">
                        {game.winner ??
                          "Pending"}
                      </div>
                    </div>

                    <div
                      className={`font-black ${
                        correct
                          ? "text-green-700"
                          : "text-red-600"
                      }`}
                    >
                      <div className="uppercase text-slate-400">
                        Result
                      </div>

                      <div className="mt-1">
                        {game.winner
                          ? correct
                            ? "✓ Correct"
                            : "✗ Incorrect"
                          : "Pending"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* Tiebreaker */}

        <div className="mt-6 rounded-2xl border border-yellow-400/30 bg-gradient-to-r from-green-50 to-yellow-50 p-5">
          <div className="text-sm font-black uppercase tracking-wide text-green-700">
            Tiebreaker Game
          </div>

          {tiebreakerGame ? (
            <>
              <div className="mt-3 text-xl font-black text-green-950">
                {tiebreakerGame.awayTeam}

                <span className="mx-2 text-yellow-600">
                  @
                </span>

                {tiebreakerGame.homeTeam}
              </div>

              <div className="mt-4 rounded-xl bg-white/80 p-4">
                <div className="text-xs font-black uppercase tracking-wide text-slate-400">
                  Final Score
                </div>

                <div className="mt-1 text-2xl font-black text-green-950">
                  {tiebreakerGame.totalPoints !==
                    null &&
                  tiebreakerGame.homePoints !==
                    null
                    ? tiebreakerGame.awayTeam ===
                      tiebreakerGame.winner
                      ? `${tiebreakerGame.totalPoints - tiebreakerGame.homePoints} - ${tiebreakerGame.homePoints}`
                      : `${tiebreakerGame.homePoints} - ${tiebreakerGame.totalPoints - tiebreakerGame.homePoints}`
                    : "Score unavailable"}
                </div>
              </div>

              <div className="mt-4 grid gap-4 text-sm md:grid-cols-3">
                <div>
                  <div className="font-black uppercase text-slate-400">
                    Winner
                  </div>

                  <div className="mt-1 font-bold text-slate-900">
                    {tiebreakerGame.winner ??
                      "Pending"}
                  </div>
                </div>

                <div>
                  <div className="font-black uppercase text-slate-400">
                    Total Points
                  </div>

                  <div className="mt-1 font-bold text-slate-900">
                    {tiebreakerGame.totalPoints ??
                      "—"}
                  </div>
                </div>

                <div>
                  <div className="font-black uppercase text-slate-400">
                    Home Team Points
                  </div>

                  <div className="mt-1 font-bold text-slate-900">
                    {tiebreakerGame.homePoints ??
                      "—"}
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-yellow-200 pt-4">
                <div className="text-xs font-black uppercase tracking-wide text-green-700">
                  Your Prediction
                </div>

                <div className="mt-1 text-lg font-black text-green-950">
                  {saved.tiebreaker.winner ||
                    "No pick"}
                </div>

                {saved.tiebreaker
                  .totalPoints !==
                  null && (
                  <p className="mt-1 font-semibold text-slate-700">
                    Your Total Points:{" "}
                    {
                      saved.tiebreaker
                        .totalPoints
                    }
                  </p>
                )}

                {saved.tiebreaker
                  .homePoints !==
                  null && (
                  <p className="font-semibold text-slate-700">
                    Your Home Team Points:{" "}
                    {
                      saved.tiebreaker
                        .homePoints
                    }
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="mt-3 text-slate-600">
              Tiebreaker game information unavailable.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}