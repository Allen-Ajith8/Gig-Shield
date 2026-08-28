'use client';

import React from 'react';
import { 
  Search, Command, Settings, Bell, Filter, Download, 
  MessageSquare, MoreHorizontal, TrendingUp, Calendar,
  Database, GitMerge, CheckCircle2, Activity, Play, Server, ChevronRight, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardHome() {
  return (
    <div className="max-w-[1400px] mx-auto w-full font-sans">
      
      {/* Top Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Welcome back, Vikas! Here's what's happening with your data today.</p>
        </div>

        <div className="flex-1 max-w-lg mx-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search datasets, workflows..." 
            className="w-full bg-white border border-slate-200 rounded-full py-2.5 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 shadow-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400 border border-slate-200 px-1.5 rounded text-xs">
            ⌘ K
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 shadow-sm relative">
            <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
            <Bell className="w-4 h-4" />
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-md ml-2 transition-colors flex items-center gap-2">
            <span>+</span> New Dataset
          </button>
          <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-6 py-2.5 rounded-full text-sm font-semibold shadow-sm transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Import
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column (Narrower) */}
        <div className="w-full lg:w-[320px] flex flex-col gap-6 flex-shrink-0">
          
          {/* Data Health Score */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] text-center">
            <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm mb-6 justify-start">
              <Activity className="w-4 h-4" /> Data Health Score
            </div>
            
            <div className="relative w-40 h-24 mx-auto mb-2">
              <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#F1F5F9" strokeWidth="12" strokeLinecap="round" />
                <path d="M10,50 A40,40 0 0,1 86,25" fill="none" stroke="#10B981" strokeWidth="12" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                <span className="text-4xl font-bold text-slate-900 tracking-tight">94.6</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">/ 100</span>
              </div>
            </div>
            <div className="text-emerald-500 font-bold text-sm mb-6">Excellent 👏</div>

            <div className="space-y-3">
              {[
                { label: 'Completeness', val: '97%' },
                { label: 'Consistency', val: '93%' },
                { label: 'Validity', val: '95%' },
                { label: 'Uniqueness', val: '94%' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2 text-slate-600"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500"/> {s.label}</div>
                  <div className="text-slate-900">{s.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Best Model Promo Card */}
          <div className="bg-[#0F172A] rounded-3xl p-8 relative overflow-hidden shadow-xl flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 mb-8">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div> Production Ready
              </div>
              <h3 className="text-3xl font-bold text-white tracking-tight">XGBoost</h3>
              <p className="text-slate-400 text-sm mt-1">customer_churn_v4</p>
            </div>
            
            <div className="relative z-10 space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Training Time</span>
                <span className="text-white font-semibold">04m 32s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">F1 Score</span>
                <span className="text-white font-semibold">0.92</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">ROC-AUC</span>
                <span className="text-white font-semibold">0.96</span>
              </div>
            </div>

            <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl font-semibold transition-colors relative z-10 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20">
              Deploy Model <Zap className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column (Wider) */}
        <div className="flex-1 flex flex-col gap-6 w-full overflow-hidden">
          
          {/* Autonomous Workflow Progress */}
          <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] w-full overflow-x-auto">
            <div className="flex items-center justify-between mb-12 min-w-[800px]">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-[15px]">
                Autonomous Workflow Progress
              </div>
              <div className="flex items-center gap-1 text-[13px] font-bold text-emerald-600 cursor-pointer hover:text-emerald-700 transition-colors">
                View All Workflows &rarr;
              </div>
            </div>

            <div className="relative flex items-center justify-between mb-16 min-w-[900px] px-2">
              {/* Connecting Lines */}
              <div className="absolute left-6 right-6 top-6 h-[2px] bg-slate-100 z-0"></div>
              <div className="absolute left-6 top-6 h-[2px] bg-emerald-500 z-0 transition-all duration-1000" style={{ width: '58%' }}></div>

              {/* Steps */}
              {[
                { id: 1, name: 'Dataset Ingestion', status: 'Completed', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg> },
                { id: 2, name: 'Profiling Agent', status: 'Completed', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> },
                { id: 3, name: 'Data Quality Agent', status: 'Completed', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
                { id: 4, name: 'Cleaning Agent', status: 'Completed', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg> },
                { id: 5, name: 'Transformation Agent', status: 'Completed', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> },
                { id: 6, name: 'Feature Engineering', status: 'Completed', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
                { id: 7, name: 'Synthetic Data Agent', status: 'Completed', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg> },
                { id: 8, name: 'Model Strategy Agent', status: 'Running', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
                { id: 9, name: 'Model Selection Agent', status: 'Waiting', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
                { id: 10, name: 'Training Agent', status: 'Waiting', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg> },
                { id: 11, name: 'Validation Agent', status: 'Waiting', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
                { id: 12, name: 'Prediction Agent', status: 'Waiting', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 10.5L21 3m-7.5 7.5L9 15m4.5-4.5L15 21m-6-6l-3 3m3-3l-3-3m3 3L3 21" /></svg> },
              ].map((step, idx) => {
                const isCompleted = step.status === 'Completed';
                const isRunning = step.status === 'Running';
                const isWaiting = step.status === 'Waiting';
                
                return (
                  <div key={step.id} className="relative z-10 flex flex-col items-center group w-[75px]">
                    <div className="relative flex items-center justify-center">
                      {/* Optional dashed outer ring for running state */}
                      {isRunning && (
                        <div className="absolute inset-[-6px] rounded-full border border-dashed border-emerald-500 animate-[spin_4s_linear_infinite]"></div>
                      )}
                      
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted ? 'bg-white border-emerald-500 text-emerald-600' :
                        isRunning ? 'bg-emerald-600 border-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' :
                        'bg-white border-slate-200 text-slate-400'
                      }`}>
                        {step.icon}
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <div className="text-[11px] font-bold text-slate-800 leading-tight">
                        {step.id}. {step.name.split(' ').map((word, i) => <React.Fragment key={i}>{word}<br/></React.Fragment>)}
                      </div>
                      <div className={`text-[10px] font-bold mt-1.5 uppercase tracking-wider ${
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

            {/* Bottom Progress Bar */}
            <div className="flex items-center gap-4 mt-8 min-w-[800px]">
              <div className="text-sm font-bold text-slate-900 flex-shrink-0 w-36">Pipeline Progress</div>
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '67%' }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </div>
              <div className="text-sm font-bold text-slate-900 flex-shrink-0">67%</div>
            </div>
          </div>
          
          {/* Top KPI Row */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { title: 'Total Datasets', val: '24', change: '+12%', bg: 'bg-emerald-600 text-white', icon: <Database className="w-4 h-4" /> },
              { title: 'Processed Pipelines', val: '10', change: '+18%', bg: 'bg-white border border-slate-100 text-slate-900', icon: <GitMerge className="w-4 h-4 text-blue-500" /> },
              { title: 'Running Pipelines', val: '12', change: 'In progress', bg: 'bg-white border border-slate-100 text-slate-900', icon: <Play className="w-4 h-4 text-emerald-500" /> },
              { title: 'Models Deployed', val: '15', change: '+8%', bg: 'bg-white border border-slate-100 text-slate-900', icon: <Server className="w-4 h-4 text-purple-500" /> },
            ].map((k, i) => (
              <div key={i} className={`${k.bg} p-5 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[130px]`}>
                <div className="flex items-center gap-2 text-sm font-semibold opacity-90">
                  {k.icon} <span className={i === 0 ? 'text-white' : 'text-slate-700'}>{k.title}</span>
                </div>
                <div>
                  <div className="text-3xl font-bold tracking-tight">{k.val}</div>
                  <div className={`text-[10px] font-bold mt-1 ${i === 0 ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {k.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Model Performance Overview */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                <TrendingUp className="w-4 h-4" /> Model Performance Overview
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-sm">
                  Metric: F1 Score <Filter className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-[220px] flex items-end justify-around px-8 relative mb-8">
              {/* Y Axis Labels (Left Side) */}
              <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[11px] font-bold text-slate-400">
                <span>1.00</span>
                <span>0.75</span>
                <span>0.50</span>
                <span>0.25</span>
              </div>
              
              {/* Floating Bars */}
              {[
                { label: 'XGBoost', val: 92, score: '0.92', color: 'bg-emerald-400', best: true },
                { label: 'Random Forest', val: 89, score: '0.89', color: 'bg-sky-400' },
                { label: 'LightGBM', val: 91, score: '0.91', color: 'bg-blue-500' },
                { label: 'Logistic Reg', val: 82, score: '0.82', color: 'bg-indigo-500' },
              ].map((m) => (
                <div key={m.label} className="flex flex-col items-center w-24 group relative">
                  {/* Score Label on Top */}
                  <div className="text-[13px] font-bold text-slate-800 mb-4 transition-transform group-hover:-translate-y-1">
                    {m.score}
                  </div>
                  
                  {/* Container for absolute positioning of floating bar relative to bottom */}
                  <div className="w-10 h-[180px] relative flex flex-col justify-end items-center mb-6">
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: `${m.val}%` }} 
                      className={`w-full ${m.color} rounded-xl absolute bottom-0 shadow-sm hover:shadow-md transition-shadow`}
                    />
                  </div>
                  
                  {/* X-Axis Label */}
                  <div className="absolute -bottom-10 w-full flex flex-col items-center">
                    <span className="text-[11px] font-bold text-slate-600 text-center leading-tight">
                      {m.label.split(' ').map((word, i) => <React.Fragment key={i}>{word}<br/></React.Fragment>)}
                    </span>
                    {m.best && (
                      <span className="inline-block text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full mt-1.5">
                        Best
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                  <Activity className="w-4 h-4" /> Recent Activity
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Live
                </div>
              </div>
              
              <div className="space-y-5">
                {[
                  { time: '10:24:31', title: 'Model Strategy Agent', desc: 'Analyzing best algorithms for this dataset', icon: <Search className="w-3.5 h-3.5 text-emerald-600"/>, bg: 'bg-emerald-100' },
                  { time: '10:24:18', title: 'Synthetic Data Agent', desc: 'Generated 4,200 synthetic records', icon: <Database className="w-3.5 h-3.5 text-blue-600"/>, bg: 'bg-blue-100' },
                  { time: '10:23:57', title: 'Feature Engineering', desc: 'Created 8 new features', icon: <GitMerge className="w-3.5 h-3.5 text-purple-600"/>, bg: 'bg-purple-100' },
                  { time: '10:23:31', title: 'Cleaning Agent', desc: 'Removed 2,625 duplicate records', icon: <CheckCircle2 className="w-3.5 h-3.5 text-orange-600"/>, bg: 'bg-orange-100' },
                ].map((act, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="text-[10px] font-bold text-slate-400 w-12 pt-1">{act.time}</div>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${act.bg}`}>
                      {act.icon}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{act.title}</div>
                      <div className="text-[11px] text-slate-500 font-medium leading-relaxed">{act.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                View Full Activity Log &rarr;
              </button>
            </div>

            {/* Next Best Actions */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                  <Zap className="w-4 h-4" /> Next Best Actions
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { title: 'Deploy model to production', desc: 'Start making real-time predictions', icon: <Server className="text-emerald-600 w-4 h-4" /> },
                  { title: 'Schedule automated retraining', desc: 'Keep your model up to date', icon: <Calendar className="text-blue-600 w-4 h-4" /> },
                  { title: 'Generate business report', desc: 'Download executive summary', icon: <Download className="text-purple-600 w-4 h-4" /> },
                ].map((action, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                        {action.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{action.title}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{action.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
