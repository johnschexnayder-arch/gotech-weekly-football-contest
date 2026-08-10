"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLoggedInPlayer } from "@/lib/auth";
import {
  getWeeks,
  createWeek,
  updateWeek,
} from "@/lib/weeks";

type Week = Awaited<ReturnType<typeof getWeeks>>[number];

type WeekStatus = "OPEN" | "LOCKED" | "COMPLETED";

export default function WeeksPage() {
  const router = useRouter();

  const [weeks, setWeeks] = useState<Week[]>([]);
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadWeeks() {
    const data = await getWeeks();
    setWeeks(data);
    setLoading(false);
  }

  useEffect(() => {
    const player = getLoggedInPlayer();

    if (!player?.is_admin) {
      router.replace("/");
      return;
    }

    loadWeeks();
  }, [router]);

  async function handleCreateWeek() {
    if (!deadline) {
      alert("Please select a deadline.");
      return;
    }

    try {
      await createWeek(deadline);

      alert("Week created.");

      setDeadline("");

      await loadWeeks();
    } catch (err) {
      console.error(err);
      alert("Unable to create week.");
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

      alert(`Week updated to ${status}`);

      await loadWeeks();
    } catch (err) {
      console.error("Week update failed:", err);
      alert("Week update failed.");
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
    <main className="mx-auto max-w-6xl space-y-8 p-6">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-green-950 via-green-900 to-green-800 p-8 text-white shadow-xl">
        <div className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
          Commissioner Tools
        </div>

        <h1 className="mt-3 text-4xl font-black">
          Week Management
        </h1>

        <p className="mt-2 text-green-100">
          Create, open, lock, and complete contest weeks.
        </p>
      </section>

      <section className="rounded-3xl border border-yellow-400/20 bg-white p-6 shadow-xl">
        <h2 className="mb-5 text-2xl font-black text-green-950">
          Create New Week
        </h2>

        <div className="flex flex-wrap gap-4">
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) =>
              setDeadline(e.target.value)
            }
            className="rounded-xl border-2 border-green-100 bg-green-50 px-4 py-3 font-semibold text-green-950 outline-none focus:border-yellow-400"
          />

          <button
            onClick={handleCreateWeek}
            className="rounded-xl border-2 border-yellow-400 bg-green-950 px-6 py-3 font-black uppercase tracking-wide text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-green-900"
          >
            Create Week
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-yellow-400/20 bg-white p-6 shadow-xl">
        <h2 className="mb-5 text-2xl font-black text-green-950">
          Existing Weeks
        </h2>

        <div className="space-y-4">
          {weeks.map((week) => (
            <div
              key={week.id}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-yellow-400/40"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-green-950">
                    Week {week.week_number}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    Deadline{" "}
                    {new Date(
                      week.deadline
                    ).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-black ${
                    week.status === "OPEN"
                      ? "bg-green-100 text-green-800"
                      : week.status === "LOCKED"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {week.status}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    changeStatus(
                      week.id,
                      week.deadline,
                      "OPEN"
                    )
                  }
                  className="rounded-xl bg-green-950 px-5 py-2 font-black text-white transition hover:bg-green-800"
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
                  className="rounded-xl border-2 border-yellow-400 bg-yellow-400 px-5 py-2 font-black text-green-950 transition hover:bg-yellow-300"
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
                  className="rounded-xl bg-slate-700 px-5 py-2 font-black text-white transition hover:bg-slate-800"
                >
                  Complete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}