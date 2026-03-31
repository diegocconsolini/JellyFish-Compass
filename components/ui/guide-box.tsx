type GuideBoxProps = { title: string; children: React.ReactNode };
export function GuideBox({ title, children }: GuideBoxProps) {
  return (
    <div className="rounded-xl border border-blue-dim bg-blue-glow p-5 mb-5">
      <h2 className="text-xs font-bold text-blue mb-1.5 flex items-center gap-1.5"><span aria-hidden="true">💡</span> {title}</h2>
      <div className="text-sm text-text-dim leading-relaxed [&_code]:font-mono [&_code]:text-[11.5px] [&_code]:bg-blue-dim [&_code]:text-blue [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded">{children}</div>
    </div>
  );
}
