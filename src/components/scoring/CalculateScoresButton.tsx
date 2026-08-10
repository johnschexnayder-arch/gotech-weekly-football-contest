"use client";

import { useState } from "react";
import { calculateWeekScore } from "@/lib/scoring";

export default function CalculateScoresButton({
  weekId,
}: {
  weekId: string;
}) {
  const [calculating, setCalculating] = useState(false);

  async function handleCalculate() {
    setCalculating(true);

    try {
      await calculateWeekScore(weekId);

      alert("Scores calculated successfully!");

      window.location.reload();
    } catch (error) {
      console.error(
        "CALCULATE SCORE ERROR:",
        error
      );

      alert("Unable to calculate scores.");
    } finally {
      setCalculating(false);
    }
  }

  return (
    <button
      onClick={handleCalculate}
      disabled={calculating}
      className="mt-6 rounded bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {calculating
        ? "Calculating..."
        : "Calculate Scores"}
    </button>
  );
}