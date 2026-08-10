import { supabase } from "@/lib/supabase";


type TiebreakerData = {
  winner: string;
  totalPoints: number;
  homePoints: number;
};


export async function savePicks(
  playerId: string,
  weekId: string,
  picks: Record<string, string>,
  tiebreaker: TiebreakerData
) {


  const { data: existingEntry, error: entryLookupError } =
    await supabase
      .from("entries")
      .select("id")
      .eq("player_id", playerId)
      .eq("week_id", weekId)
      .maybeSingle();



  if (entryLookupError) {
    throw entryLookupError;
  }



  let entryId = existingEntry?.id;



  if (!entryId) {


    const { data: newEntry, error: createEntryError } =
      await supabase
        .from("entries")
        .insert({
          player_id: playerId,
          week_id: weekId,
          tiebreaker_winner: tiebreaker.winner,
          tiebreaker_total_points: tiebreaker.totalPoints,
          tiebreaker_home_points: tiebreaker.homePoints,
        })
        .select("id")
        .single();



    if (createEntryError) {
      throw createEntryError;
    }



    entryId = newEntry.id;


  } else {


    const { error: updateEntryError } =
      await supabase
        .from("entries")
        .update({
          tiebreaker_winner: tiebreaker.winner,
          tiebreaker_total_points: tiebreaker.totalPoints,
          tiebreaker_home_points: tiebreaker.homePoints,
        })
        .eq("id", entryId);



    if (updateEntryError) {
      throw updateEntryError;
    }

  }





  const { error: deleteError } =
    await supabase
      .from("picks")
      .delete()
      .eq("entry_id", entryId);



  if (deleteError) {
    throw deleteError;
  }





  const rows = Object.entries(picks).map(
    ([gameId, selectedTeam]) => ({
      entry_id: entryId,
      game_id: gameId,
      selected_team: selectedTeam,
    })
  );





  const { error: insertError } =
    await supabase
      .from("picks")
      .insert(rows);



  if (insertError) {
    throw insertError;
  }

}









export type SavedPicks = {
  picks: Record<string, string>;
  tiebreaker: {
    winner: string;
    totalPoints: number | null;
    homePoints: number | null;
  };
};





export async function getSavedPicks(
  playerId: string,
  weekId: string
): Promise<SavedPicks> {


  const { data: entry, error: entryError } =
    await supabase
      .from("entries")
      .select(
        `
        id,
        tiebreaker_winner,
        tiebreaker_total_points,
        tiebreaker_home_points
        `
      )
      .eq("player_id", playerId)
      .eq("week_id", weekId)
      .maybeSingle();



  if (entryError) {
    throw entryError;
  }



  if (!entry) {

    return {
      picks: {},
      tiebreaker: {
        winner: "",
        totalPoints: null,
        homePoints: null,
      },
    };

  }






  const { data: picks, error: picksError } =
    await supabase
      .from("picks")
      .select("game_id, selected_team")
      .eq("entry_id", entry.id);



  if (picksError) {
    throw picksError;
  }





  const saved: Record<string, string> = {};



  picks?.forEach((pick) => {

    saved[pick.game_id] = pick.selected_team;

  });






  return {

    picks: saved,

    tiebreaker: {

      winner: entry.tiebreaker_winner ?? "",

      totalPoints:
        entry.tiebreaker_total_points ?? null,

      homePoints:
        entry.tiebreaker_home_points ?? null,

    },

  };

}









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
        (item) => item.id === pick.game_id
      );



      const correct =
        game?.winner === pick.selected_team;



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




  await supabase
    .from("weeks")
    .update({
      status: "COMPLETED",
    })
    .eq("id", weekId);



}