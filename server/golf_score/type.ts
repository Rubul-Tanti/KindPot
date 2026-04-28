export type lastFiveScores={
    id:string,
    score:number,
    playedOn:string
}
export type getLastFiveScoresResponse={
message:string,
count:number,
data: lastFiveScores[]
}
type GolfScore = {
  id: string;
  userId: string;
  score: number;
  playedOn: string;   // ISO date string
  createdAt: string;  // ISO date string
  updatedAt: string;  // ISO date string
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type GetGolfScoresResponse = {
  message: string;
  data: GolfScore[];
  pagination: Pagination;
};