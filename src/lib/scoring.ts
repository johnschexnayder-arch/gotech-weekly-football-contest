import { supabase } from "./supabase";

export async function calculateWeekScore(
  weekId: string
) {
  const {
    data: week,
    error: weekError,
  } = await supabase
    .from("weeks")
    .select("*")
    .eq("id", weekId)
    .single();

  if (weekError) {
    throw new Error(
      weekError.message
    );
  }

  const {
    data: games,
    error: gamesError,
  } = await supabase
    .from("games")
    .select("*")
    .eq("week_id", weekId);

  if (gamesError) {
    throw new Error(
      gamesError.message
    );
  }

  const {
    data: players,
    error: playersError,
  } = await supabase
    .from("players")
    .select("id");

  if (playersError) {
    throw new Error(
      playersError.message
    );
  }

  const {
    data: entries,
    error: entriesError,
  } = await supabase
    .from("entries")
    .select("*")
    .eq("week_id", weekId);

  if (entriesError) {
    throw new Error(
      entriesError.message
    );
  }

  const entryIds =
    new Set(
      (entries ?? []).map(
        (entry) =>
          entry.player_id
      )
    );

  /*
   * First calculate the normal scores for
   * every player who submitted picks.
   */
  for (const entry of entries ?? []) {
    const {
      data: picks,
      error: picksError,
    } = await supabase
      .from("picks")
      .select(
        "id, game_id, selected_team"
      )
      .eq(
        "entry_id",
        entry.id
      );

    if (picksError) {
      throw new Error(
        picksError.message
      );
    }

    let score = 0;

    for (const pick of picks ?? []) {
      const game =
        games?.find(
          (item) =>
            item.id ===
            pick.game_id
        );

      const correct =
        !!game &&
        !!game.winner &&
        game.winner ===
          pick.selected_team;

      if (correct) {
        score++;
      }

      const {
        error: pickUpdateError,
      } = await supabase
        .from("picks")
        .update({
          is_correct: correct,
        })
        .eq(
          "id",
          pick.id
        );

      if (pickUpdateError) {
        throw new Error(
          pickUpdateError.message
        );
      }
    }

    const {
      error: entryUpdateError,
    } = await supabase
      .from("entries")
      .update({
        score,
      })
      .eq(
        "id",
        entry.id
      );

    if (entryUpdateError) {
      throw new Error(
        entryUpdateError.message
      );
    }
  }

  /*
   * Re-fetch the submitted entries after
   * calculating their scores.
   */
  const {
    data: scoredEntries,
    error: scoredEntriesError,
  } = await supabase
    .from("entries")
    .select(
      "id, player_id, score"
    )
    .eq(
      "week_id",
      weekId
    );

  if (scoredEntriesError) {
    throw new Error(
      scoredEntriesError.message
    );
  }

  /*
   * At least one player is expected to submit
   * picks every week.
   */
  if (
    !scoredEntries ||
    scoredEntries.length === 0
  ) {
    throw new Error(
      "No submitted entries found for this week."
    );
  }

  const lowestSubmittedScore =
    Math.min(
      ...scoredEntries.map(
        (entry) =>
          entry.score ?? 0
      )
    );

  const noPickScore =
    lowestSubmittedScore - 1;

  /*
   * Create an entry for every player who
   * did not submit picks.
   *
   * This allows Results and Season Standings
   * to use the same entry-based scoring system.
   */
  for (const player of players ?? []) {
    if (
      entryIds.has(player.id)
    ) {
      continue;
    }

    const {
      error: missingEntryError,
    } = await supabase
      .from("entries")
      .insert({
        player_id:
          player.id,

        week_id:
          weekId,

        score:
          noPickScore,

        tiebreaker_winner:
          null,

        tiebreaker_total_points:
          null,

        tiebreaker_home_points:
          null,
      });

    if (missingEntryError) {
      throw new Error(
        missingEntryError.message
      );
    }
  }

  await calculateTiebreakerRanks(
    weekId
  );

  const {
    error: completeError,
  } = await supabase
    .from("weeks")
    .update({
      status:
        "COMPLETED",
    })
    .eq(
      "id",
      weekId
    );

  if (completeError) {
    throw new Error(
      completeError.message
    );
  }

  return true;
}

async function calculateTiebreakerRanks(
  weekId: string
) {
  const {
    data: week,
    error: weekError,
  } = await supabase
    .from("weeks")
    .select("*")
    .eq("id", weekId)
    .single();

  if (weekError) {
    throw new Error(
      weekError.message
    );
  }

  const {
    data: entries,
    error,
  } = await supabase
    .from("entries")
    .select("*")
    .eq(
      "week_id",
      weekId
    );

  if (error) {
    throw new Error(
      error.message
    );
  }

  if (
    !entries ||
    entries.length === 0
  ) {
    return;
  }

  const ranked =
    entries
      .map((entry) => ({
        ...entry,

        winnerCorrect:
          !!week.tiebreaker_winner &&
          entry.tiebreaker_winner ===
            week.tiebreaker_winner,

        totalDifference:
          Math.abs(
            (entry.tiebreaker_total_points ??
              9999) -
              (week.tiebreaker_total_points ??
                0)
          ),

        homeDifference:
          Math.abs(
            (entry.tiebreaker_home_points ??
              9999) -
              (week.tiebreaker_home_points ??
                0)
          ),
      }))
      .sort((a, b) => {
        if (
          a.winnerCorrect !==
          b.winnerCorrect
        ) {
          return a.winnerCorrect
            ? -1
            : 1;
        }

        if (
          a.totalDifference !==
          b.totalDifference
        ) {
          return (
            a.totalDifference -
            b.totalDifference
          );
        }

        return (
          a.homeDifference -
          b.homeDifference
        );
      });

  for (
    let index = 0;
    index < ranked.length;
    index++
  ) {
    const {
      error: rankUpdateError,
    } = await supabase
      .from("entries")
      .update({
        tiebreaker_rank:
          index + 1,
      })
      .eq(
        "id",
        ranked[index].id
      );

    if (rankUpdateError) {
      throw new Error(
        rankUpdateError.message
      );
    }
  }
}