"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, Database, Search, BookType, Bot,
  Workflow, Cpu, FlaskConical, Target,
  MessageSquare, History, ClipboardList, Settings,
  Sparkles, Network, BarChart3, LineChart, Lightbulb, SplitSquareHorizontal
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const navGroups = [
  {
    title: "CORE",
    items: [
      { name: "Overview", href: "/dashboard", icon: Home },
    ]
  },
  {
    title: "DATA WORKSPACE",
    items: [
      { name: "Dataset", href: "/dashboard/dataset", icon: Database },
      { name: "Profiling", href: "/dashboard/profiling", icon: Search },
      { name: "Data Dictionary", href: "/dashboard/dictionary", icon: BookType },
      { name: "Feature Engineering", href: "/dashboard/features", icon: Sparkles },
      { name: "Synthetic Data", href: "/dashboard/synthetic", icon: Cpu },
    ]
  },
  {
    title: "AI WORKFORCE",
    items: [
      { name: "Agents", href: "/dashboard/agents", icon: Bot },
      { name: "Workflow", href: "/dashboard/workflow", icon: Workflow },
      { name: "Communication", href: "/dashboard/communication", icon: Network },
    ]
  },
  {
    title: "INTELLIGENCE",
    items: [
      { name: "ML Experiments", href: "/dashboard/experiments", icon: FlaskConical },
      { name: "Model Leaderboard", href: "/dashboard/models", icon: BarChart3 },
      { name: "Predictions", href: "/dashboard/predictions", icon: Target },
      { name: "What-If Simulator", href: "/dashboard/what-if", icon: SplitSquareHorizontal },
      { name: "Insights", href: "/dashboard/insights", icon: Lightbulb },
    ]
  },
  {
    title: "SYSTEM",
    items: [
      { name: "AI Copilot", href: "/dashboard/copilot", icon: MessageSquare },
      { name: "Versions", href: "/dashboard/versions", icon: History },
      { name: "Audit Log", href: "/dashboard/audit", icon: ClipboardList },
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 h-screen border-r border-white/5 bg-background/80 backdrop-blur-xl flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(45,212,191,0.5)]">
            IQ
          </div>
          <span className="text-xl font-bold tracking-tight text-white">AgentIQ</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 scrollbar-hide pb-20">
        {navGroups.map((group) => (
          <div key={group.title}>
            <div className="text-[10px] font-bold tracking-wider text-slate-500 mb-2 px-3">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all relative group",
                      isActive 
                        ? "text-white" 
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 bg-brand-dark/10 rounded-lg border border-brand-light/20 shadow-[0_0_10px_rgba(45,212,191,0.1)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon size={16} className={cn("relative z-10", isActive ? "text-brand-light" : "")} />
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 mt-auto border-t border-white/5 bg-background">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative group text-slate-400 hover:text-white hover:bg-white/5",
            pathname === "/dashboard/settings" && "text-white bg-white/5"
          )}
        >
          <Settings size={18} />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  )
}
