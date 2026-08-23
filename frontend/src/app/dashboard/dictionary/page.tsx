"use client"
import React, { useState } from "react"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { BookType, Bot, ShieldAlert, Sparkles } from "lucide-react"

export default function DataDictionaryPage() {
  const [selectedCol, setSelectedCol] = useState<any>(null)

  const columns = [
    { name: "customer_id", type: "UUID", desc: "Unique identifier for the customer", example: "usr_123", missing: "0%", unique: "100%", ml: "Low", privacy: "High", conf: 99 },
    { name: "age", type: "Numeric", desc: "Customer's age at registration", example: "34", missing: "0%", unique: "0.05%", ml: "High", privacy: "Low", conf: 95 },
    { name: "monthly_spend", type: "Float", desc: "Average monthly spend in USD", example: "142.50", missing: "0%", unique: "89%", ml: "High", privacy: "Low", conf: 92 },
    { name: "email", type: "String", desc: "Customer contact email address", example: "john@example.com", missing: "12%", unique: "88%", ml: "None", privacy: "Critical", conf: 99 },
  ]

  return (
    <div className="space-y-6 pb-24 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">AI Data Dictionary</h1>
          <p className="text-slate-400">AgentIQ automatically understands what every column means.</p>
        </div>
        <Button className="bg-brand-dark/20 text-brand-light border border-brand-light/30 hover:bg-brand-dark/40 gap-2">
          <Sparkles size={16} /> Regenerate Descriptions
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <Card className="col-span-2 bg-black/40 backdrop-blur-xl border-white/5 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/[0.02] text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-medium">Column</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 font-medium">ML Relevance</th>
                  <th className="px-6 py-3 font-medium">Privacy Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {columns.map(col => (
                  <tr key={col.name} onClick={() => setSelectedCol(col)} className={`cursor-pointer transition-colors ${selectedCol?.name === col.name ? 'bg-brand-dark/10 border-l-2 border-brand-light' : 'hover:bg-white/[0.02]'}`}>
                    <td className="px-6 py-4 font-medium text-brand-light">{col.name}</td>
                    <td className="px-6 py-4"><Badge variant="outline" className="text-slate-400">{col.type}</Badge></td>
                    <td className="px-6 py-4 text-slate-300">{col.desc}</td>
                    <td className="px-6 py-4">
                      {col.ml === "High" ? <Badge className="bg-emerald-500/10 text-emerald-400 border-none">High</Badge> : <span className="text-slate-500">{col.ml}</span>}
                    </td>
                    <td className="px-6 py-4">
                      {col.privacy === "Critical" ? <Badge className="bg-red-500/10 text-red-400 border-none">Critical</Badge> : <span className="text-slate-500">{col.privacy}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {selectedCol ? (
          <Card className="p-6 bg-brand-dark/5 backdrop-blur-xl border-brand-light/20 flex flex-col">
            <h3 className="text-sm font-bold text-brand-light tracking-wider mb-6 flex items-center gap-2">
              <BookType size={16} /> COLUMN INTELLIGENCE
            </h3>
            <div className="mb-6">
              <div className="text-2xl font-bold text-white mb-2">{selectedCol.name}</div>
              <Badge variant="outline" className="text-slate-400">{selectedCol.type}</Badge>
            </div>
            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <span className="block text-xs text-slate-500 mb-1">Agent Description</span>
                <p className="font-medium">{selectedCol.desc}</p>
              </div>
              <div>
                <span className="block text-xs text-slate-500 mb-1">Example</span>
                <code className="bg-black/40 px-2 py-1 rounded text-brand-light">{selectedCol.example}</code>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div><span className="block text-xs text-slate-500 mb-1">Missing</span>{selectedCol.missing}</div>
                <div><span className="block text-xs text-slate-500 mb-1">Unique</span>{selectedCol.unique}</div>
                <div><span className="block text-xs text-slate-500 mb-1">Confidence</span><span className="text-brand-light">{selectedCol.conf}%</span></div>
              </div>
            </div>
            <div className="mt-auto pt-6">
              <Button className="w-full bg-brand-dark/20 text-brand-light border border-brand-light/30 hover:bg-brand-dark/40">Ask Agent About Column</Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/5 flex flex-col items-center justify-center text-slate-500">
            <BookType size={32} className="mb-4 opacity-50" />
            <p className="text-sm text-center">Select a column to view detailed intelligence.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
