import { supabase } from "./supabase";

export async function calculateWeekScore(weekId: string) {
  const { data: week, error: weekError } = await supabase
    .from("weeks")
    .select("*")
    .eq("id", weekId)
    .single();

  if (weekError) {
    throw new Error(weekError.message);
  }

  const { data: games, error: gamesError } = await supabase
    .from("games")
    .select("*")
    .eq("week_id", weekId);

  if (gamesError) {
    throw new Error(gamesError.message);
  }

  const { data: entries, error: entriesError } = await supabase
    .from("entries")
    .select("*")
    .eq("week_id", weekId);

  if (entriesError) {
    throw new Error(entriesError.message);
  }

  for (const entry of entries ?? []) {
    const { data: picks, error: picksError } = await supabase
      .from("picks")
      .select("*")
      .eq("entry_id", entry.id);

    if (picksError) {
      throw new Error(picksError.message);
    }

    let score = 0;

    for (const pick of picks ?? []) {
      const game = games?.find(
        (item) => item.id === pick.game_id
      );

      const correct =
        !!game &&
        !!game.winner &&
        game.winner === pick.selected_team;

      if (correct) {
        score++;
      }

      const { error: pickUpdateError } = await supabase
        .from("picks")
        .update({
          is_correct: correct,
        })
        .eq("id", pick.id);

      if (pickUpdateError) {
        throw new Error(pickUpdateError.message);
      }
    }

    const { error: entryUpdateError } = await supabase
      .from("entries")
      .update({
        score,
      })
      .eq("id", entry.id);

    if (entryUpdateError) {
      throw new Error(entryUpdateError.message);
    }
  }

  await calculateTiebreakerRanks(weekId);

  const { error: completeError } = await supabase
    .from("weeks")
    .update({
      status: "COMPLETED",
    })
    .eq("id", weekId);

  if (completeError) {
    throw new Error(completeError.message);
  }

  return true;
}

async function calculateTiebreakerRanks(weekId: string) {
  const { data: week, error: weekError } = await supabase
    .from("weeks")
    .select("*")
    .eq("id", weekId)
    .single();

  if (weekError) {
    throw new Error(weekError.message);
  }

  const { data: entries, error } = await supabase
    .from("entries")
    .select("*")
    .eq("week_id", weekId);

  if (error) {
    throw new Error(error.message);
  }

  if (!entries || entries.length === 0) {
    return;
  }

  const ranked = entries
    .map((entry) => ({
      ...entry,

      winnerCorrect:
        !!week.tiebreaker_winner &&
        entry.tiebreaker_winner ===
          week.tiebreaker_winner,

      totalDifference:
        Math.abs(
          (entry.tiebreaker_total_points ?? 9999) -
            (week.tiebreaker_total_points ?? 0)
        ),

      homeDifference:
        Math.abs(
          (entry.tiebreaker_home_points ?? 9999) -
            (week.tiebreaker_home_points ?? 0)
        ),
    }))
    .sort((a, b) => {
      if (a.winnerCorrect !== b.winnerCorrect) {
        return a.winnerCorrect ? -1 : 1;
      }

      if (a.totalDifference !== b.totalDifference) {
        return a.totalDifference - b.totalDifference;
      }

      return a.homeDifference - b.homeDifference;
    });

  for (let index = 0; index < ranked.length; index++) {
    const { error: rankUpdateError } = await supabase
      .from("entries")
      .update({
        tiebreaker_rank: index + 1,
      })
      .eq("id", ranked[index].id);

    if (rankUpdateError) {
      throw new Error(rankUpdateError.message);
    }
  }
}