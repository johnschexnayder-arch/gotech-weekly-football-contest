export type WeekStatus = "OPEN" | "LOCKED" | "COMPLETED";

export interface Week {
  id: string;
  week_number: number;
  deadline: string;
  status: WeekStatus;
  created_at: string;
}