import { supabase } from "@/lib/supabase";

export default async function TestDbPage() {

  const { data, error } =
    await supabase
      .from("players")
      .select("id, name, pin");

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">
        Database Test
      </h1>

      <pre className="mt-6 rounded bg-slate-100 p-5">
        {JSON.stringify(
          {
            data,
            error,
          },
          null,
          2
        )}
      </pre>
    </main>
  );
}