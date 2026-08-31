"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateGame } from "@/lib/games";

type Game = {
  id: string;
  sport: string;
  away_team: string;
  home_team: string;
  kickoff: string;
  winner: string | null;
};

const TIME_ZONE = "America/Chicago";

function getCentralDateTimeLocal(isoString: string) {
  if (!isoString) return "";

  const date = new Date(isoString);

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const values: Record<string, string> = {};

  for (const part of parts) {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  }

  let hour = values.hour;

  // Intl can return "24" for midnight in some environments.
  if (hour === "24") {
    hour = "00";
  }

  return `${values.year}-${values.month}-${values.day}T${hour}:${values.minute}`;
}

function centralDateTimeToISOString(value: string) {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/
  );

  if (!match) {
    throw new Error("Invalid kickoff date/time.");
  }

  const [, year, month, day, hour, minute] = match;

  // Start with the entered Central time interpreted as UTC.
  const guess = new Date(
    Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute)
    )
  );

  // Determine the Central Time offset for that date.
  const centralParts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    timeZoneName: "shortOffset",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(guess);

  const offsetPart = centralParts.find(
    (part) => part.type === "timeZoneName"
  );

  const offsetText = offsetPart?.value ?? "GMT-5";

  const offsetMatch = offsetText.match(
    /GMT([+-])(\d{1,2})(?::(\d{2}))?$/
  );

  if (!offsetMatch) {
    throw new Error("Unable to determine Central Time offset.");
  }

  const sign = offsetMatch[1] === "+" ? 1 : -1;
  const offsetHours = Number(offsetMatch[2]);
  const offsetMinutes = Number(offsetMatch[3] ?? 0);

  const offsetMilliseconds =
    sign *
    (offsetHours * 60 + offsetMinutes) *
    60 *
    1000;

  const utcTime = new Date(
    guess.getTime() - offsetMilliseconds
  );

  return utcTime.toISOString();
}

export default function EditGameDialog({
  game,
}: {
  game: Game;
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [sport, setSport] = useState(game.sport);
  const [awayTeam, setAwayTeam] = useState(game.away_team);
  const [homeTeam, setHomeTeam] = useState(game.home_team);
  const [kickoff, setKickoff] = useState(
    getCentralDateTimeLocal(game.kickoff)
  );
  const [winner, setWinner] = useState(game.winner ?? "");

  async function handleSave() {
    if (!awayTeam.trim() || !homeTeam.trim() || !kickoff) {
      alert("Please complete all required fields.");
      return;
    }

    try {
      setSaving(true);

      await updateGame(game.id, {
        sport,
        away_team: awayTeam.trim(),
        home_team: homeTeam.trim(),
        kickoff: centralDateTimeToISOString(kickoff),
        winner: winner.trim() || null,
      });

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Unable to update game.");
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
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          <span className="flex items-center gap-2">
            <Pencil size={14} />
            Edit
          </span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-8 shadow-2xl">
          <div className="mb-6 flex items-center justify-between">
            <Dialog.Title className="text-2xl font-black text-green-950">
              Edit Game
            </Dialog.Title>

            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-full p-2 transition hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-5">
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

              <p className="mt-1 text-xs font-semibold text-slate-500">
                All kickoff times are Central Time.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-green-950">
                Winner
              </label>

              <input
                value={winner}
                onChange={(e) => setWinner(e.target.value)}
                placeholder="Leave blank if game hasn't been played"
                className="w-full rounded-xl border-2 border-green-100 bg-green-50 p-3 outline-none focus:border-yellow-400"
              />
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-xl bg-green-900 px-5 py-3 font-black text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}