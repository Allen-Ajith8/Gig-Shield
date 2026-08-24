"use client"
import React, { useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { Search, Bell, Bot, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [panelOpen, setPanelOpen] = useState(false)

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--fg-base)' }}>
      {/* AMBIENT GLOWS FOR GLASSMORPHISM BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[150px]" style={{ backgroundColor: 'var(--bg-glow-1)' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[150px]" style={{ backgroundColor: 'var(--bg-glow-2)' }} />
        <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] rounded-full blur-[120px]" style={{ backgroundColor: 'var(--bg-glow-3)' }} />
      </div>

      <Sidebar />
      <div className="pl-64 relative z-10">
        {/* TOP STATUS & COMMAND BAR */}
        <div className="sticky top-0 z-40 glass border-b border-b-[var(--color-border)] px-8 py-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-brand-light" />
              </div>
              <input 
                type="text" 
                placeholder="Ask AgentIQ anything..." 
                className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-light focus:border-brand-light transition-all shadow-inner"
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-1 rounded">⌘K</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-light rounded-full shadow-[0_0_8px_rgba(45,212,191,0.8)]"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                US
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-xs font-medium border-t border-white/5 pt-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Dataset:</span>
              <span className="text-white">customer_churn_Q3.csv</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Pipeline:</span>
              <span className="text-brand-light flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-brand-light animate-pulse"></span> Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Agents:</span>
              <span className="text-white">5 Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Quality:</span>
              <span className="text-emerald-400">87%</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-slate-500">Last Updated:</span>
              <span className="text-slate-300 font-mono">21:07:42</span>
            </div>
          </div>
        </div>

        <main className="p-8">
          {children}
        </main>
      </div>

      {/* GLOBAL AGENT ACTIVITY PANEL */}
      <div className="fixed bottom-6 left-72 z-50">
        <AnimatePresence>
          {panelOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full mb-3 left-0 w-64 glass rounded-xl p-4 shadow-2xl"
            >
              <h4 className="text-xs font-bold text-slate-300 tracking-wider mb-3">AGENT ACTIVITY</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="font-semibold text-brand-light">MASTER AGENT</span><span className="text-slate-500">Active</span></div>
                  <div className="text-[10px] text-slate-400">Planning next step...</div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="font-semibold text-white">PROFILING AGENT</span><span className="text-emerald-400">Done</span></div>
                  <div className="text-[10px] text-slate-400">Completed</div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="font-semibold text-white">SYNTHETIC AGENT</span><span className="text-brand-light">Active</span></div>
                  <div className="text-[10px] text-slate-400">Generating records...</div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="font-semibold text-slate-400">ML AGENT</span><span className="text-slate-600">Waiting</span></div>
                  <div className="text-[10px] text-slate-500">Waiting for data</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setPanelOpen(!panelOpen)}
          className="flex items-center gap-2 glass px-4 py-2 rounded-full shadow-lg transition-colors text-sm font-medium"
        >
          <Bot size={16} className="text-brand-light" />
          <span className="text-white">5 agents active</span>
          <ChevronUp size={14} className={`text-slate-500 transition-transform ${panelOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  )
}
