export function SectionDivider({ variant = "major" }: { variant?: "major" | "minor" }) {
  if (variant === "minor") {
    return <hr className="border-t border-border my-6" />;
  }
  return (
    <div
      className="my-8 h-px"
      style={{
        background:
          "linear-gradient(to right, transparent, var(--color-border) 20%, var(--color-border-vivid) 50%, var(--color-border) 80%, transparent)",
      }}
    />
  );
}
