'use client';

import React from 'react';
import { BookOpen, Download, Edit2, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

export default function DataDictionaryPage() {
  const dictionary = [
    { col: 'customer_id', dtype: 'String', stype: 'Identifier', desc: 'Unique customer identifier assigned at registration.', example: 'CUS-1024', missing: '0%', unique: '100%', pii: 'High' },
    { col: 'age', dtype: 'Integer', stype: 'Numerical', desc: 'Customer age in years. Contains some outliers >100.', example: '42', missing: '1.2%', unique: '65%', pii: 'Low' },
    { col: 'monthly_charges', dtype: 'Float', stype: 'Currency', desc: 'Monthly recurring charge for the customer plan.', example: '$65.50', missing: '0%', unique: '88%', pii: 'None' },
    { col: 'total_spend', dtype: 'Float', stype: 'Currency', desc: 'Lifetime value spent by the customer.', example: '$1,240.00', missing: '0%', unique: '96%', pii: 'None' },
    { col: 'contract_type', dtype: 'String', stype: 'Categorical', desc: 'Type of contract (Month-to-month, One year, Two year).', example: 'Two year', missing: '0%', unique: '3%', pii: 'None' },
    { col: 'email', dtype: 'String', stype: 'Email Address', desc: 'Customer email address. Used for billing.', example: 'user@example.com', missing: '4.5%', unique: '95.5%', pii: 'High' },
    { col: 'churn', dtype: 'Boolean', stype: 'Categorical', desc: 'Target variable indicating if the customer canceled.', example: 'Yes', missing: '0%', unique: '2%', pii: 'None' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto w-full font-sans">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Data Dictionary</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Dataset: <span className="text-slate-800 font-bold">customer_churn_v4.csv</span></p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Regenerate
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-md transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Dictionary
          </button>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-emerald-500" /> AI-Generated Data Definitions
          </div>
          <button className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors">
            <Edit2 className="w-3.5 h-3.5" /> Edit All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                <th className="p-4 pl-6">Column Name</th>
                <th className="p-4">Data Type</th>
                <th className="p-4">Semantic Type</th>
                <th className="p-4 w-[300px]">Description <span className="text-emerald-500 ml-1 text-lg leading-none">*</span></th>
                <th className="p-4">Example</th>
                <th className="p-4">Missing %</th>
                <th className="p-4">Unique %</th>
                <th className="p-4 pr-6">PII Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {dictionary.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 pl-6 font-bold text-slate-900">{row.col}</td>
                  <td className="p-4 text-slate-600 font-medium">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[11px] font-bold">{row.dtype}</span>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">{row.stype}</td>
                  <td className="p-4 text-slate-500 text-xs leading-relaxed relative pr-8">
                    {row.desc}
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-xs">{row.example}</td>
                  <td className="p-4 font-bold text-slate-700">{row.missing}</td>
                  <td className="p-4 font-bold text-slate-700">{row.unique}</td>
                  <td className="p-4 pr-6">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md
                      ${row.pii === 'High' ? 'bg-red-50 text-red-600' : row.pii === 'Low' ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-400'}`}>
                      {row.pii === 'High' && <ShieldAlert className="w-3 h-3" />}
                      {row.pii}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
