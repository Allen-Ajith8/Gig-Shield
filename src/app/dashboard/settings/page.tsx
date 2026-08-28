'use client';

import React from 'react';
import { User, Bell, Shield, Database, Webhook, Zap, Server } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-[1000px] mx-auto w-full font-sans pb-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Manage your account and workspace configurations.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Settings Navigation */}
        <div className="w-full md:w-64 space-y-1 flex-shrink-0">
          {[
            { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" />, active: true },
            { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
            { id: 'security', label: 'Security & Access', icon: <Shield className="w-4 h-4" /> },
            { id: 'agents', label: 'Agent Configuration', icon: <Zap className="w-4 h-4" /> },
            { id: 'storage', label: 'Data Storage', icon: <Database className="w-4 h-4" /> },
            { id: 'api', label: 'API & Webhooks', icon: <Webhook className="w-4 h-4" /> },
            { id: 'compute', label: 'Compute Resources', icon: <Server className="w-4 h-4" /> },
          ].map(item => (
            <button key={item.id} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              item.active ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
            }`}>
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Profile Settings</h2>
          
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm relative group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" alt="User Avatar" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold">Edit</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Avatar Image</div>
              <div className="text-xs text-slate-500 mb-2">Recommended size: 256x256px</div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors">Change</button>
                <button className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg text-xs font-semibold transition-colors">Remove</button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">First Name</label>
                <input type="text" defaultValue="Sarah" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Last Name</label>
                <input type="text" defaultValue="Connor" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Email Address</label>
              <input type="email" defaultValue="sarah.connor@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Role</label>
              <input type="text" defaultValue="Data Scientist" disabled className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-medium text-slate-500 cursor-not-allowed" />
            </div>
            
            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
              <button className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition-colors">Cancel</button>
              <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition-colors">Save Changes</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
