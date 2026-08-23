"use client"
import React from "react"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { FlaskConical, CheckCircle2, Clock, Brain, Activity } from "lucide-react"

export default function ExperimentsPage() {
  const experiments = [
    { id: "Exp 05", name: "Optimized Pipeline", model: "XGBoost", feats: "42 + 17 generated", pre: "SMOTE + Scaled", f1: "92%", auc: "96%", time: "18s", isBest: true },
    { id: "Exp 04", name: "Synthetic + Feature Eng", model: "Random Forest", feats: "42 + 17 generated", pre: "SMOTE", f1: "89%", auc: "93%", time: "24s", isBest: false },
    { id: "Exp 03", name: "Class Balancing", model: "XGBoost", feats: "42 original", pre: "SMOTE", f1: "86%", auc: "90%", time: "15s", isBest: false },
    { id: "Exp 02", name: "Feature Engineering", model: "Logistic Reg", feats: "42 + 17 generated", pre: "Scaled", f1: "82%", auc: "86%", time: "4s", isBest: false },
    { id: "Exp 01", name: "Baseline", model: "Logistic Reg", feats: "42 original", pre: "None", f1: "76%", auc: "80%", time: "2s", isBest: false },
  ]

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Autonomous ML Experiments</h1>
        <p className="text-slate-400">AgentIQ automatically evaluates multiple strategies to find the optimal pipeline.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {experiments.map(e => (
            <Card key={e.id} className={`p-5 flex flex-col md:flex-row md:items-center gap-6 bg-black/40 backdrop-blur-xl ${e.isBest ? 'border-brand-light shadow-[0_0_20px_rgba(45,212,191,0.1)]' : 'border-white/5'} transition-all`}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className={e.isBest ? 'border-brand-light text-brand-light' : 'border-white/10 text-slate-400'}>{e.id}</Badge>
                  <h3 className="text-lg font-bold text-white">{e.name}</h3>
                  {e.isBest && <Badge className="bg-brand-light text-background border-none ml-auto md:ml-0"><CheckCircle2 size={12} className="mr-1"/> BEST</Badge>}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-sm mt-4">
                  <div><span className="block text-[10px] uppercase text-slate-500">Model</span><span className="text-slate-300 font-medium">{e.model}</span></div>
                  <div><span className="block text-[10px] uppercase text-slate-500">Features</span><span className="text-slate-300 font-medium">{e.feats}</span></div>
                  <div><span className="block text-[10px] uppercase text-slate-500">Preprocessing</span><span className="text-slate-300 font-medium">{e.pre}</span></div>
                </div>
              </div>
              
              <div className="flex flex-row md:flex-col gap-4 md:border-l md:border-white/10 md:pl-6 justify-between md:justify-center shrink-0">
                <div className="text-center">
                  <div className={`text-2xl font-black ${e.isBest ? 'text-emerald-400' : 'text-slate-300'}`}>{e.f1}</div>
                  <div className="text-[10px] uppercase text-slate-500">F1 Score</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${e.isBest ? 'text-brand-light' : 'text-slate-400'}`}>{e.auc}</div>
                  <div className="text-[10px] uppercase text-slate-500">AUC</div>
                </div>
                <div className="text-center flex items-center justify-center gap-1 text-slate-500">
                  <Clock size={12} /> <span className="text-xs">{e.time}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-brand-dark/10 backdrop-blur-xl border-brand-light/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light/20 blur-[50px] rounded-full pointer-events-none" />
            <h3 className="text-sm font-bold text-brand-light tracking-wider mb-6 flex items-center gap-2 relative z-10">
              <Brain size={16} /> AI EXPERIMENT INSIGHT
            </h3>
            
            <div className="text-xl font-bold text-white mb-4 relative z-10">Why Exp 05 won:</div>
            
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed relative z-10">
              <p>"Exp 05 combined Synthetic Data (SMOTE) to solve the 8% class imbalance, and applied the 17 new features engineered by the Feature Agent."</p>
              <p>"XGBoost was able to utilize the non-linear generated features much better than Logistic Regression (Exp 02), achieving a massive 16% jump in F1 score over the baseline while keeping training time under 20 seconds."</p>
            </div>
          </Card>

          <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/5 flex flex-col items-center justify-center h-48">
            <Activity size={32} className="text-slate-600 mb-4" />
            <span className="text-slate-500 text-sm font-medium uppercase tracking-widest text-center">Learning Curve<br/>Visualization</span>
          </Card>
        </div>
      </div>
    </div>
  )
}
