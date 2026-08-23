"use client"
import React from "react"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Lightbulb, AlertTriangle, ShieldAlert, Sparkles, CheckCircle2, CopyMinus, FolderSearch, ArrowRight } from "lucide-react"

export default function InsightsPage() {
  const insights = [
    { title: "DATA GAP INSIGHT", desc: "3 important fields contain incomplete data.", icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", sev: "Medium", impact: "May reduce model accuracy for cohort A.", action: "Imputation Agent recommended" },
    { title: "DUPLICATE INSIGHT", desc: "1.2% duplicate records detected.", icon: CopyMinus, color: "text-blue-400", bg: "bg-blue-400/10", sev: "Low", impact: "Minor training bias.", action: "Deduplication applied" },
    { title: "COMPLIANCE INSIGHT", desc: "4 columns contain possible sensitive information.", icon: ShieldAlert, color: "text-red-400", bg: "bg-red-500/10", sev: "Critical", impact: "PII leak risk during model export.", action: "Privacy Agent masking required" },
    { title: "RISK INSIGHT", desc: "Potential class imbalance may affect model reliability.", icon: Sparkles, color: "text-brand-light", bg: "bg-brand-light/10", sev: "High", impact: "Low recall for minority class.", action: "Synthetic Data Agent activated" },
    { title: "TAXONOMY INSIGHT", desc: "Detected customer-related entity structure.", icon: FolderSearch, color: "text-indigo-400", bg: "bg-indigo-400/10", sev: "Info", impact: "Enables automatic relation mapping.", action: "Schema documented" },
    { title: "CATALOG QUALITY", desc: "Overall dataset quality: 87%.", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", sev: "Good", impact: "Ready for baseline ML experiments.", action: "Proceed to ML Agent" },
  ]

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Data Intelligence Insights</h1>
        <p className="text-slate-400">Actionable intelligence automatically surfaced by AgentIQ's profiling systems.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight, i) => (
          <Card key={i} className="p-6 bg-black/40 backdrop-blur-xl border-white/5 flex flex-col hover:border-brand-light/30 transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${insight.bg} flex items-center justify-center ${insight.color} group-hover:bg-white/10 transition-colors`}>
                <insight.icon size={20} />
              </div>
              {insight.sev === "Critical" && <Badge className="bg-red-500/20 text-red-400 border-none">Critical</Badge>}
              {insight.sev === "High" && <Badge className="bg-amber-500/20 text-amber-400 border-none">High</Badge>}
              {insight.sev === "Medium" && <Badge className="bg-blue-500/20 text-blue-400 border-none">Medium</Badge>}
              {insight.sev === "Low" && <Badge className="bg-slate-500/20 text-slate-400 border-none">Low</Badge>}
              {insight.sev === "Info" && <Badge className="bg-indigo-500/20 text-indigo-400 border-none">Info</Badge>}
              {insight.sev === "Good" && <Badge className="bg-emerald-500/20 text-emerald-400 border-none">Good</Badge>}
            </div>
            
            <h3 className="text-[10px] font-bold text-slate-500 tracking-wider mb-2">{insight.title}</h3>
            <p className="text-lg font-bold text-white mb-4 leading-snug">{insight.desc}</p>
            
            <div className="mt-auto space-y-4">
              <div>
                <span className="block text-[10px] uppercase text-slate-500 mb-1">Business Impact</span>
                <p className="text-xs text-slate-300">{insight.impact}</p>
              </div>
              <div className="pt-4 border-t border-white/5">
                <span className="block text-[10px] uppercase text-brand-light/80 mb-1">Recommended Action</span>
                <p className="text-sm font-medium text-brand-light flex items-center gap-1">{insight.action} <ArrowRight size={14}/></p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
