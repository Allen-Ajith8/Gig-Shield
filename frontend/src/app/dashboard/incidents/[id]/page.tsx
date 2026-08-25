'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import { Terminal, Shield, CheckCircle, XCircle, AlertTriangle, FileText, ArrowLeft, Workflow, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

type LogEntry = {
  event_type: string
  agent_name: string
  message: string
  timestamp: string
}

const STATUS_COLORS: Record<string, string> = {
  INVESTIGATING: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  REMEDIATING: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  WAITING_APPROVAL: 'bg-pink-400/10 text-pink-400 border-pink-400/20',
  RESOLVED: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  FAILED: 'bg-red-400/10 text-red-400 border-red-400/20',
}

const AGENT_COLORS: Record<string, string> = {
  TriageAgent: 'text-cyan-400',
  DetectiveAgent: 'text-purple-400',
  RemediationAgent: 'text-amber-400',
  ApprovalGate: 'text-pink-400',
  ExecutionAgent: 'text-emerald-400',
  System: 'text-slate-400',
}

export default function IncidentRoom() {
  const { id } = useParams<{ id: string }>()
  const [incident, setIncident] = useState<any>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [approving, setApproving] = useState(false)
  const logsEnd = useRef<HTMLDivElement>(null)

  // Fetch incident state on interval
  useEffect(() => {
    const load = () => api.getIncident(id).then(setIncident).catch(() => {})
    load()
    const interval = setInterval(load, 3000)
    return () => clearInterval(interval)
  }, [id])

  // WebSocket for live logs
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/incidents/${id}`)
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        setLogs(prev => [...prev, data])
      } catch {}
    }
    return () => ws.close()
  }, [id])

  // Auto-scroll logs
  useEffect(() => {
    logsEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  // Initial logs from incident state
  useEffect(() => {
    if (incident?.logs?.length && logs.length === 0) {
      setLogs(incident.logs.map((msg: string) => ({
        event_type: 'LOG',
        agent_name: msg.match(/\[(.+?)\]/)?.[1] || 'System',
        message: msg.replace(/\[.+?\]\s*/, ''),
        timestamp: new Date().toISOString(),
      })))
    }
  }, [incident])

  const handleApproval = async (approved: boolean) => {
    setApproving(true)
    try {
      await api.submitApproval(id, approved, 'operator')
    } catch (e) {
      console.error(e)
    }
    setApproving(false)
  }

  const status = incident?.status || 'INVESTIGATING'
  const service = incident?.alert?.service || '—'
  const severity = incident?.alert?.severity || '—'

  // Define SRE stages
  const STAGES = [
    { id: 'triage', label: 'Triage', icon: <AlertTriangle size={14} />, state: 'INVESTIGATING' },
    { id: 'detective', label: 'Detective', icon: <Search size={14} />, state: 'INVESTIGATING' },
    { id: 'remediation', label: 'Remediation', icon: <Shield size={14} />, state: 'REMEDIATING' },
    { id: 'approval', label: 'Approval Gate', icon: <CheckCircle size={14} />, state: 'WAITING_APPROVAL' },
    { id: 'execution', label: 'Execution', icon: <Terminal size={14} />, state: 'RESOLVED' }
  ];

  // Determine current stage index based on status and available data
  let currentStageIdx = 0;
  if (status === 'RESOLVED' || status === 'FAILED') currentStageIdx = 5;
  else if (status === 'WAITING_APPROVAL') currentStageIdx = 3;
  else if (status === 'REMEDIATING') currentStageIdx = 2;
  else if (status === 'INVESTIGATING') {
    currentStageIdx = incident?.root_cause ? 2 : (incident?.triage_summary ? 1 : 0);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/incidents" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold font-mono text-[var(--fg-base)]">{id}</h1>
              <Badge className={STATUS_COLORS[status] || ''}>{status.replace('_', ' ')}</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">{service} • {severity}</p>
          </div>
        </div>
      </div>

      {/* Visual Pipeline */}
      <Card className="p-6">
        <h2 className="text-sm font-semibold text-[var(--fg-base)] mb-6 flex items-center gap-2">
          <Workflow size={16} className="text-[var(--brand-light)]" />
          Autonomous SRE Pipeline
        </h2>
        <div className="relative flex items-center justify-between max-w-4xl mx-auto px-4">
          <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-slate-800 -z-10 -translate-y-1/2" />
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIdx;
            const isCurrent = idx === currentStageIdx;
            const isFailed = status === 'FAILED' && isCurrent;

            return (
              <div key={stage.id} className="flex flex-col items-center gap-3 relative z-10">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isFailed ? '#ef4444' : (isCompleted ? '#10b981' : (isCurrent ? '#8b5cf6' : '#1e293b')),
                    borderColor: isCurrent && !isFailed ? '#a78bfa' : 'transparent'
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500 text-white shadow-lg`}
                >
                  {stage.icon}
                </motion.div>
                <div className="text-center">
                  <div className={`text-xs font-semibold ${isCurrent ? 'text-white' : 'text-slate-400'}`}>
                    {stage.label}
                  </div>
                  {isCurrent && (
                    <motion.div
                      layoutId="active-indicator"
                      className="h-1 w-8 bg-[var(--brand-light)] rounded-full mx-auto mt-1"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Approval Banner */}
      {status === 'WAITING_APPROVAL' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border border-pink-500/30 bg-pink-500/5"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-pink-400 mb-1">Approval Required</h3>
              <p className="text-xs text-slate-400">
                Action: <code className="text-[var(--fg-base)]">{incident?.proposed_action?.command || '—'}</code>
              </p>
              <p className="text-xs text-slate-500 mt-1">{incident?.proposed_action?.justification || ''}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleApproval(false)}
                disabled={approving}
                className="text-red-400 border border-red-500/20 hover:bg-red-500/10"
              >
                <XCircle size={14} className="mr-1" /> Reject
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleApproval(true)}
                disabled={approving}
                className="bg-emerald-600 hover:bg-emerald-500 border-0"
              >
                <CheckCircle size={14} className="mr-1" /> Approve
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Terminal - 3 cols */}
        <Card className="lg:col-span-3 p-0 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-border)]">
            <Terminal size={14} className="text-[var(--brand-light)]" />
            <span className="text-xs font-semibold text-[var(--fg-base)]">Agent Terminal</span>
            <span className="text-[10px] text-slate-500 ml-auto">{logs.length} events</span>
          </div>
          <div className="h-[500px] overflow-y-auto p-4 font-mono text-xs space-y-1 bg-black/30">
            {logs.length === 0 && (
              <div className="text-slate-600 py-8 text-center">Waiting for agent activity...</div>
            )}
            {logs.map((log, i) => (
              <div key={i} className="flex gap-2 leading-relaxed">
                <span className="text-slate-600 shrink-0 w-16">
                  {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false }).slice(0, 8)}
                </span>
                <span className={`shrink-0 font-semibold ${AGENT_COLORS[log.agent_name] || 'text-slate-400'}`}>
                  [{log.agent_name}]
                </span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))}
            <div ref={logsEnd} />
          </div>
        </Card>

        {/* Details - 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          {/* Triage */}
          <DetailCard title="Triage Summary" icon={<AlertTriangle size={14} />} content={incident?.triage_summary} />
          
          {/* Root Cause */}
          <DetailCard title="Root Cause" icon={<Shield size={14} />} content={incident?.root_cause} />
          
          {/* Sandbox */}
          {incident?.sandbox_test_result && (
            <Card className="p-4">
              <h3 className="text-xs font-semibold text-[var(--fg-base)] mb-2 flex items-center gap-2">
                {incident.sandbox_test_result.status === 'SUCCESS'
                  ? <CheckCircle size={14} className="text-emerald-400" />
                  : <XCircle size={14} className="text-red-400" />}
                Sandbox Result
              </h3>
              <pre className="text-[11px] text-slate-400 whitespace-pre-wrap font-mono bg-black/20 p-3 rounded-lg">
                {incident.sandbox_test_result.output}
              </pre>
            </Card>
          )}

          {/* Post-Mortem */}
          {status === 'RESOLVED' && incident?.postmortem && (
            <Card className="p-4">
              <h3 className="text-xs font-semibold text-[var(--fg-base)] mb-2 flex items-center gap-2">
                <FileText size={14} className="text-[var(--brand-light)]" />
                Post-Mortem Report
              </h3>
              <pre className="text-[11px] text-slate-400 whitespace-pre-wrap font-mono max-h-[300px] overflow-y-auto">
                {incident.postmortem}
              </pre>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailCard({ title, icon, content }: { title: string; icon: React.ReactNode; content?: string | null }) {
  return (
    <Card className="p-4">
      <h3 className="text-xs font-semibold text-[var(--fg-base)] mb-2 flex items-center gap-2">
        {icon} {title}
      </h3>
      <p className="text-xs text-slate-400 leading-relaxed">
        {content || <span className="text-slate-600 italic">Pending...</span>}
      </p>
    </Card>
  )
}
