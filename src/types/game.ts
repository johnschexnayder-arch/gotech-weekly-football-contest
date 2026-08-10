export type Sport = "NCAA" | "NFL";

export interface Game {
  id: string;
  week_id: string;
  game_number: number;
  sport: Sport;
  away_team: string;
  home_team: string;
  kickoff: string;
  winner: string | null;
  created_at?: string;
}