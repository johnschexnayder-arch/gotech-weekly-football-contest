"use client";

import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Goal,
  ClipboardList,
  Trophy,
  BarChart3,
  Shield,
  CalendarDays,
  Users,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const { player } = useAuth();

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="border-b border-slate-200 px-6 py-6">
        <Image
          src="/images/gotech-football.png"
          alt="GOTECH Football"
          width={180}
          height={120}
          className="h-auto w-full object-contain"
          priority
        />
      </div>

      <nav className="flex flex-1 flex-col px-5 py-6">
        <div className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
          Contest
        </div>

        <Link
          href="/"
          className="mb-2 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-green-900 to-green-800 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>

        <Link
          href="/picks"
          className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-green-50 hover:text-green-900"
        >
          <Goal className="h-4 w-4" />
          Make Picks
          <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition group-hover:opacity-100" />
        </Link>

        <Link
          href="/picks"
          className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-green-50 hover:text-green-900"
        >
          <ClipboardList className="h-4 w-4" />
          My Picks
          <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition group-hover:opacity-100" />
        </Link>

        <Link
          href="/standings"
          className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-green-50 hover:text-green-900"
        >
          <Trophy className="h-4 w-4" />
          Standings
          <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition group-hover:opacity-100" />
        </Link>

        <Link
          href="/results"
          className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-green-50 hover:text-green-900"
        >
          <BarChart3 className="h-4 w-4" />
          Results
          <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition group-hover:opacity-100" />
        </Link>

        {player?.is_admin && (
          <>
            <div className="my-6 border-t border-slate-200" />

            <div className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
              Commissioner
            </div>

            <Link
              href="/admin"
              className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-green-50 hover:text-green-900"
            >
              <Shield className="h-4 w-4" />
              Admin Dashboard
              <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition group-hover:opacity-100" />
            </Link>

            <Link
              href="/admin/weeks"
              className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-green-50 hover:text-green-900"
            >
              <CalendarDays className="h-4 w-4" />
              Manage Weeks
              <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition group-hover:opacity-100" />
            </Link>

            <Link
              href="/admin/players"
              className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-green-50 hover:text-green-900"
            >
              <Users className="h-4 w-4" />
              Manage Players
              <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition group-hover:opacity-100" />
            </Link>
          </>
        )}
      </nav>

      <div className="border-t border-slate-200 p-5">
        <div className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-yellow-50 p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-green-900">
            GOTECH
          </div>

          <div className="mt-1 text-sm font-semibold text-slate-700">
            Weekly Football Contest
          </div>

          <div className="mt-3 h-1 rounded-full bg-gradient-to-r from-green-800 via-yellow-500 to-green-800" />
        </div>
      </div>
    </aside>
  );
}