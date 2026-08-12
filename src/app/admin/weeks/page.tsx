"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getLoggedInPlayer } from "@/lib/auth";

import {
  getWeeks,
  createWeek,
  updateWeek,
  deleteWeekCascade,
} from "@/lib/weeks";

type Week = Awaited<
  ReturnType<typeof getWeeks>
>[number];

type WeekStatus =
  | "OPEN"
  | "LOCKED"
  | "COMPLETED";

export default function WeeksPage() {
  const router = useRouter();

  const [weeks, setWeeks] =
    useState<Week[]>([]);

  const [deadline, setDeadline] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  async function loadWeeks() {
    const data =
      await getWeeks();

    setWeeks(data);
    setLoading(false);
  }

  useEffect(() => {
    const player =
      getLoggedInPlayer();

    if (!player?.is_admin) {
      router.replace("/");
      return;
    }

    loadWeeks();
  }, [router]);

  async function handleCreateWeek() {
    if (!deadline) {
      alert(
        "Please select a deadline."
      );

      return;
    }

    try {
      // datetime-local values are local browser time.
      // Convert to UTC before storing in Supabase.
      const isoDeadline =
        new Date(
          deadline
        ).toISOString();

      await createWeek(
        isoDeadline
      );

      alert(
        "Week created."
      );

      setDeadline("");

      await loadWeeks();
    } catch (error) {
      console.error(
        error
      );

      alert(
        "Unable to create week."
      );
    }
  }

  async function changeStatus(
    id: string,
    currentDeadline: string,
    status: WeekStatus
  ) {
    try {
      await updateWeek(
        id,
        currentDeadline,
        status
      );

      alert(
        `Week updated to ${status}`
      );

      await loadWeeks();
    } catch (error) {
      console.error(
        "Week update failed:",
        error
      );

      alert(
        "Week update failed."
      );
    }
  }

  async function handleDeleteWeek(
    id: string,
    weekNumber: number
  ) {
    const confirmed =
      confirm(
        `Delete Week ${weekNumber}?\n\nThis will permanently remove games, entries, and picks.`
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteWeekCascade(
        id
      );

      alert(
        "Week deleted successfully."
      );

      await loadWeeks();
    } catch (error) {
      console.error(
        "Delete week failed:",
        error
      );

      if (
        error instanceof Error
      ) {
        alert(
          error.message
        );
      } else {
        alert(
          "Unable to delete week."
        );
      }
    }
  }

  if (loading) {
    return (
      <main className="p-6">
        Loading weeks...
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-green-950 via-green-900 to-green-800 p-5 text-white shadow-xl sm:p-8">
        <div className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400 sm:tracking-[0.35em]">
          Commissioner Tools
        </div>

        <h1 className="mt-3 text-3xl font-black sm:text-4xl">
          Week Management
        </h1>

        <p className="mt-2 text-sm leading-6 text-green-100 sm:text-base">
          Create, open, lock, complete, and delete contest weeks.
        </p>
      </section>

      <section className="rounded-3xl border border-yellow-400/20 bg-white p-4 shadow-xl sm:p-6">
        <h2 className="mb-5 text-xl font-black text-green-950 sm:text-2xl">
          Create New Week
        </h2>

        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) =>
              setDeadline(
                e.target.value
              )
            }
            className="w-full min-w-0 rounded-xl border-2 border-green-100 bg-green-50 px-4 py-3 font-semibold text-green-950 outline-none focus:border-yellow-400 sm:w-auto"
          />

          <button
            onClick={
              handleCreateWeek
            }
            className="w-full rounded-xl border-2 border-yellow-400 bg-green-950 px-6 py-3 font-black uppercase tracking-wide text-white shadow-lg transition hover:bg-green-900 sm:w-auto"
          >
            Create Week
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-yellow-400/20 bg-white p-4 shadow-xl sm:p-6">
        <h2 className="mb-5 text-xl font-black text-green-950 sm:text-2xl">
          Existing Weeks
        </h2>

        <div className="space-y-4">
          {weeks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-10 text-center text-sm font-semibold text-slate-500">
              No contest weeks have been created yet.
            </div>
          ) : (
            weeks.map(
              (week) => (
                <div
                  key={week.id}
                  className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-yellow-400/40 sm:p-5"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="text-xl font-black text-green-950">
                          Week{" "}
                          {
                            week.week_number
                          }
                        </h3>

                        <p className="mt-1 break-words text-sm font-medium leading-6 text-slate-500">
                          Deadline{" "}
                          {new Date(
                            week.deadline
                          ).toLocaleString()}
                        </p>
                      </div>

                      <span
                        className={`self-start rounded-full px-4 py-2 text-sm font-black sm:self-auto ${
                          week.status ===
                          "OPEN"
                            ? "bg-green-100 text-green-800"
                            : week.status ===
                              "LOCKED"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {
                          week.status
                        }
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
                      <button
                        onClick={() =>
                          changeStatus(
                            week.id,
                            week.deadline,
                            "OPEN"
                          )
                        }
                        className="w-full rounded-xl bg-green-950 px-5 py-3 font-black text-white transition hover:bg-green-800 sm:w-auto"
                      >
                        Open
                      </button>

                      <button
                        onClick={() =>
                          changeStatus(
                            week.id,
                            week.deadline,
                            "LOCKED"
                          )
                        }
                        className="w-full rounded-xl border-2 border-yellow-400 bg-yellow-400 px-5 py-3 font-black text-green-950 transition hover:bg-yellow-300 sm:w-auto"
                      >
                        Lock
                      </button>

                      <button
                        onClick={() =>
                          changeStatus(
                            week.id,
                            week.deadline,
                            "COMPLETED"
                          )
                        }
                        className="w-full rounded-xl bg-slate-700 px-5 py-3 font-black text-white transition hover:bg-slate-800 sm:w-auto"
                      >
                        Complete
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteWeek(
                            week.id,
                            week.week_number
                          )
                        }
                        className="w-full rounded-xl bg-red-600 px-5 py-3 font-black text-white transition hover:bg-red-700 sm:w-auto"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </section>
    </main>
  );
}