import { supabase } from "./supabase";


export type WeekStatus =
  | "OPEN"
  | "LOCKED"
  | "COMPLETED";


export interface Week {
  id: string;
  week_number: number;
  deadline: string;
  status: WeekStatus;
  tiebreaker_game_id: string | null;
  tiebreaker_winner: string | null;
  tiebreaker_total_points: number | null;
  tiebreaker_home_points: number | null;
}


export interface TiebreakerSettings {
  tiebreaker_game_id: string;
  tiebreaker_winner: string | null;
  tiebreaker_total_points: number | null;
  tiebreaker_home_points: number | null;
}


function throwSupabaseError(
  operation: string,
  error: any
): never {

  console.error(
    `Weeks.${operation} failed`,
    error
  );

  throw new Error(
    JSON.stringify({
      operation,
      message: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
    })
  );

}





export async function getWeeks(): Promise<Week[]> {

  const { data, error } =
    await supabase
      .from("weeks")
      .select("*")
      .order(
        "week_number",
        {
          ascending: true,
        }
      );


  if (error) {

    throwSupabaseError(
      "getWeeks",
      error
    );

  }


  return (data ?? []) as Week[];

}





export async function getActiveWeek(): Promise<Week | null> {

  const { data, error } =
    await supabase
      .from("weeks")
      .select("*")
      .eq(
        "status",
        "OPEN"
      )
      .single();


  if (error) {

    return null;

  }


  return data as Week;

}





export async function createWeek(
  deadline: string
): Promise<Week> {

  const {
    data: existingWeeks,
    error: fetchError,
  } =
    await supabase
      .from("weeks")
      .select("week_number")
      .order(
        "week_number",
        {
          ascending: false,
        }
      )
      .limit(1);


  if (fetchError) {

    throwSupabaseError(
      "createWeek.fetchLatestWeek",
      fetchError
    );

  }


  const nextWeek =
    existingWeeks &&
    existingWeeks.length > 0
      ? existingWeeks[0].week_number + 1
      : 1;



  const { data, error } =
    await supabase
      .from("weeks")
      .insert({
        week_number: nextWeek,
        deadline,
        status: "OPEN",
      })
      .select()
      .single();


  if (error) {

    throwSupabaseError(
      "createWeek.insert",
      error
    );

  }


  return data as Week;

}





export async function updateWeek(
  id: string,
  deadline: string,
  status: WeekStatus
): Promise<Week> {

  const { data, error } =
    await supabase
      .from("weeks")
      .update({
        deadline,
        status,
      })
      .eq(
        "id",
        id
      )
      .select()
      .single();


  if (error) {

    throwSupabaseError(
      "updateWeek",
      error
    );

  }


  return data as Week;

}





export async function updateTiebreaker(
  weekId: string,
  settings: TiebreakerSettings
): Promise<Week> {

  const { data, error } =
    await supabase
      .from("weeks")
      .update(settings)
      .eq(
        "id",
        weekId
      )
      .select()
      .single();


  if (error) {

    throwSupabaseError(
      "updateTiebreaker",
      error
    );

  }


  return data as Week;

}





export async function deleteWeek(
  id: string
): Promise<void> {

  const { error } =
    await supabase
      .from("weeks")
      .delete()
      .eq(
        "id",
        id
      );


  if (error) {

    throwSupabaseError(
      "deleteWeek",
      error
    );

  }

}





export async function deleteWeekCascade(
  weekId: string
): Promise<void> {


  // Find entries for this week

  const {
    data: entries,
    error: entriesError,
  } =
    await supabase
      .from("entries")
      .select("id")
      .eq(
        "week_id",
        weekId
      );


  if (entriesError) {

    throwSupabaseError(
      "deleteWeekCascade.entries",
      entriesError
    );

  }



  const entryIds =
    entries?.map(
      (entry) => entry.id
    ) ?? [];



  // Delete picks

  if (entryIds.length > 0) {

    const { error: picksError } =
      await supabase
        .from("picks")
        .delete()
        .in(
          "entry_id",
          entryIds
        );


    if (picksError) {

      throwSupabaseError(
        "deleteWeekCascade.picks",
        picksError
      );

    }

  }



  // Delete entries

  const { error: deleteEntriesError } =
    await supabase
      .from("entries")
      .delete()
      .eq(
        "week_id",
        weekId
      );


  if (deleteEntriesError) {

    throwSupabaseError(
      "deleteWeekCascade.entriesDelete",
      deleteEntriesError
    );

  }



  // Delete games

  const { error: gamesError } =
    await supabase
      .from("games")
      .delete()
      .eq(
        "week_id",
        weekId
      );


  if (gamesError) {

    throwSupabaseError(
      "deleteWeekCascade.games",
      gamesError
    );

  }



  // Delete week

  const { error: weekError } =
    await supabase
      .from("weeks")
      .delete()
      .eq(
        "id",
        weekId
      );


  if (weekError) {

    throwSupabaseError(
      "deleteWeekCascade.week",
      weekError
    );

  }

}