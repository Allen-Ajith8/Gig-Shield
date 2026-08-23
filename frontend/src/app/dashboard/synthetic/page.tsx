"use client"
import React from "react"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Cpu, Database, CheckCircle2, SlidersHorizontal, Eye, Play } from "lucide-react"

export default function SyntheticDataPage() {
  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Synthetic Data Studio</h1>
          <p className="text-slate-400">Generate additional data when AgentIQ determines it is necessary.</p>
        </div>
        <Button className="bg-brand-dark/20 text-brand-light border border-brand-light/30 hover:bg-brand-dark/40 gap-2">
          <Play size={16} /> Generate New Batch
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />
          <h3 className="text-sm font-bold text-slate-300 tracking-wider mb-2 flex items-center gap-2 relative z-10">
            <Database size={16} className="text-slate-500" /> ORIGINAL DATASET
          </h3>
          <div className="text-3xl font-black text-white mb-2 relative z-10">125,000</div>
          <p className="text-xs text-slate-400 relative z-10">Real records</p>
        </Card>

        <Card className="p-6 bg-brand-dark/10 backdrop-blur-xl border-brand-light/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light/20 blur-[50px] rounded-full pointer-events-none" />
          <h3 className="text-sm font-bold text-brand-light tracking-wider mb-2 flex items-center gap-2 relative z-10">
            <Cpu size={16} /> SYNTHETIC DATASET
          </h3>
          <div className="text-3xl font-black text-white mb-2 relative z-10">25,000</div>
          <p className="text-xs text-brand-light/80 relative z-10">AI Generated records</p>
        </Card>

        <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/5 flex flex-col justify-center">
          <div className="text-sm text-slate-400 mb-1">Reason for Generation:</div>
          <div className="text-lg font-bold text-white mb-4">"Class imbalance detected (8% positive)"</div>
          <div className="flex gap-2">
            <Badge variant="outline" className="border-brand-light/30 text-brand-light bg-brand-light/10">SMOTE</Badge>
            <Badge variant="outline" className="border-white/10 text-slate-300">Target: churn=1</Badge>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 bg-black/40 backdrop-blur-xl border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-300 tracking-wider">VALIDATION METRICS</h3>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-none">PASSED</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 p-4 rounded-lg border border-white/5 text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-1">94%</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Distribution Sim</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/5 text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-1">92%</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Correlation Sim</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/5 text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-1">98%</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Privacy Score</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/5 text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-1">95%</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Quality Score</div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 border-white/10 text-slate-300 hover:text-white hover:bg-white/5 gap-2"><Eye size={16}/> Preview Data</Button>
            <Button variant="outline" className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10">Reject Batch</Button>
            <Button className="flex-1 bg-brand-light text-background hover:bg-brand-light/90 gap-2"><CheckCircle2 size={16}/> Use for Training</Button>
          </div>
        </Card>

        <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/5">
          <h3 className="text-sm font-bold text-slate-300 tracking-wider mb-6 flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-slate-500" /> CONTROLS
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Number of records</span>
                <span className="text-white font-mono">25,000</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-brand-light h-full w-[25%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Noise Level</span>
                <span className="text-white font-mono">Low (0.1)</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-brand-dark h-full w-[10%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Privacy Threshold</span>
                <span className="text-white font-mono">Strict</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[90%]" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
