type BarChartProps = {
  data: { label: string; values: { height: number; className: string; label?: string }[] }[];
  legend?: { label: string; className: string }[];
  title?: string;
  height?: number;
  showLabels?: boolean;
};

export function BarChart({ data, legend, title, height = 140, showLabels = true }: BarChartProps) {
  return (
    <figure role="img" aria-label={title ?? "Bar chart visualization"}>
      <div className="flex items-end gap-1.5" style={{ height: `${height}px` }}>
        {data.map((col) => (
          <div key={col.label} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            {col.values.map((bar, i) => (
              <div key={i} className="relative w-full" style={{ height: `${bar.height}%` }}>
                {showLabels && bar.label && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-medium text-text-dim whitespace-nowrap">
                    {bar.label}
                  </span>
                )}
                <div aria-hidden="true" className={`w-full h-full rounded-t ${bar.className}`} />
              </div>
            ))}
            <div className="text-xs text-text-ghost">{col.label}</div>
          </div>
        ))}
      </div>
      {legend && (
        <div className="flex gap-3 mt-2.5 text-xs text-text-dim">
          {legend.map((l) => (
            <span key={l.label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-sm inline-block ${l.className}`} aria-hidden="true" />
              {l.label}
            </span>
          ))}
        </div>
      )}
      <figcaption className="sr-only">
        {data.map((col) => `${col.label}: ${col.values.map((v, i) => `${legend?.[i]?.label ?? `Series ${i + 1}`}: ${v.height}%`).join(", ")}`).join(". ")}
      </figcaption>
    </figure>
  );
}
