import Link from "next/link";
import {
  CalendarDays,
  ClipboardList,
  ExternalLink,
  Gamepad2,
  Users,
  CheckCircle2,
} from "lucide-react";

const adminCards = [
  {
    href: "/admin/weeks",
    title: "Manage Weeks",
    description:
      "Create, open, lock, complete, and delete contest weeks.",
    icon: CalendarDays,
  },
  {
    href: "/admin/games",
    title: "Manage Games",
    description:
      "Create and manage the weekly football slate.",
    icon: Gamepad2,
  },
  {
    href: "/admin/players",
    title: "Manage Players",
    description:
      "Add players, reset PINs, and manage participants.",
    icon: Users,
  },
  {
    href: "/admin/submissions",
    title: "Pick Status",
    description:
      "Review who has submitted picks for the current week.",
    icon: ClipboardList,
  },
  {
    href: "/admin/scoring",
    title: "Score Week",
    description:
      "Enter winners and calculate weekly contest scores.",
    icon: CheckCircle2,
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-green-950 via-green-900 to-green-800 p-6 text-white shadow-xl sm:p-8">
        <div className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400 sm:tracking-[0.35em]">
          Commissioner Tools
        </div>

        <h1 className="mt-3 text-3xl font-black sm:text-4xl">
          Admin Dashboard
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-green-100 sm:text-base">
          Manage weeks, games, players, submissions, and scoring
          for the GOTECH Weekly Football Contest.
        </p>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {adminCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-3xl border border-yellow-400/20 bg-white p-6 shadow-xl transition hover:-translate-y-1 hover:border-yellow-400/60 hover:shadow-2xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-950 text-yellow-400 shadow-lg transition group-hover:bg-green-900">
                <Icon className="h-6 w-6" />
              </div>

              <h2 className="mt-5 text-xl font-black text-green-950">
                {card.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {card.description}
              </p>

              <div className="mt-5 font-black text-green-900 transition group-hover:text-yellow-600">
                Open →
              </div>
            </Link>
          );
        })}
      </section>

      <section className="rounded-3xl border border-yellow-400/20 bg-white p-6 shadow-xl sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-green-950">
              Public Contest Site
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Return to the player-facing site.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-950 px-6 py-3 font-black text-white shadow-lg transition hover:bg-green-900"
          >
            <ExternalLink className="h-5 w-5" />
            View Public Site
          </Link>
        </div>
      </section>
    </main>
  );
}