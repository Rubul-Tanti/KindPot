"use client"

import { SectionCard } from "@/app/(main)/admin/page"
import { Badge, Btn, statusVariant } from "@/app/(main)/admin/page"
import useCharity from "@/hooks/use-charity"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"
import Image from "next/image"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUserContext } from "@/contextProvider"

type CharityListProps = {
  search: string;
  setSearch: (v: string) => void;
  page: number;
  setPage: (v: number) => void;
  active: boolean;
  setisActive: (v: boolean) => void;
  variant: "static" | "dynamic";
  limit: number;
  setLimit: (v: number) => void;
};

export const CharityList = ({
  variant, search, setSearch, page, setPage,
  active, setisActive, limit, setLimit,
}: CharityListProps) => {
  const { getCharities } = useCharity()
  const { data, isLoading } = getCharities(page, limit, search, active)
  const { user } = useUserContext()

  return (
    <SectionCard title="Charity directory">

      {/* ── Filters (dynamic only) ── */}
      {variant !== "static" && (
        <div className="flex flex-col sm:flex-row gap-2 px-3 sm:px-4 pt-3 pb-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search charities..."
            className="border rounded-lg px-3 py-2 text-sm w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-[#1a5c42]"
          />
          <Select
            value={active ? "active" : "inactive"}
            onValueChange={(v) => setisActive(v === "active")}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* ── Desktop table (sm+) ── */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-gray-500 border-b">
            <tr>
              {["Logo", "Name", "Donors", "Website", "Status", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3"><div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-3 w-32 bg-gray-200 rounded animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-3 w-16 bg-gray-200 rounded animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-3 w-40 bg-gray-200 rounded animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-8 w-16 bg-gray-200 rounded animate-pulse" /></td>
                </tr>
              ))}

            {!isLoading && data?.data.map((c: any, i: number) => (
              <motion.tr
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">
                  <Image width={40} height={40} className="rounded-full object-cover" src={c.logoUrl} alt={c.name} />
                </td>
                <td className="px-4 py-3 font-medium text-gray-700">{c.name}</td>
                <td className="px-4 py-3 text-gray-600">{c.userCharities?.length?.toLocaleString() || 0}</td>
                <td className="px-4 py-3 text-blue-600 text-xs truncate max-w-[180px]">{c.websiteUrl}</td>
                <td className="px-4 py-3">
                  <Badge
                    label={c.isActive ? "Active" : "Inactive"}
                    variant={statusVariant(c.isActive ? "Active" : "Inactive")}
                  />
                </td>
                {user.role === "ADMIN" && (
                  <td className="px-4 py-3"><Btn small>Edit</Btn></td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile card list (< sm) ── */}
      <div className="sm:hidden divide-y divide-gray-100">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
              </div>
            </div>
          ))}

        {!isLoading && data?.data.map((c: any, i: number) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 px-3 py-3"
          >
            <Image
              width={40} height={40}
              className="rounded-full object-cover shrink-0"
              src={c.logoUrl} alt={c.name}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-gray-800 truncate">{c.name}</span>
                <Badge
                  label={c.isActive ? "Active" : "Inactive"}
                  variant={statusVariant(c.isActive ? "Active" : "Inactive")}
                />
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {c.userCharities?.length?.toLocaleString() || 0} donors
              </div>
              <div className="text-xs text-blue-600 truncate">{c.websiteUrl}</div>
            </div>
            {user.role === "ADMIN" && (
              <Btn small>Edit</Btn>
            )}
          </motion.div>
        ))}
      </div>

      {/* ── Pagination (dynamic only) ── */}
      {variant === "dynamic" && (
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 mt-1">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Limit:</label>
            <input
              className="w-14 border rounded px-2 py-1 text-sm"
              type="number"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value) || 10)}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage(page - 1)}
              disabled={!data?.pagination?.hasPrev}
              className="p-2 rounded-lg border disabled:opacity-40 hover:bg-gray-100"
            >
              <MdChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium">{page}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!data?.pagination?.hasNext}
              className="p-2 rounded-lg border disabled:opacity-40 hover:bg-gray-100"
            >
              <MdChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </SectionCard>
  )
}

export default CharityList