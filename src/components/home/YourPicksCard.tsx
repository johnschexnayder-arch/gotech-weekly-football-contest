"use client";

import { useEffect, useState } from "react";

import { getSavedPicks } from "@/lib/picks";

type Game = {
  id: string;
  away: string;
  home: string;
  kickoff: string;
};

type YourPicksCardProps = {
  games: Game[];
  weekId: string | null;
};

export default function YourPicksCard({
  games = [],
  weekId,
}: YourPicksCardProps) {
  const [picks, setPicks] =
    useState<Record<string, string>>({});

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadPicks() {
      try {
        const storedPlayer =
          localStorage.getItem(
            "gotech_player"
          );

        if (!storedPlayer || !weekId) {
          setLoading(false);
          return;
        }

        const player =
          JSON.parse(storedPlayer);

        const saved =
          await getSavedPicks(
            player.id,
            weekId
          );

        setPicks(saved.picks);
      } catch (error) {
        console.error(
          "LOAD HOMEPAGE PICKS ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadPicks();
  }, [weekId]);

  return (
    <section className="overflow-hidden rounded-3xl border border-yellow-500/20 bg-white shadow-xl">
      <div className="flex items-center justify-between bg-gradient-to-r from-green-950 via-green-900 to-green-800 px-6 py-5 text-white">
        <div>
          <h2 className="text-xl font-black tracking-tight">
            Week Picks
          </h2>

          <p className="mt-1 text-sm font-medium text-yellow-200">
            Your submitted selections
          </p>
        </div>

        <div className="rounded-full border border-yellow-400/50 bg-yellow-500/20 px-4 py-2 text-sm font-black text-yellow-200">
          {games.length} Games
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {games.map((game, index) => {
          const selectedTeam =
            picks[game.id];

          return (
            <div
              key={game.id}
              className="flex items-center justify-between px-6 py-4 transition hover:bg-green-50/40"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-900 text-xs font-black text-white shadow">
                  {index + 1}
                </div>

                <div>
                  <div className="text-sm font-black text-slate-900">
                    {game.away}

                    <span className="mx-2 text-yellow-600">
                      @
                    </span>

                    {game.home}
                  </div>

                  <div className="mt-1 text-xs font-medium text-slate-400">
                    {game.kickoff}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <div
                  className={`rounded-lg border px-3 py-1.5 text-xs font-black uppercase transition ${
                    selectedTeam ===
                    game.away
                      ? "border-yellow-400 bg-gradient-to-r from-yellow-500 to-yellow-600 text-green-950 shadow"
                      : "border-slate-200 text-slate-400"
                  }`}
                >
                  {game.away}
                </div>

                <div
                  className={`rounded-lg border px-3 py-1.5 text-xs font-black uppercase transition ${
                    selectedTeam ===
                    game.home
                      ? "border-yellow-400 bg-gradient-to-r from-yellow-500 to-yellow-600 text-green-950 shadow"
                      : "border-slate-200 text-slate-400"
                  }`}
                >
                  {game.home}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!loading &&
        games.length > 0 &&
        Object.keys(picks).length ===
          0 && (
          <div className="border-t border-slate-100 px-6 py-4 text-sm font-semibold text-slate-400">
            No picks have been submitted for this week.
          </div>
        )}
    </section>
  );
}