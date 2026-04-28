export type AdminDashboardStatsResponse = {
  success: boolean;
  message: string;
  data: {
    totalUsers: number;
    totalSubscribers: number;
    totalCharities: number;
  };
};