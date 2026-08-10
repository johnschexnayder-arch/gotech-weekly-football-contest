export interface Week {
  id: string;
  week_number: number;
  deadline: string;
  status: "OPEN" | "LOCKED" | "COMPLETED";
}

export interface Game {
  id: string;
  week_id: string;
  game_number: number;
  sport: string;
  away_team: string;
  home_team: string;
  kickoff: string;
  winner: string | null;
}

export interface Player {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
}

export interface Entry {
  id: string;
  player_id: string;
  week_id: string;
  submitted_at: string;
  score: number;
}

export interface LeaderboardPlayer {
  player_id: string;
  name: string;
  points: number;
}

export interface HomePageData {
  activeWeek: Week;
  games: Game[];
  leaderboard: LeaderboardPlayer[];
  playerCount: number;
}