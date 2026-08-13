"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import GameCard from "@/components/picks/GameCard";
import ProgressCard from "@/components/picks/ProgressCard";
import TiebreakerCard from "@/components/picks/TiebreakerCard";
import SubmitBar from "@/components/picks/SubmitBar";
import PicksSubmittedModal from "@/components/picks/PicksSubmittedModal";

import {
  getSavedPicks,
  savePicks,
} from "@/lib/picks";

interface Game {
  id: string;
  game_number: number;
  sport: string;
  away_team: string;
  home_team: string;
}

type SubmitPicksFormProps = {
  games: Game[];
  weekId: string;
  weekNumber: number;
  tiebreakerGameId: string | null;
  isLocked: boolean;
};

export default function SubmitPicksForm({
  games,
  weekId,
  weekNumber,
  tiebreakerGameId,
  isLocked,
}: SubmitPicksFormProps) {
  const [picks, setPicks] =
    useState<Record<string, string>>({});

  const [submitting, setSubmitting] =
    useState(false);

  const [loadingSavedPicks, setLoadingSavedPicks] =
    useState(true);

  const [submitted, setSubmitted] =
    useState(false);

  const [tiebreaker, setTiebreaker] =
    useState({
      winner: "",
      awayScore: "",
      homeScore: "",
    });

  const selectedCount =
    Object.keys(picks).length;

  const tiebreakerGame = useMemo(
    () =>
      games.find(
        (game) =>
          game.id === tiebreakerGameId
      ) ?? null,
    [games, tiebreakerGameId]
  );

  useEffect(() => {
    async function loadSavedPicks() {
      try {
        const storedPlayer =
          localStorage.getItem(
            "gotech_player"
          );

        if (!storedPlayer) {
          setLoadingSavedPicks(false);
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

        const homePoints =
          saved.tiebreaker.homePoints;

        const totalPoints =
          saved.tiebreaker.totalPoints;

        const awayPoints =
          totalPoints !== null &&
          homePoints !== null
            ? totalPoints - homePoints
            : null;

        setTiebreaker({
          winner:
            saved.tiebreaker.winner,

          awayScore:
            awayPoints !== null
              ? String(awayPoints)
              : "",

          homeScore:
            homePoints !== null
              ? String(homePoints)
              : "",
        });
      } catch (error) {
        console.error(
          "LOAD SAVED PICKS ERROR:",
          error
        );
      } finally {
        setLoadingSavedPicks(false);
      }
    }

    loadSavedPicks();
  }, [weekId]);

  function selectWinner(
    gameId: string,
    team: string
  ) {
    if (isLocked || submitting) {
      return;
    }

    setPicks((current) => ({
      ...current,
      [gameId]: team,
    }));
  }

  async function handleSubmit() {
    if (isLocked) {
      alert("Picks are currently locked.");
      return;
    }

    const storedPlayer =
      localStorage.getItem(
        "gotech_player"
      );

    if (!storedPlayer) {
      alert("Please log in first.");
      return;
    }

    const player =
      JSON.parse(storedPlayer);

    if (selectedCount !== games.length) {
      alert(
        "Please select a winner for every game."
      );
      return;
    }

    if (
      tiebreakerGame &&
      !tiebreaker.winner
    ) {
      alert(
        "Please select the tiebreaker winner."
      );
      return;
    }

    if (
      tiebreakerGame &&
      (
        tiebreaker.awayScore === "" ||
        tiebreaker.homeScore === ""
      )
    ) {
      alert(
        "Please enter the tiebreaker score."
      );
      return;
    }

    setSubmitting(true);

    try {
      await savePicks(
        player.id,
        weekId,
        picks,
        {
          winner:
            tiebreaker.winner,

          totalPoints:
            Number(
              tiebreaker.awayScore || 0
            ) +
            Number(
              tiebreaker.homeScore || 0
            ),

          homePoints:
            Number(
              tiebreaker.homeScore || 0
            ),
        }
      );

      setSubmitted(true);
    } catch (error) {
      console.error(
        "SUBMIT PICKS ERROR:",
        error
      );

      alert(
        "There was an error submitting your picks."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingSavedPicks) {
    return (
      <section className="rounded-3xl border border-yellow-500/20 bg-white p-8 shadow-xl">
        <div className="text-sm font-semibold text-slate-500">
          Loading your picks...
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="space-y-6">
        <ProgressCard
          selected={
            selectedCount
          }
          total={
            games.length
          }
        />

        <section className="overflow-hidden rounded-3xl border border-yellow-500/20 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-green-950 via-green-900 to-green-800 px-6 py-5 text-white">
            <div className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
              Week Picks
            </div>

            <h2 className="mt-1 text-xl font-black tracking-tight">
              Select Your Winners
            </h2>

            <p className="mt-1 text-sm font-medium text-yellow-200">
              {isLocked
                ? "Your submitted picks are shown below."
                : "Choose one team in every matchup."}
            </p>
          </div>

          <div>
            {games.map((game) => (
              <GameCard
                key={game.id}
                gameNumber={
                  game.game_number
                }
                awayTeam={
                  game.away_team
                }
                homeTeam={
                  game.home_team
                }
                selectedTeam={
                  picks[game.id]
                }
                onSelect={(team) =>
                  selectWinner(
                    game.id,
                    team
                  )
                }
                disabled={
                  isLocked ||
                  submitting
                }
              />
            ))}
          </div>
        </section>

        {tiebreakerGame && (
          <TiebreakerCard
            awayTeam={
              tiebreakerGame.away_team
            }
            homeTeam={
              tiebreakerGame.home_team
            }
            winner={
              tiebreaker.winner
            }
            awayScore={
              tiebreaker.awayScore
            }
            homeScore={
              tiebreaker.homeScore
            }
            onWinnerChange={(team) =>
              setTiebreaker(
                (current) => ({
                  ...current,
                  winner: team,
                })
              )
            }
            onAwayScoreChange={(
              score
            ) =>
              setTiebreaker(
                (current) => ({
                  ...current,
                  awayScore: score,
                })
              )
            }
            onHomeScoreChange={(
              score
            ) =>
              setTiebreaker(
                (current) => ({
                  ...current,
                  homeScore: score,
                })
              )
            }
            disabled={
              isLocked ||
              submitting
            }
          />
        )}

        <SubmitBar
          selected={
            selectedCount
          }
          total={
            games.length
          }
          onSubmit={
            handleSubmit
          }
          disabled={
            isLocked ||
            submitting
          }
        />
      </section>

      <PicksSubmittedModal
        open={submitted}
        weekNumber={
          weekNumber
        }
        totalGames={
          games.length
        }
        onClose={() =>
          setSubmitted(false)
        }
      />
    </>
  );
}