"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { 
  Database, Activity, CheckCircle, Bot, AlertTriangle, GitCommit, ArrowRight, Cpu, Brain, FlaskConical, Target, MessageSquare, ArrowDown, Zap, Search, BookType, Workflow, ListChecks, ShieldAlert, Sparkles, Clock, Check
} from "lucide-react"

import { api, agentWebSocket } from "@/lib/api"

export default function DashboardOverview() {
  const [stats, setStats] = useState<any>(null)
  const [agentMessages, setAgentMessages] = useState<any[]>([])

  useEffect(() => {
    api.getStats().then(setStats).catch(console.error)
    agentWebSocket.connect()
    
    const unsubscribe = agentWebSocket.subscribe((data) => {
      if (data.type === 'agent_log') {
        setAgentMessages(prev => {
          const newMsgs = [data, ...prev]
          if (newMsgs.length > 5) return newMsgs.slice(0, 5)
          return newMsgs
        })
      }
    })
    
    return () => unsubscribe()
  }, [])
  
  if (!stats) {
    return <div className="flex h-full items-center justify-center pt-32 text-slate-500">Loading Intelligence...</div>
  }

  return (
    <div className="space-y-6 pb-24 max-w-[1600px] mx-auto">
      
      {/* 1. TOP BAR METRICS */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold text-[var(--fg-base)]">Project: Customer Churn Prediction</h1>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] tracking-widest">COMPLETED</Badge>
          </div>
          <p className="text-xs text-slate-400">Dataset: customer_churn.csv <br/> 125,000 rows • 42 columns</p>
        </div>

        <div className="flex items-center gap-4">
          <TopMetric label="Pipeline Status" value="COMPLETED" icon={<CheckCircle size={14} className="text-emerald-400"/>} valColor="text-emerald-400" />
          <TopMetric label="Active Agents" value="0 / 9" />
          <TopMetric label="Data Quality" value="87%" icon={<div className="w-4 h-4 rounded-full border-2 border-slate-700 border-t-emerald-400" />} />
          <TopMetric label="Total Time" value="08:42 min" />
          <Button variant="outline" className="border-[var(--color-border)] text-[var(--brand-light)] hover:bg-[var(--brand-light)]/10 text-xs ml-4">
            View Full Report <ArrowRight size={14} className="ml-2"/>
          </Button>
        </div>
      </div>

      {/* 2. AUTONOMOUS WORKFLOW PROGRESS */}
      <Card className="p-6 glass border-[var(--color-border)] relative overflow-visible">
        <h3 className="text-sm font-bold text-[var(--fg-base)] mb-10">Autonomous Workflow Progress</h3>
        
        {/* Master Agent Bubble */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
          <div className="bg-[var(--brand-dark)]/10 border border-[var(--brand-light)]/30 rounded-full px-4 py-2 flex items-center gap-3 shadow-[0_0_15px_rgba(45,212,191,0.2)] backdrop-blur-md">
            <Brain size={16} className="text-[var(--brand-light)]" />
            <div className="text-xs">
              <span className="font-bold text-[var(--fg-base)] block">Master Agent</span>
              <span className="text-slate-400 text-[10px]">Orchestration Complete</span>
            </div>
          </div>
          <div className="w-px h-6 bg-[var(--brand-light)]/30"></div>
        </div>

        {/* Workflow Line */}
        <div className="relative flex justify-between items-start mt-8">
          <div className="absolute top-4 left-[5%] right-[5%] h-[1px] bg-slate-800 z-0">
            <div className="h-full bg-emerald-500/50 w-full" />
          </div>
          
          {[
            { step: 1, name: "Profiling Agent", time: "00:48 min" },
            { step: 2, name: "Dictionary Agent", time: "00:36 min" },
            { step: 3, name: "Data Quality Agent", time: "01:12 min" },
            { step: 4, name: "Feature Agent", time: "01:45 min" },
            { step: 5, name: "Synthetic Data Agent", time: "01:35 min" },
            { step: 6, name: "ML Agent", time: "02:15 min" },
            { step: 7, name: "Validation Agent", time: "00:43 min" },
            { step: 8, name: "Prediction Agent", time: "00:26 min" },
          ].map((node, i) => (
            <div key={i} className="flex flex-col items-center relative z-10 w-24">
               <div className="w-8 h-8 rounded-full bg-[#0a0a0c] border border-emerald-500/50 flex items-center justify-center mb-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  <Check size={14} className="text-emerald-400" />
               </div>
               <div className="text-[10px] text-slate-500 absolute -top-5 left-2">{node.step}</div>
               <div className="text-[11px] font-bold text-[var(--fg-base)] text-center mb-0.5">{node.name}</div>
               <div className="text-[10px] text-emerald-400 mb-0.5">Completed</div>
               <div className="text-[9px] text-slate-500">{node.time}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* 3. MIDDLE GRID (4 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Dataset Health Overview */}
        <Card className="p-5 glass flex flex-col justify-between">
          <h3 className="text-sm font-bold text-[var(--fg-base)] mb-6">Dataset Health Overview</h3>
          <div className="flex gap-4 items-center">
            <div className="relative w-24 h-24 flex shrink-0 items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-800" />
                <motion.circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="283" strokeDashoffset={283 - (283 * 0.87)} className="text-[var(--brand-light)]" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">87</span>
                <span className="text-[10px] text-slate-400">/100</span>
              </div>
            </div>
            <div className="space-y-3 flex-1">
               <HealthMetric label="Missing Values" value="2.4%" status="good" />
               <HealthMetric label="Duplicates" value="1.1%" status="good" />
               <HealthMetric label="Outliers" value="3.7%" status="good" />
               <HealthMetric label="PII Detected" value="4 columns" status="good" />
               <HealthMetric label="Class Imbalance" value="8%" sub="(Detected)" status="warning" />
            </div>
          </div>
          <div className="text-center mt-2 text-emerald-400 font-bold text-sm">Good</div>
          <Button variant="ghost" className="w-full text-xs text-[var(--brand-light)] hover:text-white mt-4 border-t border-[var(--color-border)] rounded-none pt-4 pb-0 h-auto">View Full Profiling <ArrowRight size={12} className="ml-1"/></Button>
        </Card>

        {/* Key Insights */}
        <Card className="p-5 glass flex flex-col">
          <h3 className="text-sm font-bold text-[var(--fg-base)] mb-4">Key Insights</h3>
          <div className="space-y-4 flex-1">
             <InsightRow icon={<AlertTriangle size={14} className="text-amber-400"/>} text="Class Imbalance detected in target variable (8% minority class)" />
             <InsightRow icon={<CheckCircle size={14} className="text-emerald-400"/>} text="No missing values in 28 columns" />
             <InsightRow icon={<ShieldAlert size={14} className="text-pink-400"/>} text="4 columns contain potential PII" />
             <InsightRow icon={<Sparkles size={14} className="text-purple-400"/>} text="15 important features identified" />
             <InsightRow icon={<CheckCircle size={14} className="text-emerald-400"/>} text="Dataset quality is good for model training" />
          </div>
          <Button variant="ghost" className="w-full text-xs text-slate-400 hover:text-white mt-4 border-t border-[var(--color-border)] rounded-none pt-4 pb-0 h-auto">View All Insights <ArrowRight size={12} className="ml-1"/></Button>
        </Card>

        {/* Model Performance */}
        <Card className="p-5 glass flex flex-col">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-sm font-bold text-[var(--fg-base)]">Model Performance <span className="text-slate-500 font-normal">(Best Model)</span></h3>
          </div>
          
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-3 flex justify-between items-center mb-6">
             <span className="text-lg font-bold text-[var(--fg-base)]">XGBoost</span>
             <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[10px]">Recommended</Badge>
          </div>

          <div className="flex gap-4 items-center">
            <div className="relative w-24 h-24 flex shrink-0 items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-800" />
                <motion.circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="283" strokeDashoffset={283 - (283 * 0.93)} className="text-indigo-400" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">93%</span>
                <span className="text-[10px] text-slate-400">F1 Score</span>
              </div>
            </div>
            <div className="space-y-3 flex-1">
               <div className="flex justify-between text-xs"><span className="text-slate-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-600"/> Accuracy</span><span className="font-bold text-[var(--fg-base)]">93%</span></div>
               <div className="flex justify-between text-xs"><span className="text-slate-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-600"/> Precision</span><span className="font-bold text-[var(--fg-base)]">91%</span></div>
               <div className="flex justify-between text-xs"><span className="text-slate-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-600"/> Recall</span><span className="font-bold text-[var(--fg-base)]">94%</span></div>
               <div className="flex justify-between text-xs"><span className="text-slate-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-600"/> AUC</span><span className="font-bold text-[var(--fg-base)]">96%</span></div>
            </div>
          </div>
          <Button variant="ghost" className="w-full text-xs text-indigo-400 hover:text-white mt-4 border-t border-[var(--color-border)] rounded-none pt-4 pb-0 h-auto">View Model Leaderboard</Button>
        </Card>

        {/* Recent Agent Activity */}
        <Card className="p-5 glass flex flex-col">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-sm font-bold text-[var(--fg-base)]">Recent Agent Activity</h3>
             <div className="flex items-center gap-1 text-[10px] text-emerald-400"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/> Live</div>
          </div>
          
          <div className="flex-1 space-y-4 overflow-hidden relative">
             <ActivityTimelineRow time="10:24:12" agent="Prediction Agent" text="Generated predictions for 125,000 records" />
             <ActivityTimelineRow time="10:23:45" agent="Validation Agent" text="Validation completed. All checks passed." />
             <ActivityTimelineRow time="10:22:10" agent="ML Agent" text="XGBoost selected as best model (F1: 0.93)" />
             <ActivityTimelineRow time="10:19:55" agent="Synthetic Data Agent" text="Generated 25,000 synthetic records" />
             <ActivityTimelineRow time="10:18:20" agent="Feature Agent" text="Created 15 new features" />
          </div>
          <Button variant="ghost" className="w-full text-xs text-[var(--brand-light)] hover:text-white mt-4 border-t border-[var(--color-border)] rounded-none pt-4 pb-0 h-auto">View Full Activity Log</Button>
        </Card>
      </div>

      {/* 4. BOTTOM GRID (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Agent Communication Timeline */}
        <Card className="p-5 glass lg:col-span-1">
           <h3 className="text-sm font-bold text-[var(--fg-base)] mb-6">Agent Communication Timeline</h3>
           <div className="relative flex flex-col gap-4">
              {/* Vertical line */}
              <div className="absolute left-[50%] top-4 bottom-4 w-px bg-slate-800 z-0"></div>
              
              <CommBox time="10:10:24" agent="Profiling Agent" text="Class imbalance detected (8%)" color="text-indigo-400" align="left" />
              <CommBox time="10:10:25" agent="Master Agent" text="Activating Synthetic Data Agent" color="text-pink-400" align="left" />
              <CommBox time="10:10:30" agent="Synthetic Data Agent" text="Generating minority class samples" color="text-emerald-400" align="left" />
              
              <div className="absolute left-1/2 top-4 bottom-4 flex flex-col justify-around py-8 z-0">
                 <div className="w-20 h-px bg-slate-700"></div>
                 <div className="w-20 h-px bg-slate-700"></div>
                 <div className="w-20 h-px bg-slate-700"></div>
              </div>
           </div>
           <Button variant="ghost" className="w-full text-xs text-[var(--brand-light)] hover:text-white mt-6 border-t border-[var(--color-border)] rounded-none pt-4 pb-0 h-auto">View All Communications</Button>
        </Card>

        {/* Predictions Summary */}
        <Card className="p-5 glass flex flex-col">
           <h3 className="text-sm font-bold text-[var(--fg-base)] mb-6">Predictions Summary</h3>
           <div className="flex flex-1 items-center justify-center gap-8">
              <div className="relative w-36 h-36 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#0a0a0c" strokeWidth="12" />
                    {/* High Risk (Red) */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f87171" strokeWidth="12" strokeDasharray="251" strokeDashoffset={251 - (251 * 0.05)} />
                    {/* Medium Risk (Amber) */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#fbbf24" strokeWidth="12" strokeDasharray="251" strokeDashoffset={251 - (251 * 0.15)} className="rotate-[18deg] origin-center" />
                    {/* Low Risk (Green) */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#34d399" strokeWidth="12" strokeDasharray="251" strokeDashoffset={251 - (251 * 0.80)} className="rotate-[72deg] origin-center" />
                 </svg>
                 <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">125K</span>
                    <span className="text-[10px] text-slate-400">Total Predictions</span>
                 </div>
              </div>
              <div className="space-y-4">
                 <div>
                    <div className="flex items-center gap-2 text-xs mb-1"><div className="w-3 h-3 rounded-sm bg-red-400"/> <span className="text-slate-300">High Risk</span></div>
                    <div className="text-sm font-bold text-white pl-5">1,284 <span className="text-slate-500 font-normal text-xs">(1.03%)</span></div>
                 </div>
                 <div>
                    <div className="flex items-center gap-2 text-xs mb-1"><div className="w-3 h-3 rounded-sm bg-amber-400"/> <span className="text-slate-300">Medium Risk</span></div>
                    <div className="text-sm font-bold text-white pl-5">4,321 <span className="text-slate-500 font-normal text-xs">(3.46%)</span></div>
                 </div>
                 <div>
                    <div className="flex items-center gap-2 text-xs mb-1"><div className="w-3 h-3 rounded-sm bg-emerald-400"/> <span className="text-slate-300">Low Risk</span></div>
                    <div className="text-sm font-bold text-white pl-5">119,395 <span className="text-slate-500 font-normal text-xs">(95.51%)</span></div>
                 </div>
              </div>
           </div>
           <Button variant="ghost" className="w-full text-xs text-indigo-400 hover:text-white mt-6 border-t border-[var(--color-border)] rounded-none pt-4 pb-0 h-auto">Explore Predictions</Button>
        </Card>

        <div className="flex flex-col gap-6">
           {/* AI Recommendation */}
           <Card className="p-5 bg-indigo-500/5 border border-indigo-500/20 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <Brain className="text-indigo-400" size={20} />
                 </div>
                 <h3 className="text-sm font-bold text-[var(--fg-base)]">AI Recommendation</h3>
              </div>
              <p className="text-sm text-slate-300 mb-4">High priority retention campaign recommended for 1,284 high-risk customers.</p>
              <div className="flex items-center justify-between mt-auto">
                 <span className="text-xs text-slate-500">Confidence: <span className="text-[var(--brand-light)] font-bold">89%</span></span>
                 <Button variant="outline" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 text-xs">View Explanation</Button>
              </div>
           </Card>

           {/* Dataset Version */}
           <Card className="p-5 glass flex-1 flex flex-col justify-between">
              <h3 className="text-sm font-bold text-[var(--fg-base)] mb-4">Dataset Version</h3>
              <div className="flex items-center justify-between relative mt-2 mb-4">
                 <div className="absolute top-1.5 left-2 right-2 h-[1px] bg-slate-700 z-0">
                    <div className="h-full bg-emerald-400 w-[100%]" />
                 </div>
                 {[
                   { v: "V1", l: "Original" },
                   { v: "V2", l: "Cleaned" },
                   { v: "V3", l: "Features" },
                   { v: "V4", l: "Synthetic" },
                   { v: "V5", l: "Final", active: true }
                 ].map((v, i) => (
                    <div key={i} className="flex flex-col items-center relative z-10">
                       <div className={`w-3 h-3 rounded-full mb-2 ${v.active ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-emerald-400'}`} />
                       <div className={`text-[10px] font-bold ${v.active ? 'text-emerald-400' : 'text-slate-300'}`}>{v.v}</div>
                       <div className="text-[9px] text-slate-500">{v.l}</div>
                    </div>
                 ))}
              </div>
              <Button variant="ghost" className="w-full text-xs text-[var(--brand-light)] hover:text-white mt-auto border-t border-[var(--color-border)] rounded-none pt-4 pb-0 h-auto">View All Versions</Button>
           </Card>
        </div>
      </div>
      
      {/* FOOTER METRICS */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)] text-[10px] text-slate-500 font-medium">
        <div>Powered by <span className="text-slate-300 font-bold">AgentIQ</span> Autonomous AI Workforce</div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5"><Bot size={12} className="text-[var(--brand-light)]"/> 9 Agents Deployed</div>
          <div className="flex items-center gap-1.5"><Workflow size={12} className="text-[var(--brand-light)]"/> 15 Tools Utilized</div>
          <div className="flex items-center gap-1.5"><GitCommit size={12} className="text-[var(--brand-light)]"/> 5 Dataset Versions</div>
          <div className="flex items-center gap-1.5"><CheckCircle size={12} className="text-[var(--brand-light)]"/> 100% Automated</div>
        </div>
        <div>v1.0.0</div>
      </div>
    </div>
  )
}

function TopMetric({ label, value, icon, valColor = "text-[var(--fg-base)]" }: any) {
  return (
    <div className="flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] px-4 py-2 rounded-lg min-w-[120px]">
      <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold ${valColor}`}>{value}</span>
        {icon && icon}
      </div>
    </div>
  )
}

function HealthMetric({ label, value, sub, status }: any) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <Check size={12} className={status === "warning" ? "text-amber-400" : "text-emerald-400"} />
        <span className="text-slate-300">{label}</span>
      </div>
      <div className="text-right">
        <span className="font-semibold text-[var(--fg-base)]">{value}</span>
        {sub && <span className="block text-[9px] text-amber-400">{sub}</span>}
      </div>
    </div>
  )
}

function InsightRow({ icon, text }: any) {
  return (
    <div className="flex items-start gap-3 bg-[var(--color-surface)] p-2.5 rounded border border-[var(--color-border)]">
       <div className="mt-0.5 shrink-0">{icon}</div>
       <span className="text-xs text-slate-300 leading-snug">{text}</span>
    </div>
  )
}

function ActivityTimelineRow({ time, agent, text }: any) {
  return (
    <div className="flex gap-4 relative">
       <div className="w-px bg-slate-800 absolute top-2 bottom-[-16px] left-1 z-0"></div>
       <div className="relative z-10 mt-1 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center">
             <div className="w-1 h-1 rounded-full bg-indigo-400" />
          </div>
       </div>
       <div>
          <div className="text-[10px] text-slate-500 mb-0.5 flex gap-2">
             <span>{time}</span>
             <span className="text-indigo-300 font-semibold flex items-center gap-1"><Bot size={10}/> {agent}</span>
          </div>
          <div className="text-xs text-slate-300">{text}</div>
       </div>
    </div>
  )
}

function CommBox({ time, agent, text, color, align }: any) {
  return (
     <div className={`w-[90%] bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-lg relative z-10`}>
        <div className="flex items-center gap-2 mb-1">
           <div className="text-[9px] text-slate-500">{time}</div>
           <div className={`text-[10px] font-bold ${color}`}>{agent}</div>
        </div>
        <div className="text-xs text-slate-300">{text}</div>
     </div>
  )
}
