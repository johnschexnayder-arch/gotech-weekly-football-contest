"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { updateGame } from "@/lib/games";

export default function EditGameDialog({
  game,
}: {
  game: any;
}) {
  const [open, setOpen] = useState(false);

  const [sport, setSport] = useState(game.sport);
  const [awayTeam, setAwayTeam] = useState(game.away_team);
  const [homeTeam, setHomeTeam] = useState(game.home_team);
  const [kickoff, setKickoff] = useState(
    game.kickoff?.slice(0, 16) ?? ""
  );
  const [winner, setWinner] = useState(game.winner ?? "");

  async function handleSave() {
    try {
      await updateGame(game.id, {
        sport,
        away_team: awayTeam,
        home_team: homeTeam,
        kickoff: new Date(kickoff).toISOString(),
        winner: winner || null,
      });

      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Unable to update game.");
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="rounded bg-blue-600 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700">
          Edit
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />

        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="mb-4 text-xl font-bold">
            Edit Game
          </Dialog.Title>

          <div className="space-y-3">
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="w-full rounded border p-2"
            >
              <option value="NCAA">NCAA</option>
              <option value="NFL">NFL</option>
            </select>

            <input
              value={awayTeam}
              onChange={(e) => setAwayTeam(e.target.value)}
              className="w-full rounded border p-2"
              placeholder="Away Team"
            />

            <input
              value={homeTeam}
              onChange={(e) => setHomeTeam(e.target.value)}
              className="w-full rounded border p-2"
              placeholder="Home Team"
            />

            <input
              type="datetime-local"
              value={kickoff}
              onChange={(e) => setKickoff(e.target.value)}
              className="w-full rounded border p-2"
            />

            <input
              value={winner}
              onChange={(e) => setWinner(e.target.value)}
              className="w-full rounded border p-2"
              placeholder="Winner"
            />

            <button
              onClick={handleSave}
              className="w-full rounded bg-green-700 px-4 py-2 font-semibold text-white hover:bg-green-800"
            >
              Save Changes
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}