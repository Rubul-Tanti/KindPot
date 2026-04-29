"use client";

import { useUserContext } from "@/contextProvider";
import { useDraw } from "@/hooks/use-draw";
import useGolfScore from "@/hooks/use-golfScore";
import { useParticipant } from "@/hooks/use-participant";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import type {Draw} from '@/server/draw/types'
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { useWinner } from "@/hooks/use-winner";
import { TbWheel } from "react-icons/tb";
import { FaSpider } from "react-icons/fa6";
function ParticipationDialog({
  open,
  onClose,
  scores,
  onConfirm,
  isLoading,
}: {
  open: boolean;
  onClose: () => void;
  scores: number[];
  onConfirm: () => void;
  isLoading: boolean;
}) {
  if (!open) return null;

  const hasEnoughScores = scores.length === 5;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 20,
          padding: "2rem", width: "100%", maxWidth: 400,
          border: "0.5px solid #ebebeb",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div>
            <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#aaa", margin: "0 0 4px" }}>
              Monthly draw
            </p>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Your entry scores</h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#aaa", lineHeight: 1, padding: 0 }}
          >
            ✕
          </button>
        </div>

        {/* Scores or error */}
        {hasEnoughScores ? (
          <>
            <div style={{ background: "#fafafa", borderRadius: 12, padding: "1rem", marginBottom: "1rem" }}>
              <p style={{ fontSize: 12, color: "#888", margin: "0 0 10px" }}>Last 5 recorded scores</p>
              <div style={{ display: "flex", gap: 8 }}>
                {scores.map((score, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#fff", border: "0.5px solid #ebebeb",
                      borderRadius: 10, padding: "10px 0", textAlign: "center", flex: 1,
                    }}
                  >
                    <p style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.5px" }}>{score}</p>
                    <p style={{ fontSize: 10, color: "#bbb", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      R{i + 1}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <p style={{ fontSize: 12, color: "#aaa", margin: "0 0 1.25rem" }}>
              These scores will be used as your draw entry. Good luck!
            </p>
          </>
        ) : (
          <div style={{
            background: "#fef2f2", border: "0.5px solid #fecaca",
            borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1.25rem",
            display: "flex", gap: 10, alignItems: "flex-start",
          }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#dc2626", margin: "0 0 2px" }}>
                Not enough scores
              </p>
              <p style={{ fontSize: 12, color: "#dc2626", opacity: 0.8, margin: 0 }}>
                You need exactly 5 recorded scores to participate. You currently have {scores.length}.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "11px", borderRadius: 999,
              border: "0.5px solid #e5e5e5", background: "transparent",
              fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#555",
            }}
          >
            Cancel
          </button>
          <button
            onClick={hasEnoughScores ? onConfirm : undefined}
            disabled={!hasEnoughScores || isLoading}
            style={{
              flex: 2, padding: "11px", borderRadius: 999, border: "none",
              background: !hasEnoughScores || isLoading ? "#e5e5e5" : "#C9A84C",
              fontSize: 13, fontWeight: 600, cursor: hasEnoughScores && !isLoading ? "pointer" : "not-allowed",
              color: !hasEnoughScores || isLoading ? "#aaa" : "#fff",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {isLoading ? "Entering…" : "Participate now"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Countdown hook ─────────────────────────────────────────────────────────

function useCountdown(targetTime: number) {
  const [diff, setDiff] = useState(0);

  useEffect(() => {
    const tick = () => {
      setDiff(Math.max(0, targetTime - Date.now()));
    };

    tick();
    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }, [targetTime]);

  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}


function Sk({ w = "100%", h = 16, r = 8, className = "" }: { w?: string | number; h?: number; r?: number; className?: string }) {
  return (
    <div
      className={className}
      style={{
        width: w, height: h, borderRadius: r,
        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s ease-in-out infinite",
        flexShrink: 0,
      }}
    />
  );
}

function DrawPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Hero skeleton */}
        <div style={{ textAlign: "center", paddingTop: 64, paddingBottom: 48 }}>
          <Sk w={120} h={28} r={999} className="mx-auto mb-6" />
          <Sk w="60%" h={56} r={10} className="mx-auto mb-3" />
          <Sk w="40%" h={56} r={10} className="mx-auto mb-5" />
          <Sk w={200} h={16} r={6} className="mx-auto" />
        </div>

        {/* Jackpot card skeleton */}
        <div style={{ background: "#fff", border: "0.5px solid #ebebeb", borderRadius: 20, padding: "2rem", marginBottom: 24, textAlign: "center" }}>
          <Sk w={140} h={13} r={6} className="mx-auto mb-4" />
          <Sk w={220} h={52} r={10} className="mx-auto mb-3" />
          <Sk w={160} h={13} r={6} className="mx-auto" />
        </div>

        {/* Countdown skeleton */}
        <div style={{ background: "#fff", border: "0.5px solid #ebebeb", borderRadius: 20, padding: "2rem", marginBottom: 24, textAlign: "center" }}>
          <Sk w={100} h={13} r={6} className="mx-auto mb-3" />
          <Sk w={220} h={22} r={6} className="mx-auto mb-8" />
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ textAlign: "center" }}>
                <Sk w={72} h={72} r={12} />
                <Sk w={40} h={10} r={4} className="mx-auto mt-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Prize tiers skeleton */}
        <Sk w={180} h={28} r={8} className="mt-14" />
        {[0, 1, 2].map(i => (
          <div key={i} style={{ background: "#fff", border: "0.5px solid #ebebeb", borderRadius: 16, padding: "1.25rem 1.5rem", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <Sk w={60} h={11} r={4} />
              <Sk w={140} h={16} r={5} />
              <Sk w={80} h={11} r={4} />
            </div>
            <Sk w={100} h={28} r={6} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Countdown box ──────────────────────────────────────────────────────────

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ textAlign: "center", minWidth: 72 }}>
      <div style={{
        background: "#fff",
        border: "0.5px solid #ebebeb",
        borderRadius: 12,
        padding: "14px 18px",
        fontSize: 32,
        fontWeight: 700,
        letterSpacing: "-1px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        fontVariantNumeric: "tabular-nums",
        lineHeight: 1,
      }}>
        {String(value).padStart(2, "0")}
      </div>
      <div style={{
        fontSize: 9, letterSpacing: "0.18em",
        textTransform: "uppercase", color: "#aaa",
        marginTop: 8, fontWeight: 500,
      }}>
        {label}
      </div>
    </div>
  );
}

// ── Tier badge ─────────────────────────────────────────────────────────────

const tierConfig = {
  JACKPOT: { bg: "#FEF9EC", color: "#B07D1A", dot: "#C9A84C" },
  GOLD: { bg: "#FDF6E3", color: "#8C6A00", dot: "#D4A800" },
  BRONZE: { bg: "#FBF4EE", color: "#8B4C1E", dot: "#C97A3A" },
} as const;

function TierBadge({ label }: { label: keyof typeof tierConfig }) {
  const { bg, color, dot } = tierConfig[label];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: bg, color, borderRadius: 999,
      padding: "2px 10px", fontSize: 10,
      fontWeight: 700, letterSpacing: "0.1em",
      textTransform: "uppercase",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: dot, display: "inline-block" }} />
      {label}
    </span>
  );
}

// ── Divider ────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "36px 0" }}>
      <div style={{ flex: 1, height: 0.5, background: "linear-gradient(to right, transparent, #ddd)" }} />
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#C9A84C" }} />
      <div style={{ flex: 1, height: 0.5, background: "linear-gradient(to left, transparent, #ddd)" }} />
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function DrawPage() {
  const { getActiveDraw } = useDraw();
  const [claimForm,setClaimForm]=useState(false)
  const { createParticipant } = useParticipant()
  const { getLastFiveScores } = useGolfScore()
  const createWinner=useWinner().createWinner
  const { user } = useUserContext()
  const { data, isLoading, error } = getActiveDraw();
  const totalPariticipants = data?.totalParticipants
  const draw: Draw | undefined = data?.data;
  const { data: recentScores, isLoading: recentLoading } = getLastFiveScores()
  const [openParticipatonDrawer, setOpenParticipatonDrawer] = useState(false)
  const result=draw?.drawNumber
    const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const winner=data?.data?.winners.find(w=>w?.user?.email===user.email)
  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) return;
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };
  const handleParticipate = () => {
    const score = recentScores?.data.map(item => item.score).join(",");
    if (score === undefined || score.split(',').length > 5) {
      toast.error("Must have 5 scores")
      return
    }
    if (draw?.id === undefined) {
      return
    }
    createParticipant.mutate({ score, drawId: draw?.id }, {
      onSuccess: () => {
        toast.success("Participated successfully ,best of luck")
        setOpenParticipatonDrawer(false)
      }, onError: () => {
        toast.error("failed to participate")
        setOpenParticipatonDrawer(false)
      }
    })

  }

const targetTime = useMemo(() => {
  return draw?.resultDate
    ? new Date(draw.resultDate).getTime()
    : Date.now();
}, [draw?.resultDate]);

const { d, h, m, s } = useCountdown(targetTime);

  if (isLoading) return <DrawPageSkeleton />;

  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAFA" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "#dc2626", marginBottom: 8 }}>Failed to load draw</p>
        <p style={{ fontSize: 12, color: "#aaa" }}>Please try again later</p>
      </div>
    </div>
  );

  if (!draw) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAFA" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }} className="text-center flex justify-center"> <TbWheel  className="animate-spin  text-yellow-400 drop-shadow-[0_0_10px_gold]" size={26} /></div>
        <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>No active draw</p>
        <p style={{ fontSize: 13, color: "#aaa" }}>Check back soon for the next monthly draw</p>
      </div>
    </div>
  );

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: draw.currency || "GBP" }).format(n);

  const prizeTiers = [
    { label: "JACKPOT" as const, match: "5-Number Match", pct: draw.fiveMatchPct, amount: (draw.prizePool * draw.fiveMatchPct) / 100 },
    { label: "GOLD" as const, match: "4-Number Match", pct: draw.fourMatchPct, amount: (draw.prizePool * draw.fourMatchPct) / 100 },
    { label: "BRONZE" as const, match: "3-Number Match", pct: draw.threeMatchPct, amount: (draw.prizePool * draw.threeMatchPct) / 100 },
  ];

  const entryOpen = new Date(draw.entryStartDate) <= new Date();
  const entryClosed = new Date(draw.lastEntryDate) <= new Date();
  const entryStatus = entryClosed ? "closed" : entryOpen ? "open" : "upcoming";

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", color: "#111" }}>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* ── Hero ── */}
        <div style={{ textAlign: "center", paddingTop: 64, paddingBottom: 48 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            border: "0.5px solid #e5cb8a", borderRadius: 999,
            padding: "5px 14px", fontSize: 10,
            textTransform: "uppercase", letterSpacing: "0.12em",
            color: "#C9A84C", background: "#FEF9EC", marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "pulse 1.5s infinite" }} />
            Active Draw
          </div>

          <h1 style={{ fontSize: "clamp(2.5rem,8vw,4.5rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2px", margin: "0 0 16px" }}>
            Monthly{" "}
            <span style={{ color: "#C9A84C", fontStyle: "italic" }}>Prize</span>
            <br />Draw Event
          </h1>

          <p style={{ fontSize: 14, color: "#888", margin: 0 }}>
            Enter your golf scores for a chance to win from the monthly prize pool
          </p>
        </div>

        {/* ── Jackpot card ── */}
        <div style={{
          background: "#fff", border: "0.5px solid #ebebeb",
          borderRadius: 20, padding: "2rem", marginBottom: 16,
          textAlign: "center", boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
        }}>
          <div className="text-end">
            {totalPariticipants !== undefined && (
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginTop: 10,
                background: "#fafafa",
                border: "0.5px solid #e5e5e5",
                borderRadius: 999,
                padding: "4px 12px",
                fontSize: 14,
                color: "#666",
                fontWeight: 500,
              }}>
                👥 {totalPariticipants.toLocaleString()} players
              </div>
            )}
          </div>

          <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#aaa", marginBottom: 10 }}>
            Current Jackpot Pool
          </p>

          <p style={{ fontSize: "clamp(2.5rem,7vw,4rem)", fontWeight: 800, color: "#C9A84C", letterSpacing: "-2px", margin: "0 0 8px", lineHeight: 1 }}>
            {fmt(draw.prizePool)}
          </p>
          <p style={{ fontSize: 12, color: "#bbb", margin: 0 }}>
            Shared across {prizeTiers.length} prize tiers
          </p>
          {draw.jackpotRolledOver && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              marginTop: 14, background: "#f0fdf4", border: "0.5px solid #bbf7d0",
              borderRadius: 999, padding: "4px 14px",
              fontSize: 12, color: "#16a34a", fontWeight: 500,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              Jackpot rollover active — extra pot this month
            </div>
          )}
        </div>

        {/* Entry status strip */}
        <div style={{
          borderRadius: 12, padding: "10px 18px", marginBottom: 24,
          fontSize: 12, fontWeight: 500,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: entryStatus === "open" ? "#f0fdf4" : entryStatus === "closed" ? "#fef2f2" : "#fafafa",
          border: `0.5px solid ${entryStatus === "open" ? "#bbf7d0" : entryStatus === "closed" ? "#fecaca" : "#e5e5e5"}`,
          color: entryStatus === "open" ? "#16a34a" : entryStatus === "closed" ? "#dc2626" : "#888",
        }}>
          <span>
            {entryStatus === "open" && "✓ Entries are open"}
            {entryStatus === "closed" && "✗ Entries have closed"}
            {entryStatus === "upcoming" && "⏳ Entries open on " + new Date(draw.entryStartDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
          </span>
          <span style={{ color: "#aaa", fontWeight: 400 }}>
            Closes {new Date(draw.lastEntryDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>


        {!result && (
          <>
            <Divider />

            {/* ── Countdown ── */}
            <div style={{
              background: "#fff", border: "0.5px solid #ebebeb",
              borderRadius: 20, padding: "2rem",
              textAlign: "center", boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
              marginBottom: 16,
            }}>
              <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#aaa", marginBottom: 6 }}>
                Draw closes in
              </p>
              <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 28, color: "#555" }}>
                Results on{" "}
                <span style={{ color: "#C9A84C", fontStyle: "italic" }}>
                  {new Date(draw.resultDate).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </span>
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                <CountdownBox value={d} label="Days" />
                <CountdownBox value={h} label="Hours" />
                <CountdownBox value={m} label="Mins" />
                <CountdownBox value={s} label="Secs" />
              </div>
            </div>

            <Divider />
          </>
        )}

        {/* ── Prize tiers ── */}
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 16 }}>
          Prize <span style={{ color: "#C9A84C", fontStyle: "italic" }}>Tiers</span>
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
          {prizeTiers.map((tier, i) => (
            <div
              key={tier.label}
              style={{
                background: "#fff", border: "0.5px solid #ebebeb",
                borderRadius: 16, padding: "1.1rem 1.4rem",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                opacity: i === 0 ? 1 : i === 1 ? 0.92 : 0.85,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <TierBadge label={tier.label} />
                <p style={{ fontSize: 14, fontWeight: 600, margin: "2px 0 0" }}>{tier.match}</p>
                <p style={{ fontSize: 12, color: "#aaa", margin: 0 }}>{tier.pct}% of prize pool</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.5px" }}>
                  {fmt(tier.amount)}
                </p>
                <p style={{ fontSize: 11, color: "#bbb", margin: 0 }}>est. pool share</p>
              </div>
            </div>
          ))}
        </div>


        {/* Pool breakdown bar */}
        <div style={{ background: "#fff", border: "0.5px solid #ebebeb", borderRadius: 12, padding: "1rem 1.4rem", marginBottom: 24 }}>
          <p style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Pool distribution</p>
          <div style={{ display: "flex", height: 8, borderRadius: 999, overflow: "hidden", gap: 2 }}>
            <div style={{ width: `${draw.fiveMatchPct}%`, background: "#C9A84C", borderRadius: "999px 0 0 999px" }} />
            <div style={{ width: `${draw.fourMatchPct}%`, background: "#D4A800" }} />
            <div style={{ width: `${draw.threeMatchPct}%`, background: "#C97A3A", borderRadius: "0 999px 999px 0" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            {prizeTiers.map(t => (
              <span key={t.label} style={{ fontSize: 11, color: "#aaa" }}>{t.label} {t.pct}%</span>
            ))}
          </div>
        </div>

        {!result && (
          <>
            <Divider />

            {/* ── CTA ── */}
            <div style={{ textAlign: "center" }}>
              {data?.yourParticipation ? (
    <div style={{
      background: "#f0fdf4", border: "0.5px solid #bbf7d0",
      borderRadius: 20, padding: "1.5rem", marginBottom: 24, textAlign: "center",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: "50%",
        background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 12px", fontSize: 18, color: "#fff",
      }}>
        ✓
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#15803d", margin: "0 0 4px" }}>
        You're entered!
      </h2>
      <p style={{ fontSize: 13, color: "#16a34a", opacity: 0.8, margin: "0 0 20px" }}>
        Your scores have been submitted for this draw
      </p>

      {/* Score pills */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
        {data.yourParticipation.score.split(",").map((s, i) => (
          <div key={i} style={{
            background: "#fff", border: "0.5px solid #bbf7d0",
            borderRadius: 10, padding: "8px 14px", textAlign: "center", minWidth: 52,
          }}>
            <p style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#15803d", letterSpacing: "-0.5px" }}>
              {s.trim()}
            </p>
            <p style={{ fontSize: 10, color: "#86efac", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              R{i + 1}
            </p>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 6 }}>
        Ready to <span style={{ color: "#C9A84C", fontStyle: "italic" }}>Enter?</span>
      </h2>
      <p style={{ fontSize: 13, color: "#aaa", marginBottom: 24 }}>
        Your last 5 golf scores are automatically entered into the draw
      </p>
    </div>
  )}

              <button
                onClick={() => entryStatus === "open" && setOpenParticipatonDrawer(true)}
                disabled={entryStatus !== "open"}
                style={{
                  padding: "14px 40px", borderRadius: 999, border: "none",
                  fontSize: 13, fontWeight: 600, letterSpacing: "0.06em",
                  textTransform: "uppercase", cursor: entryStatus === "open" ? "pointer" : "not-allowed",
                  transition: "opacity 0.15s, transform 0.15s",
                  background: data?.yourParticipation
                    ? "#16a34a"
                    : entryStatus !== "open"
                      ? "#e5e5e5"
                      : "#C9A84C",
                  color: entryStatus !== "open" && !data?.yourParticipation ? "#aaa" : "#fff",
                }}
              >
                {data?.yourParticipation
                  ? "✓ You're Entered"
                  : entryStatus === "closed"
                    ? "Entries Closed"
                    : entryStatus === "upcoming"
                      ? "Opens Soon"
                      : "Participate Now"}
              </button>

              {entryStatus === "open" && !data?.yourParticipation && (
                <p style={{ fontSize: 11, color: "#ccc", marginTop: 12 }}>
                  Must have an active subscription to participate
                </p>
              )}
            </div>
            {openParticipatonDrawer && <ParticipationDialog
              open={openParticipatonDrawer}
              onClose={() => setOpenParticipatonDrawer(false)}
              scores={recentScores?.data.map((item) => item.score) ?? []}
              onConfirm={handleParticipate}
              isLoading={createParticipant.isPending}
            />}
          </>
        )}


      </div>
      {/* ── Result announced ── */}
{result && (
  <>
    <div style={{
      background: "#fff", border: "0.5px solid #ebebeb",
      borderRadius: 20, padding: "2rem", marginBottom: 16,
      boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
    }} className="max-w-5xl mx-auto">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "#f0fdf4", border: "0.5px solid #bbf7d0",
            borderRadius: 999, padding: "4px 12px",
            fontSize: 10, color: "#16a34a", fontWeight: 600,
            letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            Results announced
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", margin: 0 }}>
            Winning{" "}
            <span style={{ color: "#C9A84C", fontStyle: "italic" }}>Numbers</span>
          </h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>
            Draw date
          </p>
          <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>
            {new Date(draw.resultDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Winning balls */}
      <div style={{
        background: "#fafafa", borderRadius: 16,
        padding: "1.75rem 1rem", marginBottom: "1.5rem",
        display: "flex", justifyContent: "center", alignItems: "center",
        gap: 12, flexWrap: "wrap",
      }}>
        {result.split(",").map((n, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "linear-gradient(135deg, #378ADD 0%, #185FA5 100%)",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px",
              boxShadow: "0 2px 8px rgba(55,138,221,0.35)",
              border: "2px solid #fff",
            }}>
              {n.trim()}
            </div>
            <p style={{ fontSize: 9, color: "#ccc", margin: "6px 0 0", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              #{i + 1}
            </p>
          </div>
        ))}
      </div>

      {/* Your result */}
      {data?.yourParticipation&&! winner && (() => {
        const yourScores  = data.yourParticipation.score.split(",").map((s) => s.trim());
        const winningNums = result.split(",").map((s) => s.trim());
        const matched     = yourScores.filter((s) => winningNums.includes(s)).length;

        const matchResult =
          matched === 5 ? { label: "Jackpot winner!", tier: "JACKPOT", bg: "#FEF9EC", color: "#B07D1A", border: "#e5cb8a" } :
          matched === 4 ? { label: "Gold winner!",    tier: "GOLD",    bg: "#FDF6E3", color: "#8C6A00", border: "#d4b96a" } :
          matched === 3 ? { label: "Bronze winner!",  tier: "BRONZE",  bg: "#FBF4EE", color: "#8B4C1E", border: "#d4a47a" } :
                          { label: "No match",        tier: null,      bg: "#fafafa", color: "#888",    border: "#e5e5e5" };

        return (
          <div style={{
            background: matchResult.bg,
            border: `0.5px solid ${matchResult.border}`,
            borderRadius: 14, padding: "1.1rem 1.25rem",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
          }}>
            <div>
              <p style={{ fontSize: 11, color: matchResult.color, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>
                Your result
              </p>
              <p style={{ fontSize: 15, fontWeight: 700, color: matchResult.color, margin: "0 0 8px" }}>
                {matchResult.label}
              </p>
              {/* Your score pills with match highlight */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {yourScores.map((s, i) => {
                  const isMatch = winningNums.includes(s);
                  return (
                    <div key={i} style={{
                      background: isMatch ? "#C9A84C" : "#fff",
                      border: `0.5px solid ${isMatch ? "#C9A84C" : "#e5e5e5"}`,
                      borderRadius: 8, padding: "5px 10px", textAlign: "center", minWidth: 40,
                    }}>
                      <p style={{ fontSize: 14, fontWeight: 700, margin: 0, color: isMatch ? "#fff" : "#555" }}>
                        {s}
                      </p>
                      <p style={{ fontSize: 9, margin: 0, color: isMatch ? "rgba(255,255,255,0.7)" : "#ccc", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        R{i + 1}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 11, color: matchResult.color, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>
                Matched
              </p>
              <p style={{ fontSize: 36, fontWeight: 800, color: matchResult.color, margin: 0, lineHeight: 1, letterSpacing: "-1px" }}>
                {matched}<span style={{ fontSize: 16, fontWeight: 500, opacity: 0.5 }}>/5</span>
              </p>
              {matched>2&&
<Button onClick={()=>{setClaimForm(true)}} className="hover:cursor-pointer mt-4 bg-[#C9A84C] text-white hover:bg-[#b8963f]">
  Claim
</Button>              }
            </div>

          </div>
        );
      })()}
              {claimForm && (
        <div className="mt-14 flex justify-center">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

            {/* Title */}
            <h3 className="text-lg font-semibold text-center mb-2">
              Claim Your Prize
            </h3>
            <p className="text-sm text-gray-400 text-center mb-6">
              Upload screenshot of your score as proof
            </p>

            {/* Upload Area */}
            <label
              onDragEnter={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition
                ${
                  dragActive
                    ? "border-[#C9A84C] bg-[#FEF9EC]"
                    : "border-gray-300 hover:border-[#C9A84C]"
                }`}
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-3xl mb-2">
                  <ImageIcon />
                </span>

                <p className="text-sm text-gray-500">
                  {dragActive ? "Drop image here" : "Click or drag to upload"}
                </p>

                <p className="text-xs text-gray-400">
                  PNG, JPG
                </p>
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
              />
            </label>

            {/* Preview */}
            <div className="mt-4 text-center">
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-28 h-28 object-cover rounded-lg border"
                  />
                  <p className="text-xs text-gray-500">{file.name}</p>
                </div>
              ) : (
                <p className="text-xs text-gray-400">No file selected</p>
              )}
            </div>

            {/* Button */}
            <Button
              disabled={!file}
              onClick={()=>{file&&createWinner.mutate(file,{onSuccess:()=>{toast.success("winner created successfully")},onError:()=>{toast.error("fail to create Winner")}})}}
              className="w-full mt-6 bg-[#C9A84C] text-white hover:bg-[#b8963f] disabled:opacity-50 rounded-full"
            >
              {createWinner.isPending?<FaSpider className="animate-spin"/>:"Claim now"}

            </Button>
          </div>
        </div>
      )}
        {/* ── Desktop table ── */}
<div className="hidden md:block overflow-x-auto">
  <table className="w-full border-collapse text-sm">
    <thead>
      <tr className="border-b border-gray-100">
        {["Username", "Match type", "Amount", "Status"].map((h) => (
          <th
            key={h}
            className="text-left px-3 py-2.5 text-[11px] font-medium text-gray-400 uppercase tracking-wide"
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {winner && (
        <tr className="hover:bg-gray-50 transition-colors border-b border-gray-50">
          <td className="py-3 px-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {(winner.user?.userName ?? winner.userId ?? "?")[0].toUpperCase()}
              </div>
              <span className="font-medium text-sm">
                {winner.user?.userName ?? winner.userId ?? "—"}
              </span>
            </div>
          </td>
          <td className="py-3 px-3">
            <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-gray-100 text-gray-600 uppercase">
              {winner.winnerType ?? "—"}
            </span>
          </td>
          <td className="py-3 px-3 font-semibold text-sm text-gray-800">
            {new Intl.NumberFormat("en-GB", {
              style: "currency",
              currency: draw.currency ?? "GBP",
            }).format(winner.prizeAmount ?? 0)}
          </td>
          <td className="py-3 px-3">
            <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-gray-100 text-gray-600 uppercase">
              {winner.paymentStatus ?? "—"}
            </span>
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

{/* ── Mobile card ── */}
{winner && (
  <div className="md:hidden mt-3 space-y-2">
    <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-2">Winner</p>
    <div className="border border-gray-100 rounded-xl p-3 bg-white space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
            {(winner.user?.userName ?? winner.userId ?? "?")[0].toUpperCase()}
          </div>
          <p className="font-semibold text-sm m-0 truncate">
            {winner.user?.userName ?? winner.userId ?? "—"}
          </p>
        </div>
        <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-gray-100 text-gray-600 uppercase">
          {winner.paymentStatus ?? "—"}
        </span>
      </div>
      <div className="flex items-center justify-between border-t border-gray-50 pt-2">
        <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-gray-100 text-gray-600 uppercase">
          {winner.winnerType ?? "—"}
        </span>
        <span className="font-semibold text-sm text-gray-800">
          {new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: draw.currency ?? "GBP",
          }).format(winner.prizeAmount ?? 0)}
        </span>
      </div>
    </div>
  </div>
)}

      {/* Not participated */}
      {!data?.yourParticipation && (
        <div style={{
          background: "#fafafa", border: "0.5px solid #e5e5e5",
          borderRadius: 12, padding: "1rem 1.25rem",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>🏌️</span>
          <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>
            You didn't enter this draw. Enter next month for a chance to win!
          </p>
        </div>
      )}
    </div>

    <Divider />
  </>
)}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}