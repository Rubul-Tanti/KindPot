"use client";
import { StatCard } from "@/app/(main)/admin/page";
import { ActiveDrawCard, ActiveDrawSkeleton } from "../draw/drawComponent";
import { useDraw } from "@/hooks/use-draw";
import CharityList from "../charity/charityList";
import { handleAdminDashboardStas } from "@/server/dashboard";
import {
  Avatar,
  Badge,
  SectionCard,
  statusVariant,
} from "@/app/(main)/admin/page";
import { useQuery } from "@tanstack/react-query";
import { handleGetRecentUsers } from "@/server/user";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

// ─── Constants ──────────────────────────────────────────────────────────────
const SIDEBAR_STATE_KEY = "admin_sidebar_open";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

// ─── Sidebar State Hook (persisted to localStorage) ──────────────────────────
export function useSidebarState(defaultOpen = true) {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return defaultOpen;
    try {
      const stored = localStorage.getItem(SIDEBAR_STATE_KEY);
      return stored !== null ? JSON.parse(stored) : defaultOpen;
    } catch {
      return defaultOpen;
    }
  });

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const set = useCallback((value: boolean) => {
    try {
      localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(value));
    } catch {}
    setIsOpen(value);
  }, []);

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === SIDEBAR_STATE_KEY && e.newValue !== null) {
        try {
          setIsOpen(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return { isOpen, toggle, set };
}

// ─── Skeletons ────────────────────────────────────────────────────────────────
function TableSkeleton() {
  return (
    <div className="p-4 space-y-3 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-100 rounded-lg" />
      ))}
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="p-4 rounded-2xl border bg-white shadow-sm animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
      <div className="h-6 w-16 bg-gray-300 rounded mb-2" />
      <div className="h-3 w-32 bg-gray-200 rounded" />
    </div>
  );
}

// ─── Recent Users Table ───────────────────────────────────────────────────────
export function RecentUsersPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["recent-users"],
    queryFn: handleGetRecentUsers,
  });

  const users = data?.data || [];

  return (
    <div className="p-4 sm:p-6">
      <SectionCard title="Recent Users">
        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <div className="p-4 text-center text-sm text-red-500">
            Failed to load users
          </div>
        ) : users.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            No recent users found
          </div>
        ) : (
          <>
            {/* ── Desktop table (md+) ── */}
            <div className="hidden md:block overflow-x-auto rounded-xl border">
              <table className="w-full text-sm min-w-[560px]">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="text-left px-4 py-3">User</th>
                    <th className="text-left px-4 py-3">Email</th>
                    <th className="text-left px-4 py-3">Role</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar initials={u.userName?.[0] || "U"} />
                          <div>
                            <div className="font-medium">{u.userName}</div>
                            <div className="text-xs text-gray-500">
                              {u.firstName || ""} {u.lastName || ""}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-md">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          label={u.isActive ? "Active" : "Inactive"}
                          variant={statusVariant(
                            u.isActive ? "Active" : "Lapsed"
                          )}
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile card list (< md) ── */}
            <div className="md:hidden divide-y divide-gray-100">
              {users.map((u) => (
                <div key={u.id} className="flex items-start gap-3 py-3 px-1">
                  <Avatar initials={u.userName?.[0] || "U"} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-medium text-sm truncate">
                        {u.userName}
                      </span>
                      <Badge
                        label={u.isActive ? "Active" : "Inactive"}
                        variant={statusVariant(
                          u.isActive ? "Active" : "Lapsed"
                        )}
                      />
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {u.email}
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 rounded-md">
                        {u.role}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </SectionCard>
    </div>
  );
}

// ─── Overview Section ─────────────────────────────────────────────────────────
export function OverviewSection() {
  const { getActiveDraw } = useDraw();

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: handleAdminDashboardStas,
  });

  const { data: recentUsers, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["admin-recent-users"],
    queryFn: handleGetRecentUsers,
  });

  const { data, isLoading } = getActiveDraw();

  const overview = stats?.data;
  const activeDraw = data?.data;

  if (isLoadingStats) {
    return (
      // Responsive skeleton grid: 2 cols on mobile, 4 on md+
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>
    );
  }

  return (
    <>
      {/* ── Stat Cards: 2-col on mobile, 4-col on md+ ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Total Subscribers"
          value={formatNumber(overview?.totalSubscribers ?? 0)}
          delta="Active subscriptions"
          deltaUp
        />
        <StatCard
          label="Total Users"
          value={formatNumber(overview?.totalUsers ?? 0)}
          delta="Registered users"
          deltaUp
        />
        <StatCard
          label="Total Charities"
          value={formatNumber(overview?.totalCharities ?? 0)}
          delta="On platform"
          deltaUp
        />
        <StatCard
          label="Active Draw"
          value={activeDraw ? "Live" : "None"}
          delta={activeDraw ? "Ongoing draw" : "No active draw"}
          deltaUp={!!activeDraw}
        />
      </div>

      {/* ── Charity list + Active Draw: stacked on mobile, side-by-side on md+ ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CharityList
          search=""
          limit={6}
          page={1}
          setisActive={() => {}}
          setSearch={() => {}}
          setPage={() => {}}
          setLimit={() => {}}
          active={true}
          variant="static"
        />

        {isLoading ? (
          <ActiveDrawSkeleton />
        ) : !activeDraw ? (
          <SectionCard title="Active Draw">
  <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">

    {/* Icon */}
    <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
      <svg
        className="w-5 h-5 text-gray-400"
        fill="none" viewBox="0 0 24 24"
        stroke="currentColor" strokeWidth={1.5}
        strokeLinecap="round" strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>

    {/* Text */}
    <div>
      <p className="text-sm font-medium text-gray-700">No active draw</p>
      <p className="text-xs text-gray-400 mt-0.5">Start a new draw to see it here</p>
    </div>



  </div>
</SectionCard>
        ) : (
          <ActiveDrawCard draw={activeDraw} onEdit={undefined} />
        )}
      </div>

      {/* ── Recent Users ── */}
      <RecentUsersPage />
    </>
  );
}