"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getLoggedInPlayer } from "@/lib/auth";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/weeks", label: "Weeks", icon: "📅" },
  { href: "/admin/games", label: "Games", icon: "🏈" },
  { href: "/admin/players", label: "Players", icon: "👥" },
  { href: "/admin/scoring", label: "Score Week", icon: "✅" },
];

const publicLinks = [
  { href: "/", label: "Public Site", icon: "🌐" },
];

export default function Sidebar() {
  const [player, setPlayer] = useState<any>(null);

  useEffect(() => {
    setPlayer(getLoggedInPlayer());
  }, []);

  return (
    <aside className="flex min-h-screen w-72 flex-col bg-slate-900 text-white">
      <div className="border-b border-slate-800 p-8">
        <h1 className="text-2xl font-black">
          GOTECH
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Football Contest Admin
        </p>
      </div>

      <nav className="flex-1 p-4">

        {player?.is_admin && (
          <>
            <div className="mb-4 px-4 text-xs font-black uppercase tracking-[0.25em] text-green-400">
              Commissioner
            </div>

            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-green-700"
              >
                <span className="text-xl">
                  {link.icon}
                </span>

                <span>
                  {link.label}
                </span>
              </Link>
            ))}
          </>
        )}

        <div className="mt-8 mb-4 px-4 text-xs font-black uppercase tracking-[0.25em] text-slate-400">
          Navigation
        </div>

        {publicLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-green-700"
          >
            <span className="text-xl">
              {link.icon}
            </span>

            <span>
              {link.label}
            </span>
          </Link>
        ))}

      </nav>
    </aside>
  );
}
