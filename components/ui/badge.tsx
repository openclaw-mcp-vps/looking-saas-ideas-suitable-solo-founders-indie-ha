import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", {
  variants: {
    variant: {
      default: "border-transparent bg-[#2f81f7]/20 text-[#79c0ff]",
      secondary: "border-[#30363d] bg-[#21262d] text-[#c9d1d9]",
      success: "border-[#1a7f37]/40 bg-[#1a7f37]/20 text-[#56d364]",
      warning: "border-[#9e6a03]/40 bg-[#9e6a03]/20 text-[#e3b341]"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps): React.JSX.Element {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
