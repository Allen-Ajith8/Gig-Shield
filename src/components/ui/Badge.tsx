import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "brand"
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-white/10 bg-white/5 text-slate-300": variant === "default",
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-400": variant === "success",
          "border-amber-500/20 bg-amber-500/10 text-amber-400": variant === "warning",
          "border-red-500/20 bg-red-500/10 text-red-400": variant === "error",
          "border-brand-dark/30 bg-brand-dark/10 text-brand-light": variant === "brand",
        },
        className
      )}
      {...props}
    />
  )
}
