type BarChartProps = { data: { label: string; values: { height: number; className: string }[] }[]; legend?: { label: string; className: string }[] };
export function BarChart({ data, legend }: BarChartProps) {
  return (
    <figure role="img" aria-label="Bar chart visualization">
      <div className="flex items-end gap-1.5 h-[140px]">
        {data.map((col) => (
          <div key={col.label} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            {col.values.map((bar, i) => (<div key={i} aria-hidden="true" className={`w-full rounded-t ${bar.className}`} style={{ height: `${bar.height}%` }} />))}
            <div className="text-[10px] text-text-ghost">{col.label}</div>
          </div>
        ))}
      </div>
      {legend && (<div className="flex gap-3 mt-2.5 text-[11px] text-text-dim">{legend.map((l) => (<span key={l.label} className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-sm inline-block ${l.className}`} aria-hidden="true" />{l.label}</span>))}</div>)}
      <figcaption className="sr-only">
        {data.map((col) => `${col.label}: ${col.values.map((v, i) => `${legend?.[i]?.label ?? `Series ${i + 1}`}: ${v.height}%`).join(", ")}`).join(". ")}
      </figcaption>
    </figure>
  );
}
