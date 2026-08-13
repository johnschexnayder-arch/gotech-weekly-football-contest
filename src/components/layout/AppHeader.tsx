"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trophy,
  LogOut,
  LogIn,
  User,
  Menu,
  X,
  LayoutDashboard,
  Goal,
  ClipboardList,
  BarChart3,
  Shield,
  CalendarDays,
  Users,
} from "lucide-react";

import { logoutPlayer } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

export default function AppHeader() {
  const router = useRouter();
  const { player, refreshPlayer } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logoutPlayer();
    refreshPlayer();
    setMenuOpen(false);
    router.push("/login");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  const initials = player?.name
    ? player.name
        .split(" ")
        .map((name: string) => name.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "G";

  return (
    <>
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="h-1 bg-gradient-to-r from-green-900 via-yellow-500 to-green-900" />

        <div className="flex items-center justify-between px-4 py-4 md:px-8 md:py-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 shrink-0 text-yellow-500" />

              <h1 className="truncate text-lg font-black tracking-tight text-green-950 md:text-2xl">
                GOTECH Weekly Football Contest
              </h1>
            </div>

            <p className="mt-1 hidden text-sm text-slate-500 md:block">
              15 Weeks | 12 Games Per Week | Picks Due Each Friday Afternoon
            </p>
          </div>

          <div className="ml-4 flex shrink-0 items-center gap-3 md:gap-5">
            {player ? (
              <>
                <div className="hidden text-right md:block">
                  <div className="text-sm text-slate-500">
                    Welcome back
                  </div>

                  <div className="font-bold text-green-900">
                    {player.name}
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition hover:text-red-600"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Logout
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Log out"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-green-900 to-green-700 text-sm font-bold text-white shadow-lg ring-2 ring-yellow-400 transition hover:scale-105 md:h-12 md:w-12"
                >
                  {initials}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-green-900 transition hover:bg-slate-50 md:inline-flex"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>

                <Link
                  href="/login"
                  aria-label="Login"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-green-900 to-green-700 text-white shadow-lg ring-2 ring-yellow-400 transition hover:scale-105 md:h-12 md:w-12"
                >
                  <User className="h-5 w-5" />
                </Link>
              </>
            )}

            <button
              type="button"
              aria-label={
                menuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-green-900 shadow-sm transition hover:bg-green-50 md:hidden"
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="border-b border-slate-200 bg-white shadow-lg md:hidden">
          <nav className="space-y-1 px-4 py-4">
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-green-50 hover:text-green-900"
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>

            <Link
              href="/picks"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-green-50 hover:text-green-900"
            >
              <Goal className="h-5 w-5" />
              Make Picks
            </Link>

            <Link
              href="/picks"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-green-50 hover:text-green-900"
            >
              <ClipboardList className="h-5 w-5" />
              My Picks
            </Link>

            <Link
              href="/standings"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-green-50 hover:text-green-900"
            >
              <Trophy className="h-5 w-5" />
              Standings
            </Link>

            <Link
              href="/results"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-green-50 hover:text-green-900"
            >
              <BarChart3 className="h-5 w-5" />
              Results
            </Link>

            {player?.is_admin && (
              <>
                <div className="my-3 border-t border-slate-200" />

                <div className="px-4 pb-2 pt-1 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                  Commissioner
                </div>

                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-green-50 hover:text-green-900"
                >
                  <Shield className="h-5 w-5" />
                  Admin Dashboard
                </Link>

                <Link
                  href="/admin/weeks"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-green-50 hover:text-green-900"
                >
                  <CalendarDays className="h-5 w-5" />
                  Manage Weeks
                </Link>

                <Link
                  href="/admin/players"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-green-50 hover:text-green-900"
                >
                  <Users className="h-5 w-5" />
                  Manage Players
                </Link>

                <Link
                  href="/admin/games"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-green-50 hover:text-green-900"
                >
                  <ClipboardList className="h-5 w-5" />
                  Manage Games
                </Link>

                <Link
                  href="/admin/scoring"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-green-50 hover:text-green-900"
                >
                  <BarChart3 className="h-5 w-5" />
                  Score Week
                </Link>
              </>
            )}

            {player && (
              <>
                <div className="my-3 border-t border-slate-200" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
}