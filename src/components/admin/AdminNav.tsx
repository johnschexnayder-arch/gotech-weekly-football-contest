"use client";

import Link from "next/link";

export default function AdminNav() {
  return (
    <nav className="mb-8 flex flex-wrap gap-3">

      <Link
        href="/admin"
        className="rounded-lg bg-green-700 px-4 py-2 font-semibold text-white hover:bg-green-800"
      >
        Dashboard
      </Link>

      <Link
        href="/admin/players"
        className="rounded-lg bg-green-700 px-4 py-2 font-semibold text-white hover:bg-green-800"
      >
        Players
      </Link>

      <Link
        href="/admin/games"
        className="rounded-lg bg-green-700 px-4 py-2 font-semibold text-white hover:bg-green-800"
      >
        Games
      </Link>

      <Link
        href="/admin/weeks"
        className="rounded-lg bg-green-700 px-4 py-2 font-semibold text-white hover:bg-green-800"
      >
        Weeks
      </Link>

      <Link
        href="/admin/scoring"
        className="rounded-lg bg-green-700 px-4 py-2 font-semibold text-white hover:bg-green-800"
      >
        Scoring
      </Link>

    </nav>
  );
}