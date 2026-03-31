type PageHeroProps = { eyebrow: string; title: string; subtitle?: string; intro?: string };
export function PageHero({ eyebrow, title, subtitle, intro }: PageHeroProps) {
  const eyebrowId = `page-eyebrow-${eyebrow.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className="mb-6">
      <p id={eyebrowId} className="text-xs font-semibold uppercase tracking-widest text-blue mb-1.5">{eyebrow}</p>
      <h1 aria-describedby={eyebrowId} className="font-serif text-4xl font-normal tracking-tight">{title}{subtitle && <i className="text-text-dim"> {subtitle}</i>}</h1>
      {intro && <p className="text-text-dim text-[15px] mt-1.5 max-w-xl">{intro}</p>}
    </div>
  );
}
