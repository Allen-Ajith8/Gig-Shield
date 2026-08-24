"use client"
import React, { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Sparkles, Brain, Check, X, Eye } from "lucide-react"
import { api } from "@/lib/api"

export default function FeaturesPage() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const [features, setFeatures] = useState<any[]>([])

  useEffect(() => {
    api.getFeatures().then(res => {
      setFeatures(res.suggested_features)
      if (res.suggested_features.length > 0) {
        setSelectedFeature(res.suggested_features[0].name)
      }
    }).catch(console.error)
  }, [])

  return (
    <div className="space-y-6 pb-24 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Autonomous Feature Engineering</h1>
          <p className="text-slate-400">AgentIQ creates and evaluates new features to improve model performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/5 text-center">
          <div className="text-4xl font-black text-slate-300 mb-2">42</div>
          <div className="text-xs text-slate-500 uppercase tracking-widest">Original Features</div>
        </Card>
        <Card className="p-6 bg-brand-dark/10 backdrop-blur-xl border-brand-light/30 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light/20 blur-[50px] rounded-full pointer-events-none" />
          <div className="text-4xl font-black text-brand-light mb-2 relative z-10">+17</div>
          <div className="text-xs text-brand-light/80 uppercase tracking-widest relative z-10">Generated Features</div>
        </Card>
        <Card className="p-6 bg-red-500/5 backdrop-blur-xl border-white/5 text-center">
          <div className="text-4xl font-black text-red-400 mb-2">-5</div>
          <div className="text-xs text-slate-500 uppercase tracking-widest">Removed Features</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <Card className="col-span-2 bg-black/40 backdrop-blur-xl border-white/5 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/[0.02] text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-medium">Feature</th>
                  <th className="px-6 py-3 font-medium">Source / Transformation</th>
                  <th className="px-6 py-3 font-medium">Importance</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {features.map(f => (
                  <tr key={f.name} onClick={() => setSelectedFeature(f.name)} className={`cursor-pointer transition-colors ${selectedFeature === f.name ? 'bg-brand-dark/10 border-l-2 border-brand-light' : 'hover:bg-white/[0.02]'}`}>
                    <td className="px-6 py-4 font-medium text-white">{f.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{f.formula}</td>
                    <td className="px-6 py-4">
                      {f.impact === "High" ? <span className="text-emerald-400 font-semibold">High</span> : 
                       f.impact === "Medium" ? <span className="text-amber-400 font-semibold">Medium</span> : 
                       <span className="text-slate-500">Low</span>}
                    </td>
                    <td className="px-6 py-4">
                      {f.status === "Accepted" ? <Badge className="bg-emerald-500/10 text-emerald-400 border-none">Accepted</Badge> : 
                       <Badge variant="outline" className="text-slate-500 border-slate-700">Removed</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6 bg-brand-dark/5 backdrop-blur-xl border-brand-light/20 flex flex-col relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-light/10 blur-[50px] rounded-full pointer-events-none" />
          <h3 className="text-sm font-bold text-brand-light tracking-wider mb-6 flex items-center gap-2 relative z-10">
            <Brain size={16} /> AI EXPLANATION
          </h3>
          
          <div className="mb-6 relative z-10">
            <div className="text-xs text-slate-500 mb-1 uppercase">Why was this feature created?</div>
            <div className="text-xl font-bold text-white mb-2">{selectedFeature}</div>
          </div>
          
          <div className="bg-black/40 p-4 rounded-lg border border-white/5 text-sm text-slate-300 leading-relaxed relative z-10 mb-6">
            "By dividing the total purchase count by the customer's age, this feature creates a normalized purchasing frequency metric. Early models indicated that raw purchase count was heavily biased by older accounts. This new feature increases model F1 score by 2.4%."
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
              <span className="block text-[10px] text-slate-500 mb-1 uppercase">Correlation w/ Target</span>
              <span className="text-lg font-bold text-emerald-400">0.68</span>
            </div>
            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
              <span className="block text-[10px] text-slate-500 mb-1 uppercase">Information Gain</span>
              <span className="text-lg font-bold text-brand-light">0.42</span>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3 relative z-10">
            <Button variant="outline" className="w-full border-white/10 text-slate-300 hover:text-white hover:bg-white/5 gap-2"><Eye size={16}/> Preview Transformation</Button>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 gap-2"><X size={16}/> Reject</Button>
              <Button className="flex-1 bg-brand-light text-background hover:bg-brand-light/90 gap-2"><Check size={16}/> Accept</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
