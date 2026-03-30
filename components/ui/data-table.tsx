type DataTableProps = { headers: string[]; rows: React.ReactNode[][] };
export function DataTable({ headers, rows }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead><tr>{headers.map((h) => (<th key={h} className="text-left text-[10.5px] font-semibold uppercase tracking-wider text-text-ghost px-3 py-2 border-b border-border-vivid">{h}</th>))}</tr></thead>
        <tbody>{rows.map((row, i) => (<tr key={i} className="hover:bg-white/[0.02] transition-colors">{row.map((cell, j) => (<td key={j} className="px-3 py-2.5 text-sm border-b border-border">{cell}</td>))}</tr>))}</tbody>
      </table>
    </div>
  );
}
