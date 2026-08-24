"use client"
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { MessageSquare, Network, Brain, Database, Cpu, FlaskConical, Filter } from "lucide-react"
import { agentWebSocket } from "@/lib/api"

export default function CommunicationPage() {
  const [filter, setFilter] = useState("All")
  const [msgs, setMsgs] = useState<any[]>([])

  useEffect(() => {
    agentWebSocket.connect()
    const unsubscribe = agentWebSocket.subscribe((data) => {
      if (data.type === 'agent_log') {
        setMsgs(prev => [...prev, {
          time: data.time,
          from: data.agent,
          to: "Network", // Simplified
          msg: data.msg,
          color: data.color,
          bg: data.color.replace('text-', 'bg-').includes('400') ? data.color.replace('text-', 'bg-').replace('400', '500/10') : data.color.replace('text-', 'bg-') + '/10'
        }])
      }
    })
    return () => unsubscribe()
  }, [])
  
  return (
    <div className="space-y-6 pb-24 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Agent-to-Agent Communication</h1>
          <p className="text-slate-400">Monitor how agents collaborate and make decisions in real-time.</p>
        </div>
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-lg border border-white/5">
          {["All", "Master", "Data", "ML"].map(f => (
            <Button key={f} variant="ghost" size="sm" onClick={() => setFilter(f)} className={filter === f ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}>
              {f}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/5 flex flex-col overflow-hidden">
          <h3 className="text-sm font-bold text-slate-300 tracking-wider mb-6 flex items-center gap-2">
            <MessageSquare size={16} className="text-brand-light" /> LIVE FEED
          </h3>
          <div className="flex-1 overflow-y-auto pr-4 space-y-6">
            {msgs.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="relative pl-6 border-l border-white/10 pb-6 last:pb-0">
                <div className={`absolute -left-[5px] top-0 w-2 h-2 rounded-full ${m.bg.replace('/10', '')}`} />
                <div className="flex items-center gap-3 text-xs mb-2">
                  <span className="text-slate-500 font-mono">{m.time}</span>
                  <Badge variant="outline" className={`${m.color} ${m.bg} border-none`}>{m.from}</Badge>
                  <span className="text-slate-600">→</span>
                  <Badge variant="outline" className="text-slate-400 bg-white/5 border-none">{m.to}</Badge>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5 text-slate-200 text-sm">
                  "{m.msg}"
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-[#09090b]/80 border-white/5 backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <h3 className="absolute top-6 left-6 text-sm font-bold text-slate-300 tracking-wider flex items-center gap-2 z-10">
            <Network size={16} className="text-brand-dark" /> COMMUNICATION GRAPH
          </h3>
          
          <div className="relative w-full h-[400px] flex items-center justify-center">
            {/* Visual graph representation */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M 50% 30% L 30% 60%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
              <path d="M 50% 30% L 70% 60%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
              <path d="M 70% 60% L 50% 80%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
              <path d="M 50% 80% L 50% 30%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
              
              {/* Active data packet */}
              <circle cx="50%" cy="30%" r="3" fill="#2DD4BF">
                <animate attributeName="cy" values="30%;60%;30%" dur="2s" repeatCount="indefinite" />
                <animate attributeName="cx" values="50%;70%;50%" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>

            <div className="absolute top-[30%] -translate-y-1/2 flex flex-col items-center">
              <div className="w-12 h-12 bg-brand-light/20 rounded-full border border-brand-light flex items-center justify-center text-brand-light shadow-[0_0_20px_rgba(45,212,191,0.3)]"><Brain size={20}/></div>
              <span className="text-[10px] font-bold text-white mt-2 bg-background/80 px-1 rounded">MASTER</span>
            </div>
            
            <div className="absolute left-[30%] top-[60%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full border border-blue-500 flex items-center justify-center text-blue-400"><Database size={16}/></div>
              <span className="text-[10px] font-bold text-slate-400 mt-2 bg-background/80 px-1 rounded">PROFILING</span>
            </div>
            
            <div className="absolute left-[70%] top-[60%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-10 h-10 bg-brand-dark/20 rounded-full border border-brand-dark flex items-center justify-center text-brand-dark"><Cpu size={16}/></div>
              <span className="text-[10px] font-bold text-slate-400 mt-2 bg-background/80 px-1 rounded">SYNTHETIC</span>
            </div>

            <div className="absolute top-[80%] -translate-y-1/2 flex flex-col items-center">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-full border border-emerald-500 flex items-center justify-center text-emerald-400"><CheckCircle2 size={16}/></div>
              <span className="text-[10px] font-bold text-slate-400 mt-2 bg-background/80 px-1 rounded">VALIDATION</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
function CheckCircle2(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg> }
