import { Avatar, Badge, SectionCard, statusVariant } from "@/app/(main)/admin/page";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { handleAsignRole, handleDeactivateUser, handleGetUsers } from "@/server/user";
import { Button } from "@/components/ui/button";
import { User } from "@/server/user/types";
import { FaStreetView } from "react-icons/fa6";
import { GrUserAdmin } from "react-icons/gr";
import { ImProfile, ImWarning } from "react-icons/im";
import { toast } from "react-toastify";
type Role = "ADMIN" | "SUBSCRIBER" | "VIEWER";


function TableSkeleton() {
  return (
    <div className="p-4 space-y-3 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-100 rounded-lg" />
      ))}
    </div>
  );
}

function SuspendConfirm({
  user,
  onConfirm,
  onCancel,
}: {
  user: User;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/90 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="text-center px-8 py-6 max-w-xs">
        <div className="text-4xl mb-3 flex justify-center"><ImWarning/></div>
        <h3 className="text-base font-bold text-gray-900 mb-1">
          Suspend {user.userName}?
        </h3>
        <p className="text-sm text-gray-500 mb-5 leading-relaxed">
          This will immediately revoke their access. They won't be able to log
          in until reinstated.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Go Back
          </Button>
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
          >
            Yes, Suspend
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Edit Dialog ────────────────────────────────────────────────────────────
const ROLES: { value: Role; label: string; icon:any; desc: string }[] = [
  { value: "ADMIN",      label: "Admin",      icon:<GrUserAdmin />, desc: "Full access"    },
  { value: "SUBSCRIBER", label: "Subscriber", icon:<ImProfile />, desc: "Content access" },
  { value: "VIEWER",     label: "Viewer",     icon: <FaStreetView />, desc: "Read-only"      },
];

function EditUserDialog({
  user,
  onClose,
  onSave,
}: {
  user: User;
  onClose: () => void;
  onSave: (id: string, role: Role) => void;
}) {
  const queryClient=useQueryClient()
  const [selectedRole, setSelectedRole] = useState<Role>(user.role);
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const deleteUser=useMutation({mutationFn:handleDeactivateUser})
  const asignRole=useMutation({mutationFn:handleAsignRole})
 async function handleSuspendConfirm() {
    console.log("Suspended user:", user.id);
    deleteUser.mutate(user.id,{onSuccess:()=>{
        toast.success("user suspended ")
        queryClient.invalidateQueries({queryKey:['users']})
      setShowSuspendConfirm(false);
      onClose();
    },onError:()=>{
      toast.error("failed to suspend")
        setShowSuspendConfirm(false);
      onClose();    }})
  }

  function handleSave() {
    asignRole.mutate({id:user.id,role:selectedRole},
      {onSuccess:()=>{
        toast.success("user Asigned ")
        queryClient.invalidateQueries({queryKey:['users']})
      setShowSuspendConfirm(false);
      onClose()
    },onError:()=>{
      toast.error("failed to Asigned")
        setShowSuspendConfirm(false);
    onClose()
      }}
    )
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Dialog */}
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">

        {/* Suspend confirmation overlay */}
        {showSuspendConfirm && (
          <SuspendConfirm
            user={user}
            onConfirm={handleSuspendConfirm}
            onCancel={() => setShowSuspendConfirm(false)}
          />
        )}

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {user.userName?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{user.userName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Role selector */}
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-3">
              Assign Role
            </p>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(({ value, label, icon, desc }) => (
                <button
                  key={value}
                  onClick={() => setSelectedRole(value)}
                  className={`rounded-xl border-[1.5px] py-3 px-2 text-center transition-all ${
                    selectedRole === value
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="text-xl mb-1">{icon}</div>
                  <div
                    className={`text-xs font-semibold ${
                      selectedRole === value ? "text-indigo-600" : "text-gray-700"
                    }`}
                  >
                    {label}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-100" />

          {/* Danger zone */}
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-3">
              Danger Zone
            </p>
            <div className="flex items-center justify-between rounded-xl border-[1.5px] border-red-100 bg-red-50/60 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-red-600">Suspend User</p>
                <p className="text-xs text-red-400 mt-0.5">Revokes login access immediately</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-600 bg-red-100 hover:bg-red-200 font-semibold"
                onClick={() => setShowSuspendConfirm(true)}
              >
                Suspend
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 justify-end px-6 py-4 border-t border-gray-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Section ───────────────────────────────────────────────────────────
export function UsersSection() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, limit, search],
    queryFn: () => handleGetUsers({ page, limit, userName: search }),
  });

  const users: User[] = data?.data || [];

  function handleSave(id: string, role: Role) {
    // TODO: call your update-role API here
    console.log("Update role:", id, role);
  }

  return (
    <>
      {/* Edit dialog (portal-like, rendered outside table) */}
      {editingUser && (
        <EditUserDialog
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSave}
        />
      )}

      {/* Controls */}
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
            {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <SectionCard title="Users">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <>
            {/* Desktop table */}
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
                        <Button size="sm" onClick={() => setEditingUser(u)}>Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
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
                      {(u.firstName || u.lastName) && (
                        <span className="text-xs text-gray-400">
                          {u.firstName} {u.lastName}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button size="sm" className="shrink-0" onClick={() => setEditingUser(u)}>
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 px-3 pb-2">
          <Button size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
          <span className="text-xs text-gray-500">
            Page {page} of {data?.pagination.totalPages || 1}
          </span>
          <Button size="sm" disabled={!data?.pagination?.hasNextPage} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </SectionCard>
    </>
  );
}