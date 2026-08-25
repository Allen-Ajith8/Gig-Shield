"use client"
import React, { useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import PixelSnow from "@/components/PixelSnow"
import { Menu } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--fg-base)' }}>
      {/* PixelSnow Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-40 mix-blend-screen">
        <PixelSnow
          color="#ffffff"
          flakeSize={0.019}
          minFlakeSize={1.25}
          pixelResolution={500}
          speed={1.25}
          depthFade={8}
          farPlane={20}
          brightness={1}
          gamma={0.4545}
          density={0.3}
          variant="snowflake"
          direction={125}
        />
      </div>

      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content Area */}
      <div className={`relative z-10 transition-all duration-300 ${sidebarOpen ? 'pl-64' : 'pl-0'}`}>
        
        {/* Toggle button when sidebar is closed */}
        {!sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className="absolute top-6 left-6 z-50 p-2 rounded-md bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-slate-300 hover:text-[var(--fg-base)] transition-colors shadow-sm"
            title="Open sidebar"
          >
            <Menu size={20} />
          </button>
        )}

        <main className={`p-8 ${!sidebarOpen ? 'pt-20' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  )
}
