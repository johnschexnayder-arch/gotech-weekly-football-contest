"use client";

import { useRouter, useSearchParams } from "next/navigation";

type CompletedWeek = {
  id: string;
  week_number: number;
};

type WeekSelectorProps = {
  weeks: CompletedWeek[];
  selectedWeekId: string;
};

export default function WeekSelector({
  weeks,
  selectedWeekId,
}: WeekSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const weekId = event.target.value;

    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("week", weekId);

    router.push(`/results?${params.toString()}`);
  }

  return (
    <div className="rounded-2xl border border-yellow-400/30 bg-gradient-to-r from-green-50 to-yellow-50 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-black uppercase tracking-wide text-green-700">
            Select Week
          </div>

          <p className="mt-1 text-sm font-semibold text-slate-600">
            View results from any completed week.
          </p>
        </div>

        <select
          value={selectedWeekId}
          onChange={handleChange}
          className="rounded-xl border-2 border-green-900 bg-white px-4 py-3 font-black text-green-950 shadow-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/30"
        >
          {weeks.map((week) => (
            <option
              key={week.id}
              value={week.id}
            >
              Week {week.week_number}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}