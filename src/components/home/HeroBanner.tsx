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
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-white shadow-2xl border border-yellow-600/30">
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
        <Image
          src="/images/gotech-tree.png"
          alt=""
          width={360}
          height={360}
          className="object-contain"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-green-950/80 via-transparent to-yellow-500/10" />

      <div className="relative flex flex-col justify-between gap-8 px-8 py-8 lg:flex-row lg:items-center">
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
            <div className="rounded-xl border border-yellow-400/30 bg-black/20 px-5 py-3 backdrop-blur">
              <div className="text-xs font-black uppercase tracking-wide text-yellow-300">
                Games
              </div>

              <div className="mt-1 text-3xl font-black">
                {gameCount}
              </div>
            </div>

            <div className="rounded-xl border border-yellow-400/30 bg-black/20 px-5 py-3 backdrop-blur">
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