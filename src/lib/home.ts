import { getActiveWeek } from "./weeks";
import { getGames } from "./games";
import { supabase } from "./supabase";

export async function getHomePageData() {
  const activeWeek = await getActiveWeek();

  const games = activeWeek
    ? await getGames(activeWeek.id)
    : [];

  const { count: playerCount } = await supabase
    .from("players")
    .select("*", { count: "exact", head: true });

  const { data: standings } = await supabase
    .from("entries")
    .select(`
      player_id,
      score,
      players (
        name
      )
    `);

  const leaderboard =
    standings
      ?.reduce((acc: any[], row: any) => {
        const existing = acc.find(
          (p) => p.player_id === row.player_id
        );

        if (existing) {
          existing.points += row.score;
        } else {
          acc.push({
            player_id: row.player_id,
            name: row.players?.name ?? "Unknown",
            points: row.score,
          });
        }

        return acc;
      }, [])
      .sort((a, b) => b.points - a.points) ?? [];

  return {
    activeWeek,
    games,
    leaderboard,
    playerCount: playerCount ?? 0,
  };
}