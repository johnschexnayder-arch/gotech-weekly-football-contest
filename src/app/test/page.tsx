import { supabase } from "@/lib/supabase";

export default async function TestPage() {
  const { data, error } = await supabase
    .from("weeks")
    .select("*");

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-8 text-4xl font-bold text-green-700">
        Supabase Connection Test
      </h1>

      {error ? (
        <div className="rounded-lg bg-red-100 p-4 text-red-700">
          <h2 className="font-bold">Connection Error</h2>
          <p>{error.message}</p>
        </div>
      ) : (
        <>
          <p className="mb-6">
            Successfully connected to Supabase!
          </p>

          <pre className="overflow-auto rounded-lg bg-slate-900 p-6 text-sm text-green-300">
            {JSON.stringify(data, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}