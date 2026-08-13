"use client";

import Image from "next/image";
import Link from "next/link";

type HeroBannerProps = {
  weekNumber: number;
  deadline: string;
  gameCount: number;
};

export default function HeroBanner({
  weekNumber,
  deadline,
  gameCount,
}: HeroBannerProps) {
  const hasWeek = weekNumber > 0;

  const formattedDeadline = hasWeek
    ? new Date(deadline).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-yellow-600/30 text-white shadow-2xl">
      {/* Desktop background */}
      <div className="absolute inset-0 hidden lg:block">
        <Image
          src="/images/gotech-football-field.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-fill"
        />
      </div>

      <div className="absolute inset-0 hidden bg-gradient-to-r from-green-950/75 via-green-950/30 to-green-950/15 lg:block" />

      {/* Desktop layout */}
      <div className="relative hidden min-h-[280px] flex-col justify-between gap-8 px-8 py-8 lg:flex lg:flex-row lg:items-center">
        <div className="flex flex-col">
          <div className="lg:-translate-y-10">
            <div className="text-xs font-black uppercase tracking-[0.45em] text-yellow-400">
              GOTECH Weekly Football Contest
            </div>

            <h1 className="mt-1 text-5xl font-black tracking-tight">
              {hasWeek
                ? `Week ${weekNumber} Picks`
                : "Contest Coming Soon"}
            </h1>
          </div>

          {hasWeek && (
            <div className="mt-6 flex flex-wrap gap-4 lg:translate-y-10">
              <div className="rounded-xl border border-yellow-400/30 bg-black/30 px-5 py-3 backdrop-blur">
                <div className="text-xs font-black uppercase tracking-wide text-yellow-300">
                  Games
                </div>

                <div className="mt-1 text-3xl font-black">
                  {gameCount}
                </div>
              </div>

              <div className="rounded-xl border border-yellow-400/30 bg-black/30 px-5 py-3 backdrop-blur">
                <div className="text-xs font-black uppercase tracking-wide text-yellow-300">
                  Picks Close
                </div>

                <div className="mt-1 text-sm font-bold">
                  {formattedDeadline}
                </div>
              </div>
            </div>
          )}
        </div>

        {hasWeek && (
          <Link
            href="/picks"
            className="group inline-flex items-center justify-center rounded-2xl border-2 border-yellow-400 bg-gradient-to-r from-yellow-500 to-yellow-600 px-10 py-5 text-base font-black uppercase tracking-wide text-green-950 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:from-yellow-400 hover:to-yellow-500 lg:self-start lg:-mt-2"
          >
            <span>🏈 Make Your Picks</span>
          </Link>
        )}
      </div>

      {/* Mobile layout */}
      <div className="relative bg-green-950 lg:hidden">
        {/* Mobile headline */}
        <div className="relative z-10 px-5 pb-4 pt-5 text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">
            GOTECH Weekly Football Contest
          </div>

          <h1 className="mt-1 text-3xl font-black tracking-tight">
            {hasWeek
              ? `Week ${weekNumber} Picks`
              : "Contest Coming Soon"}
          </h1>
        </div>

        {/* Mobile football image.
            The aspect ratio matches the original 1939 x 811 image,
            so the photograph cannot be stretched or distorted. */}
        <div className="relative mx-3 aspect-[1939/811] overflow-hidden rounded-2xl border border-yellow-400/20">
          <Image
            src="/images/gotech-football-field.png"
            alt=""
            fill
            sizes="calc(100vw - 24px)"
            className="object-contain"
          />

          <div className="absolute inset-0 bg-green-950/10" />
        </div>

        {/* Mobile controls */}
        {hasWeek && (
          <div className="relative z-10 px-5 pb-5 pt-4">
            <div className="flex justify-center gap-3">
              <div className="rounded-xl border border-yellow-400/30 bg-black/50 px-4 py-2 backdrop-blur">
                <div className="text-[9px] font-black uppercase tracking-wide text-yellow-300">
                  Games
                </div>

                <div className="mt-0.5 text-2xl font-black">
                  {gameCount}
                </div>
              </div>

              <div className="rounded-xl border border-yellow-400/30 bg-black/50 px-4 py-2 backdrop-blur">
                <div className="text-[9px] font-black uppercase tracking-wide text-yellow-300">
                  Picks Close
                </div>

                <div className="mt-0.5 text-xs font-bold">
                  {formattedDeadline}
                </div>
              </div>
            </div>

            <Link
              href="/picks"
              className="mt-3 flex w-full items-center justify-center rounded-2xl border-2 border-yellow-400 bg-gradient-to-r from-yellow-500 to-yellow-600 px-5 py-3 text-sm font-black uppercase tracking-wide text-green-950 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:from-yellow-400 hover:to-yellow-500"
            >
              <span>🏈 Make Your Picks</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}