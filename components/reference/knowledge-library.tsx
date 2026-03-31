"use client";
import { Badge } from "@/components/ui/badge";

const libraryCategories = [
  "Software Engineering Management", "DevOps", "Metrics & KPIs",
  "Developer Productivity", "Developer Experience", "Code Quality",
  "SDLC", "Value Stream", "Software Capitalization",
  "Platform Engineering", "AI in Software Development",
  "Delivery & Planning", "Product & Operations", "Engineering Roles",
  "Analytics", "Transformation", "Strategic Planning",
];

export function KnowledgeLibrarySection() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-text-dim">
        The Jellyfish Knowledge Library at <a href="https://jellyfish.co/library/index/" target="_blank" rel="noopener noreferrer" className="text-blue hover:underline">jellyfish.co/library</a> contains 80+ articles across {libraryCategories.length} categories.
      </p>
      <div className="flex flex-wrap gap-2">
        {libraryCategories.map((cat, i) => (
          <Badge key={cat} variant={i % 2 === 0 ? "blue" : "violet"}>{cat}</Badge>
        ))}
      </div>
    </div>
  );
}
