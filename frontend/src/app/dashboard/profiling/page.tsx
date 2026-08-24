"use client"
import React, { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Search, Bot, AlertTriangle, CheckCircle2, BarChart2 } from "lucide-react"
import { motion } from "framer-motion"
import { api } from "@/lib/api"

export default function ProfilingPage() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    api.getStats().then(setStats).catch(console.error)
  }, [])

  if (!stats) {
    return <div className="flex h-full items-center justify-center pt-32 text-slate-500">Loading Profile...</div>
  }

  const score = stats.dataset_health.score

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--fg-base)] mb-1">Automatic Data Profiling</h1>
          <p className="text-slate-400">Let AgentIQ understand your data before making decisions.</p>
        </div>
        <Button className="bg-[var(--brand-dark)]/20 text-[var(--brand-light)] border border-[var(--brand-light)]/30 hover:bg-[var(--brand-dark)]/40 gap-2">
          <Bot size={16} /> Ask Profiling Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 glass flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-light)]/10 blur-[50px] rounded-full pointer-events-none" />
          <h3 className="text-sm font-bold text-slate-300 tracking-wider mb-6 text-center">DATASET HEALTH</h3>
          <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
              <motion.circle 
                cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * score) / 100} 
                className="text-[var(--brand-light)] drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" 
                initial={{ strokeDashoffset: 283 }} animate={{ strokeDashoffset: 283 - (283 * score) / 100 }} transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute flex items-center justify-center inset-0">
              <span className="text-3xl font-black text-[var(--fg-base)]">{score}%</span>
            </div>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">GOOD</Badge>
        </Card>

        <Card className="col-span-3 p-6 glass border-[var(--color-border)]">
          <h3 className="text-sm font-bold text-slate-300 tracking-wider mb-4 flex items-center gap-2">
            <Search size={16} className="text-[var(--brand-light)]" /> PROFILING AGENT FINDINGS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
              <CheckCircle2 size={18} className="text-emerald-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[var(--fg-base)]">{stats.dataset_health.columns} columns detected</p>
                <p className="text-xs text-slate-400">Successfully inferred data types.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle size={18} className="text-red-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-400">{stats.dataset_health.outliers_pct}% outliers detected</p>
                <p className="text-xs text-slate-400">Extreme values found in numerical columns.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle size={18} className="text-amber-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-400">{stats.dataset_health.missing_pct}% missing values</p>
                <p className="text-xs text-slate-400">Imputation required before modeling.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
              <CheckCircle2 size={18} className="text-[var(--brand-dark)] mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[var(--fg-base)]">{stats.dataset_health.pii_cols} PII columns identified</p>
                <p className="text-xs text-slate-400">Privacy filter is active.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/5 h-[300px] flex flex-col items-center justify-center">
          <BarChart2 size={32} className="text-slate-600 mb-4" />
          <span className="text-slate-500 text-sm font-medium uppercase tracking-widest">Numerical Distribution</span>
        </Card>
        <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/5 h-[300px] flex flex-col items-center justify-center">
          <BarChart2 size={32} className="text-slate-600 mb-4" />
          <span className="text-slate-500 text-sm font-medium uppercase tracking-widest">Missing Value Dist</span>
        </Card>
        <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/5 h-[300px] flex flex-col items-center justify-center">
          <BarChart2 size={32} className="text-slate-600 mb-4" />
          <span className="text-slate-500 text-sm font-medium uppercase tracking-widest">Correlation Matrix</span>
        </Card>
      </div>
    </div>
  )
}
