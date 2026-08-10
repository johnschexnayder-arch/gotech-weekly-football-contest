"use server";

import { supabase } from "@/lib/supabase";

export async function calculateScores(
  weekId: string
) {
  const { data: games, error: gamesError } =
    await supabase
      .from("games")
      .select("id, winner")
      .eq("week_id", weekId);

  if (gamesError) {
    throw gamesError;
  }

  const { data: entries, error: entriesError } =
    await supabase
      .from("entries")
      .select("id")
      .eq("week_id", weekId);

  if (entriesError) {
    throw entriesError;
  }

  for (const entry of entries ?? []) {
    const { data: picks, error: picksError } =
      await supabase
        .from("picks")
        .select("id, game_id, selected_team")
        .eq("entry_id", entry.id);

    if (picksError) {
      throw picksError;
    }

    let score = 0;

    for (const pick of picks ?? []) {
      const game = games?.find(
        (g) => g.id === pick.game_id
      );

      if (!game?.winner) {
        continue;
      }

      const correct =
        game.winner === pick.selected_team;

      if (correct) {
        score++;
      }

      await supabase
        .from("picks")
        .update({
          is_correct: correct,
        })
        .eq("id", pick.id);
    }

    await supabase
      .from("entries")
      .update({
        score,
      })
      .eq("id", entry.id);
  }
}