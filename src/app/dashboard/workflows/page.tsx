'use client';

import React, { useState } from 'react';
import { 
  Play, Pause, Square, RotateCcw, FastForward, CheckCircle2, AlertCircle, Clock, 
  Search, ShieldCheck, Database, GitMerge, Box, Activity, ChevronRight, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WorkflowsPage() {
  const [selectedNode, setSelectedNode] = useState<number | null>(2); // Default to Profiling Agent
  
  const pipeline = [
    { id: 1, name: 'Dataset Ingestion', status: 'Completed', icon: <Database className="w-5 h-5" /> },
    { id: 2, name: 'Profiling Agent', status: 'Completed', icon: <Search className="w-5 h-5" /> },
    { id: 3, name: 'Data Quality Agent', status: 'Completed', icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 4, name: 'Cleaning Agent', status: 'Completed', icon: <CheckCircle2 className="w-5 h-5" /> },
    { id: 5, name: 'Transformation Agent', status: 'Completed', icon: <GitMerge className="w-5 h-5" /> },
    { id: 6, name: 'Feature Engineering', status: 'Completed', icon: <Box className="w-5 h-5" /> },
    { id: 7, name: 'Synthetic Data Agent', status: 'Completed', icon: <Activity className="w-5 h-5" /> },
    { id: 8, name: 'Model Strategy Agent', status: 'Running', icon: <Box className="w-5 h-5" /> },
    { id: 9, name: 'Model Selection Agent', status: 'Waiting', icon: <Box className="w-5 h-5" /> },
    { id: 10, name: 'Training Agent', status: 'Waiting', icon: <Box className="w-5 h-5" /> },
    { id: 11, name: 'Validation Agent', status: 'Waiting', icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 12, name: 'Prediction Agent', status: 'Waiting', icon: <Activity className="w-5 h-5" /> },
  ];

  return (
    <div className="max-w-[1400px] mx-auto w-full font-sans flex flex-col h-[calc(100vh-64px)] relative">
      <header className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Active Workflow</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Dataset: <span className="text-slate-800 font-bold">customer_churn_v4.csv</span></p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors">
            <Pause className="w-4 h-4" fill="currentColor" /> Pause
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors">
            <Square className="w-4 h-4" fill="currentColor" /> Stop
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1"></div>
          <button className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition-colors">
            <FastForward className="w-4 h-4" fill="currentColor" /> Continue Next Step
          </button>
        </div>
      </header>

      {/* Main Execution Center */}
      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
        
        {/* Pipeline Visualization (Vertical) */}
        <div className="w-[320px] bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 overflow-y-auto flex-shrink-0 relative">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Execution Pipeline</div>
          
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[23px] top-4 bottom-4 w-[2px] bg-slate-100 z-0"></div>
            <div className="absolute left-[23px] top-4 h-[58%] w-[2px] bg-emerald-500 z-0 transition-all duration-1000"></div>

            <div className="flex flex-col gap-6 relative z-10">
              {pipeline.map((step) => {
                const isSelected = selectedNode === step.id;
                const isCompleted = step.status === 'Completed';
                const isRunning = step.status === 'Running';
                
                return (
                  <div 
                    key={step.id} 
                    onClick={() => setSelectedNode(step.id)}
                    className={`flex items-start gap-4 cursor-pointer group p-2 rounded-xl transition-all ${isSelected ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
                  >
                    <div className="relative">
                      {isRunning && (
                        <div className="absolute inset-[-4px] rounded-full border border-dashed border-emerald-500 animate-[spin_4s_linear_infinite]"></div>
                      )}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted ? 'bg-white border-emerald-500 text-emerald-600 shadow-sm' :
                        isRunning ? 'bg-emerald-600 border-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' :
                        'bg-white border-slate-200 text-slate-400'
                      }`}>
                        {step.icon}
                      </div>
                    </div>
                    <div className="pt-1.5 flex-1">
                      <div className={`text-sm font-bold ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>{step.name}</div>
                      <div className={`text-[10px] font-bold mt-0.5 uppercase tracking-wider ${
                        isCompleted ? 'text-emerald-500' :
                        isRunning ? 'text-emerald-600' :
                        'text-slate-400'
                      }`}>
                        {step.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <AnimatePresence mode="wait">
          {selectedNode === 2 ? (
            <motion.div 
              key="panel-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-8 overflow-y-auto"
            >
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Search className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Profiling Agent</h2>
                  <p className="text-sm font-medium text-slate-500">Execution time: 00:04:12 • Completed successfully</p>
                </div>
                <div className="ml-auto flex gap-2">
                  <button className="px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors">
                    <RotateCcw className="w-4 h-4" /> Re-run
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {/* Left Side */}
                <div className="space-y-8">
                  <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Input Data</h3>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <span className="font-semibold text-slate-700">customer_churn_v4.csv</span>
                      <button className="text-emerald-600 text-xs font-bold hover:underline">View Source &rarr;</button>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Agent Findings</h3>
                    <div className="space-y-3">
                      <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-2xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                        <div>
                          <div className="text-sm font-bold text-slate-900">3.2% Missing Values</div>
                          <div className="text-xs text-slate-600 mt-1">Detected primarily in 'Income' and 'Tenure' columns.</div>
                        </div>
                      </div>
                      <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3">
                        <Activity className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <div className="text-sm font-bold text-slate-900">Class Imbalance Detected</div>
                          <div className="text-xs text-slate-600 mt-1">Target variable 'Churn' has an 8% minority class representation.</div>
                        </div>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-start gap-3">
                        <Database className="w-5 h-5 text-slate-500 mt-0.5" />
                        <div>
                          <div className="text-sm font-bold text-slate-900">125,000 rows • 42 columns</div>
                          <div className="text-xs text-slate-600 mt-1">38 numerical features, 4 categorical features.</div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Side */}
                <div className="space-y-8">
                  <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Autonomous Decisions</h3>
                    <div className="bg-[#0F172A] rounded-2xl p-6 shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                      <p className="text-white text-lg font-medium leading-relaxed relative z-10 mb-6">
                        "Activate Synthetic Data Agent because class imbalance exceeds configured threshold of 15%."
                      </p>
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4" /> 96% Confidence
                        </div>
                        <button className="text-xs font-bold text-slate-300 hover:text-white border border-slate-700 px-3 py-1.5 rounded-lg transition-colors">
                          Explain Decision
                        </button>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Next Step Generated</h3>
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-emerald-600" />
                        <span className="font-bold text-emerald-800">Route to Data Quality Agent</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-emerald-600" />
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-slate-400"
            >
              <Box className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-semibold">Select a node to view agent details.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
