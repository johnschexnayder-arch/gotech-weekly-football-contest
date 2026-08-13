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
      <div className="absolute inset-0">
        <Image
          src="/images/gotech-football-field.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-fill"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-green-950/75 via-green-950/30 to-green-950/15" />

      <div className="relative flex min-h-[230px] flex-col justify-between px-5 py-5 sm:px-8 sm:py-8 lg:min-h-[280px] lg:flex-row lg:items-center lg:gap-8">
        <div className="flex flex-col">
          <div className="lg:-translate-y-10">
            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-yellow-400 sm:text-xs sm:tracking-[0.45em]">
              GOTECH Weekly Football Contest
            </div>

            <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-5xl">
              {hasWeek
                ? `Week ${weekNumber} Picks`
                : "Contest Coming Soon"}
            </h1>
          </div>

          {hasWeek && (
            <div className="mt-4 flex flex-wrap gap-2 lg:mt-6 lg:translate-y-10 sm:gap-4">
              <div className="rounded-xl border border-yellow-400/30 bg-black/30 px-3 py-2 backdrop-blur sm:px-5 sm:py-3">
                <div className="text-[9px] font-black uppercase tracking-wide text-yellow-300 sm:text-xs">
                  Games
                </div>

                <div className="mt-0.5 text-2xl font-black sm:mt-1 sm:text-3xl">
                  {gameCount}
                </div>
              </div>

              <div className="rounded-xl border border-yellow-400/30 bg-black/30 px-3 py-2 backdrop-blur sm:px-5 sm:py-3">
                <div className="text-[9px] font-black uppercase tracking-wide text-yellow-300 sm:text-xs">
                  Picks Close
                </div>

                <div className="mt-0.5 text-[11px] font-bold sm:mt-1 sm:text-sm">
                  {formattedDeadline}
                </div>
              </div>
            </div>
          )}
        </div>

        {hasWeek && (
          <Link
            href="/picks"
            className="group mt-3 inline-flex w-full items-center justify-center rounded-2xl border-2 border-yellow-400 bg-gradient-to-r from-yellow-500 to-yellow-600 px-5 py-3 text-xs font-black uppercase tracking-wide text-green-950 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:from-yellow-400 hover:to-yellow-500 sm:px-10 sm:py-5 sm:text-base lg:mt-0 lg:w-auto lg:self-start lg:-mt-2"
          >
            <span>🏈 Make Your Picks</span>
          </Link>
        )}
      </div>
    </section>
  );
}