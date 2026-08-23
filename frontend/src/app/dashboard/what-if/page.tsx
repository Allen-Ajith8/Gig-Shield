"use client"
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { SplitSquareHorizontal, ArrowRight, Brain, SlidersHorizontal, Activity } from "lucide-react"

export default function WhatIfSimulator() {
  const [simulating, setSimulating] = useState(false)
  const [pred, setPred] = useState(82)

  const handleSimulate = () => {
    setSimulating(true)
    setTimeout(() => {
      setPred(61)
      setSimulating(false)
    }, 1500)
  }

  return (
    <div className="space-y-6 pb-24 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">What-If Intelligence</h1>
        <p className="text-slate-400">Explore how changing input conditions affects model predictions in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/5 flex flex-col h-full">
            <h3 className="text-sm font-bold text-slate-300 tracking-wider mb-6 flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-brand-light" /> SCENARIO CONTROLS
            </h3>
            
            <div className="space-y-8 flex-1">
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-slate-300 font-medium">Monthly Usage (hours)</span>
                  <span className="text-brand-light font-mono bg-brand-light/10 px-2 py-0.5 rounded">120</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full relative">
                  <div className="absolute left-[30%] w-[30%] h-full bg-brand-light/30 rounded-full" />
                  <div className="absolute left-[60%] w-3 h-4 -top-1 bg-brand-light rounded-sm cursor-pointer shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
                  <span>0</span><span>Original: 60</span><span>200</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-slate-300 font-medium">Support Tickets</span>
                  <span className="text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">2</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full relative">
                  <div className="absolute left-[20%] w-[20%] h-full bg-emerald-400/30 rounded-full" />
                  <div className="absolute left-[20%] w-3 h-4 -top-1 bg-emerald-400 rounded-sm cursor-pointer" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
                  <span>0</span><span>Original: 4</span><span>10</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-slate-300 font-medium">Purchase Frequency</span>
                  <div className="flex bg-white/5 rounded-lg p-1">
                    <button className="px-3 py-1 text-xs text-slate-400 rounded-md">Low</button>
                    <button className="px-3 py-1 text-xs bg-brand-dark/20 text-brand-light font-bold rounded-md">High</button>
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={handleSimulate} disabled={simulating} className="w-full bg-brand-light text-background font-bold hover:bg-brand-light/90">
              {simulating ? "Simulating..." : "Run Simulation"}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/5 flex flex-col justify-center items-center">
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Original Prediction</div>
              <div className="text-4xl font-black text-slate-400">82%</div>
              <Badge className="mt-2 bg-red-500/10 text-red-400 border-none">HIGH RISK</Badge>
            </Card>
            <div className="flex items-center justify-center">
              <ArrowRight size={32} className="text-white/10" />
            </div>
            <Card className="p-6 bg-brand-dark/10 backdrop-blur-xl border-brand-light/30 flex flex-col justify-center items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-brand-light/5 to-transparent pointer-events-none" />
              <div className="text-xs text-brand-light uppercase tracking-widest mb-2 relative z-10">New Prediction</div>
              <div className="flex items-end gap-2 relative z-10">
                <div className="text-5xl font-black text-white">{pred}%</div>
                <div className="text-sm font-bold text-emerald-400 mb-1 flex items-center">↓ 21%</div>
              </div>
              <Badge className="mt-2 bg-amber-500/10 text-amber-400 border-none relative z-10">MEDIUM RISK</Badge>
            </Card>
          </div>

          <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/5 flex-1 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-dark/10 blur-[80px] rounded-full pointer-events-none" />
            <h3 className="text-sm font-bold text-slate-300 tracking-wider mb-6 flex items-center gap-2 relative z-10">
              <Activity size={16} className="text-brand-dark" /> FACTORS RESPONSIBLE FOR CHANGE
            </h3>

            <div className="flex-1 flex flex-col justify-center relative z-10 space-y-6 max-w-2xl mx-auto w-full">
              {simulating ? (
                <div className="flex flex-col items-center justify-center text-brand-light animate-pulse">
                  <Brain size={48} className="mb-4" />
                  <p className="font-mono text-sm uppercase tracking-widest">Recalculating Pathways...</p>
                </div>
              ) : (
                <AnimatePresence>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-emerald-400 font-semibold flex items-center gap-2">Monthly Usage <span className="text-xs text-slate-500 font-mono">(60 → 120)</span></span>
                        <span className="text-emerald-400 font-mono">-14% risk</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full"><div className="bg-emerald-400 h-full w-[60%]" /></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-emerald-400 font-semibold flex items-center gap-2">Support Tickets <span className="text-xs text-slate-500 font-mono">(4 → 2)</span></span>
                        <span className="text-emerald-400 font-mono">-9% risk</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full"><div className="bg-emerald-400 h-full w-[40%]" /></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-red-400 font-semibold flex items-center gap-2">Purchase Freq <span className="text-xs text-slate-500 font-mono">(Low → High)</span></span>
                        <span className="text-red-400 font-mono">+2% risk</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full"><div className="bg-red-400 h-full w-[10%]" /></div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
