import { Badge, Btn, SectionCard, statusVariant } from "@/app/(main)/admin/page";
import { Button } from "@/components/ui/button";
import { useDraw } from "@/hooks/use-draw";
import { SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import type {Draw} from "@/server/draw/types"

type JackpotStatus = "Rolled over" | "Paid" | "Pending";
type DrawLogic = "random" | "algorithmic";

interface DrawResult {
  month: string;
  numbers: number[];
  fiveMatch: number;
  fourMatch: number;
  threeMatch: number;
  jackpot: JackpotStatus;
}

interface DrawFormState {
  prizePool: number;
  currency: string;
  entryStartDate: string;
  lastEntryDate: string;
  resultDate: string;
  fiveMatchPct: string;
  fourMatchPct: string;
  threeMatchPct: string;
}


function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, color: "#888", fontWeight: 500, display: "block", marginBottom: 5 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none";
function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  isLoading,
  numbers,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  numbers: number[];
}) {
  if (!open) return null;
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
          background: "#fff", borderRadius: 20, padding: "2rem",
          width: "100%", maxWidth: 380, border: "0.5px solid #ebebeb",
        }}
      >
        {/* Icon */}
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "#fffbeb", border: "0.5px solid #fde68a",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, margin: "0 0 1rem",
        }}>
          ⚠️
        </div>

        <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 6px" }}>
          Publish draw results?
        </h2>
        <p style={{ fontSize: 13, color: "#888", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
          This will finalise the draw and notify all participants. This action cannot be undone.
        </p>

        {/* Numbers preview */}
        <div style={{
          background: "#fafafa", border: "0.5px solid #ebebeb",
          borderRadius: 12, padding: "0.85rem 1rem", marginBottom: "1.5rem",
        }}>
          <p style={{ fontSize: 10, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>
            Winning numbers
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {numbers.map((n, i) => (
              <div key={i} style={{
                width: 36, height: 36, borderRadius: "50%",
                background: n === 0 ? "#e5e5e5" : "#378ADD",
                color: n === 0 ? "#aaa" : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 600,
              }}>
                {n === 0 ? "?" : n}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={{
              flex: 1, padding: "11px", borderRadius: 999,
              border: "0.5px solid #e5e5e5", background: "transparent",
              fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#555",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading || numbers.every((n) => n === 0)}
            style={{
              flex: 2, padding: "11px", borderRadius: 999, border: "none",
              background: isLoading || numbers.every((n) => n === 0) ? "#e5e5e5" : "#16a34a",
              fontSize: 13, fontWeight: 600,
              cursor: isLoading || numbers.every((n) => n === 0) ? "not-allowed" : "pointer",
              color: isLoading || numbers.every((n) => n === 0) ? "#aaa" : "#fff",
              letterSpacing: "0.04em", textTransform: "uppercase",
            }}
          >
            {isLoading ? "Publishing…" : "Confirm & publish"}
          </button>
        </div>

        {numbers.every((n) => n === 0) && (
          <p style={{ fontSize: 11, color: "#dc2626", textAlign: "center", marginTop: 10 }}>
            Run a simulation first to generate numbers
          </p>
        )}
      </div>
    </div>
  );
}

const DrawCreateForm = ({ setShowForm }: { setShowForm: React.Dispatch<SetStateAction<boolean>> }) => {
  const [form, setForm] = useState<DrawFormState>({
    prizePool:123, currency: "USD",
    entryStartDate: "", lastEntryDate: "", resultDate: "",
    fiveMatchPct: "", fourMatchPct: "", threeMatchPct: "",
  });

  const createDraw = useDraw().create;
  const handleChange = (key: string, value:  number|string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    await createDraw.mutate(form, {
      onSuccess: () => { toast.success("Draw created successfully"); setShowForm(false); },
      onError:   (e:any) => { toast.error(e.response.data.message); },
    });
  };

  return (
    <DrawFormLayout
      title="Create Monthly Draw"
      form={form}
      onChange={handleChange}
      onCancel={() => setShowForm(false)}
      onSubmit={handleSubmit}
      submitLabel="Create Draw"
      isLoading={createDraw.isPending}
    />
  );
};

// ── Update form ────────────────────────────────────────────────────────────

const DrawUpdateForm = ({
  drawId,
  initial,
  onClose,
}: {
  drawId: string;
  initial: DrawFormState;
  onClose: () => void;
}) => {
  const [form, setForm] = useState<DrawFormState>(initial);
  const updateDraw = useDraw().update;

  const handleChange = (key: string, value:string|number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    await updateDraw.mutate({data:form,id:drawId}, {
      onSuccess: () => { toast.success("Draw updated successfully"); onClose(); },
      onError:   () => { toast.error("Error while updating draw"); },
    });
  };

  return (
    <DrawFormLayout
      title="Update Active Draw"
      form={form}
      onChange={handleChange}
      onCancel={onClose}
      onSubmit={handleSubmit}
      submitLabel="Save Changes"
      isLoading={updateDraw.isPending}
    />
  );
};

// ── Shared form layout ─────────────────────────────────────────────────────

function DrawFormLayout({
  title, form, onChange, onCancel, onSubmit, submitLabel, isLoading,
}: {
  title: string;
  form: DrawFormState;
  onChange: (key: string, value: string|number) => void;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
  isLoading?: boolean;
}) {
  const total = (Number(form.fiveMatchPct) || 0) + (Number(form.fourMatchPct) || 0) + (Number(form.threeMatchPct) || 0);
  const pctOk = total === 100;

  return (
    <div style={{ marginBottom: "1.25rem", padding: "1.5rem", background: "#fff", border: "0.5px solid #ebebeb", borderRadius: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <p style={{ fontSize: 14, fontWeight: 600, color: "#111", margin: 0 }}>{title}</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <Field label="Prize Pool (pence/cents)">
          <input type="number" value={Number(form.prizePool)} onChange={(e) => onChange("prizePool", Number(e.target.value))} className={inputCls} placeholder="e.g. 50000 = £500" />
        </Field>
        <Field label="Currency">
          <select value={form.currency} onChange={(e) => onChange("currency", e.target.value)} className={inputCls}>
            {["GBP", "USD", "EUR", "AUD"].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Entry Start Date">
          <input type="date" value={form.entryStartDate} onChange={(e) => onChange("entryStartDate", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Last Entry Date">
          <input type="date" value={form.lastEntryDate} min={form.entryStartDate} onChange={(e) => onChange("lastEntryDate", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Result Date">
          <input type="date" value={form.resultDate} min={form.lastEntryDate} onChange={(e) => onChange("resultDate", e.target.value)} className={inputCls} />
        </Field>
      </div>

      {/* Prize distribution */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: "#555", margin: 0 }}>Prize distribution (%)</p>
          <span style={{ fontSize: 11, color: pctOk ? "#16a34a" : "#dc2626", fontWeight: 500 }}>
            {pctOk ? "✓ Sums to 100%" : `Total: ${total}% — needs ${100 - total > 0 ? "+" : ""}${100 - total}%`}
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
          {([["fiveMatchPct", "5-match %"], ["fourMatchPct", "4-match %"], ["threeMatchPct", "3-match %"]] as const).map(([key, ph]) => (
            <input key={key} type="number" placeholder={ph} value={form[key]} onChange={(e) => onChange(key, e.target.value)} className={inputCls} min={1} max={98} />
          ))}
        </div>
        {/* Visual bar */}
        {total > 0 && (
          <div style={{ marginTop: 10, height: 6, borderRadius: 999, overflow: "hidden", background: "#f0f0f0", display: "flex", gap: 1 }}>
            <div style={{ width: `${(Number(form.fiveMatchPct) / Math.max(total, 1)) * 100}%`, background: "#378ADD", transition: "width 0.3s" }} />
            <div style={{ width: `${(Number(form.fourMatchPct) / Math.max(total, 1)) * 100}%`, background: "#C9A84C", transition: "width 0.3s" }} />
            <div style={{ width: `${(Number(form.threeMatchPct) / Math.max(total, 1)) * 100}%`, background: "#C97A3A", transition: "width 0.3s" }} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: "0.5rem", borderTop: "0.5px solid #f0f0f0" }}>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Saving…" : submitLabel}
        </Button>
      </div>
    </div>
  );
}

// ── Active draw card ───────────────────────────────────────────────────────

export function ActiveDrawCard({ draw, onEdit }: { draw:Draw, onEdit:any
 }) {

 const [logic, setLogic]         = useState<DrawLogic>("random");
  const [simNums, setSimNums]     = useState<number[]>([0, 0, 0, 0, 0]);
  const [showConfirm, setShowConfirm] = useState(false);  // ← add this
  const { publishResult } = useDraw();
    const fmt = (n: number) =>
new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: draw.currency || "GBP",
}).format(n);

  const handlePublish = () => {
    publishResult.mutate(
      { drawId: draw.id, result: simNums.join(",") },
      {
        onSuccess: () => {
          setShowConfirm(false);
          toast.success("Results published successfully");
        },
        onError: () => {
          toast.error("Failed to publish results");
        },
      }
    );
  };


  const simulate = () => {
    const used = new Set<number>();
    const nums: number[] = [];
    while (nums.length < 5) {
      const n = Math.floor(Math.random() * 45) + 1;
      if (!used.has(n)) { used.add(n); nums.push(n); }
    }
    setSimNums(nums);
  };
  const statusColor = draw.status === "active"
    ? { bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e" }
    : { bg: "#fafafa", color: "#888", dot: "#ccc" };

  const rows = [
    { label: "Prize Pool",      value: fmt(draw.prizePool) },
    { label: "Entry Opens",     value: new Date(draw.entryStartDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) },
    { label: "Entry Closes",    value: new Date(draw.lastEntryDate).toLocaleDateString("en-GB",  { day: "numeric", month: "short", year: "numeric" }) },
    { label: "Result Date",     value: new Date(draw.resultDate).toLocaleDateString("en-GB",     { day: "numeric", month: "short", year: "numeric" }) },
    { label: "Jackpot Rollover",value: draw.jackpotRolledOver ? "Yes" : "No" },
  ];

  return (
    <div style={{ background: "#fff", border: "0.5px solid #ebebeb", borderRadius: 16, padding: "1.25rem 1.5rem", marginBottom: "1.25rem", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Active Draw</p>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: statusColor.bg, color: statusColor.color,
              borderRadius: 999, padding: "2px 10px", fontSize: 10,
              fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: statusColor.dot, display: "inline-block" }} />
              {draw.status}
            </span>
          </div>
          <p style={{ fontSize: 12, color: "#aaa", margin: 0 }}>Draw #{draw.drawNumber}</p>
        </div>{
         onEdit&&

        <button
          onClick={onEdit}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 12, fontWeight: 500, padding: "6px 14px",
            border: "0.5px solid #e5e5e5", borderRadius: 8,
            background: "transparent", cursor: "pointer",
            color: "#555", transition: "border-color 0.15s",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Update
        </button>

        } </div>

      {/* Info grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1rem" }}>
        {rows.map(({ label, value }) => (
          <div key={label} style={{ background: "#fafafa", borderRadius: 10, padding: "0.6rem 0.85rem" }}>
            <p style={{ fontSize: 10, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 3px" }}>{label}</p>
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: "#222" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Prize distribution bar */}

      <div>
        <p style={{ fontSize: 10, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Prize distribution</p>
        <div style={{ display: "flex", height: 7, borderRadius: 999, overflow: "hidden", gap: 2 }}>
          <div style={{ width: `${draw.fiveMatchPct}%`,   background: "#378ADD" }} title={`Jackpot ${draw.fiveMatchPct}%`} />
          <div style={{ width: `${draw.fourMatchPct}%`,   background: "#C9A84C" }} title={`4-match ${draw.fourMatchPct}%`} />
          <div style={{ width: `${draw.threeMatchPct}%`,  background: "#C97A3A" }} title={`3-match ${draw.threeMatchPct}%`} />
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
          {[
            { label: "5-match (Jackpot)", pct: draw.fiveMatchPct,  color: "#378ADD" },
            { label: "4-match",           pct: draw.fourMatchPct,  color: "#C9A84C" },
            { label: "3-match",           pct: draw.threeMatchPct, color: "#C97A3A" },
          ].map(({ label, pct, color }) => (
            <span key={label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#888" }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: color, display: "inline-block" }} />
              {label} — {pct}%
            </span>
          ))}
        </div>
      </div>
         {onEdit&&<>
      {draw.drawNumber?
<div style={{
  background: "#fff", border: "0.5px solid #ebebeb",
  borderRadius: 16, padding: "1.25rem 1.5rem",
  marginTop: "1rem", boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
}}>

  {/* Result row */}
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: "1.25rem", paddingBottom: "1rem",
    borderBottom: "0.5px solid #f0f0f0",
  }}>
    <div className="w-full">
      <p style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>
        Draw result
      </p>
      {draw.drawNumber ? (
        <div style={{ display: "flex", gap: 8 }} className=" justify-between flex flex-wrap w-full">
          <div  className="flex  gap-2 mt-2">
          {draw.drawNumber.split(",").map((n: string, i: number) => (
            <div key={i} style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "#378ADD", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 600,
            }}>
              {n.trim()}
            </div>
          ))}
          </div>
          <Button variant={"destructive"}>Close Draw</Button>
        </div>
      ) : (
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: "#fafafa", border: "0.5px solid #e5e5e5",
          borderRadius: 999, padding: "3px 12px",
          fontSize: 12, color: "#aaa", fontWeight: 500,
        }}>
          Not published yet
        </span>
      )}
    </div>

    {draw.jackpotRolledOver && (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        background: "#f0fdf4", border: "0.5px solid #bbf7d0",
        borderRadius: 999, padding: "4px 12px",
        fontSize: 11, color: "#16a34a", fontWeight: 500,
      }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
        Jackpot rolled over
      </span>
    )}
  </div>

  {/* Winners table */}
  <p style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>
    Winners
  </p>

  {(!draw.winners || draw.winners.length === 0) ? (
    <div style={{
      textAlign: "center", padding: "2rem 0",
      background: "#fafafa", borderRadius: 10,
      border: "0.5px dashed #e5e5e5",
    }}>
      <p style={{ fontSize: 13, color: "#ccc", margin: 0 }}>No winners recorded yet</p>
    </div>
  ) : (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr>
          {["Username", "Match type", "Amount", "Proof", "Status"].map((h) => (
            <th key={h} style={{
              textAlign: "left", padding: "8px 12px",
              fontSize: 11, fontWeight: 500, color: "#888",
              borderBottom: "0.5px solid #e5e5e5",
              textTransform: "uppercase", letterSpacing: "0.04em",
            }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {draw.winners.map((w: any, i: number) => {
          const isLast = i === draw.winners.length - 1;
          const rowBorder = isLast ? "none" : "0.5px solid #f5f5f5";

          const tierConfig: Record<string, { bg: string; color: string; label: string }> = {
            jackpot: { bg: "#FEF9EC", color: "#B07D1A", label: "5-match jackpot" },
            gold:    { bg: "#FDF6E3", color: "#8C6A00", label: "4-match gold"    },
            bronze:  { bg: "#FBF4EE", color: "#8B4C1E", label: "3-match bronze"  },
          };
          const tier = tierConfig[w.tier?.toLowerCase()] ?? { bg: "#fafafa", color: "#888", label: w.tier ?? "—" };

          const statusConfig: Record<string, { bg: string; color: string; dot: string }> = {
            paid:      { bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e" },
            pending:   { bg: "#fffbeb", color: "#b45309", dot: "#f59e0b" },
            cancelled: { bg: "#fef2f2", color: "#dc2626", dot: "#f87171" },
          };
          const st = statusConfig[w.status?.toLowerCase()] ?? statusConfig.pending;

          return (
            <tr key={w.id ?? i}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              style={{ transition: "background 0.1s" }}
            >
              {/* Username */}
              <td style={{ padding: "12px 12px", borderBottom: rowBorder }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "#E6F1FB", color: "#185FA5",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 600, flexShrink: 0,
                  }}>
                    {(w.user?.userName ?? w.userName ?? "?")[0].toUpperCase()}
                  </div>
                  <span style={{ fontWeight: 500 }}>
                    {w.user?.userName ?? w.userName ?? "—"}
                  </span>
                </div>
              </td>

              {/* Match type */}
              <td style={{ padding: "12px 12px", borderBottom: rowBorder }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: tier.bg, color: tier.color,
                  borderRadius: 999, padding: "2px 10px",
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}>
                  {tier.label}
                </span>
              </td>

              {/* Amount */}
              <td style={{ padding: "12px 12px", borderBottom: rowBorder }}>
                <span style={{ fontWeight: 600 }}>
                  {new Intl.NumberFormat("en-GB", {
                    style: "currency",
                    currency: draw.currency ?? "GBP",
                  }).format(w.amount ?? 0)}
                </span>
              </td>

              {/* Proof image */}
              <td style={{ padding: "12px 12px", borderBottom: rowBorder }}>
                {w.proofImage ? (
                    <a
                    href={w.proofImage}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      fontSize: 12, color: "#378ADD", textDecoration: "none", fontWeight: 500,
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    View proof
                  </a>
                ) : (
                  <span style={{ fontSize: 12, color: "#ccc" }}>No proof</span>
                )}
              </td>

              {/* Status */}
              <td style={{ padding: "12px 12px", borderBottom: rowBorder }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  background: st.bg, color: st.color,
                  borderRadius: 999, padding: "2px 10px",
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: st.dot, display: "inline-block" }} />
                  {w.status ?? "Pending"}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  )}
</div>
      :
      <div className="mt-5" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: "#888", marginBottom: 8 }}>Draw logic</p>
          {(["random", "algorithmic"] as DrawLogic[]).map((opt) => (
            <div
              key={opt}
              onClick={() => setLogic(opt)}
              style={{
                border: logic === opt ? "0.5px solid #378ADD" : "0.5px solid #e5e5e5",
                background: logic === opt ? "#E6F1FB" : "transparent",
                borderRadius: 8, padding: "0.75rem 1rem",
                marginBottom: 8, cursor: "pointer",
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 500, color: logic === opt ? "#185FA5" : "inherit", marginBottom: 2 }}>
                {opt === "random" ? "Random draw" : "Algorithmic draw"}
              </p>
              <p style={{ fontSize: 12, color: "#888" }}>
                {opt === "random" ? "Standard lottery-style number generation" : "Weighted by most/least frequent scores"}
              </p>
            </div>
          ))}
        </div>

        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: "#888", marginBottom: 8 }}>Draw simulation</p>
          <div style={{ background: "#f5f5f3", borderRadius: 8, padding: "1rem", textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "#888", marginBottom: "0.5rem" }}>April 2026 draw numbers</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "0.75rem 0" }}>
              {simNums.map((n, i) => (
                <div key={i} style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "#378ADD", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 500,
                }}>{n}</div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: "#888", marginBottom: "0.75rem" }}>Simulation mode — not published</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <Btn onClick={simulate}>Re-simulate</Btn>
              <Btn primary onClick={() =>setShowConfirm(true)}>Publish results</Btn>
            </div>
          </div>
        </div>
      </div>}
      </>
      }
          {/* ── Draw logic + Simulation ── */}

        <ConfirmDialog
        open={showConfirm}
        onClose={() => !publishResult.isPending && setShowConfirm(false)}
        onConfirm={handlePublish}
        isLoading={publishResult.isPending}
        numbers={simNums}
      />
    </div>
  );
}

// ── Active draw skeleton ───────────────────────────────────────────────────

function Sk({ w = "100%", h = 14, r = 6 }: { w?: string | number; h?: number; r?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s ease-in-out infinite",
    }} />
  );
}

export function ActiveDrawSkeleton() {
  return (
    <div style={{ background: "#fff", border: "0.5px solid #ebebeb", borderRadius: 16, padding: "1.25rem 1.5rem", marginBottom: "1.25rem" }}>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Sk w={120} h={16} />
          <Sk w={80} h={11} />
        </div>
        <Sk w={80} h={32} r={8} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.75rem", marginBottom: "1rem" }}>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{ background: "#fafafa", borderRadius: 10, padding: "0.6rem 0.85rem", display: "flex", flexDirection: "column", gap: 5 }}>
            <Sk w="60%" h={10} />
            <Sk w="80%" h={14} />
          </div>
        ))}
      </div>
      <Sk w="100%" h={7} r={999} />
    </div>
  );
}


function DrawSection() {
  const [showForm, setShowForm] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
const [page, setPage]     = useState(1);
const [limit, setLimit]   = useState(10);
const [status, setStatus] = useState("");
const [year, setYear]     = useState("");
const [month, setMonth]   = useState("");
  const { getActiveDraw,getAllDraw} = useDraw();
  const {data:allDraws,isLoading:allDrawIsLoading}=getAllDraw(page,limit,status,year,month)
  const { data, isLoading } = getActiveDraw();
  const activeDraw = data?.data;


  // Build initial values for update form from active draw
  const updateInitial: DrawFormState = activeDraw ? {
    prizePool:      activeDraw.prizePool,
    currency:       activeDraw.currency ?? "GBP",
    entryStartDate: activeDraw.entryStartDate?.split("T")[0] ?? "",
    lastEntryDate:  activeDraw.lastEntryDate?.split("T")[0]  ?? "",
    resultDate:     activeDraw.resultDate?.split("T")[0]     ?? "",
    fiveMatchPct:   String(activeDraw.fiveMatchPct  ?? ""),
    fourMatchPct:   String(activeDraw.fourMatchPct  ?? ""),
    threeMatchPct:  String(activeDraw.threeMatchPct ?? ""),
  } : { prizePool:0, currency:"GBP", entryStartDate:"", lastEntryDate:"", resultDate:"", fiveMatchPct:"", fourMatchPct:"", threeMatchPct:"" };

  return (
    <>
      {/* ── Top action bar ── */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <Button
          onClick={() => { setShowForm((p) => !p); setShowUpdate(false); }}
          variant={showForm ? "outline" : "default"}
        >
          {showForm ? "Close" : "Create Monthly Draw"}
        </Button>
      </div>

      {/* ── Create form ── */}
      {showForm && <DrawCreateForm setShowForm={setShowForm} />}

      {/* ── Active draw ── */}
      {isLoading ? (
        <ActiveDrawSkeleton />
      ) : activeDraw ? (
        <>
          <ActiveDrawCard
            draw={activeDraw}
            onEdit={() => { setShowUpdate((p) => !p); setShowForm(false); }}
          />
          {showUpdate && (
            <DrawUpdateForm
              drawId={activeDraw.id}
              initial={updateInitial}
              onClose={() => setShowUpdate(false)}
            />
          )}
        </>
      ) : (
        <div style={{
          background: "#fafafa", border: "0.5px dashed #e0e0e0",
          borderRadius: 16, padding: "2rem", textAlign: "center",
          marginBottom: "1.25rem",
        }}>
          <p style={{ fontSize: 13, color: "#bbb", margin: 0 }}>No active draw — create one above</p>
        </div>
      )}



   {/* ── Draw history ── */}
<SectionCard title="Draw history">

  {/* Filters */}
  <div style={{ display: "flex", gap: 8, marginBottom: "1rem", flexWrap: "wrap" }}>
    <select
      value={status}
      onChange={(e) => { setStatus(e.target.value); setPage(1); }}
      style={{ fontSize: 12, padding: "6px 10px", border: "0.5px solid #e5e5e5", borderRadius: 8, color: "#555", background: "#fff", cursor: "pointer" }}
    >
      <option value="">All statuses</option>
      <option value="active">Active</option>
      <option value="completed">Completed</option>
      <option value="cancelled">Cancelled</option>
    </select>

    <select
      value={year}
      onChange={(e) => { setYear(e.target.value); setPage(1); }}
      style={{ fontSize: 12, padding: "6px 10px", border: "0.5px solid #e5e5e5", borderRadius: 8, color: "#555", background: "#fff", cursor: "pointer" }}
    >
      <option value="">All years</option>
      {[2024, 2025, 2026].map((y) => (
        <option key={y} value={String(y)}>{y}</option>
      ))}
    </select>

    <select
      value={month}
      onChange={(e) => { setMonth(e.target.value); setPage(1); }}
      style={{ fontSize: 12, padding: "6px 10px", border: "0.5px solid #e5e5e5", borderRadius: 8, color: "#555", background: "#fff", cursor: "pointer" }}
    >
      <option value="">All months</option>
      {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m, i) => (
        <option key={m} value={String(i + 1)}>{m}</option>
      ))}
    </select>

    {(status || year || month) && (
      <button
        onClick={() => { setStatus(""); setYear(""); setMonth(""); setPage(1); }}
        style={{ fontSize: 12, padding: "6px 12px", border: "0.5px solid #fecaca", borderRadius: 8, color: "#dc2626", background: "#fef2f2", cursor: "pointer" }}
      >
        Clear filters
      </button>
    )}
  </div>

  {/* Table */}
  {allDrawIsLoading ? (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {[0,1,2,3].map((i) => (
        <div key={i} style={{ height: 44, borderRadius: 8, background: "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s ease-in-out infinite" }} />
      ))}
    </div>
  ) : !allDraws?.data?.length ? (
    <div style={{ textAlign: "center", padding: "2rem 0" }}>
      <p style={{ fontSize: 13, color: "#bbb", margin: 0 }}>No draws found</p>
    </div>
  ) : (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr>
          {["#", "Period", "Prize Pool", "Distribution", "Status","Result", "Jackpot", "Winners"].map((h) => (
            <th key={h} style={{
              textAlign: "left", padding: "8px 12px",
              fontSize: 11, fontWeight: 500, color: "#888",
              borderBottom: "0.5px solid #e5e5e5",
              textTransform: "uppercase", letterSpacing: "0.04em",
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {allDraws.data.map((d, i: number) => {
          const isLast = i === allDraws.data.length - 1;
          const fmt = (n: number) =>
            new Intl.NumberFormat("en-GB", { style: "currency", currency: d.currency || "GBP" }).format(n);
          const rowBorder = isLast ? "none" : "0.5px solid #f0f0f0";

          const statusStyle = d.status === "active"
            ? { bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e" }
            : d.status === "completed"
            ? { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" }
            : { bg: "#fafafa", color: "#888",    dot: "#ccc"    };

          return (
            <tr key={d.id} style={{ transition: "background 0.1s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {/* Draw number */}
              <td style={{ padding: "12px 12px", borderBottom: rowBorder, color: "#bbb", fontSize: 12 }}>
                {d.drawNumber ?? "—"}
              </td>

              {/* Period */}
              <td style={{ padding: "12px 12px", borderBottom: rowBorder }}>
                <p style={{ margin: 0, fontWeight: 500, fontSize: 13 }}>
                  {new Date(d.resultDate).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: "#aaa" }}>
                  {new Date(d.entryStartDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  {" – "}
                  {new Date(d.lastEntryDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </p>
              </td>

              {/* Prize pool */}
              <td style={{ padding: "12px 12px", borderBottom: rowBorder }}>
                <span style={{ fontWeight: 600 }}>{fmt(d.prizePool)}</span>
                {d.jackpotRolledOver && (
                  <span style={{
                    marginLeft: 6, fontSize: 10, background: "#f0fdf4",
                    color: "#16a34a", borderRadius: 999, padding: "1px 7px",
                    fontWeight: 500, border: "0.5px solid #bbf7d0",
                  }}>rollover</span>
                )}
              </td>

              {/* Distribution mini-bar */}
              <td style={{ padding: "12px 12px", borderBottom: rowBorder }}>
                <div style={{ display: "flex", height: 5, width: 80, borderRadius: 999, overflow: "hidden", gap: 1, marginBottom: 4 }}>
                  <div style={{ width: `${d.fiveMatchPct}%`,  background: "#378ADD" }} title={`Jackpot ${d.fiveMatchPct}%`} />
                  <div style={{ width: `${d.fourMatchPct}%`,  background: "#C9A84C" }} title={`4-match ${d.fourMatchPct}%`} />
                  <div style={{ width: `${d.threeMatchPct}%`, background: "#C97A3A" }} title={`3-match ${d.threeMatchPct}%`} />
                </div>
                <p style={{ fontSize: 10, color: "#bbb", margin: 0 }}>
                  {d.fiveMatchPct}% / {d.fourMatchPct}% / {d.threeMatchPct}%
                </p>
              </td>

              {/* Status badge */}
              <td style={{ padding: "12px 12px", borderBottom: rowBorder }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  background: statusStyle.bg, color: statusStyle.color,
                  borderRadius: 999, padding: "2px 10px",
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: statusStyle.dot, display: "inline-block" }} />
                  {d.status}
                </span>
              </td>
              {/* Result*/}
              <td style={{ padding: "12px 12px", borderBottom: rowBorder }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  background: statusStyle.bg, color: statusStyle.color,
                  borderRadius: 999, padding: "2px 10px",
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: statusStyle.dot, display: "inline-block" }} />
                  {d.drawNumber?d.drawNumber:"Not Published"}
                </span>
              </td>

              {/* Jackpot status */}
              <td style={{ padding: "12px 12px", borderBottom: rowBorder }}>
                {d.jackpotRolledOver
                  ? <Badge label="Rolled over" variant="red" />
                  : d.winners?.some((w: any) => w.tier === "")
                  ? <Badge label="Paid"        variant="green" />
                  : <Badge label="Pending"     variant="gray" />}
              </td>

              {/* Winners count */}
              <td style={{ padding: "12px 12px", borderBottom: rowBorder }}>
                {d.winners?.length > 0 ? (
                  <span style={{ fontWeight: 600 }}>{d.winners.length}</span>
                ) : (
                  <span style={{ color: "#ccc" }}>—</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  )}

  {/* Pagination */}
  {allDraws?.pagination && allDraws.pagination.pages > 1 && (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem", paddingTop: "1rem", borderTop: "0.5px solid #f0f0f0" }}>
      <p style={{ fontSize: 12, color: "#aaa", margin: 0 }}>
        Page {allDraws.pagination.page} of {allDraws.pagination.pages}
        {" · "}
        <span style={{ color: "#888" }}>{allDraws.pagination.total} draws total</span>
      </p>
      <div style={{ display: "flex", gap: 6 }}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={!allDraws.pagination.hasPrev}
          style={{
            padding: "5px 14px", fontSize: 12, borderRadius: 8,
            border: "0.5px solid #e5e5e5", background: "transparent",
            cursor: allDraws.pagination.hasPrev ? "pointer" : "not-allowed",
            color: allDraws.pagination.hasPrev ? "#555" : "#ccc",
          }}
        >← Prev</button>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!allDraws.pagination.hasNext}
          style={{
            padding: "5px 14px", fontSize: 12, borderRadius: 8,
            border: "0.5px solid #e5e5e5", background: "transparent",
            cursor: allDraws.pagination.hasNext ? "pointer" : "not-allowed",
            color: allDraws.pagination.hasNext ? "#555" : "#ccc",
          }}
        >Next →</button>
      </div>
    </div>
  )}
</SectionCard>
    </>
  );
}

export default DrawSection;