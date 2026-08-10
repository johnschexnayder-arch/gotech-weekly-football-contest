export default function RulesPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6">
      <section className="rounded-3xl bg-gradient-to-r from-green-800 via-green-700 to-green-900 p-10 text-white shadow-xl">
        <h1 className="text-5xl font-black">
          Contest Rules
        </h1>

        <p className="mt-4 text-lg text-green-100">
          GOTECH Weekly Football Contest rules,
          scoring, and prizes.
        </p>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-lg">
        <h2 className="text-3xl font-black text-slate-800">
          How It Works
        </h2>

        <ul className="mt-5 space-y-3 text-lg text-slate-700">
          <li>
            • Entry fee: $20 for the season
          </li>

          <li>
            • Pick the winner of each game
            (no point spreads)
          </li>

          <li>
            • 12 games are selected each week
          </li>

          <li>
            • Each correct pick earns 1 point
          </li>

          <li>
            • Highest weekly score wins the weekly prize
          </li>

          <li>
            • Highest season total wins the season championship
          </li>
        </ul>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-lg">
        <h2 className="text-3xl font-black text-slate-800">
          Season Awards
        </h2>

        <ul className="mt-5 space-y-3 text-lg text-slate-700">
          <li>
            🏆 Weekly Champion
          </li>

          <li>
            👑 Season Champion
          </li>

          <li>
            😬 Season Last Place Award
          </li>

          <li>
            ⭐ Perfect Slate Bonus
            (correctly pick every game in a week)
          </li>
        </ul>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-lg">
        <h2 className="text-3xl font-black text-slate-800">
          Pick Deadline
        </h2>

        <p className="mt-4 text-lg text-slate-700">
          All picks must be submitted before the
          weekly deadline. Once the deadline passes,
          picks are locked and cannot be changed.
        </p>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-lg">
        <h2 className="text-3xl font-black text-slate-800">
          Good Luck!
        </h2>

        <p className="mt-4 text-lg text-slate-700">
          Make your picks, compete with friends,
          and climb the leaderboard!
        </p>
      </section>
    </main>
  );
}