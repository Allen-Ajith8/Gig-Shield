'use client';

import React from 'react';
import { Target, UploadCloud, FileText, CheckCircle2, ChevronRight, Activity, Zap } from 'lucide-react';

export default function PredictionsPage() {
  return (
    <div className="max-w-[1400px] mx-auto w-full font-sans pb-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Predictions</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Run inference using your deployed models.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Input Column */}
        <div className="xl:col-span-1 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Active Model</h2>
            <div className="bg-[#0F172A] rounded-2xl p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm">XGBoost v3</div>
                  <div className="text-[10px] text-slate-400">customer_churn_model</div>
                </div>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-[10px] font-bold">Deployed</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Batch Prediction</h2>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-700 mb-1">Upload CSV or Excel</div>
              <div className="text-xs text-slate-500 max-w-[200px]">Drag and drop your file here, or click to browse.</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Single Record Prediction</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Customer ID (Optional)</label>
                <input type="text" placeholder="e.g. CUS-9921" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Contract Type</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                  <option>Month-to-month</option>
                  <option>One year</option>
                  <option>Two year</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Tenure (Months)</label>
                  <input type="number" defaultValue={4} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Monthly Charges</label>
                  <input type="number" defaultValue={89.50} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>
              </div>
            </div>
            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl text-sm font-bold shadow-md transition-colors">
              Run Prediction
            </button>
          </div>

        </div>

        {/* Results Column */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] h-full">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-8">
              <Target className="w-4 h-4 text-emerald-500" /> Prediction Results
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 flex flex-col md:flex-row items-center gap-8 mb-10">
              <div className="flex-1 text-center md:text-left border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-8">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Prediction</div>
                <div className="text-4xl font-bold text-red-500 mb-2">Likely to Churn</div>
                <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold">
                  <Activity className="w-3.5 h-3.5" /> High Risk
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Confidence Score</div>
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" className="stroke-slate-200" strokeWidth="12" fill="none" />
                    <circle cx="64" cy="64" r="56" className="stroke-emerald-500" strokeWidth="12" fill="none" strokeDasharray="324 351" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-bold text-slate-900">92%</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" /> Explanation (Top Factors)
              </h3>
              
              <div className="space-y-6">
                {[
                  { factor: 'Contract Duration', value: 'Month-to-month', impact: 'High', impactVal: 85, color: 'bg-red-500', barColor: 'bg-red-500' },
                  { factor: 'Monthly Charges', value: '$89.50', impact: 'Medium', impactVal: 65, color: 'bg-orange-500', barColor: 'bg-orange-400' },
                  { factor: 'Tenure', value: '4 Months', impact: 'Medium', impactVal: 55, color: 'bg-orange-500', barColor: 'bg-orange-400' },
                  { factor: 'Support Tickets', value: '3', impact: 'Low', impactVal: 25, color: 'bg-slate-500', barColor: 'bg-slate-300' },
                ].map((f) => (
                  <div key={f.factor}>
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <div className="text-sm font-bold text-slate-800">{f.factor}</div>
                        <div className="text-xs text-slate-500">Value: {f.value}</div>
                      </div>
                      <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white ${f.color}`}>
                        {f.impact} Impact
                      </div>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${f.barColor}`} style={{ width: `${f.impactVal}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-blue-50/50 border border-blue-100 rounded-2xl p-5 text-sm text-slate-700 leading-relaxed">
                <strong className="text-slate-900 block mb-1">AI Summary:</strong>
                This customer exhibits a classic churn pattern characterized by a short tenure (4 months) combined with a month-to-month contract and relatively high monthly charges. The model strongly associates these three factors with a high probability of churn within the next 30 days.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
