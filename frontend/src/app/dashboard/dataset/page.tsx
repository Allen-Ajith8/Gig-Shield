"use client"
import React, { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { UploadCloud, FileSpreadsheet, Play, CheckCircle2, ShieldAlert } from "lucide-react"
import { api } from "@/lib/api"

export default function DatasetWorkspace() {
  const [analyzing, setAnalyzing] = useState(false)
  const [datasetId, setDatasetId] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const res = await api.uploadDataset(file)
      setDatasetId(res.dataset_id)
      setMetadata(res.metadata)
    } catch (err) {
      console.error(err)
      alert("Failed to upload file")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleStartAnalysis = async () => {
    if (!datasetId) return alert("Please upload a dataset first")
    
    setAnalyzing(true)
    try {
      await api.startWorkflow("Analyze and prepare dataset for ML", datasetId)
    } catch (err) {
      console.error(err)
      alert("Failed to start analysis")
      setAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--fg-base)] mb-1">Dataset Workspace</h1>
          <p className="text-slate-400">Upload and manage datasets for AgentIQ processing.</p>
        </div>
        <Button 
          onClick={handleStartAnalysis}
          className={`gap-2 ${analyzing ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-[var(--brand-dark)] hover:bg-opacity-80 text-white'}`}
          disabled={analyzing || !datasetId}
        >
          {analyzing ? <><CheckCircle2 size={16} /> Dataset received by Master Agent</> : <><Play size={16} /> Start AgentIQ Analysis</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 p-8 border-dashed border-2 hover:border-[var(--brand-light)] transition-colors glass flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-[var(--brand-light)]/10 flex items-center justify-center text-[var(--brand-light)] mb-4">
            <UploadCloud size={32} />
          </div>
          <h3 className="text-lg font-semibold text-[var(--fg-base)] mb-2">Drag & Drop Dataset</h3>
          <p className="text-slate-400 text-sm mb-6 text-center max-w-md">Upload CSV or Parquet files. AgentIQ will automatically profile and dictionary your data upon analysis.</p>
          <div className="flex gap-4">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,.parquet" 
              className="hidden" 
            />
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-slate-300 hover:text-[var(--fg-base)]"
            >
              {uploading ? "Uploading..." : "Browse Files"}
            </Button>
            <Button variant="outline" className="text-slate-300 hover:text-[var(--fg-base)] flex items-center gap-2">
              Connect Database
            </Button>
          </div>
        </Card>

        <Card className="p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-300 tracking-wider mb-4 flex items-center gap-2">
            <FileSpreadsheet size={16} className="text-[var(--brand-light)]" /> CURRENT DATASET
          </h3>
          <div className="space-y-4 flex-1">
            {datasetId ? (
              <>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Dataset ID</div>
                  <div className="font-semibold text-[var(--fg-base)]">{datasetId}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Rows</div>
                    <div className="font-semibold text-[var(--fg-base)]">{metadata?.rows.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Columns</div>
                    <div className="font-semibold text-[var(--fg-base)]">{metadata?.columns}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Status</div>
                    <div className="font-semibold text-emerald-400">Uploaded</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Version</div>
                    <Badge className="bg-[var(--brand-dark)]/20 text-[var(--brand-light)] border-[var(--brand-light)]/20">V1</Badge>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-slate-500">
                No dataset uploaded yet.
              </div>
            )}
          </div>
        </Card>
      </div>

      {metadata && (
        <Card className="overflow-hidden p-0">
          <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 tracking-wider">DATASET PREVIEW</h3>
            <Badge variant="outline" className="text-slate-500">Showing top rows</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[var(--color-border)] text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-medium">Column</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Example Value</th>
                  <th className="px-6 py-3 font-medium">Missing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] text-[var(--fg-base)]">
                {metadata.schema.map((col: any, i: number) => (
                  <tr key={i} className="hover:bg-[var(--color-surface)] transition-colors">
                    <td className="px-6 py-4 font-medium text-[var(--brand-light)]">{col.column}</td>
                    <td className="px-6 py-4"><Badge variant="outline" className="text-slate-400">{col.type}</Badge></td>
                    <td className="px-6 py-4 font-mono text-xs">{metadata.head[0][col.column] !== null ? String(metadata.head[0][col.column]) : 'null'}</td>
                    <td className="px-6 py-4 text-slate-400">{col.null_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
