"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Trophy,
  Medal,
  ArrowRight,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type ResultsData = {
  correct: number;
  totalGames: number;
  seasonPoints: number;
  rank: number | null;
};

export default function YourResultsCard() {
  const [results, setResults] =
    useState<ResultsData | null>(null);

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
          JSON.parse(storedPlayer);

        if (!player?.id) {
          setLoading(false);
          return;
        }

        // Find the most recently completed week.
        const {
          data: completedWeek,
          error: weekError,
        } = await supabase
          .from("weeks")
          .select(
            "id, week_number"
          )
          .eq(
            "status",
            "COMPLETED"
          )
          .order(
            "week_number",
            {
              ascending: false,
            }
          )
          .limit(1)
          .maybeSingle();

        if (weekError) {
          throw new Error(
            weekError.message
          );
        }

        if (!completedWeek) {
          setResults({
            correct: 0,
            totalGames: 0,
            seasonPoints: 0,
            rank: null,
          });

          return;
        }

        // Get all games from the most recently completed week.
        const {
          data: games,
          error: gamesError,
        } = await supabase
          .from("games")
          .select(
            "id, winner"
          )
          .eq(
            "week_id",
            completedWeek.id
          );

        if (gamesError) {
          throw new Error(
            gamesError.message
          );
        }

        // Get the player's entry for the completed week.
        const {
          data: entry,
          error: entryError,
        } = await supabase
          .from("entries")
          .select(
            "id, score"
          )
          .eq(
            "player_id",
            player.id
          )
          .eq(
            "week_id",
            completedWeek.id
          )
          .maybeSingle();

        if (entryError) {
          throw new Error(
            entryError.message
          );
        }

        let correct = 0;

        if (entry) {
          const {
            data: picks,
            error: picksError,
          } = await supabase
            .from("picks")
            .select(
              "game_id, is_correct"
            )
            .eq(
              "entry_id",
              entry.id
            );

          if (picksError) {
            throw new Error(
              picksError.message
            );
          }

          correct =
            (picks ?? []).filter(
              (pick) =>
                pick.is_correct === true
            ).length;
        }

        // Get every completed-week entry so we can calculate
        // cumulative season scores.
        const {
          data: seasonEntries,
          error: seasonEntriesError,
        } = await supabase
          .from("entries")
          .select(
            `
            player_id,
            score,
            weeks (
              status
            )
            `
          );

        if (seasonEntriesError) {
          throw new Error(
            seasonEntriesError.message
          );
        }

        const completedEntries =
          (seasonEntries ?? []).filter(
            (item: any) =>
              item.weeks?.status ===
              "COMPLETED"
          );

        // Calculate this player's cumulative season score.
        const playerSeasonPoints =
          completedEntries
            .filter(
              (item: any) =>
                item.player_id ===
                player.id
            )
            .reduce(
              (
                total: number,
                item: any
              ) =>
                total +
                (item.score ?? 0),
              0
            );

        // Build season totals for every player.
        const seasonTotals =
          new Map<
            string,
            number
          >();

        for (const item of completedEntries as any[]) {
          const current =
            seasonTotals.get(
              item.player_id
            ) ?? 0;

          seasonTotals.set(
            item.player_id,
            current +
              (item.score ?? 0)
          );
        }

        // Rank all players by cumulative season score.
        const rankedPlayers =
          Array.from(
            seasonTotals.entries()
          )
            .sort(
              (
                [, scoreA],
                [, scoreB]
              ) =>
                scoreB -
                scoreA
            );

        const playerRankIndex =
          rankedPlayers.findIndex(
            ([playerId]) =>
              playerId ===
              player.id
          );

        const rank =
          playerRankIndex >= 0
            ? playerRankIndex + 1
            : null;

        setResults({
          correct,
          totalGames:
            games?.length ?? 0,
          seasonPoints:
            playerSeasonPoints,
          rank,
        });
      } catch (error) {
        console.error(
          "LOAD HOME RESULTS ERROR:",
          error
        );

        setResults(null);
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, []);

  const correct =
    results?.correct ?? 0;

  const totalGames =
    results?.totalGames ?? 0;

  const seasonPoints =
    results?.seasonPoints ?? 0;

  const rank =
    results?.rank ?? null;

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">

      <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700" />

      <div className="bg-gradient-to-r from-green-950 via-green-900 to-green-800 px-6 py-5 text-white">

        <div className="flex items-center gap-2">

          <BarChart3 className="h-5 w-5 text-yellow-400" />

          <h2 className="text-xl font-bold">
            Your Results
          </h2>

        </div>

        <p className="mt-1 text-sm text-green-200">
          Track your weekly and season performance
        </p>

      </div>

      <div className="grid gap-5 p-6 sm:grid-cols-3">

        <div className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-yellow-50 p-5 transition-all duration-200 hover:shadow-md">

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-700">

            <Trophy className="h-4 w-4" />

            This Week

          </div>

          <div className="mt-4 text-4xl font-black text-green-950">

            {loading
              ? "..."
              : `${correct}/${totalGames}`}

          </div>

          <p className="mt-2 text-xs text-slate-500">
            Correct picks this week
          </p>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:shadow-md">

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">

            <BarChart3 className="h-4 w-4" />

            Season Points

          </div>

          <div className="mt-4 text-4xl font-black text-green-900">

            {loading
              ? "..."
              : seasonPoints}

          </div>

          <p className="mt-2 text-xs text-slate-500">
            Total points earned
          </p>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:shadow-md">

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">

            <Medal className="h-4 w-4" />

            Rank

          </div>

          <div className="mt-4 text-4xl font-black text-green-900">

            {loading
              ? "..."
              : rank !== null
                ? `#${rank}`
                : "--"}

          </div>

          <p className="mt-2 text-xs text-slate-500">
            Current season standing
          </p>

        </div>

      </div>

      <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">

        <Link
          href="/results"
          className="inline-flex items-center gap-2 text-sm font-semibold text-green-900 transition-colors hover:text-green-700"
        >

          View Full Results

          <ArrowRight className="h-4 w-4" />

        </Link>

      </div>

    </section>
  );
}