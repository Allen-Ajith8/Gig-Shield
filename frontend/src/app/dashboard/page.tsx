"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { 
  Database, Activity, CheckCircle, Bot, AlertTriangle, GitCommit, ArrowRight, Cpu, Brain, FlaskConical, Target, MessageSquare, ArrowDown, Zap
} from "lucide-react"

// ---- DATA & CONSTANTS ----
const agents = [
  { name: "Master Agent", icon: Brain, status: "ACTIVE" },
  { name: "Profiling Agent", icon: Database, status: "ACTIVE" },
  { name: "Synthetic Data Agent", icon: Cpu, status: "ACTIVE" },
  { name: "ML Agent", icon: FlaskConical, status: "ACTIVE" },
  { name: "Validation Agent", icon: CheckCircle, status: "ACTIVE" },
]

const messages = [
  { time: "21:04", agent: "Profiling Agent", msg: "Class imbalance detected.", color: "text-blue-400" },
  { time: "21:05", agent: "Master Agent", msg: "Activating Synthetic Data Agent.", color: "text-brand-light" },
  { time: "21:06", agent: "Synthetic Data Agent", msg: "5,000 records generated.", color: "text-brand-dark" },
  { time: "21:07", agent: "Validation Agent", msg: "Distribution similarity: 94%.", color: "text-emerald-400" },
]

export default function DashboardOverview() {
  const [activeWorkflowNode, setActiveWorkflowNode] = useState(4) // ML Node
  
  return (
    <div className="space-y-6 pb-24">
      
      {/* ROW 1: Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <DatasetHealthCard />
        <ActiveAgentsCard />
        <ModelPerformanceCard />
        <PredictionOverviewCard />
      </div>

      {/* ROW 2: Central Visual & Workflow */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-5 h-[400px]">
          <AIWorkforceNetwork />
        </div>
        <div className="xl:col-span-7 flex flex-col gap-6">
          <DynamicWorkflowCard activeNode={activeWorkflowNode} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            <DynamicRoutingCard />
            <AgentCommunicationCard messages={messages} />
          </div>
        </div>
      </div>

      {/* ROW 3: Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SyntheticDataCard />
        <AIRecommendationCard />
        <VersionRollbackCard />
      </div>

      {/* FLOATING COPILOT BUTTON */}
      <CopilotButton />
    </div>
  )
}

/* =========================================================================
   COMPONENTS
   ========================================================================= */

function DatasetHealthCard() {
  return (
    <Card className="p-5 flex flex-col relative overflow-hidden bg-black/40 backdrop-blur-xl border-white/5 hover:border-brand-light/30 transition-colors">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light/10 blur-[50px] rounded-full pointer-events-none" />
      <div className="flex items-start justify-between mb-4 relative z-10">
        <h3 className="text-sm font-bold text-slate-300 tracking-wider">DATASET HEALTH</h3>
        <Database size={16} className="text-slate-500" />
      </div>
      
      <div className="flex items-center gap-6 mb-6 relative z-10">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
            <motion.circle 
              cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="283" strokeDashoffset="36.79" 
              className="text-brand-light drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" 
              initial={{ strokeDashoffset: 283 }} animate={{ strokeDashoffset: 36.79 }} transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute flex items-center justify-center inset-0">
            <span className="text-xl font-black text-white">87%</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
          <div><span className="text-slate-500 block">Rows</span><span className="font-semibold text-slate-200">125,000</span></div>
          <div><span className="text-slate-500 block">Columns</span><span className="font-semibold text-slate-200">42</span></div>
          <div><span className="text-slate-500 block">Missing</span><span className="font-semibold text-amber-400">2.4%</span></div>
          <div><span className="text-slate-500 block">Duplicates</span><span className="font-semibold text-emerald-400">1.1%</span></div>
          <div><span className="text-slate-500 block">Outliers</span><span className="font-semibold text-red-400">3.7%</span></div>
          <div><span className="text-slate-500 block">PII</span><span className="font-semibold text-brand-dark">4 cols</span></div>
        </div>
      </div>
      
      <button className="mt-auto text-xs font-semibold text-brand-light hover:text-white flex items-center gap-1 transition-colors relative z-10 w-fit">
        View Profile <ArrowRight size={14} />
      </button>
    </Card>
  )
}

function ActiveAgentsCard() {
  return (
    <Card className="p-5 flex flex-col bg-black/40 backdrop-blur-xl border-white/5 hover:border-brand-light/30 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-300 tracking-wider">ACTIVE AI WORKFORCE</h3>
        <Bot size={16} className="text-brand-light" />
      </div>
      <div className="text-2xl font-black text-white mb-4">5 <span className="text-sm font-medium text-slate-500">/ 9 Agents Active</span></div>
      
      <div className="space-y-2.5 flex-1">
        {agents.map((agent, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="relative flex h-2 w-2">
              <motion.span animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }} className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-light opacity-75"></motion.span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-light"></span>
            </div>
            <agent.icon size={14} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-300">{agent.name}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function ModelPerformanceCard() {
  return (
    <Card className="p-5 flex flex-col bg-black/40 backdrop-blur-xl border-white/5 hover:border-brand-dark/30 transition-colors relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-dark/10 blur-[50px] rounded-full pointer-events-none" />
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-300 tracking-wider">BEST MODEL</h3>
        <FlaskConical size={16} className="text-brand-dark" />
      </div>
      
      <div className="text-xl font-bold text-white mb-4">XGBoost</div>
      
      <div className="grid grid-cols-2 gap-4 flex-1 mb-4">
        <div className="bg-white/5 rounded-lg p-2 border border-white/5">
          <div className="text-xs text-slate-500 mb-1">F1 Score</div>
          <div className="text-lg font-bold text-emerald-400">92%</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2 border border-white/5">
          <div className="text-xs text-slate-500 mb-1">AUC</div>
          <div className="text-lg font-bold text-brand-light">96%</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2 border border-white/5">
          <div className="text-xs text-slate-500 mb-1">Precision</div>
          <div className="text-lg font-bold text-slate-200">91%</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2 border border-white/5">
          <div className="text-xs text-slate-500 mb-1">Recall</div>
          <div className="text-lg font-bold text-slate-200">94%</div>
        </div>
      </div>
      
      <button className="mt-auto text-xs font-semibold text-brand-dark hover:text-white flex items-center gap-1 transition-colors relative z-10 w-fit">
        View Experiments <ArrowRight size={14} />
      </button>
    </Card>
  )
}

function PredictionOverviewCard() {
  return (
    <Card className="p-5 flex flex-col bg-black/40 backdrop-blur-xl border-white/5 hover:border-amber-500/30 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-300 tracking-wider">PREDICTION INSIGHTS</h3>
        <Target size={16} className="text-amber-500" />
      </div>
      
      <div className="space-y-3 mb-6">
        <div>
          <div className="flex justify-between text-xs mb-1"><span className="text-red-400 font-semibold">HIGH RISK</span><span className="text-slate-300 font-bold">1,284</span></div>
          <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-red-500 h-1.5 rounded-full" style={{ width: '15%' }}></div></div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1"><span className="text-amber-400 font-semibold">MEDIUM RISK</span><span className="text-slate-300 font-bold">4,321</span></div>
          <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '35%' }}></div></div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1"><span className="text-emerald-400 font-semibold">LOW RISK</span><span className="text-slate-300 font-bold">18,920</span></div>
          <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '80%' }}></div></div>
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="text-xs text-slate-500 mb-2 font-medium">Top prediction drivers:</div>
        <ul className="text-xs text-slate-300 space-y-1">
          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-brand-light rounded-full" /> Low engagement</li>
          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-brand-light rounded-full" /> Reduced purchases</li>
          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-brand-light rounded-full" /> Customer complaints</li>
        </ul>
      </div>
    </Card>
  )
}

function DynamicWorkflowCard({ activeNode }: { activeNode: number }) {
  const nodes = ["PROFILE", "CLEAN", "FEATURE", "SYNTHETIC DATA", "ML", "VALIDATE"]
  
  return (
    <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/5 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-light/30 to-transparent" />
      <h3 className="text-sm font-bold text-slate-300 tracking-wider mb-8">LIVE AGENT WORKFLOW</h3>
      
      <div className="flex items-center justify-between relative mt-4 mb-2">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 z-0">
          <motion.div 
            className="h-full bg-gradient-brand shadow-[0_0_10px_rgba(45,212,191,0.5)]" 
            initial={{ width: '0%' }}
            animate={{ width: `${(activeNode / (nodes.length - 1)) * 100}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </div>
        
        {/* Nodes */}
        {nodes.map((node, i) => {
          const isActive = i === activeNode
          const isPast = i < activeNode
          return (
            <div key={node} className="relative z-10 flex flex-col items-center gap-3">
              <motion.div 
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  isActive ? 'bg-brand-light border-brand-light shadow-[0_0_15px_rgba(45,212,191,0.8)]' : 
                  isPast ? 'bg-brand-dark border-brand-dark' : 'bg-[#09090b] border-white/20'
                }`}
                animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                transition={isActive ? { duration: 2, repeat: Infinity } : {}}
              >
                {isPast && <CheckCircle2 size={10} className="text-[#09090b]" />}
                {isActive && <div className="w-1.5 h-1.5 bg-background rounded-full" />}
              </motion.div>
              <div className={`text-[10px] font-bold tracking-wider ${isActive ? 'text-brand-light' : isPast ? 'text-slate-300' : 'text-slate-600'}`}>
                {node}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function CheckCircle2(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>
}

function AgentCommunicationCard({ messages }: { messages: any[] }) {
  return (
    <Card className="p-5 flex flex-col bg-black/40 backdrop-blur-xl border-white/5 h-[300px]">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-300 tracking-wider">AGENT-TO-AGENT COMMUNICATION</h3>
        <MessageSquare size={16} className="text-slate-500" />
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10 pointer-events-none" />
        <div className="space-y-4 pt-2">
          {messages.map((m, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: i * 0.2 }}
              className="flex gap-3 text-sm"
            >
              <div className="text-xs text-slate-500 mt-0.5 w-10 shrink-0">{m.time}</div>
              <div>
                <span className={`font-semibold ${m.color} mr-2`}>{m.agent}:</span>
                <span className="text-slate-300">{m.msg}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function DynamicRoutingCard() {
  return (
    <Card className="p-5 flex flex-col bg-black/40 backdrop-blur-xl border-white/5 h-[300px] overflow-hidden">
      <h3 className="text-sm font-bold text-slate-300 tracking-wider mb-4">DYNAMIC ROUTING</h3>
      <div className="flex-1 flex flex-col justify-center space-y-4">
        
        {/* Step 1 */}
        <div className="flex flex-col items-center">
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-1.5 rounded-full flex items-center gap-2 mb-2">
            <AlertTriangle size={12} /> Class imbalance detected
          </div>
          <ArrowDown size={14} className="text-slate-600 mb-2" />
          <div className="bg-white/5 border border-white/10 text-slate-200 text-xs font-semibold px-4 py-2 rounded-lg flex items-center justify-between w-full max-w-[220px]">
            Synthetic Data Agent <Badge variant="default" className="bg-brand-light/20 text-brand-light hover:bg-brand-light/30 border-none text-[10px]">ACTIVATED</Badge>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center opacity-50">
          <ArrowDown size={14} className="text-slate-600 my-2" />
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1.5 rounded-full flex items-center gap-2 mb-2">
            <CheckCircle2 size={12} /> No missing values
          </div>
          <ArrowDown size={14} className="text-slate-600 mb-2" />
          <div className="bg-white/5 border border-white/10 text-slate-400 text-xs font-semibold px-4 py-2 rounded-lg flex items-center justify-between w-full max-w-[220px]">
            Imputation Agent <Badge variant="outline" className="text-slate-500 border-slate-700 text-[10px]">SKIPPED</Badge>
          </div>
        </div>

      </div>
    </Card>
  )
}

function SyntheticDataCard() {
  return (
    <Card className="p-5 flex flex-col bg-black/40 backdrop-blur-xl border-white/5">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-300 tracking-wider">SYNTHETIC DATA</h3>
        <Cpu size={16} className="text-brand-dark" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-xs text-slate-500 mb-1">Original</div>
          <div className="text-lg font-bold text-white">125K</div>
        </div>
        <div>
          <div className="text-xs text-brand-light mb-1">Synthetic</div>
          <div className="text-lg font-bold text-brand-light">+25K</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Purpose</div>
          <div className="text-sm font-medium text-slate-300">Class balancing</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Status</div>
          <Badge variant="success" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">VALIDATED</Badge>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3">
        <Button variant="outline" className="w-full text-xs border-white/10 text-slate-300 hover:bg-white/5">Compare</Button>
        <Button className="w-full text-xs bg-brand-dark/20 text-brand-light border border-brand-light/30 hover:bg-brand-dark/40">Use for Training</Button>
      </div>
    </Card>
  )
}

function AIRecommendationCard() {
  return (
    <Card className="p-5 flex flex-col bg-gradient-to-br from-brand-dark/10 to-transparent border-brand-dark/30 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light/5 blur-[40px] rounded-full pointer-events-none" />
      <div className="flex items-start justify-between mb-4 relative z-10">
        <h3 className="text-sm font-bold text-brand-light tracking-wider flex items-center gap-2"><Zap size={16} /> AI RECOMMENDATION</h3>
      </div>
      
      <div className="text-lg font-bold text-white leading-snug mb-3 relative z-10">
        "1,284 customers show high churn probability."
      </div>
      <p className="text-sm text-slate-400 mb-4 relative z-10">
        Consider targeted retention campaigns for high-risk customers.
      </p>
      
      <div className="flex items-center gap-2 mb-6 relative z-10">
        <span className="text-xs text-slate-500">Confidence:</span>
        <Badge variant="default" className="bg-brand-dark text-white border-none hover:bg-brand-dark">89%</Badge>
      </div>

      <button className="mt-auto text-xs font-semibold text-brand-light hover:text-white flex items-center gap-1 transition-colors relative z-10 w-fit">
        View Explanation <ArrowRight size={14} />
      </button>
    </Card>
  )
}

function VersionRollbackCard() {
  return (
    <Card className="p-5 flex flex-col bg-black/40 backdrop-blur-xl border-white/5">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-300 tracking-wider">DATASET VERSION</h3>
        <GitCommit size={16} className="text-slate-500" />
      </div>
      
      <div className="space-y-1 mb-6 flex-1 text-sm font-medium">
        <div className="flex items-center gap-3 text-slate-500"><div className="w-2 h-2 rounded-full border border-slate-500" /> v1 Original</div>
        <div className="pl-1 h-3 border-l border-slate-700 ml-1"></div>
        <div className="flex items-center gap-3 text-slate-400"><div className="w-2 h-2 rounded-full border border-slate-400" /> v2 Cleaning</div>
        <div className="pl-1 h-3 border-l border-slate-700 ml-1"></div>
        <div className="flex items-center gap-3 text-slate-300"><div className="w-2 h-2 rounded-full border border-slate-300" /> v3 Features</div>
        <div className="pl-1 h-3 border-l border-slate-700 ml-1"></div>
        <div className="flex items-center gap-3 text-brand-light"><div className="w-2 h-2 rounded-full bg-brand-light shadow-[0_0_8px_rgba(45,212,191,0.5)]" /> v4 Current</div>
      </div>
      
      <div className="mt-auto grid grid-cols-2 gap-3">
        <Button variant="outline" className="w-full text-xs border-white/10 text-slate-300 hover:bg-white/5">Compare</Button>
        <Button variant="outline" className="w-full text-xs border-red-500/20 text-red-400 hover:bg-red-500/10">Rollback</Button>
      </div>
    </Card>
  )
}

/* =========================================================================
   CENTRAL AI WORKFORCE VISUAL
   ========================================================================= */
function AIWorkforceNetwork() {
  const nodes = [
    { name: "Profiling", x: -120, y: -90, color: "bg-blue-400" },
    { name: "Dictionary", x: 120, y: -90, color: "bg-indigo-400" },
    { name: "Cleaning", x: -140, y: 0, color: "bg-emerald-400" },
    { name: "Synthetic", x: 140, y: 0, color: "bg-brand-dark" },
    { name: "Feature", x: -120, y: 90, color: "bg-fuchsia-400" },
    { name: "Validation", x: 120, y: 90, color: "bg-teal-400" },
    { name: "ML", x: 0, y: -130, color: "bg-amber-400" },
    { name: "Prediction", x: 0, y: 130, color: "bg-orange-400" },
  ]

  return (
    <Card className="w-full h-full p-0 flex items-center justify-center bg-[#09090b]/80 border-white/5 backdrop-blur-xl relative overflow-hidden group">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
      
      <div className="relative z-10 flex items-center justify-center">
        {/* Connection Lines (Static for visual) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ left: '50%', top: '50%', overflow: 'visible' }}>
          {nodes.map((n, i) => (
            <motion.line 
              key={i} 
              x1="0" y1="0" x2={n.x} y2={n.y} 
              stroke="rgba(255,255,255,0.05)" 
              strokeWidth="1"
            />
          ))}
          {/* Animated particles */}
          {nodes.map((n, i) => (
            <motion.circle
              key={`p-${i}`}
              r="2"
              fill="currentColor"
              className={n.color.replace('bg-', 'text-')}
              initial={{ cx: 0, cy: 0, opacity: 0 }}
              animate={{ cx: [0, n.x], cy: [0, n.y], opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
            />
          ))}
        </svg>

        {/* Outer Nodes */}
        {nodes.map((n, i) => (
          <motion.div 
            key={n.name}
            className="absolute flex flex-col items-center gap-2"
            style={{ x: n.x, y: n.y }}
            animate={{ y: [n.y - 5, n.y + 5, n.y - 5] }}
            transition={{ duration: 4 + (i%3), repeat: Infinity, ease: "easeInOut" }}
          >
            <div className={`w-3 h-3 rounded-full ${n.color} shadow-[0_0_10px_currentColor]`} />
            <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase bg-[#09090b]/80 px-1 rounded">{n.name}</span>
          </motion.div>
        ))}

        {/* Center Master Node */}
        <div className="relative flex flex-col items-center justify-center w-32 h-32">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-brand-light rounded-full blur-2xl"
          />
          <div className="relative z-10 flex flex-col items-center justify-center w-20 h-20 bg-background border border-brand-light/30 rounded-full shadow-[0_0_30px_rgba(45,212,191,0.2)] backdrop-blur-md">
            <Brain className="text-brand-light mb-1" size={24} />
            <span className="text-[8px] font-black tracking-widest text-white uppercase text-center leading-tight">MASTER<br/>AGENT</span>
          </div>
        </div>

      </div>
    </Card>
  )
}

/* =========================================================================
   AI COPILOT FLOATING BUTTON
   ========================================================================= */
function CopilotButton() {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 bg-gradient-brand text-white px-5 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(45,212,191,0.4)] border border-white/20 hover:border-white/40 transition-colors"
      >
        <Bot size={20} />
        AgentIQ Copilot
      </motion.button>
    </div>
  )
}
