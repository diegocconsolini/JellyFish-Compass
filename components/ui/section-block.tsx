import { ReactNode } from "react";
type SectionBlockProps = { title: string; copy?: string; children: ReactNode };
export function SectionBlock({ title, copy, children }: SectionBlockProps) {
  return (
    <section className="mb-5">
      <div className="mb-4"><h2 className="text-base font-bold">{title}</h2>{copy && <p className="text-sm text-text-dim mt-1">{copy}</p>}</div>
      {children}
    </section>
  );
}
