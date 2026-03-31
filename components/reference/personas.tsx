"use client";
import { DataTable } from "@/components/ui/data-table";

const personas = [
  { role: "Engineering Executives", useCases: "Strategic alignment, investment decisions, board reporting" },
  { role: "Engineering Managers", useCases: "Team health, operational effectiveness, people management" },
  { role: "Product Leaders", useCases: "Delivery tracking, capacity planning, roadmap alignment" },
  { role: "PMO & Engineering Operations", useCases: "Workflow analysis, process optimization, metrics" },
  { role: "Platform Engineering", useCases: "Developer tooling impact, DevEx measurement, infrastructure ROI" },
  { role: "Finance Teams", useCases: "Software capitalization, R&D financial reporting" },
  { role: "Software Developers", useCases: "DevEx surveys, productivity feedback" },
];

export function PersonasSection() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-text-dim">Jellyfish serves 7 target personas across engineering, product, finance, and operations.</p>
      <DataTable
        caption="Target personas"
        headers={["Persona", "Use Cases"]}
        rows={personas.map((p) => [
          <span key="role" className="text-[13px] font-medium">{p.role}</span>,
          <span key="use" className="text-[13px] text-text-dim">{p.useCases}</span>,
        ])}
      />
    </div>
  );
}
