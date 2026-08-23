"use client"
import React from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">AgentIQ Settings</h1>
        <p className="text-slate-400">Configure global platform behavior and AI agent parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/5 space-y-6">
          <h3 className="text-sm font-bold text-slate-300 tracking-wider border-b border-white/5 pb-4">AI CONFIGURATION</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Primary LLM Model</label>
              <select className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-brand-light">
                <option>GPT-4o</option>
                <option>Claude 3.5 Sonnet</option>
                <option>Gemini 1.5 Pro</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Agent Creativity (Temperature)</label>
              <input type="range" min="0" max="100" defaultValue="20" className="w-full mt-2 accent-brand-light" />
              <div className="flex justify-between text-xs text-slate-500 mt-1"><span>Precise</span><span>Balanced</span><span>Creative</span></div>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Max Active Agents</label>
              <input type="number" defaultValue={10} className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-brand-light" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/5 space-y-6">
          <h3 className="text-sm font-bold text-slate-300 tracking-wider border-b border-white/5 pb-4">PIPELINE SETTINGS</h3>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/10 bg-white/5 text-brand-light focus:ring-brand-light focus:ring-offset-background accent-brand-light" />
              <span className="text-sm text-slate-300">Auto-routing (Agents decide next steps autonomously)</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/10 bg-white/5 text-brand-light focus:ring-brand-light focus:ring-offset-background accent-brand-light" />
              <span className="text-sm text-slate-300">Auto-retry failed agent tasks</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-brand-light focus:ring-brand-light focus:ring-offset-background accent-brand-light" />
              <span className="text-sm text-slate-300">Require human approval before dataset modification</span>
            </label>
            
            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-400 uppercase">Validation Threshold (%)</label>
              <input type="number" defaultValue={90} className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-brand-light" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/5 space-y-6">
          <h3 className="text-sm font-bold text-slate-300 tracking-wider border-b border-white/5 pb-4">DATA & PRIVACY</h3>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/10 bg-white/5 text-brand-light focus:ring-brand-light focus:ring-offset-background accent-brand-light" />
              <span className="text-sm text-slate-300">Strict PII detection & auto-masking</span>
            </label>
            
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Synthetic Data Policy</label>
              <select className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-brand-light">
                <option>Allow when necessary</option>
                <option>Always ask first</option>
                <option>Never generate</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Data Retention</label>
              <select className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-brand-light">
                <option>30 Days</option>
                <option>90 Days</option>
                <option>Indefinite</option>
              </select>
            </div>
          </div>
        </Card>

        <div className="flex justify-end lg:col-span-2">
          <Button className="bg-brand-light text-background font-bold hover:bg-brand-light/90 px-8">Save Configuration</Button>
        </div>
      </div>
    </div>
  )
}
