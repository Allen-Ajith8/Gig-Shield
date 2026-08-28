'use client';

import React from 'react';
import { Sparkles, AlertTriangle, Lightbulb, TrendingUp, BarChart2, Activity, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DataInsightsPage() {
  return (
    <div className="max-w-[1400px] mx-auto w-full font-sans pb-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Data Insights</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">What is happening with your data? (Dataset: <span className="text-slate-800 font-bold">customer_churn_v4.csv</span>)</p>
        </div>
        <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors flex items-center gap-2">
          <DownloadIcon className="w-4 h-4" /> Download Report
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        
        {/* Data Profile */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-6">
            <BarChart2 className="w-4 h-4 text-indigo-500" /> Data Profile
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Rows</div>
              <div className="text-2xl font-bold text-slate-900">125,000</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Columns</div>
              <div className="text-2xl font-bold text-slate-900">42</div>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { label: 'Numerical Columns', val: 38 },
              { label: 'Categorical Columns', val: 4 },
              { label: 'Date Columns', val: 0 },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between text-xs font-semibold">
                <div className="text-slate-600">{s.label}</div>
                <div className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Quality */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Activity className="w-4 h-4 text-emerald-500" /> Data Quality
            </div>
            <div className="text-xl font-bold text-slate-900">94.6<span className="text-[10px] text-slate-400 uppercase ml-1">/100</span></div>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Completeness', val: 97 },
              { label: 'Consistency', val: 93 },
              { label: 'Validity', val: 95 },
              { label: 'Uniqueness', val: 94 },
              { label: 'Integrity', val: 98 },
            ].map((metric) => (
              <div key={metric.label}>
                <div className="flex justify-between text-[11px] font-bold mb-1">
                  <span className="text-slate-600">{metric.label}</span>
                  <span className="text-slate-900">{metric.val}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${metric.val > 95 ? 'bg-emerald-500' : 'bg-orange-400'}`} style={{ width: `${metric.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Values Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-6">
            <TrendingUp className="w-4 h-4 text-orange-500" /> Missing Values by Column
          </div>
          <div className="flex-1 flex items-end justify-between px-2 pb-4">
            {[
              { col: 'Income', val: 3.2 },
              { col: 'Tenure', val: 1.8 },
              { col: 'Age', val: 1.2 },
              { col: 'Zip', val: 0.5 },
            ].map(m => (
              <div key={m.col} className="flex flex-col items-center gap-2 group w-12">
                <div className="text-[10px] font-bold text-slate-500">{m.val}%</div>
                <div className="w-full h-24 bg-slate-50 rounded-t-lg relative flex flex-col justify-end">
                  <motion.div initial={{ height: 0 }} animate={{ height: `${m.val * 30}%` }} className="w-full bg-orange-400 rounded-t-lg opacity-80 group-hover:opacity-100 transition-opacity"></motion.div>
                </div>
                <div className="text-[9px] font-bold text-slate-600 truncate w-full text-center">{m.col}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* AI Findings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-6">
            <Sparkles className="w-4 h-4 text-emerald-500" /> AI Findings (Anomalies)
          </div>
          <div className="space-y-4">
            <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-slate-900 mb-1">Income contains 2.4% extreme outliers.</div>
                <div className="text-xs text-slate-600 leading-relaxed">Values in the `monthly_income` column exceed 5 standard deviations from the mean (e.g., $9,999,999).</div>
              </div>
            </div>
            
            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3">
              <Activity className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-slate-900 mb-1">Target class is highly imbalanced.</div>
                <div className="text-xs text-slate-600 leading-relaxed">The target column `churn` has a 92% to 8% class ratio, which will negatively affect model precision for the minority class.</div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-start gap-3">
              <Search className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-slate-900 mb-1">Three columns contain missing values.</div>
                <div className="text-xs text-slate-600 leading-relaxed">`income` (3.2%), `tenure` (1.8%), and `age` (1.2%) have null representations.</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-6">
            <Lightbulb className="w-4 h-4 text-amber-500" /> AI Recommendations
          </div>
          
          <div className="space-y-4">
            <div className="bg-[#0F172A] p-5 rounded-2xl relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="text-white font-bold text-sm mb-2">"Consider synthetic sampling (SMOTE)."</div>
                <div className="text-slate-400 text-xs mb-3">
                  <strong className="text-slate-300">Reason:</strong> To correct the 92/8 class imbalance and improve recall.<br/>
                  <strong className="text-slate-300">Evidence:</strong> Logistic Regression baseline showed 0.34 recall on minority class.
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 98% Confidence
                  </div>
                  <button className="text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition-colors">Apply Fix</button>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
              <div className="text-slate-900 font-bold text-sm mb-2">"Impute missing income values using median strategy."</div>
              <div className="text-slate-500 text-xs mb-3">
                <strong className="text-slate-700">Reason:</strong> Median is robust against the 2.4% extreme outliers detected in this column.<br/>
                <strong className="text-slate-700">Evidence:</strong> Mean strategy would skew predictions by +14%.
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 92% Confidence
                </div>
                <button className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors">Apply Fix</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function DownloadIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}
function Search(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}
