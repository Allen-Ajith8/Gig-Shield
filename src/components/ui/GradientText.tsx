import * as React from "react"
import { cn } from "@/lib/utils"

export function GradientText({ className, as: Component = "span", children, ...props }: any) {
  return (
    <Component className={cn("text-gradient-brand font-bold", className)} {...props}>
      {children}
    </Component>
  )
}
