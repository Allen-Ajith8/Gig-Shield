"use client"
import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { UploadCloud, FileSpreadsheet, Loader2, CheckCircle2, Download, AlertTriangle, Play, ChevronRight, FileCheck } from "lucide-react"
import { api } from "@/lib/api"

export default function DatasetCarousel() {
  const [step, setStep] = useState<number>(0)
  const [datasetId, setDatasetId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [outliers, setOutliers] = useState<any[]>([])
  const [loadingText, setLoadingText] = useState("Initializing analysis...")
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Carousel transition variants
  const variants = {
    initial: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" as any }
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? -100 : 100,
      transition: { duration: 0.3, ease: "easeIn" as any }
    })
  }

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
      // Background loading text changer
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
      setOutliers(result.outliers || [])
      setStep(2) // Move to results step
      setUploading(false)
    } catch (err) {
      console.error(err)
      alert("Analysis failed")
      setStep(0)
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto min-h-[500px] flex flex-col justify-center relative overflow-hidden">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-[var(--fg-base)] mb-2">Dataset Analysis</h1>
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <span className={step === 0 ? "text-[var(--brand-light)] font-medium" : ""}>1. Upload</span>
          <ChevronRight size={14} className="opacity-50" />
          <span className={step === 1 ? "text-[var(--brand-light)] font-medium" : ""}>2. Process</span>
          <ChevronRight size={14} className="opacity-50" />
          <span className={step === 2 ? "text-[var(--brand-light)] font-medium" : ""}>3. Results</span>
        </div>
      </div>

      <div className="relative flex-1">
        <AnimatePresence mode="wait" custom={1}>
          {step === 0 && (
            <motion.div
              key="step-0"
              custom={1}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0"
            >
              <Card className="p-12 border-dashed border-2 border-[var(--color-border)] hover:border-[var(--brand-light)]/40 transition-colors flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 rounded-full bg-[var(--brand-light)]/10 flex items-center justify-center text-[var(--brand-light)] mb-4">
                  <UploadCloud size={32} />
                </div>
                <h3 className="text-xl font-semibold text-[var(--fg-base)] mb-2">Upload Datasheet</h3>
                <p className="text-sm text-slate-400 mb-8 text-center max-w-sm">
                  Drag and drop or select your CSV/Parquet file. AgentIQ will automatically detect anomalies and outliers.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleUpload}
                  accept=".csv,.parquet"
                  className="hidden"
                />
                <Button
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  Browse Files
                </Button>
              </Card>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-1"
              custom={1}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0"
            >
              <Card className="p-12 flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 size={48} className="text-[var(--brand-light)] animate-spin mb-6" />
                <h3 className="text-xl font-semibold text-[var(--fg-base)] mb-2">Processing Data</h3>
                <p className="text-sm text-slate-400 max-w-sm text-center h-6 overflow-hidden">
                  <motion.span
                    key={loadingText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="block"
                  >
                    {loadingText}
                  </motion.span>
                </p>
                
                <div className="w-64 h-1.5 bg-slate-800 rounded-full mt-8 overflow-hidden relative">
                  <motion.div 
                    className="absolute top-0 left-0 bottom-0 bg-gradient-brand rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.5, ease: "easeInOut" as any }}
                  />
                </div>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              custom={1}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0"
            >
              <Card className="p-8 min-h-[400px] flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--fg-base)]">Analysis Complete</h3>
                    <p className="text-sm text-slate-400">Processed dataset {datasetId}</p>
                  </div>
                  <div className="ml-auto flex gap-3">
                    <Button variant="ghost" onClick={() => setStep(0)}>
                      Upload Another
                    </Button>
                    <a href={datasetId ? api.getDownloadUrl(datasetId) : "#"} download>
                      <Button className="bg-emerald-600 hover:bg-emerald-500 text-white border-none gap-2">
                        <Download size={16} /> Download CSV
                      </Button>
                    </a>
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-[var(--fg-base)] mb-4 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-400" /> Detected Outliers
                  </h4>
                  
                  {outliers.length === 0 ? (
                    <div className="text-center py-12 border rounded-xl border-[var(--color-border)] bg-[var(--color-surface)]">
                      <FileCheck size={32} className="mx-auto mb-3 text-emerald-400/50" />
                      <p className="text-slate-400 text-sm">No significant outliers detected in the dataset.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {outliers.map((outlier, i) => (
                        <div key={i} className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col">
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="warning" className="font-mono">{outlier.column}</Badge>
                            <span className="text-xs text-amber-400 font-medium">{outlier.count} outliers</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-black/20 p-2 rounded">
                              <span className="text-slate-500 block mb-0.5">Mean</span>
                              <span className="font-mono text-slate-200">{outlier.mean}</span>
                            </div>
                            <div className="bg-black/20 p-2 rounded">
                              <span className="text-slate-500 block mb-0.5">Std Dev</span>
                              <span className="font-mono text-slate-200">{outlier.std}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
