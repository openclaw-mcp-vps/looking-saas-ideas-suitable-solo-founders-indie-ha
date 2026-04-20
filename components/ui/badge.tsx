import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-slate-700 bg-slate-800/80 text-slate-200",
        success: "border-emerald-500/40 bg-emerald-500/20 text-emerald-300",
        warning: "border-amber-500/40 bg-amber-500/20 text-amber-300",
        info: "border-cyan-500/40 bg-cyan-500/20 text-cyan-300"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
