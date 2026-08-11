"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trophy,
  LogOut,
  LogIn,
  User,
} from "lucide-react";

import { logoutPlayer } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

export default function AppHeader() {
  const router = useRouter();
  const { player, refreshPlayer } = useAuth();

  function handleLogout() {
    logoutPlayer();
    refreshPlayer();
    router.push("/login");
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
            15 Weeks | 12 Games Per Week | Picks Due Each Saturday Morning
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
        </div>
      </div>
    </header>
  );
}