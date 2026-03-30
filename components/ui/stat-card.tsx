const topBorder: Record<string, string> = { blue: "from-blue to-cyan", green: "from-green to-emerald-300", amber: "from-amber to-yellow-300", violet: "from-violet to-purple-300" };
const valColor: Record<string, string> = { blue: "text-blue", green: "text-green", amber: "text-amber", violet: "text-violet" };
type StatCardProps = { label: string; value: string; note: string; trend?: string; trendDirection?: "up" | "down"; color?: "blue" | "green" | "amber" | "violet" };
export function StatCard({ label, value, note, trend, trendDirection, color = "blue" }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-5">
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${topBorder[color]}`} />
      <div className="text-[11px] font-semibold uppercase tracking-wider text-text-ghost mb-2">{label}</div>
      <div className={`text-3xl font-extrabold tracking-tight ${valColor[color]}`}>{value}</div>
      <div className="text-[11px] text-text-ghost mt-1">{note}</div>
      {trend && trendDirection && (
        <div className={`inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded mt-1.5 ${trendDirection === "up" ? "text-green bg-green-dim" : "text-red bg-red-dim"}`}>
          {trendDirection === "up" ? "\u2191" : "\u2193"} {trend}
        </div>
      )}
    </div>
  );
}
