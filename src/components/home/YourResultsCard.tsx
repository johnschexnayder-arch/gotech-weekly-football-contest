import Link from "next/link";
import { BarChart3, Trophy, Medal, ArrowRight } from "lucide-react";

export default function YourResultsCard() {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700" />

      <div className="bg-gradient-to-r from-green-950 via-green-900 to-green-800 px-6 py-5 text-white">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-yellow-400" />

          <h2 className="text-xl font-bold">
            Your Results
          </h2>
        </div>

        <p className="mt-1 text-sm text-green-200">
          Track your weekly and season performance
        </p>
      </div>

      <div className="grid gap-5 p-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-yellow-50 p-5 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-700">
            <Trophy className="h-4 w-4" />
            This Week
          </div>

          <div className="mt-4 text-4xl font-black text-green-950">
            0/12
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Correct picks this week
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            <BarChart3 className="h-4 w-4" />
            Season Points
          </div>

          <div className="mt-4 text-4xl font-black text-green-900">
            0
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Total points earned
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            <Medal className="h-4 w-4" />
            Rank
          </div>

          <div className="mt-4 text-4xl font-black text-green-900">
            --
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Current season standing
          </p>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
        <Link
          href="/results"
          className="inline-flex items-center gap-2 text-sm font-semibold text-green-900 transition-colors hover:text-green-700"
        >
          View Full Results
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}