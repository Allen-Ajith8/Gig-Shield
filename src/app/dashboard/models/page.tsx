'use client';

import React from 'react';
import { Target, Zap, Play, Box, CheckCircle2, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ModelsPage() {
  const models = [
    { name: 'XGBoost', acc: '94.2%', prec: '0.93', rec: '0.91', f1: '0.92', roc: '0.96', time: '04m 32s', status: 'Trained', selected: true },
    { name: 'LightGBM', acc: '93.5%', prec: '0.92', rec: '0.89', f1: '0.91', roc: '0.95', time: '02m 14s', status: 'Trained', selected: false },
    { name: 'Random Forest', acc: '91.8%', prec: '0.89', rec: '0.88', f1: '0.89', roc: '0.92', time: '06m 45s', status: 'Trained', selected: false },
    { name: 'Logistic Regression', acc: '85.4%', prec: '0.81', rec: '0.78', f1: '0.82', roc: '0.86', time: '00m 45s', status: 'Trained', selected: false },
  ];

  return (
    <div className="max-w-[1400px] mx-auto w-full font-sans pb-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Model Intelligence Center</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Algorithm selection, training, and performance metrics.</p>
        </div>
      </header>

      {/* Model Strategy */}
      <div className="bg-[#0F172A] rounded-3xl p-8 border border-slate-800 shadow-xl mb-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Target className="w-4 h-4" /> Strategy Defined
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Binary Classification</h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
            The Model Strategy Agent has analyzed your dataset and identified this as a classification problem targeting the <strong className="text-white">`churn`</strong> column.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4 flex-1">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Column</div>
            <div className="text-lg font-bold">churn</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Recommended Metric</div>
            <div className="text-lg font-bold text-emerald-400">F1 Score</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Model Candidates Table */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Box className="w-4 h-4 text-emerald-500" /> Model Candidates
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors">
                Train Selected
              </button>
              <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors">
                Train All
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-wider font-bold">
                  <th className="p-4 pl-6">Model Name</th>
                  <th className="p-4">Accuracy</th>
                  <th className="p-4">Precision</th>
                  <th className="p-4">Recall</th>
                  <th className="p-4">F1 Score</th>
                  <th className="p-4">ROC-AUC</th>
                  <th className="p-4">Train Time</th>
                  <th className="p-4 pr-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {models.map((m, idx) => (
                  <tr key={idx} className={`transition-colors ${m.selected ? 'bg-emerald-50/30' : 'hover:bg-slate-50/50'}`}>
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-2">
                        {m.selected && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        <span className={`font-bold ${m.selected ? 'text-emerald-700' : 'text-slate-800'}`}>{m.name}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-600">{m.acc}</td>
                    <td className="p-4 font-semibold text-slate-600">{m.prec}</td>
                    <td className="p-4 font-semibold text-slate-600">{m.rec}</td>
                    <td className="p-4 font-bold text-slate-900">{m.f1}</td>
                    <td className="p-4 font-semibold text-slate-600">{m.roc}</td>
                    <td className="p-4 font-mono text-xs text-slate-500">{m.time}</td>
                    <td className="p-4 pr-6">
                      <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Training Interface */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Zap className="w-4 h-4 text-orange-500" /> Live Training
            </div>
            <div className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md uppercase tracking-wider animate-pulse">
              Running
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6">
            <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
              <span>XGBoost</span>
              <span>84 / 100 iterations</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mb-4">
              <motion.div 
                className="h-full bg-orange-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '84%' }}
                transition={{ duration: 2, ease: 'easeOut' }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Validation F1</div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  0.91 <span className="text-emerald-500">&rarr; 0.92</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Training Loss</div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  0.24 <span className="text-emerald-500">&rarr; 0.18</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <div className="text-xs text-slate-600 leading-relaxed font-medium">
              <strong className="text-slate-900 block mb-1">Model Selection Agent Decision</strong>
              "XGBoost selected because it achieved the highest validation F1 score with acceptable training time."
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
