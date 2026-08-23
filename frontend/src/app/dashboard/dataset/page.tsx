"use client"
import React, { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { UploadCloud, FileSpreadsheet, Play, CheckCircle2, ShieldAlert } from "lucide-react"

export default function DatasetWorkspace() {
  const [analyzing, setAnalyzing] = useState(false)

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Dataset Workspace</h1>
          <p className="text-slate-400">Upload and manage datasets for AgentIQ processing.</p>
        </div>
        <Button 
          onClick={() => setAnalyzing(true)}
          className={`gap-2 ${analyzing ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-brand-dark hover:bg-brand-dark/80 text-white'}`}
          disabled={analyzing}
        >
          {analyzing ? <><CheckCircle2 size={16} /> Dataset received by Master Agent</> : <><Play size={16} /> Start AgentIQ Analysis</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 p-8 border-dashed border-2 border-white/10 hover:border-brand-light/30 transition-colors bg-black/20 flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-brand-light/10 flex items-center justify-center text-brand-light mb-4">
            <UploadCloud size={32} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Drag & Drop Dataset</h3>
          <p className="text-slate-400 text-sm mb-6 text-center max-w-md">Upload CSV, Excel, or Parquet files. AgentIQ will automatically profile and dictionary your data upon analysis.</p>
          <div className="flex gap-4">
            <Button variant="outline" className="border-white/10 text-slate-300 hover:text-white">Browse Files</Button>
            <Button variant="outline" className="border-white/10 text-slate-300 hover:text-white flex items-center gap-2">
              Connect Database
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/5 flex flex-col">
          <h3 className="text-sm font-bold text-slate-300 tracking-wider mb-4 flex items-center gap-2">
            <FileSpreadsheet size={16} className="text-brand-light" /> CURRENT DATASET
          </h3>
          <div className="space-y-4 flex-1">
            <div>
              <div className="text-xs text-slate-500 mb-1">Filename</div>
              <div className="font-semibold text-slate-200">customer_churn_Q3.csv</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">Rows</div>
                <div className="font-semibold text-white">125,000</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Columns</div>
                <div className="font-semibold text-white">42</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">File Size</div>
                <div className="font-semibold text-white">24.5 MB</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Version</div>
                <Badge className="bg-brand-dark/20 text-brand-light border-brand-light/20">V5</Badge>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Upload Timestamp</div>
              <div className="text-sm text-slate-300">2026-08-23 10:45 AM</div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-black/40 backdrop-blur-xl border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-300 tracking-wider">DATASET PREVIEW</h3>
          <Badge variant="outline" className="text-slate-500 border-white/10">Showing top 5 rows</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/[0.02] text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-3 font-medium">Column</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Example Value</th>
                <th className="px-6 py-3 font-medium">Missing %</th>
                <th className="px-6 py-3 font-medium">Unique %</th>
                <th className="px-6 py-3 font-medium">Privacy Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-brand-light">customer_id</td>
                <td className="px-6 py-4"><Badge variant="outline" className="text-slate-400">UUID</Badge></td>
                <td className="px-6 py-4 font-mono text-xs">usr_892a...</td>
                <td className="px-6 py-4 text-emerald-400">0%</td>
                <td className="px-6 py-4">100%</td>
                <td className="px-6 py-4"><ShieldAlert size={14} className="text-amber-500 inline mr-1"/> High</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-brand-light">age</td>
                <td className="px-6 py-4"><Badge variant="outline" className="text-slate-400">Numeric</Badge></td>
                <td className="px-6 py-4 font-mono text-xs">34</td>
                <td className="px-6 py-4 text-emerald-400">0%</td>
                <td className="px-6 py-4">0.05%</td>
                <td className="px-6 py-4 text-slate-500">Low</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-brand-light">last_purchase_date</td>
                <td className="px-6 py-4"><Badge variant="outline" className="text-slate-400">Datetime</Badge></td>
                <td className="px-6 py-4 font-mono text-xs">2026-08-10</td>
                <td className="px-6 py-4 text-amber-400">2.4%</td>
                <td className="px-6 py-4">42%</td>
                <td className="px-6 py-4 text-slate-500">Low</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
