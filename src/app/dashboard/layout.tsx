"use client"
import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { AICopilot } from '@/components/dashboard/AICopilot';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      {/* 
        The sidebar is 80px wide (w-[80px]).
        We add pl-[80px] to the main content wrapper so it sits perfectly next to the fixed sidebar 
        without overlapping.
      */}
      <div className="flex-1 pl-[80px] min-h-screen flex flex-col relative">
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
        
        {/* Floating Copilot Widget */}
        <AICopilot />
      </div>
    </div>
  );
}
