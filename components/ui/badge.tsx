import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", {
  variants: { variant: { blue: "bg-blue-dim text-blue", green: "bg-green-dim text-green", amber: "bg-amber-dim text-amber", red: "bg-red-dim text-red", violet: "bg-violet-dim text-violet", ghost: "bg-surface-raised text-text-ghost" } },
  defaultVariants: { variant: "blue" },
});
type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;
export function Badge({ variant, className, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
