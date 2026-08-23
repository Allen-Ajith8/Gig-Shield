"use client"
import React from "react"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { ClipboardList, Filter, Download } from "lucide-react"

export default function AuditLogPage() {
  const logs = [
    { time: "21:07:42", agent: "Validation Agent", action: "Validated synthetic data", reason: "Distribution similarity 94%", ver: "V4", status: "Passed" },
    { time: "21:06:15", agent: "Synthetic Agent", action: "Generated 25K records", reason: "Master Agent request", ver: "V4", status: "Completed" },
    { time: "21:05:00", agent: "Master Agent", action: "Activated Synthetic Agent", reason: "Imbalance detected", ver: "V3", status: "Completed" },
    { time: "21:04:12", agent: "Profiling Agent", action: "Detected imbalance", reason: "Class distribution < 10%", ver: "V2", status: "Warning" },
    { time: "21:03:45", agent: "Feature Agent", action: "Removed 5 features", reason: "Zero variance", ver: "V2", status: "Completed" },
    { time: "21:02:10", agent: "Quality Agent", action: "Imputed missing values", reason: "Found 2.4% missing in age", ver: "V1", status: "Completed" },
  ]

  return (
    <div className="space-y-6 pb-24 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">AI Audit Trail</h1>
          <p className="text-slate-400">Every important AI action is traceable and logged for compliance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 text-slate-300 hover:text-white hover:bg-white/5 gap-2"><Filter size={16}/> Filter</Button>
          <Button variant="outline" className="border-white/10 text-slate-300 hover:text-white hover:bg-white/5 gap-2"><Download size={16}/> Export CSV</Button>
        </div>
      </div>

      <Card className="flex-1 bg-black/40 backdrop-blur-xl border-white/5 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/[0.02] text-xs uppercase text-slate-400 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">Agent</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Reason</th>
                <th className="px-6 py-4 font-medium">Dataset</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {logs.map((log, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{log.time}</td>
                  <td className="px-6 py-4 font-medium text-brand-light">{log.agent}</td>
                  <td className="px-6 py-4 text-white">{log.action}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs">{log.reason}</td>
                  <td className="px-6 py-4"><Badge variant="outline" className="text-slate-500 border-white/10">{log.ver}</Badge></td>
                  <td className="px-6 py-4">
                    {log.status === "Passed" ? <Badge className="bg-emerald-500/10 text-emerald-400 border-none">Passed</Badge> : 
                     log.status === "Warning" ? <Badge className="bg-amber-500/10 text-amber-400 border-none">Warning</Badge> : 
                     <Badge className="bg-white/10 text-slate-300 border-none">Completed</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
