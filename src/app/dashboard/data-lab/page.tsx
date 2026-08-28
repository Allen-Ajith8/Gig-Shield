'use client';

import React, { useState } from 'react';
import { Settings, RefreshCw, CheckCircle2, AlertCircle, X, Check, Activity, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DataLabPage() {
  const [activeTab, setActiveTab] = useState<'cleaning' | 'transformation' | 'feature' | 'synthetic'>('synthetic');

  return (
    <div className="max-w-[1400px] mx-auto w-full font-sans pb-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Data Lab</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Interact with and tune your data transformations.</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200 pb-px">
        {[
          { id: 'cleaning', label: 'Cleaning' },
          { id: 'transformation', label: 'Transformation' },
          { id: 'feature', label: 'Feature Engineering' },
          { id: 'synthetic', label: 'Synthetic Data' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-emerald-500 text-emerald-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'synthetic' && (
          <motion.div 
            key="synthetic"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 xl:grid-cols-2 gap-6"
          >
            {/* Context & Actions */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl flex items-start gap-3 mb-8">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-slate-900 mb-1">Class imbalance detected.</div>
                  <div className="text-xs text-slate-600 leading-relaxed">The target column `churn` contains 92% negative instances and only 8% positive instances. The Agent recommends generating synthetic data to balance the classes and improve model recall.</div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Generation Strategy</div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-emerald-50 border border-emerald-200 text-emerald-700 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> SMOTE (Recommended)
                    </button>
                    <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 py-3 rounded-xl text-sm font-bold transition-colors">
                      ADASYN
                    </button>
                    <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 py-3 rounded-xl text-sm font-bold transition-colors">
                      Random Oversampling
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Original Records</div>
                    <div className="text-2xl font-bold text-slate-900">125,000</div>
                  </div>
                  <div className="bg-emerald-50/30 border border-emerald-100 p-4 rounded-2xl">
                    <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Synthetic Generated</div>
                    <div className="text-2xl font-bold text-emerald-700">+ 4,200</div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-sm font-bold shadow-md transition-colors flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Accept Data
                  </button>
                  <button className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                    <X className="w-4 h-4" /> Discard
                  </button>
                </div>
              </div>
            </div>

            {/* Before / After Charts */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-8">
                <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-emerald-500" /> Class Distribution
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wider">
                  Similarity Score: 96.4%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 h-[250px]">
                {/* Before */}
                <div className="relative flex flex-col items-center h-full">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Before</div>
                  <div className="flex items-end justify-center gap-8 w-full flex-1">
                    <div className="w-16 flex flex-col items-center">
                      <div className="text-[11px] font-bold text-slate-500 mb-2">92%</div>
                      <div className="w-12 bg-slate-200 rounded-t-lg h-[180px]"></div>
                      <div className="text-[10px] font-bold text-slate-600 mt-3">Class A</div>
                    </div>
                    <div className="w-16 flex flex-col items-center">
                      <div className="text-[11px] font-bold text-slate-500 mb-2">8%</div>
                      <div className="w-12 bg-blue-400 rounded-t-lg h-[16px]"></div>
                      <div className="text-[10px] font-bold text-slate-600 mt-3">Class B</div>
                    </div>
                  </div>
                </div>

                {/* After */}
                <div className="relative flex flex-col items-center h-full border-l border-slate-100 pl-8">
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-6">After</div>
                  <div className="flex items-end justify-center gap-8 w-full flex-1">
                    <div className="w-16 flex flex-col items-center">
                      <div className="text-[11px] font-bold text-emerald-700 mb-2">75%</div>
                      <div className="w-12 bg-slate-200 rounded-t-lg h-[150px]"></div>
                      <div className="text-[10px] font-bold text-slate-600 mt-3">Class A</div>
                    </div>
                    <div className="w-16 flex flex-col items-center">
                      <div className="text-[11px] font-bold text-emerald-700 mb-2">25%</div>
                      <div className="w-12 bg-emerald-500 rounded-t-lg h-[50px] shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
                      <div className="text-[10px] font-bold text-slate-600 mt-3">Class B</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Feature Engineering Tab Placeholder */}
        {activeTab === 'feature' && (
          <motion.div 
            key="feature"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
          >
            <div className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-500" /> Generated Features
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'CustomerTenure', formula: '(current_date - signup_date) / 365', imp: 'High', corr: '0.64' },
                { name: 'AverageTransactionValue', formula: 'total_spend / transaction_count', imp: 'Medium', corr: '0.42' },
                { name: 'MonthlySpendRatio', formula: 'monthly_charges / total_spend', imp: 'Low', corr: '0.12' },
              ].map(f => (
                <div key={f.name} className="border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:border-slate-200 transition-colors">
                  <div>
                    <div className="font-bold text-slate-900 text-sm mb-1">{f.name}</div>
                    <div className="text-xs font-mono text-slate-500 bg-slate-50 inline-block px-2 py-0.5 rounded border border-slate-100">{f.formula}</div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Importance</div>
                      <div className={`text-xs font-bold ${f.imp === 'High' ? 'text-emerald-600' : f.imp === 'Medium' ? 'text-amber-500' : 'text-slate-500'}`}>{f.imp}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Correlation</div>
                      <div className="text-xs font-bold text-slate-700">{f.corr}</div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button className="px-4 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-colors">Accept</button>
                      <button className="px-4 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg text-xs font-bold transition-colors">Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
