"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, AlertTriangle, Shield, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const navGroups = [
  {
    title: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
    ]
  },
  {
    title: "INCIDENT RESPONSE",
    items: [
      { name: "Incidents", href: "/dashboard/incidents", icon: AlertTriangle },
    ]
  },
]

export function Sidebar({ isOpen = true, setIsOpen }: { isOpen?: boolean, setIsOpen?: (v: boolean) => void }) {
  const pathname = usePathname()

  return (
    <div className={cn(
      "w-64 h-screen border-r border-[var(--color-border)] flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )} style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Logo and Collapse Button */}
      <div className="p-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-[var(--fg-base)] block leading-tight">AgentIQ</span>
            <span className="text-[10px] text-slate-500">Autonomous Data Workforce</span>
          </div>
        </Link>
        {setIsOpen && (
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-[var(--color-surface)] transition-colors"
            title="Close sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            <div className="text-[10px] font-bold tracking-wider text-slate-500 mb-2 px-3">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = item.href === "/dashboard"
                  ? pathname === item.href
                  : pathname?.startsWith(item.href) ?? false

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all relative",
                      isActive
                        ? "text-[var(--fg-base)] bg-[var(--color-surface)]"
                        : "text-slate-400 hover:text-[var(--fg-base)] hover:bg-[var(--color-surface-hover)]"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 bg-[var(--brand-light)]/10 rounded-lg border border-[var(--brand-light)]/20"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon size={16} className={cn("relative z-10", isActive ? "text-[var(--brand-light)]" : "")} />
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>System Online</span>
        </div>
      </div>
    </div>
  )
}
