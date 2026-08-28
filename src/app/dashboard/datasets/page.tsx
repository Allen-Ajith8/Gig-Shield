'use client';

import React, { useState } from 'react';
import { Search, Plus, Download, MoreVertical, FileText, CheckCircle2, Clock, UploadCloud, Database } from 'lucide-react';

export default function DatasetsPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'detail'>('list');

  const datasets = [
    { name: 'customer_churn_v4.csv', rows: '125,000', cols: 42, size: '42.5 MB', quality: 94.6, status: 'Processed', date: '2 hours ago', version: 'v4' },
    { name: 'q3_sales_raw_export.xlsx', rows: '84,200', cols: 156, size: '112.1 MB', quality: 62.4, status: 'Needs Attention', date: '1 day ago', version: 'v1' },
    { name: 'user_behavior_logs_aug.parquet', rows: '4.2M', cols: 12, size: '850 MB', quality: 98.1, status: 'Processed', date: '2 days ago', version: 'v2' },
    { name: 'marketing_spend_2024.csv', rows: '1,450', cols: 24, size: '1.2 MB', quality: 88.5, status: 'Processing...', date: 'Just now', version: 'v1' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto w-full font-sans">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dataset Management</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Upload, preview, and process your raw data.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Import URL
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-md transition-colors flex items-center gap-2">
            <UploadCloud className="w-4 h-4" /> Upload Dataset
          </button>
        </div>
      </header>

      {activeTab === 'list' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 max-w-sm w-full relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search datasets..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="flex gap-2 text-sm font-semibold">
              <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg">All</button>
              <button className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg">Processed</button>
              <button className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg">Raw</button>
            </div>
          </div>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                <th className="p-4 pl-6 font-bold">Dataset Name</th>
                <th className="p-4 font-bold">Size & Dimensions</th>
                <th className="p-4 font-bold">Quality Score</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Version</th>
                <th className="p-4 font-bold">Last Updated</th>
                <th className="p-4 pr-6 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {datasets.map((ds, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors cursor-pointer group" onClick={() => setActiveTab('detail')}>
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{ds.name}</div>
                        <div className="text-[11px] text-slate-500 font-medium">Uploaded by Vikas</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-semibold text-slate-700">{ds.rows} rows</div>
                    <div className="text-[11px] text-slate-400 font-medium">{ds.cols} columns • {ds.size}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${ds.quality > 90 ? 'bg-emerald-500' : ds.quality > 70 ? 'bg-orange-400' : 'bg-red-500'}`} style={{ width: `${ds.quality}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-slate-700">{ds.quality}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                      ${ds.status === 'Processed' ? 'bg-emerald-50 text-emerald-600' : 
                        ds.status === 'Needs Attention' ? 'bg-orange-50 text-orange-600' : 
                        'bg-blue-50 text-blue-600'}`}>
                      {ds.status === 'Processed' && <CheckCircle2 className="w-3 h-3" />}
                      {ds.status === 'Processing...' && <Clock className="w-3 h-3 animate-spin" />}
                      {ds.status}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{ds.version}</span>
                  </td>
                  <td className="p-4 text-xs font-semibold text-slate-500">
                    {ds.date}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 flex items-center justify-center ml-auto transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'detail' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 text-sm font-semibold text-slate-500 mb-2 cursor-pointer hover:text-slate-800" onClick={() => setActiveTab('list')}>
            &larr; Back to Datasets
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">customer_churn_v4.csv</h2>
                  <div className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-3">
                    <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide">Processed</span>
                    <span>125,000 Rows</span>
                    <span>42 Columns</span>
                    <span>Updated 2 hours ago</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50">Download</button>
                <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4" /> Create Version
                </button>
              </div>
            </div>

            {/* Before / After Comparison */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Raw Data</div>
                <div className="grid grid-cols-2 gap-y-6">
                  <div>
                    <div className="text-[11px] text-slate-500 font-semibold uppercase">Rows</div>
                    <div className="text-xl font-bold text-slate-900">125,000</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-semibold uppercase">Missing Values</div>
                    <div className="text-xl font-bold text-red-500">3.2%</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-semibold uppercase">Duplicates</div>
                    <div className="text-xl font-bold text-orange-500">2.1%</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-semibold uppercase">Quality Score</div>
                    <div className="text-xl font-bold text-slate-900">81.4</div>
                  </div>
                </div>
              </div>
              
              <div className="border border-emerald-100 rounded-2xl p-6 bg-emerald-50/30 relative">
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 text-lg font-bold shadow-sm">&rarr;</div>
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-6">Processed Data</div>
                <div className="grid grid-cols-2 gap-y-6">
                  <div>
                    <div className="text-[11px] text-slate-500 font-semibold uppercase">Rows</div>
                    <div className="text-xl font-bold text-emerald-700">122,375</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-semibold uppercase">Missing Values</div>
                    <div className="text-xl font-bold text-emerald-600">0%</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-semibold uppercase">Duplicates</div>
                    <div className="text-xl font-bold text-emerald-600">0%</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-semibold uppercase">Quality Score</div>
                    <div className="text-xl font-bold text-emerald-700">94.6</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Spreadsheet Preview */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center justify-between">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Data Preview (First 5 Rows)</div>
                <div className="flex gap-2">
                  <button className="text-xs font-semibold px-3 py-1 bg-white border border-slate-200 rounded-md shadow-sm">Raw</button>
                  <button className="text-xs font-semibold px-3 py-1 bg-emerald-600 text-white rounded-md shadow-sm">Processed</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="bg-white border-b border-slate-100">
                      <th className="p-3 text-slate-400 font-semibold border-r border-slate-100 w-12 text-center">#</th>
                      <th className="p-3 font-bold text-slate-700 border-r border-slate-100">customer_id</th>
                      <th className="p-3 font-bold text-slate-700 border-r border-slate-100">age</th>
                      <th className="p-3 font-bold text-slate-700 border-r border-slate-100">monthly_charges</th>
                      <th className="p-3 font-bold text-slate-700 border-r border-slate-100">total_spend</th>
                      <th className="p-3 font-bold text-emerald-600 bg-emerald-50/50">churn (Target)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 bg-white">
                    {[
                      { id: 'CUS-1024', age: 42, mc: '$65.50', ts: '$1,240.00', churn: 'No' },
                      { id: 'CUS-1025', age: 28, mc: '$105.00', ts: '$850.00', churn: 'Yes' },
                      { id: 'CUS-1026', age: 65, mc: '$25.00', ts: '$4,500.00', churn: 'No' },
                      { id: 'CUS-1027', age: 34, mc: '$89.90', ts: '$2,100.50', churn: 'Yes' },
                      { id: 'CUS-1028', age: 51, mc: '$45.00', ts: '$3,800.00', churn: 'No' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors text-slate-600">
                        <td className="p-3 border-r border-slate-100 text-center text-slate-400 text-xs">{i+1}</td>
                        <td className="p-3 border-r border-slate-100 font-medium">{row.id}</td>
                        <td className="p-3 border-r border-slate-100">{row.age}</td>
                        <td className="p-3 border-r border-slate-100">{row.mc}</td>
                        <td className="p-3 border-r border-slate-100">{row.ts}</td>
                        <td className="p-3 bg-emerald-50/20 font-bold text-slate-700">{row.churn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
