"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
          localStorage.getItem("gotech_player");

        if (!storedPlayer || !weekId) {
          setLoading(false);
          return;
        }

        const player = JSON.parse(storedPlayer);

        const saved = await getSavedPicks(
          player.id,
          weekId
        );

        setPicks(saved.picks ?? {});
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

  const hasSubmittedPicks =
    Object.keys(picks).length > 0;

  return (
    <section className="overflow-hidden rounded-3xl border border-yellow-500/20 bg-white shadow-xl">
      <div className="flex items-center justify-between bg-gradient-to-r from-green-950 via-green-900 to-green-800 px-6 py-5 text-white">
        <div>
          <h2 className="text-xl font-black tracking-tight">
            Week Picks
          </h2>

          <p className="mt-1 text-sm font-medium text-yellow-200">
            {hasSubmittedPicks
              ? "Your submitted selections"
              : "Your weekly pick status"}
          </p>
        </div>

        <div className="rounded-full border border-yellow-400/50 bg-yellow-500/20 px-4 py-2 text-sm font-black text-yellow-200">
          {games.length} Games
        </div>
      </div>

      {loading ? (
        <div className="px-6 py-10 text-center text-sm font-semibold text-slate-400">
          Loading your picks...
        </div>
      ) : !hasSubmittedPicks ? (
        <div className="px-6 py-8">
          <div className="rounded-2xl border border-yellow-400/30 bg-yellow-50 p-6 text-center">
            <div className="text-sm font-black uppercase tracking-[0.2em] text-green-700">
              Picks Not Submitted
            </div>

            <h3 className="mt-2 text-2xl font-black text-green-950">
              Your picks are waiting for you.
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Make your selections on the Make Picks page,
              then submit them before the weekly deadline.
            </p>

            <Link
              href="/picks"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-3 font-black text-green-950 shadow-lg transition hover:from-yellow-400 hover:to-yellow-500"
            >
              MAKE YOUR PICKS →
            </Link>
          </div>
        </div>
      ) : (
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
                      selectedTeam === game.away
                        ? "border-yellow-400 bg-gradient-to-r from-yellow-500 to-yellow-600 text-green-950 shadow"
                        : "border-slate-200 text-slate-400"
                    }`}
                  >
                    {game.away}
                  </div>

                  <div
                    className={`rounded-lg border px-3 py-1.5 text-xs font-black uppercase transition ${
                      selectedTeam === game.home
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

          <div className="border-t border-green-100 bg-green-50 px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-black text-green-900">
                  ✓ Picks Submitted
                </div>

                <div className="text-xs font-medium text-slate-500">
                  Your selections have been saved for this week.
                </div>
              </div>

              <Link
                href="/picks"
                className="font-black text-green-900 transition hover:text-yellow-600"
              >
                View / Edit Picks →
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}