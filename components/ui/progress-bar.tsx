const gradients: Record<string, string> = { blue: "from-blue to-cyan", green: "from-green to-emerald-300", amber: "from-amber to-yellow-300", red: "from-red to-red-300", violet: "from-violet to-purple-300", ghost: "from-text-ghost to-text-ghost" };
type ProgressBarProps = { label: string; value: string; percent: number; color: string; valueColor?: string };
export function ProgressBar({ label, value, percent, color, valueColor }: ProgressBarProps) {
  return (
    <div className="mb-2.5">
      <div className="flex justify-between text-sm mb-1"><span className="text-text-dim">{label}</span><span className={`font-semibold font-mono text-xs ${valueColor || "text-text-primary"}`}>{value}</span></div>
      <div className="h-1.5 bg-surface-overlay rounded-full overflow-hidden"><div className={`h-full rounded-full bg-gradient-to-r ${gradients[color] || gradients.blue}`} style={{ width: `${percent}%` }} /></div>
    </div>
  );
}
