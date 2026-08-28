'use client';

import React, { useState, useEffect } from 'react';
import { 
  Terminal, ShieldCheck, Database, Search, CheckCircle2, GitMerge, Box, Activity, 
  Cpu, MoreHorizontal, Zap, MessageSquare, Plus, Network
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AgentsPage() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'Profiling Agent', to: 'Master Agent', msg: 'Class imbalance detected (8% minority).', time: '10:24:12' },
    { id: 2, from: 'Master Agent', to: 'Synthetic Data Agent', msg: 'Generate balanced training samples for target class.', time: '10:24:14' },
    { id: 3, from: 'Synthetic Data Agent', to: 'Validation Agent', msg: '4,200 synthetic records generated using SMOTE.', time: '10:24:45' },
    { id: 4, from: 'Validation Agent', to: 'Master Agent', msg: 'Distribution similarity check passed: 96.4%.', time: '10:24:51' },
  ]);

  const agents = [
    { name: 'Profiling Agent', role: 'Analyzes raw data structure', status: 'Idle', tasks: 124, success: '99.8%', icon: <Search /> },
    { name: 'Data Quality Agent', role: 'Detects anomalies & issues', status: 'Idle', tasks: 122, success: '98.5%', icon: <ShieldCheck /> },
    { name: 'Cleaning Agent', role: 'Handles missing/invalid data', status: 'Idle', tasks: 118, success: '99.1%', icon: <CheckCircle2 /> },
    { name: 'Transformation Agent', role: 'Encodes & scales features', status: 'Idle', tasks: 95, success: '100%', icon: <GitMerge /> },
    { name: 'Feature Eng. Agent', role: 'Creates new predictive features', status: 'Idle', tasks: 88, success: '94.2%', icon: <Box /> },
    { name: 'Synthetic Data Agent', role: 'Balances minority classes', status: 'Idle', tasks: 42, success: '96.4%', icon: <Activity /> },
    { name: 'Model Strategy Agent', role: 'Selects algorithms & metrics', status: 'Running', tasks: 156, success: '99.9%', icon: <Cpu /> },
    { name: 'Training Agent', role: 'Executes model training', status: 'Waiting', tasks: 140, success: '92.1%', icon: <Zap /> },
  ];

  return (
    <div className="max-w-[1400px] mx-auto w-full font-sans pb-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Agent Center</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage and monitor your autonomous workforce.</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Custom Agent
        </button>
      </header>

      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Left Column - Master & Communication */}
        <div className="w-full xl:w-[400px] flex flex-col gap-6 flex-shrink-0">
          
          {/* Master Agent Card */}
          <div className="bg-[#0F172A] rounded-3xl p-8 relative overflow-hidden shadow-xl text-white">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <Network className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div> Coordinating
              </div>
            </div>

            <div className="relative z-10 mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Master Agent</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Understands dataset context, creates processing plans, dynamically routes workflows, and resolves agent failures.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-xs font-bold text-slate-400 mb-1">Workflows Managed</div>
                <div className="text-2xl font-bold">1,248</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-xs font-bold text-slate-400 mb-1">Decisions Made</div>
                <div className="text-2xl font-bold">14.2k</div>
              </div>
            </div>
          </div>

          {/* Live Communication Stream */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex-1 flex flex-col overflow-hidden min-h-[400px]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <MessageSquare className="w-4 h-4 text-emerald-500" /> Agent Communication Stream
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Live
              </div>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto space-y-6 bg-slate-50">
              {messages.map((msg) => (
                <div key={msg.id} className="relative">
                  <div className="flex justify-between items-end mb-2">
                    <div className="text-[10px] font-bold text-slate-400">{msg.time}</div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 shadow-sm relative">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <span className="text-indigo-600">{msg.from}</span>
                      <span>&rarr;</span>
                      <span className="text-slate-700">{msg.to}</span>
                    </div>
                    <div className="text-sm font-medium text-slate-800">"{msg.msg}"</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column - Agent Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent, i) => {
              const isRunning = agent.status === 'Running';
              return (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] group hover:border-emerald-100 transition-colors">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center relative ${
                        isRunning ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400 group-hover:text-emerald-500 group-hover:bg-emerald-50/50 transition-colors'
                      }`}>
                        {isRunning && (
                          <div className="absolute inset-[-4px] rounded-full border border-dashed border-emerald-500 animate-[spin_4s_linear_infinite]"></div>
                        )}
                        {agent.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{agent.name}</h3>
                        <p className="text-[11px] font-medium text-slate-500">{agent.role}</p>
                      </div>
                    </div>
                    <button className="text-slate-300 hover:text-slate-500 transition-colors"><MoreHorizontal className="w-5 h-5"/></button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Tasks</div>
                      <div className="font-bold text-slate-700">{agent.tasks}</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Success Rate</div>
                      <div className="font-bold text-emerald-600">{agent.success}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                      isRunning ? 'bg-emerald-50 text-emerald-600' :
                      agent.status === 'Waiting' ? 'bg-slate-100 text-slate-500' :
                      'bg-slate-50 border border-slate-200 text-slate-500'
                    }`}>
                      {agent.status}
                    </div>
                    <button className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
                      View Logs &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
