import Link from "next/link";

import { HighlightCard as HighlightCardType } from "@/lib/types";

type HighlightCardProps = {
  item: HighlightCardType;
};

export function HighlightCard({ item }: HighlightCardProps) {
  return (
    <article className="card">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      {item.tags ? (
        <div className="tag-row">
          {item.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <div className="inline-actions">
        <Link className="button-secondary" href={item.href}>
          Explore
        </Link>
      </div>
    </article>
  );
}
