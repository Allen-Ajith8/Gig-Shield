"use client"
import React, { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Brain, Search, BookType, Sparkles, Cpu, FlaskConical, Activity, CheckCircle, Target, ArrowRight } from "lucide-react"

const stages = ["OBSERVE", "PLAN", "ACT", "COMMUNICATE", "VERIFY", "REPLAN"]

export default function WorkflowPage() {
  const [selectedAgent, setSelectedAgent] = useState("Master")

  return (
    <div className="space-y-6 pb-24 h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Autonomous Agent Workflow</h1>
        <p className="text-slate-400">Live visualization of your AI workforce in action.</p>
      </div>

      <div className="flex gap-4 mb-4">
        {stages.map((s, i) => (
          <div key={s} className="flex items-center gap-4">
            <span className={`text-[10px] font-bold tracking-widest ${i === 2 ? 'text-brand-light' : 'text-slate-600'}`}>{s}</span>
            {i < stages.length - 1 && <ArrowRight size={12} className="text-slate-700" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <Card className="col-span-2 p-0 bg-[#09090b]/80 border-white/5 backdrop-blur-xl relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            {/* Master Node */}
            <div className="absolute left-1/4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 cursor-pointer" onClick={() => setSelectedAgent("Master")}>
               <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-24 h-24 rounded-full bg-brand-light/20 border-2 border-brand-light flex items-center justify-center text-brand-light shadow-[0_0_30px_rgba(45,212,191,0.3)]">
                  <Brain size={32} />
               </motion.div>
               <span className="text-xs font-bold text-white tracking-widest">MASTER</span>
            </div>

            {/* Connecting line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <path d="M 30% 50% L 60% 30%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
              <path d="M 30% 50% L 60% 50%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
              <path d="M 30% 50% L 60% 70%" stroke="rgba(45,212,191,0.5)" strokeWidth="2" fill="none" strokeDasharray="5,5" className="animate-[dash_1s_linear_infinite]" />
            </svg>

            {/* Sub Nodes */}
            <div className="absolute left-[60%] top-[30%] -translate-y-1/2 flex items-center gap-3 cursor-pointer" onClick={() => setSelectedAgent("Profiling")}>
               <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-blue-400"><Search size={20} /></div>
               <span className="text-xs font-bold text-slate-300">PROFILING</span>
            </div>
            
            <div className="absolute left-[60%] top-[50%] -translate-y-1/2 flex items-center gap-3 cursor-pointer" onClick={() => setSelectedAgent("Synthetic")}>
               <div className="w-12 h-12 rounded-full bg-brand-dark/20 border border-brand-dark flex items-center justify-center text-brand-dark"><Cpu size={20} /></div>
               <span className="text-xs font-bold text-slate-300">SYNTHETIC DATA</span>
            </div>

            <div className="absolute left-[60%] top-[70%] -translate-y-1/2 flex items-center gap-3 cursor-pointer" onClick={() => setSelectedAgent("ML")}>
               <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                  <FlaskConical size={20} />
               </motion.div>
               <span className="text-xs font-bold text-white">ML AGENT</span>
               <Badge className="ml-2 bg-emerald-500/20 text-emerald-400 border-none animate-pulse">ACTIVE</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-brand-dark/5 backdrop-blur-xl border-brand-light/20 flex flex-col h-full overflow-y-auto">
          <h3 className="text-sm font-bold text-brand-light tracking-wider mb-6">AGENT DETAILS</h3>
          
          <div className="text-2xl font-bold text-white mb-6 uppercase">{selectedAgent} AGENT</div>
          
          <div className="space-y-6">
            <div>
              <span className="block text-xs text-slate-500 mb-1 uppercase">Current Task</span>
              <p className="text-sm font-medium text-slate-200">
                {selectedAgent === "ML" ? "Training XGBoost classifier on generated features." : "Waiting for dependencies."}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="block text-[10px] text-slate-500 mb-1 uppercase">Input</span>
                <span className="text-xs text-slate-300 font-mono">Dataset V4</span>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="block text-[10px] text-slate-500 mb-1 uppercase">Output</span>
                <span className="text-xs text-brand-light font-mono">Model Pipeline</span>
              </div>
            </div>

            <div>
              <span className="block text-xs text-slate-500 mb-1 uppercase">Decision Log</span>
              <div className="bg-black/40 p-3 rounded-lg text-xs font-mono text-slate-400 space-y-2 border border-white/5">
                <p>{"{"}</p>
                <p className="pl-4">"reason": "Class imbalance resolved by Synthetic Agent",</p>
                <p className="pl-4">"action": "Proceeding with standard classification models",</p>
                <p className="pl-4">"confidence": 0.94</p>
                <p>{"}"}</p>
              </div>
            </div>
            
            <div>
              <span className="block text-xs text-slate-500 mb-2 uppercase">Dependencies</span>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10">Synthetic Data</Badge>
                <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10">Feature Eng</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
