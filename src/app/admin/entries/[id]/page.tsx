import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function EntryDetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { data: entry, error } = await supabase
    .from("entries")
    .select(`
      id,
      score,
      submitted_at,
      players (
        name,
        email
      ),
      weeks (
        week_number
      ),
      picks (
        selected_team,
        games (
          game_number,
          sport,
          away_team,
          home_team
        )
      )
    `)
    .eq("id", params.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const player = Array.isArray(entry.players)
    ? entry.players[0]
    : entry.players;

  const week = Array.isArray(entry.weeks)
    ? entry.weeks[0]
    : entry.weeks;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-bold text-green-700">
        Entry Details
      </h1>

      <div className="mt-6 rounded-xl bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-semibold">
          {player?.name}
        </h2>

        <p className="text-slate-600">
          {player?.email}
        </p>

        <p className="mt-2">
          Week {week?.week_number}
        </p>

        <p>
          Score: {entry.score ?? 0}
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-lg">
        <table className="w-full">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="px-5 py-4 text-left">
                Game
              </th>

              <th className="px-5 py-4 text-left">
                Matchup
              </th>

              <th className="px-5 py-4 text-left">
                Pick
              </th>
            </tr>
          </thead>

          <tbody>
            {entry.picks.map((pick: any) => (
              <tr
                key={pick.game_number}
                className="border-t"
              >
                <td className="px-5 py-4">
                  Game {pick.games.game_number}
                </td>

                <td className="px-5 py-4">
                  {pick.games.away_team} vs{" "}
                  {pick.games.home_team}
                </td>

                <td className="px-5 py-4 font-semibold">
                  {pick.selected_team}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <Link
          href="/admin/entries"
          className="text-green-700 hover:underline"
        >
          Back to Entries
        </Link>
      </div>
    </div>
  );
}