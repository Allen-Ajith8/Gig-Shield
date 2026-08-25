"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { 
  AlertTriangle, CheckCircle, Shield, Activity, ArrowRight, Zap, Server, 
  UploadCloud, Loader2, CheckCircle2, Download, ChevronRight, FileCheck 
} from "lucide-react"
import { api } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"

interface Incident {
  incident_id: string
  message?: string
}

const STATUS_COLORS: Record<string, string> = {
  INVESTIGATING: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  REMEDIATING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  WAITING_APPROVAL: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  RESOLVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  FAILED: "bg-red-500/10 text-red-400 border-red-500/20",
}

function extractStatus(msg?: string) {
  if (!msg) return "UNKNOWN"
  const match = msg.match(/Status: (\w+)/)
  return match ? match[1] : "UNKNOWN"
}

export default function DashboardOverview() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  
  // Carousel State
  const [step, setStep] = useState<number>(0)
  const [datasetId, setDatasetId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [report, setReport] = useState<{problems_found: string[], changes_done: string[]} | null>(null)
  const [loadingText, setLoadingText] = useState("Initializing analysis...")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetch = () => api.listIncidents().then(setIncidents).catch(() => {})
    fetch()
    const id = setInterval(fetch, 5000)
    return () => clearInterval(id)
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const res = await api.uploadDataset(file)
      setDatasetId(res.dataset_id)
      
      // Move to next step automatically
      setStep(1)
      startAnalysis(res.dataset_id)
    } catch (err) {
      console.error(err)
      alert("Failed to upload file")
      setUploading(false)
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const startAnalysis = async (id: string) => {
    try {
      const loadingStates = [
        "Profiling dataset schema...",
        "Identifying numeric distributions...",
        "Calculating z-scores for outlier detection...",
        "Finalizing dataset report..."
      ]
      let i = 0
      const textInterval = setInterval(() => {
        i = (i + 1) % loadingStates.length
        setLoadingText(loadingStates[i])
      }, 800)

      const result = await api.analyzeDataset(id)
      
      clearInterval(textInterval)
      setReport(result.report || null)
      setStep(2)
      setUploading(false)
    } catch (err) {
      console.error(err)
      alert("Analysis failed")
      setStep(0)
      setUploading(false)
    }
  }

  const active = incidents.filter(i => !["RESOLVED", "FAILED"].includes(extractStatus(i.message))).length
  const resolved = incidents.filter(i => extractStatus(i.message) === "RESOLVED").length
  const failed = incidents.filter(i => extractStatus(i.message) === "FAILED").length

  const variants = {
    initial: (direction: number) => ({ opacity: 0, x: direction > 0 ? 50 : -50 }),
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -50 : 50, transition: { duration: 0.3, ease: "easeIn" } })
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--fg-base)]">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Autonomous data profiling, cleaning, and incident remediation</p>
      </div>

      {/* Dataset Upload Carousel */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--fg-base)]">Dataset Analysis Workflow</h2>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className={step === 0 ? "text-[var(--brand-light)] font-medium" : ""}>1. Upload</span>
            <ChevronRight size={12} className="opacity-50" />
            <span className={step === 1 ? "text-[var(--brand-light)] font-medium" : ""}>2. Process</span>
            <ChevronRight size={12} className="opacity-50" />
            <span className={step === 2 ? "text-[var(--brand-light)] font-medium" : ""}>3. Results</span>
          </div>
        </div>

        <div className="relative overflow-hidden h-[240px]">
          <AnimatePresence mode="wait" custom={1}>
            {step === 0 && (
              <motion.div key="step-0" custom={1} variants={variants} initial="initial" animate="animate" exit="exit" className="absolute inset-0">
                <Card className="h-full p-8 border-dashed border-2 border-[var(--color-border)] hover:border-[var(--brand-light)]/40 transition-colors flex flex-row items-center gap-8">
                  <div className="flex-1 pr-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--brand-light)]/10 flex items-center justify-center text-[var(--brand-light)] mb-4">
                      <UploadCloud size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--fg-base)] mb-2">Upload Datasheet</h3>
                    <p className="text-sm text-slate-400">
                      Drag and drop or select your CSV/Parquet file. We will automatically profile schemas and detect outliers.
                    </p>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center h-full border border-[var(--color-border)] bg-black/20 rounded-xl">
                    <input type="file" ref={fileInputRef} onChange={handleUpload} accept=".csv,.parquet" className="hidden" />
                    <Button size="lg" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                      Browse Files
                    </Button>
                    <span className="text-xs text-slate-500 mt-3">Supports .csv and .parquet</span>
                  </div>
                </Card>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step-1" custom={1} variants={variants} initial="initial" animate="animate" exit="exit" className="absolute inset-0">
                <Card className="h-full p-8 flex flex-row items-center gap-12">
                  <div className="flex flex-col items-start flex-1">
                    <Loader2 size={32} className="text-[var(--brand-light)] animate-spin mb-4" />
                    <h3 className="text-xl font-semibold text-[var(--fg-base)] mb-2">Processing Data</h3>
                    <p className="text-sm text-slate-400 h-5 overflow-hidden">
                      <motion.span key={loadingText} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="block">
                        {loadingText}
                      </motion.span>
                    </p>
                  </div>
                  <div className="flex-[2] px-8">
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
                      <motion.div className="absolute top-0 left-0 bottom-0 bg-gradient-brand rounded-full" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2.5, ease: "easeInOut" }} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step-2" custom={1} variants={variants} initial="initial" animate="animate" exit="exit" className="absolute inset-0">
                <Card className="h-full p-6 flex flex-row gap-6">
                  <div className="w-1/3 flex flex-col justify-between border-r border-[var(--color-border)] pr-6">
                    <div>
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
                        <CheckCircle2 size={20} />
                      </div>
                      <h3 className="text-lg font-semibold text-[var(--fg-base)]">Analysis Complete</h3>
                      <p className="text-xs text-slate-400 mt-1">Processed: {datasetId}</p>
                    </div>
                    <div className="flex flex-col gap-2 mt-4">
                      <a href={datasetId ? api.getDownloadUrl(datasetId) : "#"} download className="block">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white border-none gap-2">
                          <Download size={14} /> Download CSV
                        </Button>
                      </a>
                      <Button variant="ghost" size="sm" onClick={() => setStep(0)} className="w-full">Upload Another</Button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4">
                    {/* Problems Found */}
                    <div>
                      <h4 className="text-xs font-semibold text-[var(--fg-base)] mb-3 flex items-center gap-2">
                        <AlertTriangle size={14} className="text-amber-400" /> Problems Detected
                      </h4>
                      <ul className="space-y-2">
                        {report?.problems_found.map((prob, i) => (
                          <li key={i} className="flex items-start gap-2 text-[11px] text-slate-300 bg-[var(--color-surface)] p-2.5 rounded-lg border border-[var(--color-border)] leading-relaxed">
                            <span className="text-amber-500 mt-0.5 text-[10px]">●</span> {prob}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Changes Applied */}
                    <div>
                      <h4 className="text-xs font-semibold text-[var(--fg-base)] mb-3 flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-400" /> Automated Fixes Applied
                      </h4>
                      <ul className="space-y-2">
                        {report?.changes_done.map((change, i) => (
                          <li key={i} className="flex items-start gap-2 text-[11px] text-slate-300 bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/20 leading-relaxed">
                            <span className="text-emerald-500 mt-0.5">✓</span> {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Active" value={active} color="text-amber-400" icon={<Activity size={18} />} />
        <StatCard label="Resolved" value={resolved} color="text-emerald-400" icon={<CheckCircle size={18} />} />
        <StatCard label="Failed" value={failed} color="text-red-400" icon={<AlertTriangle size={18} />} />
      </div>

      {/* Agent Pipeline */}
      <Card className="p-6">
        <h2 className="text-sm font-semibold text-[var(--fg-base)] mb-6">Resolution Pipeline</h2>
        <div className="flex items-center justify-between">
          {[
            { name: "Triage", icon: <AlertTriangle size={16} />, color: "text-cyan-400" },
            { name: "Detective", icon: <Shield size={16} />, color: "text-purple-400" },
            { name: "Remediation", icon: <Zap size={16} />, color: "text-amber-400" },
            { name: "Approval", icon: <CheckCircle size={16} />, color: "text-pink-400" },
            { name: "Execution", icon: <Server size={16} />, color: "text-emerald-400" },
          ].map((agent, i, arr) => (
            <React.Fragment key={agent.name}>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center ${agent.color}`}>
                  {agent.icon}
                </div>
                <span className={`text-xs font-medium ${agent.color}`}>{agent.name}</span>
              </div>
              {i < arr.length - 1 && <div className="flex-1 h-px bg-slate-800 mx-2" />}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulate Incident */}
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-[var(--fg-base)] mb-4">Simulate Incident</h2>
          <div className="space-y-3">
            {[
              { name: "Database Deadlock", severity: "CRITICAL", color: "text-red-400", border: "border-red-500/20" },
              { name: "Pod Crash Loop", severity: "HIGH", color: "text-amber-400", border: "border-amber-500/20" },
              { name: "High Latency Spike", severity: "MEDIUM", color: "text-yellow-400", border: "border-yellow-500/20" },
            ].map(s => (
              <Link key={s.name} href="/dashboard/incidents">
                <div className={`flex items-center justify-between p-3 rounded-lg border ${s.border} bg-[var(--color-surface)] hover:bg-black/20 cursor-pointer transition-colors mb-3`}>
                  <span className={`text-sm font-medium ${s.color}`}>{s.name}</span>
                  <Badge className={`text-[10px] ${s.color} bg-transparent border-current`}>{s.severity}</Badge>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/dashboard/incidents" className="block mt-4">
            <Button variant="ghost" className="w-full text-xs text-[var(--brand-light)]">
              Go to Incident Simulator <ArrowRight size={12} className="ml-1" />
            </Button>
          </Link>
        </Card>

        {/* Recent Incidents */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[var(--fg-base)]">Recent Incidents</h2>
            {incidents.length > 0 && (
              <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
              </div>
            )}
          </div>

          {incidents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-500">
              <Shield size={28} className="mb-2 opacity-40" />
              <p className="text-sm">No incidents yet</p>
              <p className="text-xs mt-1">Trigger a scenario to see agents in action</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[220px] overflow-y-auto">
              {incidents.slice().reverse().map((inc) => {
                const status = extractStatus(inc.message)
                return (
                  <Link key={inc.incident_id} href={`/dashboard/incidents/${inc.incident_id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--brand-light)]/30 transition-all cursor-pointer"
                    >
                      <span className="text-sm font-mono text-[var(--fg-base)]">{inc.incident_id}</span>
                      <Badge className={`text-[10px] ${STATUS_COLORS[status] || ""}`}>{status}</Badge>
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <Card className="p-5 flex items-center gap-4">
      <div className={`${color}`}>{icon}</div>
      <div>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        <div className="text-xs text-slate-400">{label}</div>
      </div>
    </Card>
  )
}
