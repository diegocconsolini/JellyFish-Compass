import { ReactNode } from "react";

type SectionBlockProps = {
  title: string;
  copy?: string;
  children: ReactNode;
};

export function SectionBlock({ title, copy, children }: SectionBlockProps) {
  return (
    <section className="page-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">{title}</h2>
          {copy ? <p className="section-copy">{copy}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}
