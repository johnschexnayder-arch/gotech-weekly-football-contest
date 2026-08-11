"use client";

import { useEffect, useState } from "react";

import DeadlineBanner from "@/components/picks/DeadlineBanner";
import GameCard from "@/components/picks/GameCard";
import ProgressCard from "@/components/picks/ProgressCard";
import SubmitBar from "@/components/picks/SubmitBar";
import TiebreakerCard from "@/components/picks/TiebreakerCard";
import PicksSubmittedModal from "@/components/picks/PicksSubmittedModal";

import {
  CurrentWeek,
  getCurrentWeek,
} from "@/lib/games";

import {
  savePicks,
  getSavedPicks,
} from "@/lib/picks";

import {
  getLoggedInPlayer,
} from "@/lib/auth";

export default function PicksPage() {
  const [week, setWeek] =
    useState<CurrentWeek | null>(null);

  const [selectedPicks, setSelectedPicks] =
    useState<Record<string, string>>({});

  const [isLocked, setIsLocked] =
    useState(false);

  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  const [tiebreaker, setTiebreaker] =
    useState({
      winner: "",
      totalPoints: "",
      homePoints: "",
    });

  useEffect(() => {
    async function loadWeek() {
      try {
        const data =
          await getCurrentWeek();

        setWeek(data);

        if (data) {
          const lockedByDeadline =
            new Date() >=
            new Date(data.deadline);

          const lockedByStatus =
            data.status === "LOCKED" ||
            data.status === "COMPLETED";

          setIsLocked(
            lockedByDeadline ||
            lockedByStatus
          );

          const player =
            getLoggedInPlayer();

          if (player) {
            const saved =
              await getSavedPicks(
                player.id,
                data.id
              );

            setSelectedPicks(
              saved.picks
            );

            setTiebreaker({
              winner:
                saved.tiebreaker.winner ?? "",

              totalPoints:
                saved.tiebreaker.totalPoints !== null
                  ? String(
                      saved.tiebreaker.totalPoints
                    )
                  : "",

              homePoints:
                saved.tiebreaker.homePoints !== null
                  ? String(
                      saved.tiebreaker.homePoints
                    )
                  : "",
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadWeek();
  }, []);

  function handlePick(
    gameId: string,
    team: string
  ) {
    if (isLocked) {
      return;
    }

    setSelectedPicks(
      (previous) => {
        const updated = {
          ...previous,
        };

        if (
          updated[gameId] === team
        ) {
          delete updated[gameId];
        } else {
          updated[gameId] = team;
        }

        return updated;
      }
    );
  }

  async function handleSubmit() {
    if (isLocked) {
      alert(
        "Picks are locked."
      );

      return;
    }

    const player =
      getLoggedInPlayer();

    if (!player) {
      alert(
        "Please login first."
      );

      return;
    }

    if (!week) {
      alert(
        "No active week found."
      );

      return;
    }

    if (
      Object.keys(selectedPicks).length !==
      week.games.length
    ) {
      alert(
        "Please select a winner for every game."
      );

      return;
    }

    try {
      await savePicks(
        player.id,
        week.id,
        selectedPicks,
        {
          winner:
            tiebreaker.winner,

          totalPoints:
            Number(
              tiebreaker.totalPoints
            ),

          homePoints:
            Number(
              tiebreaker.homePoints
            ),
        }
      );

      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Error saving picks."
      );
    }
  }

  if (!week) {
    return (
      <main className="p-6">
        <p>
          Loading...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6">
      <h1 className="text-4xl font-bold text-green-900">
        Week {week.weekNumber} Picks
      </h1>

      <DeadlineBanner
        deadline={
          week.deadline
        }
        isLocked={
          isLocked
        }
      />

      <ProgressCard
        selected={
          Object.keys(selectedPicks).length
        }
        total={
          week.games.length
        }
      />

      <section className="overflow-hidden rounded-3xl bg-white shadow-lg">
        <div className="bg-green-900 px-6 py-5 text-white">
          <h2 className="text-xl font-semibold">
            Weekly Matchups
          </h2>
        </div>

        {week.games.map(
          (game, index) => (
            <GameCard
              key={
                game.id
              }
              gameNumber={
                index + 1
              }
              awayTeam={
                game.awayTeam
              }
              homeTeam={
                game.homeTeam
              }
              selectedTeam={
                selectedPicks[game.id]
              }
              onSelect={
                (team) =>
                  handlePick(
                    game.id,
                    team
                  )
              }
              disabled={
                isLocked
              }
            />
          )
        )}
      </section>

      <TiebreakerCard
        awayTeam={
          week.games[0]?.awayTeam ?? ""
        }
        homeTeam={
          week.games[0]?.homeTeam ?? ""
        }
        winner={
          tiebreaker.winner
        }
        awayScore={
          tiebreaker.totalPoints
        }
        homeScore={
          tiebreaker.homePoints
        }
        onWinnerChange={
          (value) =>
            setTiebreaker(
              (prev) => ({
                ...prev,
                winner: value,
              })
            )
        }
        onAwayScoreChange={
          (value) =>
            setTiebreaker(
              (prev) => ({
                ...prev,
                totalPoints: value,
              })
            )
        }
        onHomeScoreChange={
          (value) =>
            setTiebreaker(
              (prev) => ({
                ...prev,
                homePoints: value,
              })
            )
        }
        disabled={
          isLocked
        }
      />

      <SubmitBar
        selected={
          Object.keys(selectedPicks).length
        }
        total={
          week.games.length
        }
        disabled={
          isLocked
        }
        onSubmit={
          handleSubmit
        }
      />

      <PicksSubmittedModal
        open={
          showSuccessModal
        }
        weekNumber={
          week.weekNumber
        }
        totalGames={
          week.games.length
        }
        onClose={() =>
          setShowSuccessModal(false)
        }
      />
    </main>
  );
}