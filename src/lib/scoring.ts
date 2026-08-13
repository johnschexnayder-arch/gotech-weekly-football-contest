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
  /*
   * Tiebreaker #1:
   * Did the player correctly pick the winner
   * of the tiebreaker game?
   */
  const aWinnerCorrect =
    !!week.tiebreaker_winner &&
    a.tiebreaker_winner ===
      week.tiebreaker_winner;

  const bWinnerCorrect =
    !!week.tiebreaker_winner &&
    b.tiebreaker_winner ===
      week.tiebreaker_winner;

  if (
    aWinnerCorrect !==
    bWinnerCorrect
  ) {
    return aWinnerCorrect
      ? -1
      : 1;
  }

  /*
   * Tiebreaker #2:
   * Closest to the total points scored
   * in the tiebreaker game.
   */
  const aTotalDifference =
    Math.abs(
      (a.tiebreaker_total_points ??
        9999) -
        (week.tiebreaker_total_points ??
          0)
    );

  const bTotalDifference =
    Math.abs(
      (b.tiebreaker_total_points ??
        9999) -
        (week.tiebreaker_total_points ??
          0)
    );

  if (
    aTotalDifference !==
    bTotalDifference
  ) {
    return (
      aTotalDifference -
      bTotalDifference
    );
  }

  /*
   * Tiebreaker #3:
   * Closest to the home team's score
   * in the tiebreaker game.
   */
  const aHomeDifference =
    Math.abs(
      (a.tiebreaker_home_points ??
        9999) -
        (week.tiebreaker_home_points ??
          0)
    );

  const bHomeDifference =
    Math.abs(
      (b.tiebreaker_home_points ??
        9999) -
        (week.tiebreaker_home_points ??
          0)
    );

  if (
    aHomeDifference !==
    bHomeDifference
  ) {
    return (
      aHomeDifference -
      bHomeDifference
    );
  }

  /*
   * Still tied after all three
   * tiebreaker criteria.
   */
  return 0;
}

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

  if (!week) {
    throw new Error(
      "Week not found."
    );
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
    throw new Error(
      gamesError.message
    );
  }

  /*
   * Do not allow scoring to begin until
   * every required game result has been entered.
   */
  if (
    !games ||
    games.length === 0
  ) {
    throw new Error(
      "No games are available for this week."
    );
  }

  const gamesWithoutWinners =
    games.filter(
      (game) =>
        !game.winner
    );

  if (
    gamesWithoutWinners.length > 0
  ) {
    const gameNumbers =
      gamesWithoutWinners
        .map(
          (game) =>
            game.game_number
        )
        .join(", ");

    throw new Error(
      `Cannot calculate scores. Game winner(s) are missing for game(s): ${gameNumbers}.`
    );
  }

  /*
   * Validate the tiebreaker result before
   * changing any player scores.
   */
  if (
    !week.tiebreaker_game_id
  ) {
    throw new Error(
      "Cannot calculate scores. A tiebreaker game has not been selected."
    );
  }

  const tiebreakerGame =
    games.find(
      (game) =>
        game.id ===
        week.tiebreaker_game_id
    );

  if (!tiebreakerGame) {
    throw new Error(
      "Cannot calculate scores. The selected tiebreaker game does not belong to this week."
    );
  }

  if (
    !week.tiebreaker_winner
  ) {
    throw new Error(
      "Cannot calculate scores. The tiebreaker game winner has not been entered."
    );
  }

  if (
    week.tiebreaker_winner !==
      tiebreakerGame.away_team &&
    week.tiebreaker_winner !==
      tiebreakerGame.home_team
  ) {
    throw new Error(
      "Cannot calculate scores. The tiebreaker winner must be one of the two teams in the tiebreaker game."
    );
  }

  if (
    typeof week.tiebreaker_total_points !==
      "number" ||
    !Number.isFinite(
      week.tiebreaker_total_points
    ) ||
    week.tiebreaker_total_points <
      0
  ) {
    throw new Error(
      "Cannot calculate scores. The actual tiebreaker total points must be entered."
    );
  }

  if (
    typeof week.tiebreaker_home_points !==
      "number" ||
    !Number.isFinite(
      week.tiebreaker_home_points
    ) ||
    week.tiebreaker_home_points <
      0
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
   * Calculate the normal score for every
   * player who submitted picks.
   */
  for (
    const entry of
      entries ?? []
  ) {
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

    for (
      const pick of
        picks ?? []
    ) {
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
        error:
          pickUpdateError,
      } = await supabase
        .from("picks")
        .update({
          is_correct:
            correct,
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
      error:
        entryUpdateError,
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
   * Re-fetch the scored entries.
   */
  const {
    data: scoredEntries,
    error:
      scoredEntriesError,
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
   * Create an entry for players who did not
   * submit picks.
   */
  for (
    const player of
      players ?? []
  ) {
    if (
      entryIds.has(
        player.id
      )
    ) {
      continue;
    }

    const {
      error:
        missingEntryError,
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

  /*
   * Calculate the complete tiebreaker
   * ranking after all entries exist.
   */
  await calculateTiebreakerRanks(
    weekId
  );

  const {
    error:
      completeError,
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
  /*
   * Get the current week and its actual
   * tiebreaker result.
   */
  const {
    data: currentWeek,
    error:
      currentWeekError,
  } = await supabase
    .from("weeks")
    .select(
      "id, week_number, tiebreaker_winner, tiebreaker_total_points, tiebreaker_home_points"
    )
    .eq(
      "id",
      weekId
    )
    .single();

  if (currentWeekError) {
    throw new Error(
      currentWeekError.message
    );
  }

  if (!currentWeek) {
    throw new Error(
      "Current week not found."
    );
  }

  const tiebreakerWeek:
    TiebreakerWeek = {
    id:
      currentWeek.id,

    week_number:
      currentWeek.week_number,

    tiebreaker_winner:
      currentWeek.tiebreaker_winner,

    tiebreaker_total_points:
      currentWeek.tiebreaker_total_points,

    tiebreaker_home_points:
      currentWeek.tiebreaker_home_points,
  };

  /*
   * Get all entries for the current week.
   */
  const {
    data: currentEntries,
    error:
      currentEntriesError,
  } = await supabase
    .from("entries")
    .select(
      "id, player_id, score, tiebreaker_winner, tiebreaker_total_points, tiebreaker_home_points"
    )
    .eq(
      "week_id",
      weekId
    );

  if (currentEntriesError) {
    throw new Error(
      currentEntriesError.message
    );
  }

  if (
    !currentEntries ||
    currentEntries.length === 0
  ) {
    return;
  }

  /*
   * Get all previously completed weeks,
   * newest first.
   *
   * This means Week 2 is checked before
   * Week 1 when determining a Week 3 tie.
   */
  const {
    data: previousWeeks,
    error:
      previousWeeksError,
  } = await supabase
    .from("weeks")
    .select(
      "id, week_number, tiebreaker_winner, tiebreaker_total_points, tiebreaker_home_points"
    )
    .eq(
      "status",
      "COMPLETED"
    )
    .lt(
      "week_number",
      tiebreakerWeek.week_number
    )
    .order(
      "week_number",
      {
        ascending:
          false,
      }
    );

  if (previousWeeksError) {
    throw new Error(
      previousWeeksError.message
    );
  }

  /*
   * Load all previous-week entries in one
   * query so the comparisons can be performed
   * synchronously in memory.
   */
  const previousWeekIds =
    (previousWeeks ?? []).map(
      (previousWeek) =>
        previousWeek.id
    );

  const previousEntriesByWeek =
    new Map<
      string,
      Map<
        string,
        TiebreakerEntry
      >
    >();

  if (
    previousWeekIds.length >
    0
  ) {
    const {
      data:
        previousEntries,
      error:
        previousEntriesError,
    } = await supabase
      .from("entries")
      .select(
        "id, week_id, player_id, score, tiebreaker_winner, tiebreaker_total_points, tiebreaker_home_points"
      )
      .in(
        "week_id",
        previousWeekIds
      );

    if (previousEntriesError) {
      throw new Error(
        previousEntriesError.message
      );
    }

    for (
      const entry of
        previousEntries ??
        []
    ) {
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
        .get(
          entry.week_id
        )!
        .set(
          entry.player_id,
          entry
        );
    }
  }

  /*
   * Compare two entries who have the same
   * current-week score.
   */
  function compareEntries(
    a: TiebreakerEntry,
    b: TiebreakerEntry
  ): number {
    /*
     * FIRST:
     * Current week's tiebreaker.
     */
    const currentComparison =
      compareTiebreakerForWeek(
        a,
        b,
        tiebreakerWeek
      );

    if (
      currentComparison !== 0
    ) {
      return currentComparison;
    }

    /*
     * STILL TIED:
     * Go backward through previous completed
     * weeks, newest first.
     */
    for (
      const previousWeek of
        previousWeeks ?? []
    ) {
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

      /*
       * Neither player has an entry for this
       * previous week. Continue backward.
       */
      if (
        !aPrevious &&
        !bPrevious
      ) {
        continue;
      }

      /*
       * Only one player has an entry.
       * The player with the entry gets the
       * tiebreaker advantage.
       */
      if (
        aPrevious &&
        !bPrevious
      ) {
        return -1;
      }

      if (
        !aPrevious &&
        bPrevious
      ) {
        return 1;
      }

      /*
       * Both players have an entry.
       * Apply the exact same three tiebreakers
       * from that previous week.
       */
      const previousComparison =
        compareTiebreakerForWeek(
          aPrevious!,
          bPrevious!,
          previousWeek
        );

      if (
        previousComparison !==
        0
      ) {
        return previousComparison;
      }

      /*
       * Still tied.
       * Continue to the next older week.
       */
    }

    /*
     * They are completely tied through every
     * available tiebreaker.
     */
    return 0;
  }

  /*
   * Rank by:
   *
   * 1. Weekly score
   * 2. Current-week tiebreaker
   * 3. Previous-week tiebreaker(s) if needed
   */
  const ranked =
    [
      ...currentEntries,
    ].sort(
      (a, b) => {
        const aScore =
          a.score ?? 0;

        const bScore =
          b.score ?? 0;

        /*
         * Weekly score is always the primary
         * ranking criterion.
         */
        if (
          aScore !==
          bScore
        ) {
          return (
            bScore -
            aScore
          );
        }

        /*
         * Same weekly score:
         * use the complete tiebreaker chain.
         */
        return compareEntries(
          a,
          b
        );
      }
    );

  /*
   * Save the resulting tiebreaker rank.
   *
   * Players who are completely tied receive
   * the same rank. For example:
   *
   * 1
   * 1
   * 3
   *
   * rather than:
   *
   * 1
   * 2
   * 3
   */
  let previousEntry:
    TiebreakerEntry | null =
    null;

  let previousRank = 0;

  for (
    let index = 0;
    index < ranked.length;
    index++
  ) {
    const currentEntry =
      ranked[index];

    let sameAsPrevious =
      false;

    if (
      previousEntry
    ) {
      const scoreSame =
        (currentEntry.score ??
          0) ===
        (previousEntry.score ??
          0);

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

    const rank =
      sameAsPrevious
        ? previousRank
        : index + 1;

    const {
      error:
        rankUpdateError,
    } = await supabase
      .from("entries")
      .update({
        tiebreaker_rank:
          rank,
      })
      .eq(
        "id",
        currentEntry.id
      );

    if (rankUpdateError) {
      throw new Error(
        rankUpdateError.message
      );
    }

    previousEntry =
      currentEntry;

    previousRank =
      rank;
  }
}