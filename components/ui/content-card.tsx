import { ReactNode } from "react";

type ContentCardProps = {
  title: string;
  body: string;
  footer?: ReactNode;
};

export function ContentCard({ title, body, footer }: ContentCardProps) {
  return (
    <article className="card">
      <h3>{title}</h3>
      <p>{body}</p>
      {footer}
    </article>
  );
}
