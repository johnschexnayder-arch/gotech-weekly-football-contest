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
  const formattedDeadline = new Date(deadline).toLocaleString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );

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

      <div className="relative flex min-h-[280px] flex-col justify-between gap-8 px-8 py-8 lg:flex-row lg:items-center">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.45em] text-yellow-400">
            GOTECH Weekly Football Contest
          </div>

          <h1 className="mt-3 text-5xl font-black tracking-tight">
            Week {weekNumber} Picks
          </h1>

          <p className="mt-3 max-w-xl text-base font-medium text-green-100">
            Put your football knowledge to the test.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
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
        </div>

        <Link
          href="/picks"
          className="group inline-flex items-center justify-center rounded-2xl border-2 border-yellow-400 bg-gradient-to-r from-yellow-500 to-yellow-600 px-10 py-5 text-base font-black uppercase tracking-wide text-green-950 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:from-yellow-400 hover:to-yellow-500"
        >
          <span>🏈 Make Your Picks</span>
        </Link>
      </div>
    </section>
  );
}