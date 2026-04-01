import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { PlaybookDefinition } from "@/lib/types";

const personaLabels: Record<string, string> = {
  sm: "SM",
  po: "PO",
  em: "EM",
  pm: "PM",
};

export function PlaybookCard({ playbook }: { playbook: PlaybookDefinition }) {
  return (
    <Link
      href={`/academy/playbooks/${playbook.slug}`}
      className="group relative overflow-hidden rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-vivid"
    >
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${playbook.color.from} ${playbook.color.to}`}
        aria-hidden="true"
      />
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {playbook.personas.map((p) => (
          <Badge key={p} variant="blue">
            {personaLabels[p] ?? p}
          </Badge>
        ))}
        <span className="text-xs text-text-ghost ml-auto">
          {playbook.steps.length} steps
        </span>
      </div>
      <h3 className="text-base font-bold text-text-primary mb-1 group-hover:text-blue transition-colors">
        {playbook.title}
      </h3>
      <p className="text-sm text-text-dim leading-relaxed line-clamp-2">
        {playbook.goal}
      </p>
      <p className="text-xs text-text-ghost mt-3 truncate">
        Source: {playbook.source.label}
      </p>
    </Link>
  );
}
