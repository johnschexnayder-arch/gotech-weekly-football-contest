import { supabase } from "./supabase";

type TiebreakerEntry = {
  id: string;
  player_id: string;
  score: number | null;
  tiebreaker_winner: string | null;
  tiebreaker_total_points: number | null;
  tiebreaker_home_points: number | null;
};

type TiebreakerWeek = {
  id: string;
  week_number: number;
  tiebreaker_winner: string | null;
  tiebreaker_total_points: number | null;
  tiebreaker_home_points: number | null;
};

function compareTiebreakerForWeek(
  a: TiebreakerEntry,
  b: TiebreakerEntry,
  week: TiebreakerWeek
): number {
  const aWinnerCorrect =
    !!week.tiebreaker_winner &&
    a.tiebreaker_winner === week.tiebreaker_winner;

  const bWinnerCorrect =
    !!week.tiebreaker_winner &&
    b.tiebreaker_winner === week.tiebreaker_winner;

  if (aWinnerCorrect !== bWinnerCorrect) {
    return aWinnerCorrect ? -1 : 1;
  }

  /*
   * Player tiebreaker_total_points stores
   * the predicted TOTAL points scored in the
   * tiebreaker game.
   *
   * Player tiebreaker_home_points stores
   * the predicted HOME-team score.
   *
   * Therefore, tiebreaker_total_points is
   * already the player's predicted total.
   * Do not add the home score to it.
   */
  const aPredictedTotal =
    a.tiebreaker_total_points !== null
      ? a.tiebreaker_total_points
      : null;

  const bPredictedTotal =
    b.tiebreaker_total_points !== null
      ? b.tiebreaker_total_points
      : null;

  const actualTotal = week.tiebreaker_total_points ?? 0;

  const aTotalDifference =
    aPredictedTotal !== null
      ? Math.abs(aPredictedTotal - actualTotal)
      : 9999;

  const bTotalDifference =
    bPredictedTotal !== null
      ? Math.abs(bPredictedTotal - actualTotal)
      : 9999;

  if (aTotalDifference !== bTotalDifference) {
    return aTotalDifference - bTotalDifference;
  }

  /*
   * Third tiebreaker:
   * closest to actual HOME-team score.
   */
  const aHomeDifference = Math.abs(
    (a.tiebreaker_home_points ?? 9999) -
      (week.tiebreaker_home_points ?? 0)
  );

  const bHomeDifference = Math.abs(
    (b.tiebreaker_home_points ?? 9999) -
      (week.tiebreaker_home_points ?? 0)
  );

  if (aHomeDifference !== bHomeDifference) {
    return aHomeDifference - bHomeDifference;
  }

  return 0;
}

export async function calculateWeekScore(weekId: string) {
  const {
    data: week,
    error: weekError,
  } = await supabase
    .from("weeks")
    .select("*")
    .eq("id", weekId)
    .single();

  if (weekError) {
    throw new Error(weekError.message);
  }

  if (!week) {
    throw new Error("Week not found.");
  }

  const {
    data: games,
    error: gamesError,
  } = await supabase
    .from("games")
    .select("*")
    .eq("week_id", weekId)
    .order("game_number");

  if (gamesError) {
    throw new Error(gamesError.message);
  }

  if (!games || games.length === 0) {
    throw new Error("No games are available for this week.");
  }

  const gamesWithoutWinners = games.filter(
    (game) => !game.winner
  );

  if (gamesWithoutWinners.length > 0) {
    const gameNumbers = gamesWithoutWinners
      .map((game) => game.game_number)
      .join(", ");

    throw new Error(
      `Cannot calculate scores. Game winner(s) are missing for game(s): ${gameNumbers}.`
    );
  }

  if (!week.tiebreaker_game_id) {
    throw new Error(
      "Cannot calculate scores. A tiebreaker game has not been selected."
    );
  }

  const tiebreakerGame = games.find(
    (game) => game.id === week.tiebreaker_game_id
  );

  if (!tiebreakerGame) {
    throw new Error(
      "Cannot calculate scores. The selected tiebreaker game does not belong to this week."
    );
  }

  if (!week.tiebreaker_winner) {
    throw new Error(
      "Cannot calculate scores. The tiebreaker game winner has not been entered."
    );
  }

  if (
    week.tiebreaker_winner !== tiebreakerGame.away_team &&
    week.tiebreaker_winner !== tiebreakerGame.home_team
  ) {
    throw new Error(
      "Cannot calculate scores. The tiebreaker winner must be one of the two teams in the tiebreaker game."
    );
  }

  if (
    typeof week.tiebreaker_total_points !== "number" ||
    !Number.isFinite(week.tiebreaker_total_points) ||
    week.tiebreaker_total_points < 0
  ) {
    throw new Error(
      "Cannot calculate scores. The actual tiebreaker total points must be entered."
    );
  }

  if (
    typeof week.tiebreaker_home_points !== "number" ||
    !Number.isFinite(week.tiebreaker_home_points) ||
    week.tiebreaker_home_points < 0
  ) {
    throw new Error(
      "Cannot calculate scores. The actual tiebreaker home-team points must be entered."
    );
  }

  if (
    week.tiebreaker_home_points >
    week.tiebreaker_total_points
  ) {
    throw new Error(
      "Cannot calculate scores. The tiebreaker home-team points cannot exceed the total points."
    );
  }

  const {
    data: players,
    error: playersError,
  } = await supabase
    .from("players")
    .select("id");

  if (playersError) {
    throw new Error(playersError.message);
  }

  const {
    data: entries,
    error: entriesError,
  } = await supabase
    .from("entries")
    .select("*")
    .eq("week_id", weekId);

  if (entriesError) {
    throw new Error(entriesError.message);
  }

  /*
   * Track which players actually submitted picks.
   *
   * This is important when rescoring a week.
   *
   * A previous scoring run may have created an entry
   * for a player who did not submit. That entry must
   * NOT be treated as a submitted entry simply because
   * it exists in the entries table.
   */
  const submittedPlayerIds = new Set<string>();

  /*
   * Track players who have an existing entry but
   * submitted no picks. These players need to receive
   * the non-submission score after all submitted scores
   * have been recalculated.
   */
  const noPickEntryIds = new Set<string>();

  for (const entry of entries ?? []) {
    const {
      data: picks,
      error: picksError,
    } = await supabase
      .from("picks")
      .select("id, game_id, selected_team")
      .eq("entry_id", entry.id);

    if (picksError) {
      throw new Error(picksError.message);
    }

    /*
     * A player with at least one pick is considered
     * to have submitted.
     */
    if (picks && picks.length > 0) {
      submittedPlayerIds.add(entry.player_id);
    } else {
      noPickEntryIds.add(entry.id);
    }

    let score = 0;

    for (const pick of picks ?? []) {
      const game = games.find(
        (item) => item.id === pick.game_id
      );

      const correct =
        !!game &&
        !!game.winner &&
        game.winner === pick.selected_team;

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
        .eq("id", pick.id);

      if (pickUpdateError) {
        throw new Error(pickUpdateError.message);
      }
    }

    /*
     * Only recalculate the score normally for players
     * who actually submitted picks.
     *
     * Existing no-pick entries are handled below after
     * the lowest legitimate submitted score is known.
     */
    if (picks && picks.length > 0) {
      const {
        error: entryUpdateError,
      } = await supabase
        .from("entries")
        .update({
          score,
        })
        .eq("id", entry.id);

      if (entryUpdateError) {
        throw new Error(entryUpdateError.message);
      }
    }
  }

  /*
   * Get all entries again after recalculating the
   * legitimate submitted entries.
   */
  const {
    data: scoredEntries,
    error: scoredEntriesError,
  } = await supabase
    .from("entries")
    .select("id, player_id, score")
    .eq("week_id", weekId);

  if (scoredEntriesError) {
    throw new Error(scoredEntriesError.message);
  }

  /*
   * Determine the lowest score ONLY among players
   * who actually submitted picks.
   */
  const submittedEntries = (scoredEntries ?? []).filter(
    (entry) => submittedPlayerIds.has(entry.player_id)
  );

  if (submittedEntries.length === 0) {
    throw new Error(
      "No submitted entries found for this week."
    );
  }

  const lowestSubmittedScore = Math.min(
    ...submittedEntries.map(
      (entry) => entry.score ?? 0
    )
  );

  /*
   * A player who does not submit receives one point
   * less than the lowest legitimate submitted score.
   */
  const noPickScore = lowestSubmittedScore - 1;

  /*
   * FIX FOR RESCORING:
   *
   * If a no-submission player already has an entry,
   * update that existing entry instead of ignoring it.
   */
  for (const entryId of noPickEntryIds) {
    const {
      error: noPickUpdateError,
    } = await supabase
      .from("entries")
      .update({
        score: noPickScore,
        tiebreaker_winner: null,
        tiebreaker_total_points: null,
        tiebreaker_home_points: null,
      })
      .eq("id", entryId);

    if (noPickUpdateError) {
      throw new Error(noPickUpdateError.message);
    }
  }

  /*
   * Players who have no entry at all are also
   * non-submitters and receive the same penalty.
   */
  const existingEntryPlayerIds = new Set(
    (scoredEntries ?? []).map(
      (entry) => entry.player_id
    )
  );

  for (const player of players ?? []) {
    if (existingEntryPlayerIds.has(player.id)) {
      continue;
    }

    const {
      error: missingEntryError,
    } = await supabase
      .from("entries")
      .insert({
        player_id: player.id,
        week_id: weekId,
        score: noPickScore,
        tiebreaker_winner: null,
        tiebreaker_total_points: null,
        tiebreaker_home_points: null,
      });

    if (missingEntryError) {
      throw new Error(missingEntryError.message);
    }
  }

  await calculateTiebreakerRanks(weekId);

  const {
    error: completeError,
  } = await supabase
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

async function calculateTiebreakerRanks(
  weekId: string
) {
  const {
    data: currentWeek,
    error: currentWeekError,
  } = await supabase
    .from("weeks")
    .select(
      "id, week_number, tiebreaker_winner, tiebreaker_total_points, tiebreaker_home_points"
    )
    .eq("id", weekId)
    .single();

  if (currentWeekError) {
    throw new Error(currentWeekError.message);
  }

  if (!currentWeek) {
    throw new Error("Current week not found.");
  }

  const tiebreakerWeek: TiebreakerWeek = {
    id: currentWeek.id,
    week_number: currentWeek.week_number,
    tiebreaker_winner:
      currentWeek.tiebreaker_winner,
    tiebreaker_total_points:
      currentWeek.tiebreaker_total_points,
    tiebreaker_home_points:
      currentWeek.tiebreaker_home_points,
  };

  const {
    data: currentEntries,
    error: currentEntriesError,
  } = await supabase
    .from("entries")
    .select(
      "id, player_id, score, tiebreaker_winner, tiebreaker_total_points, tiebreaker_home_points"
    )
    .eq("week_id", weekId);

  if (currentEntriesError) {
    throw new Error(currentEntriesError.message);
  }

  if (!currentEntries || currentEntries.length === 0) {
    return;
  }

  const {
    data: previousWeeks,
    error: previousWeeksError,
  } = await supabase
    .from("weeks")
    .select(
      "id, week_number, tiebreaker_winner, tiebreaker_total_points, tiebreaker_home_points"
    )
    .eq("status", "COMPLETED")
    .lt(
      "week_number",
      tiebreakerWeek.week_number
    )
    .order("week_number", {
      ascending: false,
    });

  if (previousWeeksError) {
    throw new Error(previousWeeksError.message);
  }

  const previousWeekIds =
    (previousWeeks ?? []).map(
      (previousWeek) => previousWeek.id
    );

  const previousEntriesByWeek =
    new Map<
      string,
      Map<string, TiebreakerEntry>
    >();

  if (previousWeekIds.length > 0) {
    const {
      data: previousEntries,
      error: previousEntriesError,
    } = await supabase
      .from("entries")
      .select(
        "id, week_id, player_id, score, tiebreaker_winner, tiebreaker_total_points, tiebreaker_home_points"
      )
      .in("week_id", previousWeekIds);

    if (previousEntriesError) {
      throw new Error(
        previousEntriesError.message
      );
    }

    for (const entry of previousEntries ?? []) {
      if (
        !previousEntriesByWeek.has(
          entry.week_id
        )
      ) {
        previousEntriesByWeek.set(
          entry.week_id,
          new Map()
        );
      }

      previousEntriesByWeek
        .get(entry.week_id)!
        .set(entry.player_id, entry);
    }
  }

  function compareEntries(
    a: TiebreakerEntry,
    b: TiebreakerEntry
  ): number {
    const currentComparison =
      compareTiebreakerForWeek(
        a,
        b,
        tiebreakerWeek
      );

    if (currentComparison !== 0) {
      return currentComparison;
    }

    for (const previousWeek of previousWeeks ?? []) {
      const entriesForWeek =
        previousEntriesByWeek.get(
          previousWeek.id
        );

      const aPrevious =
        entriesForWeek?.get(
          a.player_id
        );

      const bPrevious =
        entriesForWeek?.get(
          b.player_id
        );

      if (!aPrevious && !bPrevious) {
        continue;
      }

      if (aPrevious && !bPrevious) {
        return -1;
      }

      if (!aPrevious && bPrevious) {
        return 1;
      }

      const previousComparison =
        compareTiebreakerForWeek(
          aPrevious!,
          bPrevious!,
          previousWeek
        );

      if (previousComparison !== 0) {
        return previousComparison;
      }
    }

    return 0;
  }

  const ranked = [...currentEntries].sort(
    (a, b) => {
      const aScore = a.score ?? 0;
      const bScore = b.score ?? 0;

      if (aScore !== bScore) {
        return bScore - aScore;
      }

      return compareEntries(a, b);
    }
  );

  let previousEntry:
    TiebreakerEntry | null = null;

  let previousRank = 0;

  for (
    let index = 0;
    index < ranked.length;
    index++
  ) {
    const currentEntry = ranked[index];

    let sameAsPrevious = false;

    if (previousEntry) {
      const scoreSame =
        (currentEntry.score ?? 0) ===
        (previousEntry.score ?? 0);

      const tiebreakerSame =
        compareEntries(
          currentEntry,
          previousEntry
        ) === 0 &&
        compareEntries(
          previousEntry,
          currentEntry
        ) === 0;

      sameAsPrevious =
        scoreSame &&
        tiebreakerSame;
    }

    const rank = sameAsPrevious
      ? previousRank
      : index + 1;

    const {
      error: rankUpdateError,
    } = await supabase
      .from("entries")
      .update({
        tiebreaker_rank: rank,
      })
      .eq("id", currentEntry.id);

    if (rankUpdateError) {
      throw new Error(
        rankUpdateError.message
      );
    }

    previousEntry = currentEntry;
    previousRank = rank;
  }
}