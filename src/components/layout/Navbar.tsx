import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link
          href="/"
          className="flex items-center gap-4"
        >
          <Image
            src="/images/gotech-logo.png"
            alt="GOTECH Logo"
            width={190}
            height={65}
            className="h-auto w-[190px]"
          />

          <div className="hidden border-l border-slate-300 pl-4 md:block">
            <div className="text-sm font-black tracking-wide text-green-900">
              WEEKLY FOOTBALL CONTEST
            </div>

            <div className="mt-1 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
              2026 SEASON
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-6 text-sm font-bold text-slate-700">

          <Link
            href="/"
            className="transition hover:text-green-700"
          >
            Home
          </Link>

          <Link
            href="/picks"
            className="transition hover:text-green-700"
          >
            Make Picks
          </Link>

          <Link
            href="/standings"
            className="transition hover:text-green-700"
          >
            Standings
          </Link>

          <Link
            href="/rules"
            className="transition hover:text-green-700"
          >
            Rules
          </Link>

          <Link
            href="/admin"
            className="transition hover:text-green-700"
          >
            Admin
          </Link>

        </div>

      </div>
    </nav>
  );
}