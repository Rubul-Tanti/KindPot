export type WinnerType = "fiveMatch" | "fourMatch" | "threeMatch";

export type VerificationStatus = "pending" | "verified" | "rejected";
export type PaymentStatus = "pending" | "paid" | "failed";

export type Winner = {
  id: string;
  drawId: string;
  userId: string;

  winnerType: WinnerType;
  winnerScore: string;

  verificationStatus: VerificationStatus;
  paymentStatus: PaymentStatus;

  proofImage: string;

  prizeAmount: number | null;
  adminNotes: string | null;

  verifiedAt: string | null;
  paidAt: string | null;

  createdAt: string;
  updatedAt: string;

  // ✅ FIX: user object exists
  user?: {
    userName: string;
    email: string;
  };
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