type PageHeroProps = { eyebrow: string; title: string; subtitle?: string; intro?: string };
export function PageHero({ eyebrow, title, subtitle, intro }: PageHeroProps) {
  return (
    <div className="mb-6">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-blue mb-1.5">{eyebrow}</div>
      <h1 className="font-serif text-4xl font-normal tracking-tight">{title}{subtitle && <i className="text-text-dim"> {subtitle}</i>}</h1>
      {intro && <p className="text-text-dim text-[15px] mt-1.5 max-w-xl">{intro}</p>}
    </div>
  );
}
