"use client"
import React from "react"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Brain, Search, BookType, Sparkles, Cpu, ShieldAlert, FlaskConical, Activity, CheckCircle, Target, Lightbulb, Workflow } from "lucide-react"

const agents = [
  { name: "Master Agent", purpose: "Plans and orchestrates the entire workflow.", icon: Brain, status: "ACTIVE", task: "Planning ML experiments", color: "text-brand-light", bg: "bg-brand-light/10" },
  { name: "Profiling Agent", purpose: "Analyzes data quality, structure, and anomalies.", icon: Search, status: "COMPLETED", task: "Profiled 42 columns", color: "text-blue-400", bg: "bg-blue-400/10" },
  { name: "Dictionary Agent", purpose: "Generates contextual descriptions for columns.", icon: BookType, status: "COMPLETED", task: "Documented schema", color: "text-indigo-400", bg: "bg-indigo-400/10" },
  { name: "Quality Agent", purpose: "Handles missing values and inconsistent data.", icon: Sparkles, status: "COMPLETED", task: "Imputed 3% missing", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { name: "Feature Agent", purpose: "Creates useful features based on objectives.", icon: FlaskConical, status: "COMPLETED", task: "Generated 17 features", color: "text-fuchsia-400", bg: "bg-fuchsia-400/10" },
  { name: "Synthetic Agent", purpose: "Generates records for class balancing.", icon: Cpu, status: "COMPLETED", task: "Generated 25K records", color: "text-brand-dark", bg: "bg-brand-dark/10" },
  { name: "Privacy Agent", purpose: "Detects PII and privacy risks.", icon: ShieldAlert, status: "COMPLETED", task: "Masked 4 columns", color: "text-red-400", bg: "bg-red-400/10" },
  { name: "ML Strategy Agent", purpose: "Determines ML problem and candidate models.", icon: Workflow, status: "ACTIVE", task: "Selecting classifiers", color: "text-orange-400", bg: "bg-orange-400/10" },
  { name: "Experiment Agent", purpose: "Runs and compares multiple ML pipelines.", icon: Activity, status: "WAITING", task: "Waiting for Strategy", color: "text-pink-400", bg: "bg-pink-400/10" },
  { name: "Validation Agent", purpose: "Checks data leakage and model reliability.", icon: CheckCircle, status: "WAITING", task: "-", color: "text-teal-400", bg: "bg-teal-400/10" },
  { name: "Prediction Agent", purpose: "Generates predictions from optimal model.", icon: Target, status: "WAITING", task: "-", color: "text-cyan-400", bg: "bg-cyan-400/10" },
  { name: "Recommendation Agent", purpose: "Converts predictions into business actions.", icon: Lightbulb, status: "WAITING", task: "-", color: "text-amber-400", bg: "bg-amber-400/10" },
]

export default function AgentsPage() {
  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">AI Workforce</h1>
        <p className="text-slate-400">Meet the specialized agents powering AgentIQ.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {agents.map((a, i) => (
          <Card key={i} className="p-5 flex flex-col bg-black/40 backdrop-blur-xl border-white/5 hover:border-brand-light/30 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-lg ${a.bg} flex items-center justify-center ${a.color} group-hover:bg-white/10 transition-colors`}>
                <a.icon size={20} />
              </div>
              {a.status === "ACTIVE" && <Badge className="bg-brand-light/20 text-brand-light border-none animate-pulse">ACTIVE</Badge>}
              {a.status === "COMPLETED" && <Badge className="bg-emerald-500/10 text-emerald-400 border-none">DONE</Badge>}
              {a.status === "WAITING" && <Badge className="bg-slate-500/10 text-slate-400 border-none">WAITING</Badge>}
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{a.name}</h3>
            <p className="text-xs text-slate-400 mb-4 flex-1">{a.purpose}</p>
            <div className="pt-4 border-t border-white/5 mt-auto">
              <span className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">Current Task</span>
              <span className={`text-sm font-medium ${a.status === 'ACTIVE' ? 'text-white' : 'text-slate-400'}`}>{a.task}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
