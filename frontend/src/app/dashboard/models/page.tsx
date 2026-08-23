"use client"
import React from "react"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { BarChart3, Brain, CheckCircle2 } from "lucide-react"

export default function ModelsPage() {
  const models = [
    { name: "XGBoost", acc: "94%", pre: "91%", rec: "94%", f1: "92%", auc: "96%", time: "18 sec", status: "BEST" },
    { name: "Random Forest", acc: "91%", pre: "88%", rec: "90%", f1: "89%", auc: "93%", time: "24 sec", status: "" },
    { name: "LightGBM", acc: "92%", pre: "89%", rec: "91%", f1: "90%", auc: "94%", time: "12 sec", status: "" },
    { name: "Logistic Regression", acc: "84%", pre: "80%", rec: "84%", f1: "82%", auc: "87%", time: "4 sec", status: "" },
    { name: "SVM", acc: "83%", pre: "79%", rec: "81%", f1: "80%", auc: "85%", time: "45 sec", status: "" },
  ]

  return (
    <div className="space-y-6 pb-24 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Model Intelligence</h1>
        <p className="text-slate-400">AgentIQ evaluates top algorithms to select the most robust model for production.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <Card className="col-span-2 bg-black/40 backdrop-blur-xl border-white/5 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5 flex items-center gap-2">
            <BarChart3 size={16} className="text-slate-500" />
            <h3 className="text-sm font-bold text-slate-300 tracking-wider">LEADERBOARD</h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/[0.02] text-xs uppercase text-slate-400 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-medium">Model</th>
                  <th className="px-4 py-4 font-medium">Accuracy</th>
                  <th className="px-4 py-4 font-medium">Precision</th>
                  <th className="px-4 py-4 font-medium">Recall</th>
                  <th className="px-4 py-4 font-medium text-brand-light">F1 Score</th>
                  <th className="px-4 py-4 font-medium">AUC</th>
                  <th className="px-4 py-4 font-medium">Time</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {models.map(m => (
                  <tr key={m.name} className={`transition-colors ${m.status === 'BEST' ? 'bg-brand-dark/10' : 'hover:bg-white/[0.02]'}`}>
                    <td className={`px-6 py-4 font-medium ${m.status === 'BEST' ? 'text-white' : 'text-slate-300'}`}>{m.name}</td>
                    <td className="px-4 py-4">{m.acc}</td>
                    <td className="px-4 py-4">{m.pre}</td>
                    <td className="px-4 py-4">{m.rec}</td>
                    <td className={`px-4 py-4 font-bold ${m.status === 'BEST' ? 'text-emerald-400' : 'text-slate-200'}`}>{m.f1}</td>
                    <td className="px-4 py-4">{m.auc}</td>
                    <td className="px-4 py-4 text-xs text-slate-500 font-mono">{m.time}</td>
                    <td className="px-6 py-4">
                      {m.status === "BEST" && <Badge className="bg-brand-light text-background border-none gap-1"><CheckCircle2 size={12}/> BEST</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6 bg-brand-dark/5 backdrop-blur-xl border-brand-light/20 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-light/10 blur-[60px] rounded-full pointer-events-none" />
          <h3 className="text-sm font-bold text-brand-light tracking-wider mb-6 flex items-center gap-2 relative z-10">
            <Brain size={16} /> MODEL SELECTION REASONING
          </h3>
          
          <div className="mb-6 relative z-10">
            <div className="text-2xl font-black text-white mb-2 uppercase">XGBoost</div>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10">Selected for Production</Badge>
          </div>
          
          <div className="space-y-4 text-sm text-slate-300 leading-relaxed relative z-10 flex-1">
            <p>"XGBoost achieved the highest validation performance (92% F1) while maintaining an acceptable training time of 18 seconds."</p>
            <p>"While LightGBM was slightly faster (12s), XGBoost captured complex non-linear relationships in the generated features (specifically `customer_frequency`) slightly better, resulting in a 2% improvement in Recall."</p>
            <p>"Since the business objective prioritizes identifying churn (Recall), XGBoost is the mathematically superior choice."</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
