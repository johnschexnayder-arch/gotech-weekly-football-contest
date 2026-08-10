"use client";

import { deleteGame } from "@/lib/games";

export default function DeleteGameButton({
  gameId,
}: {
  gameId: string;
}) {
  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this game?"
    );

    if (!confirmed) return;

    try {
      await deleteGame(gameId);

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Unable to delete game.");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-700"
    >
      Delete
    </button>
  );
}