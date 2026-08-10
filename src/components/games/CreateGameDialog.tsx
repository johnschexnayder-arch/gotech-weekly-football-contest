"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { X } from "lucide-react";
import { createGame } from "@/lib/games";

export default function CreateGameDialog({
  weekId,
}: {
  weekId: string;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [gameNumber, setGameNumber] = useState(1);
  const [sport, setSport] = useState("NCAA");
  const [awayTeam, setAwayTeam] = useState("");
  const [homeTeam, setHomeTeam] = useState("");
  const [kickoff, setKickoff] = useState("");

  async function handleSubmit() {
    if (!awayTeam.trim() || !homeTeam.trim() || !kickoff) {
      alert("Please complete all fields.");
      return;
    }

    try {
      setSaving(true);

      await createGame({
        week_id: weekId,
        game_number: gameNumber,
        sport,
        away_team: awayTeam.trim(),
        home_team: homeTeam.trim(),
        kickoff: new Date(kickoff).toISOString(),
      });

      setOpen(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Unable to save game.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={setOpen}
    >
      <Dialog.Trigger asChild>
        <button className="rounded-xl bg-yellow-400 px-5 py-3 font-black text-green-950 transition hover:bg-yellow-300">
          + Add Game
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-8 shadow-2xl">
          <div className="mb-6 flex items-center justify-between">
            <Dialog.Title className="text-2xl font-black text-green-950">
              Add Game
            </Dialog.Title>

            <Dialog.Close asChild>
              <button className="rounded-full p-2 transition hover:bg-slate-100">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-bold text-green-950">
                Game Number
              </label>

              <input
                type="number"
                min={1}
                value={gameNumber}
                onChange={(e) => setGameNumber(Number(e.target.value))}
                className="w-full rounded-xl border-2 border-green-100 bg-green-50 p-3 outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-green-950">
                Sport
              </label>

              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="w-full rounded-xl border-2 border-green-100 bg-green-50 p-3 outline-none focus:border-yellow-400"
              >
                <option value="NCAA">NCAA</option>
                <option value="NFL">NFL</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-green-950">
                Away Team
              </label>

              <input
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                className="w-full rounded-xl border-2 border-green-100 bg-green-50 p-3 outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-green-950">
                Home Team
              </label>

              <input
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                className="w-full rounded-xl border-2 border-green-100 bg-green-50 p-3 outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-green-950">
                Kickoff
              </label>

              <input
                type="datetime-local"
                value={kickoff}
                onChange={(e) => setKickoff(e.target.value)}
                className="w-full rounded-xl border-2 border-green-100 bg-green-50 p-3 outline-none focus:border-yellow-400"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={saving}
              className="w-full rounded-xl bg-green-900 px-5 py-3 font-black text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Game"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}