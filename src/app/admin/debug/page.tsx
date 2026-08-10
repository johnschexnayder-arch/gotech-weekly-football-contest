import { supabase } from "@/lib/supabase";

export default async function DebugPage() {
  const { data: entries } = await supabase
    .from("entries")
    .select("*");

  const { data: games } = await supabase
    .from("games")
    .select("*");

  const { data: picks } = await supabase
    .from("picks")
    .select("*");

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-green-700">
        Scoring Debug
      </h1>

      <h2 className="mb-2 text-xl font-semibold">
        Entries
      </h2>

      <pre className="mb-8 rounded bg-slate-100 p-4 text-sm">
        {JSON.stringify(entries, null, 2)}
      </pre>


      <h2 className="mb-2 text-xl font-semibold">
        Games
      </h2>

      <pre className="mb-8 rounded bg-slate-100 p-4 text-sm">
        {JSON.stringify(games, null, 2)}
      </pre>


      <h2 className="mb-2 text-xl font-semibold">
        Picks
      </h2>

      <pre className="rounded bg-slate-100 p-4 text-sm">
        {JSON.stringify(picks, null, 2)}
      </pre>
    </div>
  );
}