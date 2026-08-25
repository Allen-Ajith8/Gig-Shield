'use client';

import { Navbar } from "@/components/landing/Navbar"
import { CinematicHero } from "@/components/landing/CinematicHero"
import { PlatformOverview } from "@/components/landing/PlatformOverview"
import { AgentWorkforce } from "@/components/landing/AgentWorkforce"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-brand-light/30">
      <Navbar />
      <CinematicHero />
      <PlatformOverview />
      <AgentWorkforce />
    </main>
  )
}
