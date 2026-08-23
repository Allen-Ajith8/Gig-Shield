"use client"
import React, { useState } from "react"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Bot, Send, Zap, Sparkles, Brain } from "lucide-react"

export default function CopilotPage() {
  const [msg, setMsg] = useState("")

  const suggestions = [
    "Why was Synthetic Data Agent activated?",
    "Why was XGBoost selected over Random Forest?",
    "What changed between Dataset V2 and V5?",
    "Explain prediction for Customer #1024.",
  ]

  return (
    <div className="pb-24 h-[calc(100vh-2rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">AgentIQ Copilot</h1>
        <p className="text-slate-400">Your conversational interface to the autonomous data intelligence platform.</p>
      </div>

      <Card className="flex-1 bg-black/40 backdrop-blur-xl border-white/5 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light/5 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
          
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-brand-light/20 border border-brand-light/50 flex items-center justify-center shrink-0 text-brand-light">
              <Bot size={18} />
            </div>
            <div className="flex flex-col gap-2 max-w-2xl">
              <div className="bg-white/5 p-4 rounded-2xl rounded-tl-sm border border-white/10 text-slate-200 text-sm leading-relaxed">
                Hello! I'm your AgentIQ Copilot. I have full context of your dataset, the agents' activities, pipeline history, and model predictions. What would you like to know?
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {suggestions.map(s => (
                  <Badge key={s} variant="outline" className="bg-brand-dark/10 border-brand-light/20 text-brand-light hover:bg-brand-dark/30 cursor-pointer text-xs py-1.5 px-3">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-white font-bold text-xs">
              ME
            </div>
            <div className="bg-brand-light text-background p-4 rounded-2xl rounded-tr-sm text-sm leading-relaxed max-w-2xl font-medium">
              Why did you activate Synthetic Data Agent?
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-brand-light/20 border border-brand-light/50 flex items-center justify-center shrink-0 text-brand-light">
              <Bot size={18} />
            </div>
            <div className="flex flex-col gap-2 max-w-2xl w-full">
              <div className="bg-white/5 p-4 rounded-2xl rounded-tl-sm border border-white/10 text-slate-200 text-sm leading-relaxed space-y-4">
                <p><strong>Profiling Agent</strong> detected an 8% minority class in your target variable (`churn`). Because this level of imbalance typically degrades recall in classification models, the <strong>Master Agent</strong> automatically activated the <strong>Synthetic Data Agent</strong> to improve class balance.</p>
                
                <div className="bg-black/50 p-3 rounded-lg border border-white/5 font-mono text-xs">
                  <div className="text-brand-light flex items-center gap-2 mb-2"><Brain size={12}/> Agent Evidence</div>
                  <div className="text-slate-400">Dataset Version: <span className="text-white">V3</span></div>
                  <div className="text-slate-400">Action: <span className="text-emerald-400">SMOTE Generation (N=25,000)</span></div>
                  <div className="text-slate-400">New Distribution: <span className="text-white">42% positive class</span></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="p-4 bg-black/60 border-t border-white/5 relative z-10">
          <div className="relative">
            <input 
              type="text" 
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Ask AgentIQ about models, agents, or data..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-4 text-sm text-white focus:outline-none focus:border-brand-light transition-colors shadow-inner" 
            />
            <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-light text-background hover:bg-brand-light/80 rounded-lg h-9 w-9">
              <Send size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
