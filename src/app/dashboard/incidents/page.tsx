"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { api } from "@/lib/api"
import { AlertTriangle, Database, Server, Wifi, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const SCENARIOS = [
  {
    name: "Database Deadlock",
    icon: Database,
    color: "text-red-400",
    border: "border-red-500/20 hover:border-red-500/40",
    payload: {
      service: "payment-service",
      severity: "CRITICAL",
      description: "Database deadlock detected on payment-service",
      raw_log: "ERROR 2026-08-25 DeadlockDetected: Transaction timeout after 30s",
      metrics: { error_rate: 42.5, p99_latency_ms: 3200 },
      source: "datadog",
      scenario: "db_deadlock",
    },
  },
  {
    name: "Pod Crash Loop",
    icon: Server,
    color: "text-amber-400",
    border: "border-amber-500/20 hover:border-amber-500/40",
    payload: {
      service: "api-gateway",
      severity: "HIGH",
      description: "Pod crash loop detected on api-gateway",
      raw_log: "FATAL 2026-08-25 OOMKilled: Container exceeded memory limit",
      metrics: { restart_count: 15, memory_usage_pct: 98 },
      source: "kubernetes",
      scenario: "pod_crash",
    },
  },
  {
    name: "High Latency Spike",
    icon: Wifi,
    color: "text-yellow-400",
    border: "border-yellow-500/20 hover:border-yellow-500/40",
    payload: {
      service: "search-service",
      severity: "MEDIUM",
      description: "P99 latency spike on search-service",
      raw_log: "WARN 2026-08-25 SlowQuery: Query took 8500ms",
      metrics: { p99_latency_ms: 8500, error_rate: 5.2 },
      source: "cloudwatch",
      scenario: "high_latency",
    },
  },
]

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

export default function IncidentsPage() {
  const router = useRouter()
  const [incidents, setIncidents] = useState<any[]>([])
  const [triggering, setTriggering] = useState<string | null>(null)

  useEffect(() => {
    const fetch = () => api.listIncidents().then(setIncidents).catch(() => {})
    fetch()
    const id = setInterval(fetch, 4000)
    return () => clearInterval(id)
  }, [])

  const trigger = async (scenario: typeof SCENARIOS[0]) => {
    setTriggering(scenario.name)
    try {
      const res = await api.triggerIncident(scenario.payload)
      router.push(`/dashboard/incidents/${res.incident_id}`)
    } catch (e) {
      console.error(e)
      setTriggering(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--fg-base)]">Incidents</h1>
        <p className="text-sm text-slate-400 mt-1">Trigger simulated incidents or monitor active ones</p>
      </div>

      {/* Trigger Cards */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--fg-base)] mb-3">Simulate an Incident</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SCENARIOS.map((s) => (
            <button
              key={s.name}
              onClick={() => trigger(s)}
              disabled={triggering !== null}
              className={`text-left p-4 rounded-xl border bg-[var(--color-surface)] transition-all ${s.border} disabled:opacity-50`}
            >
              <div className="flex items-center gap-3 mb-2">
                {triggering === s.name ? (
                  <RefreshCw size={18} className={`${s.color} animate-spin`} />
                ) : (
                  <s.icon size={18} className={s.color} />
                )}
                <span className={`text-sm font-semibold ${s.color}`}>{s.name}</span>
              </div>
              <p className="text-xs text-slate-500">{s.payload.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Incident List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--fg-base)]">All Incidents</h2>
          {incidents.length > 0 && (
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
            </span>
          )}
        </div>

        {incidents.length === 0 ? (
          <Card className="p-8 text-center">
            <AlertTriangle size={24} className="mx-auto mb-2 text-slate-600" />
            <p className="text-sm text-slate-500">No incidents triggered yet</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {incidents.slice().reverse().map((inc, i) => {
              const status = extractStatus(inc.message)
              return (
                <Link key={inc.incident_id} href={`/dashboard/incidents/${inc.incident_id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--brand-light)]/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono font-medium text-[var(--fg-base)]">{inc.incident_id}</span>
                    </div>
                    <Badge className={`text-[10px] ${STATUS_COLORS[status] || ""}`}>{status}</Badge>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
