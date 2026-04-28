"use client";

import CharitiesSection from "@/components/admin/charity/charitySection";
import DrawSection from "@/components/admin/draw/drawComponent";
import { OverviewSection } from "@/components/admin/overview/overview";
import { UsersSection } from "@/components/admin/user";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { IconBase } from "react-icons/lib";

// ─── Types ────────────────────────────────────────────────────────────────────
type NavSection = "overview" | "users" | "draw" | "charities";
type SubscriptionPlan = "Monthly" | "Yearly";
type UserStatus = "Active" | "Lapsed" | "Cancelled";
type PaymentStatus = "Paid" | "Pending" | "Rejected";
type VerificationStatus = "Uploaded" | "Pending" | "Approved" | "Rejected";
export type CharityStatus = "Active" | "Under Review" | "Inactive";
type JackpotStatus = "Rolled over" | "Paid" | "Pending";

// ─── Helper Components ────────────────────────────────────────────────────────
export function Avatar({ initials }: { initials: string }) {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#E6F1FB] text-[#185FA5] text-[11px] font-medium mr-2 shrink-0">
      {initials}
    </span>
  );
}

type BadgeVariant = "blue" | "green" | "amber" | "red" | "gray";

const BADGE_CLASSES: Record<BadgeVariant, string> = {
  blue:  "bg-[#E6F1FB] text-[#185FA5]",
  green: "bg-[#EAF3DE] text-[#3B6D11]",
  amber: "bg-[#FAEEDA] text-[#854F0B]",
  red:   "bg-[#FCEBEB] text-[#A32D2D]",
  gray:  "bg-[#F1EFE8] text-[#5F5E5A]",
};

export function Badge({ label, variant }: { label: string; variant: BadgeVariant }) {
  return (
    <span className={`${BADGE_CLASSES[variant]} text-[11px] font-medium px-2 py-0.5 rounded-full inline-block`}>
      {label}
    </span>
  );
}

export function statusVariant(
  s: UserStatus | CharityStatus | PaymentStatus | JackpotStatus | VerificationStatus
): BadgeVariant {
  if (s === "Active" || s === "Paid" || s === "Approved") return "green";
  if (s === "Lapsed" || s === "Under Review" || s === "Pending" || s === "Rolled over") return "amber";
  if (s === "Cancelled" || s === "Rejected" || s === "Inactive") return "red";
  if (s === "Uploaded") return "blue";
  return "gray";
}

export function StatCard({
  label, value, delta, deltaUp,
}: {
  label: string; value: string; delta?: string; deltaUp?: boolean;
}) {
  return (
    <div className="bg-[#f5f5f3] rounded-lg p-4">
      <p className="text-[12px] text-[#888] mb-1">{label}</p>
      <p className="text-[22px] font-medium">{value}</p>
      {delta && (
        <p className={`text-[11px] mt-0.5 ${deltaUp ? "text-[#3B6D11]" : "text-[#A32D2D]"}`}>
          {delta}
        </p>
      )}
    </div>
  );
}

export function SectionCard({
  title, badge, children,
}: {
  title: string; badge?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="border border-[#e5e5e5] rounded-xl overflow-hidden mb-4 bg-white">
      <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-3 border-b border-[#e5e5e5]">
        <span className="text-[13px] font-medium truncate">{title}</span>
        <div className="flex items-center gap-2 shrink-0">
          <Link href=""><ArrowRight size={16} /></Link>
          {badge}
        </div>
      </div>
      {children}
    </div>
  );
}

export function Btn({
  children, primary, danger, onClick, small,
}: {
  children: React.ReactNode;
  primary?: boolean;
  danger?: boolean;
  small?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-lg cursor-pointer font-[inherit]
        ${small ? "text-[11px] px-2 py-0.5" : "text-[12px] px-3 py-1"}
        ${primary ? "bg-[#378ADD] text-white border-none" : ""}
        ${danger ? "bg-transparent text-[#A32D2D] border border-[#ccc]" : ""}
        ${!primary && !danger ? "bg-transparent border border-[#ccc]" : ""}
      `}
    >
      {children}
    </button>
  );
}

// ─── Nav config ───────────────────────────────────────────────────────────────
const NAV_ITEMS: { id: NavSection; label: string; icon: string }[] = [
  { id: "overview",  label: "Overview",   icon: "⊞" },
  { id: "users",     label: "Users",      icon: "👤" },
  { id: "draw",      label: "Draw",       icon: "🎰" },
  { id: "charities", label: "Charities",  icon: 'C' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [active, setActive] = useState<NavSection>("overview");

  const sectionMap: Record<NavSection, React.ReactNode> = {
    overview:  <OverviewSection  />,
    users:     <UsersSection     />,
    draw:      <DrawSection      />,
    charities: <CharitiesSection />,
  };

  return (
    <div className="flex w-full  mx-auto h-screen font-[system-ui,sans-serif] text-[14px] text-[#1a1a1a]">

      {/* ── Sidebar (desktop only) ── */}
      <aside className="hidden md:flex flex-col w-[200px] min-w-[200px] bg-[#fafaf8] border-r border-[#e5e5e5] py-4">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`
              flex items-center gap-2 px-4 py-2 text-[13px] text-left w-full cursor-pointer font-[inherit]
              border-l-2 transition-colors
              ${active === item.id
                ? "text-[#1a1a1a] font-medium bg-white border-l-[#378ADD]"
                : "text-[#888] font-normal bg-transparent border-l-transparent hover:bg-gray-50"
              }
            `}
          >
            {item.label}
          </button>
        ))}
      </aside>

      {/* ── Main content ── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-white pb-20 md:pb-6">
          {sectionMap[active]}
        </main>
      </div>

      {/* ── Bottom nav (mobile only) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e5e5e5] flex">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`
              flex-1 flex flex-col items-center justify-center py-2 gap-0.5
              text-[10px] font-medium transition-colors cursor-pointer
              ${active === item.id ? "text-[#378ADD]" : "text-[#888]"}
            `}
          >
            <span className="text-lg leading-none">{item.icon}</span>
            {item.label}
            {active === item.id && (
              <span className="absolute top-0 w-8 h-0.5 bg-[#378ADD] rounded-full" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}