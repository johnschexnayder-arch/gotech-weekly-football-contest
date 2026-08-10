"use client";

import { useRouter } from "next/navigation";


export default function WeekSelector({
  weeks,
  selectedWeekId,
}: {
  weeks: {
    id: string;
    week_number: number;
    status: string;
  }[];

  selectedWeekId: string;
}) {


  const router = useRouter();



  return (

    <select

      value={selectedWeekId}

      onChange={(e) => {

        router.push(
          `/admin/scoring?week=${e.target.value}`
        );

      }}

      className="rounded-xl border-2 border-green-100 bg-green-50 px-4 py-3 font-semibold text-green-950 outline-none focus:border-yellow-400"

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

  );

}