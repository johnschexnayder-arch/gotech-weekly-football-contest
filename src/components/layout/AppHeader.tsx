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

      <div className="flex items-center justify-between px-8 py-5">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />

            <h1 className="text-2xl font-black tracking-tight text-green-950">
              GOTECH Weekly Football Contest
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
  15 Weeks | 12 Games Per Week | Picks Due Each Saturday Morning
</p>
        </div>

        <div className="flex items-center gap-5">
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

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-900 to-green-700 text-sm font-bold text-white shadow-lg ring-2 ring-yellow-400">
                {initials}
              </div>
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

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-900 to-green-700 text-white shadow-lg ring-2 ring-yellow-400">
                <User className="h-5 w-5" />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}