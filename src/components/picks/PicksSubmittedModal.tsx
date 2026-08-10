"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

type PicksSubmittedModalProps = {
  open: boolean;
  weekNumber: number;
  totalGames: number;
  onClose: () => void;
};

export default function PicksSubmittedModal({
  open,
  weekNumber,
  totalGames,
  onClose,
}: PicksSubmittedModalProps) {

  useEffect(() => {

    if (!open) return;

    const colors = [
      "#0B5D3B",
      "#F4C542",
      "#FFFFFF",
    ];

    confetti({
      particleCount: 80,
      spread: 70,
      startVelocity: 45,
      origin: {
        x: 0.15,
        y: 0.65,
      },
      colors,
    });

    confetti({
      particleCount: 80,
      spread: 70,
      startVelocity: 45,
      origin: {
        x: 0.85,
        y: 0.65,
      },
      colors,
    });

  }, [open]);

  if (!open) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">

      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300">

        <div className="h-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400" />

        <div className="p-8 text-center">

          <div className="text-7xl drop-shadow-sm">
            🏈
          </div>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-green-950">
            PICKS ARE LOCKED IN!
          </h2>

          <p className="mt-2 text-lg font-bold text-yellow-600">
            Good luck this week!
          </p>

          <p className="mt-6 text-slate-600">
            Your <span className="font-bold">Week {weekNumber}</span> picks
            have been successfully saved.
          </p>

          <div className="mt-6 inline-flex items-center rounded-full bg-green-100 px-6 py-3">

            <span className="text-lg font-black text-green-900">
              ✓ {totalGames} / {totalGames} Games Complete
            </span>

          </div>

          <p className="mt-6 text-sm leading-6 text-slate-500">
            You can return anytime before the submission deadline to update your picks.
          </p>

          <button
            onClick={onClose}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-green-950 to-green-800 px-6 py-4 text-lg font-black uppercase tracking-wide text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
          >
            AWESOME!
          </button>

        </div>

      </div>

    </div>

  );
}