export function JsonViewer({ data }: { data: unknown }) {
  return (
    <pre className="mt-3 bg-bg-deep border border-border rounded-lg p-4 max-h-[200px] overflow-auto font-mono text-[11.5px] text-[#24292e] dark:text-[#c9d1d9] leading-relaxed" tabIndex={0} aria-label="JSON response data">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
