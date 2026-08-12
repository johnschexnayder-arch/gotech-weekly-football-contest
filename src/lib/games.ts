import { supabase } from "@/lib/supabase";

export type Game = {
  id: string;
  awayTeam: string;
  homeTeam: string;
  winner: string | null;
};

export type CurrentWeek = {
  id: string;
  weekNumber: number;
  deadline: string;
  status: "OPEN" | "LOCKED" | "COMPLETED";
  tiebreakerGameId: string | null;
  games: Game[];
};

export async function getCurrentWeek(): Promise<CurrentWeek | null> {
  const { data: openWeek, error: openError } =
    await supabase
      .from("weeks")
      .select(
        "id, week_number, deadline, status, tiebreaker_game_id"
      )
      .eq("status", "OPEN")
      .order("week_number", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

  if (openError) {
    throw new Error(
      openError.message
    );
  }

  let week = openWeek;

  if (!week) {
    const {
      data: recentWeek,
      error: recentError,
    } = await supabase
      .from("weeks")
      .select(
        "id, week_number, deadline, status, tiebreaker_game_id"
      )
      .order("week_number", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (recentError) {
      throw new Error(
        recentError.message
      );
    }

    week = recentWeek;
  }

  if (!week) {
    return null;
  }

  const {
    data: games,
    error: gamesError,
  } = await supabase
    .from("games")
    .select("*")
    .eq("week_id", week.id)
    .order("game_number");

  if (gamesError) {
    throw new Error(
      gamesError.message
    );
  }

  return {
    id: week.id,

    weekNumber:
      week.week_number,

    deadline:
      week.deadline,

    status:
      week.status,

    tiebreakerGameId:
      week.tiebreaker_game_id ?? null,

    games:
      games?.map((game) => ({
        id:
          game.id,

        awayTeam:
          game.away_team,

        homeTeam:
          game.home_team,

        winner:
          game.winner ?? null,
      })) ?? [],
  };
}

export async function getGames(
  weekId: string
) {
  const {
    data,
    error,
  } = await supabase
    .from("games")
    .select("*")
    .eq("week_id", weekId)
    .order("game_number");

  if (error) {
    throw new Error(
      error.message
    );
  }

  return data ?? [];
}

export async function createGame(
  game: {
    week_id: string;
    game_number: number;
    sport: string;
    away_team: string;
    home_team: string;
    kickoff: string;
  }
) {
  const {
    data,
    error,
  } = await supabase
    .from("games")
    .insert(game)
    .select()
    .single();

  if (error) {
    throw new Error(
      error.message
    );
  }

  return data;
}

export async function updateGame(
  id: string,
  game: {
    sport: string;
    away_team: string;
    home_team: string;
    kickoff: string;
    winner?: string | null;
  }
) {
  const {
    data,
    error,
  } = await supabase
    .from("games")
    .update(game)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(
      error.message
    );
  }

  return data;
}

export async function deleteGame(
  id: string
) {
  const {
    error,
  } = await supabase
    .from("games")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(
      error.message
    );
  }
}