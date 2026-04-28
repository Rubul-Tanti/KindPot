type Winner = {
  id: string;
  userId: string;
  matchCount: 3 | 4 | 5;
  prizeAmount: number;
};
export type Draw = {
  id: string;
  adminId: string;
  prizePool: number;
  currency: string;
  entryStartDate: string; // ISO string
  lastEntryDate: string;
  resultDate: string;
  drawNumber: string | null;
  status: "active" | "inactive" | "completed"; // extend if needed
  fiveMatchPct: number;
  fourMatchPct: number;
  threeMatchPct: number;
  jackpotRolledOver: boolean;
  rolledOverFromId: string | null;
  createdAt: string;
  updatedAt: string;

  admin: {
    id: string;
    email: string;
    userName: string;
  };

  winners: Winner[]; // define below
};
type Participation = {
  id: string;
  drawId: string;
  userId: string;
  score: string; // comma-separated scores
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
};
export type getActiveDrawResponse = {
  success: boolean;
  data: Draw;
  totalParticipants: number
  yourParticipation:Participation
};
type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
export type getAllDrawResponse ={
  success:boolean,
data:Draw[],
  pagination:Pagination
}