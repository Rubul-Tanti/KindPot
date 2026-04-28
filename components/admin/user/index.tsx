import { Avatar, Badge, SectionCard, statusVariant } from "@/app/(main)/admin/page";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { handleGetUsers } from "@/server/user";
import { Button } from "@/components/ui/button";

function TableSkeleton() {
  return (
    <div className="p-4 space-y-3 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-100 rounded-lg" />
      ))}
    </div>
  );
}

export function UsersSection() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, limit, search],
    queryFn: () => handleGetUsers({ page, limit, userName: search }),
  });

  const users = data?.data || [];

  return (
    <>
      {/* ── Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search users..."
          className="border rounded-xl px-3 py-2 text-sm w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Rows:</span>
          <select
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            className="border rounded-lg px-2 py-1 focus:outline-none"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      <SectionCard title="Users">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <>
            {/* ── Desktop table (sm+) ── */}
            <div className="hidden sm:block overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="text-left px-4 py-3">User</th>
                    <th className="text-left px-4 py-3">Email</th>
                    <th className="text-left px-4 py-3">Role</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t hover:bg-gray-50 transition">
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
                          variant={statusVariant(u.isActive ? "Active" : "Lapsed")}
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile card list (< sm) ── */}
            <div className="sm:hidden divide-y divide-gray-100">
              {users.map((u) => (
                <div key={u.id} className="flex items-center gap-3 px-3 py-3">
                  <Avatar initials={u.userName?.[0] || "U"} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium truncate">{u.userName}</span>
                      <Badge
                        label={u.isActive ? "Active" : "Inactive"}
                        variant={statusVariant(u.isActive ? "Active" : "Lapsed")}
                      />
                    </div>
                    <div className="text-xs text-gray-500 truncate">{u.email}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 rounded-md">
                        {u.role}
                      </span>
                      {u.firstName || u.lastName ? (
                        <span className="text-xs text-gray-400">
                          {u.firstName} {u.lastName}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <Button size="sm" className="shrink-0">Edit</Button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Pagination ── */}
        <div className="flex items-center justify-between mt-4 px-3 pb-2">
          <Button size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </Button>
          <span className="text-xs text-gray-500">
            Page {page} of {data?.pagination.totalPages || 1}
          </span>
          <Button size="sm" disabled={!data?.pagination?.hasNextPage} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </SectionCard>
    </>
  );
}