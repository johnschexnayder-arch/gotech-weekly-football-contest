import { supabase } from "@/lib/supabase";

export type HeroData = {
  weekNumber: number;
  deadline: string;
  gameCount: number;
};

export type LeaderboardPlayer = {
  rank: number;
  name: string;
  score: number;
  tiebreakerRank?: number;
};

export type WeeklyGame = {
  id: number;
  away: string;
  home: string;
  kickoff: string;
};

export type ContestStats = {
  players: number;
  games: number;
  weeklyPrize: number;
  seasonPot: number;
};

export type WeeklyAwards = {
  winner?: {
    name: string;
    score: number;
  };

  lastPlace?: {
    name: string;
    score: number;
  };
};

export type PerfectSlatePlayer = {
  name: string;
  score: number;
};

export type LastWeekTop10Player = {
  rank: number;
  name: string;
  score: number;
};

export type LastWeekTop10Data = {
  weekNumber?: number;
  players: LastWeekTop10Player[];
};

export type DashboardData = {
  hero: HeroData;
  leaderboard: LeaderboardPlayer[];
  seasonLeaderboard: LeaderboardPlayer[];
  weeklyAwards: WeeklyAwards;
  perfectSlatePlayers: PerfectSlatePlayer[];
  games: WeeklyGame[];
  stats: ContestStats;
  lastWeekTop10: LastWeekTop10Data;
};

export async function getDashboard(): Promise<DashboardData> {
  const { data: openWeeks, error: openWeekError } = await supabase
    .from("weeks")
    .select("*")
    .eq("status", "OPEN")
    .order("week_number", {
      ascending: false,
    })
    .limit(1);

  if (openWeekError) {
    console.error("OPEN WEEK ERROR:", openWeekError);
    throw new Error(JSON.stringify(openWeekError));
  }

  let week = openWeeks?.[0];

  if (!week) {
    const { data: recentWeeks, error: recentWeekError } = await supabase
      .from("weeks")
      .select("*")
      .order("week_number", {
        ascending: false,
      })
      .limit(1);

    if (recentWeekError) {
      console.error("RECENT WEEK ERROR:", recentWeekError);
      throw new Error(JSON.stringify(recentWeekError));
    }

    week = recentWeeks?.[0];
  }

  if (!week) {
    throw new Error("No contest weeks found.");
  }

  const { data: dbGames, error: gamesError } = await supabase
    .from("games")
    .select("*")
    .eq("week_id", week.id)
    .order("game_number");

  if (gamesError) {
    console.error("GAMES ERROR:", gamesError);
    throw new Error(JSON.stringify(gamesError));
  }

  const totalGames = dbGames?.length ?? 0;

  const { count: playerCount, error: playersError } = await supabase
    .from("players")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (playersError) {
    console.error("PLAYERS ERROR:", playersError);
    throw new Error(JSON.stringify(playersError));
  }

  const { data: weeklyEntries, error: weeklyError } = await supabase
    .from("entries")
    .select(`
      score,
      tiebreaker_rank,
      players (
        name
      )
    `)
    .eq("week_id", week.id);

  if (weeklyError) {
    console.error("WEEKLY ENTRIES ERROR:", weeklyError);
    throw new Error(JSON.stringify(weeklyError));
  }

  const leaderboard =
    (weeklyEntries ?? [])
      .sort((a, b) => {
        if ((b.score ?? 0) !== (a.score ?? 0)) {
          return (b.score ?? 0) - (a.score ?? 0);
        }

        return (
          (a.tiebreaker_rank ?? 999) -
          (b.tiebreaker_rank ?? 999)
        );
      })
      .map((entry, index) => {
        const player = Array.isArray(entry.players)
          ? entry.players[0]
          : entry.players;

        return {
          rank: index + 1,
          name: player?.name ?? "Unknown Player",
          score: entry.score ?? 0,
          tiebreakerRank:
            entry.tiebreaker_rank ?? undefined,
        };
      });

  const weeklyAwards: WeeklyAwards = {
    winner: leaderboard[0]
      ? {
          name: leaderboard[0].name,
          score: leaderboard[0].score,
        }
      : undefined,

    lastPlace:
      leaderboard.length > 0
        ? {
            name: leaderboard[leaderboard.length - 1].name,
            score: leaderboard[leaderboard.length - 1].score,
          }
        : undefined,
  };

  const perfectSlatePlayers = leaderboard
    .filter((player) => player.score === totalGames)
    .map((player) => ({
      name: player.name,
      score: player.score,
    }));

  const { data: seasonEntries, error: seasonError } = await supabase
    .from("entries")
    .select(`
      score,
      tiebreaker_rank,
      players (
        name
      )
    `);

  if (seasonError) {
    console.error("SEASON ERROR:", seasonError);
    throw new Error(JSON.stringify(seasonError));
  }

  const totals: Record<
    string,
    {
      name: string;
      score: number;
      bestRank: number;
    }
  > = {};

  seasonEntries?.forEach((entry) => {
    const player = Array.isArray(entry.players)
      ? entry.players[0]
      : entry.players;

    const name = player?.name ?? "Unknown Player";

    if (!totals[name]) {
      totals[name] = {
        name,
        score: 0,
        bestRank: entry.tiebreaker_rank ?? 999,
      };
    }

    totals[name].score += entry.score ?? 0;

    totals[name].bestRank = Math.min(
      totals[name].bestRank,
      entry.tiebreaker_rank ?? 999
    );
  });

  const seasonLeaderboard = Object.values(totals)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.bestRank - b.bestRank;
    })
    .map((player, index) => ({
      rank: index + 1,
      name: player.name,
      score: player.score,
    }));

  /*
   * Last Week Top 10
   *
   * Find the most recently completed contest week.
   * This is intentionally separate from the current/open week
   * leaderboard above.
   */
  const { data: completedWeeks, error: completedWeeksError } =
    await supabase
      .from("weeks")
      .select("id, week_number")
      .eq("status", "COMPLETED")
      .order("week_number", {
        ascending: false,
      })
      .limit(1);

  if (completedWeeksError) {
    console.error(
      "COMPLETED WEEKS ERROR:",
      completedWeeksError
    );
    throw new Error(
      JSON.stringify(completedWeeksError)
    );
  }

  const completedWeek = completedWeeks?.[0];

  let lastWeekTop10: LastWeekTop10Data = {
    players: [],
  };

  if (completedWeek) {
    const {
      data: completedEntries,
      error: completedEntriesError,
    } = await supabase
      .from("entries")
      .select(`
        score,
        tiebreaker_rank,
        players (
          name
        )
      `)
      .eq("week_id", completedWeek.id);

    if (completedEntriesError) {
      console.error(
        "COMPLETED WEEK ENTRIES ERROR:",
        completedEntriesError
      );
      throw new Error(
        JSON.stringify(completedEntriesError)
      );
    }

    const completedLeaderboard = (completedEntries ?? [])
      .sort((a, b) => {
        if ((b.score ?? 0) !== (a.score ?? 0)) {
          return (b.score ?? 0) - (a.score ?? 0);
        }

        return (
          (a.tiebreaker_rank ?? 999) -
          (b.tiebreaker_rank ?? 999)
        );
      })
      .slice(0, 10)
      .map((entry, index) => {
        const player = Array.isArray(entry.players)
          ? entry.players[0]
          : entry.players;

        return {
          rank: index + 1,
          name: player?.name ?? "Unknown Player",
          score: entry.score ?? 0,
        };
      });

    lastWeekTop10 = {
      weekNumber: completedWeek.week_number,
      players: completedLeaderboard,
    };
  }

  return {
    hero: {
      weekNumber: week.week_number,
      deadline: week.deadline,
      gameCount: totalGames,
    },

    leaderboard,

    seasonLeaderboard,

    weeklyAwards,

    perfectSlatePlayers,

    games: (dbGames ?? []).map((game) => ({
      id: game.game_number,
      away: game.away_team,
      home: game.home_team,
      kickoff: game.kickoff ?? "Kickoff TBD",
    })),

    stats: {
      players: playerCount ?? 0,
      games: totalGames,
      weeklyPrize: 80,
      seasonPot: (playerCount ?? 0) * 20,
    },

    lastWeekTop10,
  };
}