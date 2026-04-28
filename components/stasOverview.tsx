import { useQueries, useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "./ui/card"
import { handleDashboardOverview } from "@/server/dashboard"

type StatCard = {
  title: string
  value?: string
  subtitle?: string
  status?: string
}

export default function UserStatsOverview() {
  const {data,isLoading}=useQuery({queryKey:['dashboard-overview'],queryFn:handleDashboardOverview})
  const overview = data?.data;
  const formatCurrency = (amount: number, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};
const stats: StatCard[] = [
  {
    title: "Subscription",
    status:
      overview?.subscription?.status === "COMPLETED"
        ? "Active"
        : "Inactive",
    subtitle: overview?.subscription?.periodEnd
      ? `Renews ${new Date(
          overview.subscription.periodEnd
        ).toDateString()}`
      : "No active subscription",
  },
  {
    title: "Total Won",
    value: formatCurrency(overview?.totalWon ?? 0),
    subtitle: "Lifetime winnings",
  },
  {
    title: "Total Donated",
    value: formatCurrency(
      overview?.totalDonated ?? 0,
      overview?.subscription?.currency || "USD"
    ),
    subtitle: "Total contributions",
  },
  {
    title: "Draws Entered",
    value: String(overview?.totalParticipated ?? 0),
    subtitle: "Total participation",
  },
];
if (isLoading) {
  return <div className="text-center mt-10">Loading stats...</div>;
}
  return (
    <div className="grid mt-4 sm:mt-6 lg:mt-8 mx-auto max-w-6xl w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition"
        >
          <CardContent className="p-5 flex flex-col gap-3">
            <p className="text-xs tracking-wide text-gray-400 uppercase font-semibold">
              {stat.title}
            </p>

            {stat.status ? (
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                {stat.status}
              </div>
            ) : (
              <h2 className="text-3xl font-bold text-gray-900">
                {stat.value}
              </h2>
            )}

            <p className="text-sm text-gray-500">
              {stat.subtitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}