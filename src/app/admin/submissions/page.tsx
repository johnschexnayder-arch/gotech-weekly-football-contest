"use client";

import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase";
import { getPlayers } from "@/lib/players";
import { getWeeks } from "@/lib/weeks";

type Player = {
  id: string;
  name: string;
  email: string | null;
};

type Week = {
  id: string;
  week_number: number;
  deadline: string;
  status: "OPEN" | "LOCKED" | "COMPLETED";
};

type Submission = {
  player_id: string;
};

export default function SubmissionStatusPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedWeekId, setSelectedWeekId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] =
    useState(false);

  async function loadInitialData() {
    try {
      const [playerData, weekData] = await Promise.all([
        getPlayers(),
        getWeeks(),
      ]);

      setPlayers(playerData);
      setWeeks(weekData);

      const openWeek =
        weekData.find((week) => week.status === "OPEN") ??
        weekData[0];

      if (openWeek) {
        setSelectedWeekId(openWeek.id);
      }
    } catch (error) {
      console.error(
        "LOAD SUBMISSION STATUS ERROR:",
        error
      );

      alert("Unable to load submission status.");
    } finally {
      setLoading(false);
    }
  }

  async function loadSubmissions(weekId: string) {
    if (!weekId) {
      setSubmissions([]);
      return;
    }

    setLoadingSubmissions(true);

    try {
      const { data, error } = await supabase
        .from("entries")
        .select("player_id")
        .eq("week_id", weekId);

      if (error) {
        throw error;
      }

      setSubmissions((data ?? []) as Submission[]);
    } catch (error) {
      console.error(
        "LOAD SUBMISSIONS ERROR:",
        error
      );

      alert("Unable to load submission status.");
    } finally {
      setLoadingSubmissions(false);
    }
  }

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedWeekId) {
      loadSubmissions(selectedWeekId);
    }
  }, [selectedWeekId]);

  const submittedPlayerIds = useMemo(
    () =>
      new Set(
        submissions.map(
          (submission) => submission.player_id
        )
      ),
    [submissions]
  );

  const submittedCount = players.filter(
    (player) =>
      submittedPlayerIds.has(player.id)
  ).length;

  const notSubmittedCount =
    players.length - submittedCount;

  const selectedWeek = weeks.find(
    (week) => week.id === selectedWeekId
  );

  if (loading) {
    return (
      <main className="p-6">
        Loading submission status...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-12">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-green-950 via-green-900 to-green-800 p-8 text-white shadow-xl">
        <div className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
          Commissioner Tools
        </div>

        <h1 className="mt-3 text-4xl font-black">
          Pick Submission Status
        </h1>

        <p className="mt-2 text-green-100">
          See who has submitted picks and who still needs to submit.
        </p>
      </section>

      <section className="rounded-3xl border border-yellow-400/20 bg-white p-6 shadow-xl">
        <div className="flex flex-wrap items-center gap-4">
          <label
            htmlFor="week"
            className="font-black uppercase tracking-wide text-green-950"
          >
            Week
          </label>

          <select
            id="week"
            value={selectedWeekId}
            onChange={(event) =>
              setSelectedWeekId(event.target.value)
            }
            className="rounded-xl border-2 border-green-100 bg-green-50 px-4 py-2 font-semibold text-green-950 outline-none focus:border-yellow-400"
          >
            {weeks.map((week) => (
              <option
                key={week.id}
                value={week.id}
              >
                Week {week.week_number} ({week.status})
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-green-200 bg-green-50 p-6 shadow-lg">
          <div className="text-sm font-black uppercase tracking-wide text-green-700">
            Submitted
          </div>

          <div className="mt-2 text-4xl font-black text-green-950">
            {submittedCount}
          </div>

          <div className="mt-1 text-sm font-semibold text-green-700">
            players
          </div>
        </div>

        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-lg">
          <div className="text-sm font-black uppercase tracking-wide text-red-600">
            Not Submitted
          </div>

          <div className="mt-2 text-4xl font-black text-red-950">
            {notSubmittedCount}
          </div>

          <div className="mt-1 text-sm font-semibold text-red-600">
            players
          </div>
        </div>

        <div className="rounded-3xl border border-yellow-300 bg-yellow-50 p-6 shadow-lg">
          <div className="text-sm font-black uppercase tracking-wide text-yellow-700">
            Total Players
          </div>

          <div className="mt-2 text-4xl font-black text-green-950">
            {players.length}
          </div>

          <div className="mt-1 text-sm font-semibold text-yellow-700">
            registered
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-yellow-400/20 bg-white shadow-xl">
        <div className="bg-green-950 px-6 py-5 text-white">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
            Week {selectedWeek?.week_number ?? ""}
          </div>

          <h2 className="mt-1 text-2xl font-black">
            Player Status
          </h2>

          {selectedWeek && (
            <p className="mt-1 text-sm font-medium text-green-200">
              Deadline:{" "}
              {new Date(
                selectedWeek.deadline
              ).toLocaleString("en-US", {
                timeZone: "America/Chicago",
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>

        {loadingSubmissions ? (
          <div className="p-8 text-center font-semibold text-slate-500">
            Loading submission status...
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {players.map((player) => {
              const submitted =
                submittedPlayerIds.has(player.id);

              return (
                <div
                  key={player.id}
                  className="flex flex-wrap items-center justify-between gap-4 px-6 py-5"
                >
                  <div>
                    <div className="text-lg font-black text-green-950">
                      {player.name}
                    </div>

                    {player.email && (
                      <div className="text-sm font-medium text-slate-500">
                        {player.email}
                      </div>
                    )}
                  </div>

                  {submitted ? (
                    <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-800">
                      ✓ Submitted
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-black text-red-700">
                      ! Not Submitted
                    </span>
                  )}
                </div>
              );
            })}

            {players.length === 0 && (
              <div className="p-8 text-center font-semibold text-slate-500">
                No players registered.
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
