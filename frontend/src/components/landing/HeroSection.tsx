"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { GradientText } from "@/components/ui/GradientText"
import { ArrowRight, Play } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-light/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-brand-dark/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center z-10 relative">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" as any }}
          className="flex flex-col gap-6"
        >
          <div>
            <Badge variant="brand" className="mb-6">AI-NATIVE ENTERPRISE PLATFORM</Badge>
            <h1 className="text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Meet AgentIQ.<br />
              <GradientText>Your Autonomous Data Workforce.</GradientText>
            </h1>
          </div>
          
          <p className="text-xl text-slate-400 max-w-xl leading-relaxed">
            Transform messy enterprise data into validated predictions and intelligent decisions through a self-orchestrating AI workforce.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Button size="lg" className="gap-2">
              Explore AgentIQ <ArrowRight size={18} />
            </Button>
            <Button variant="secondary" size="lg" className="gap-2">
              <Play size={18} /> View Live Workflow
            </Button>
          </div>
        </motion.div>

        {/* Right side animated visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative h-[600px] w-full hidden lg:block"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Core */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" as any }}
              className="relative w-64 h-64 rounded-full border border-white/10 bg-white/5 flex items-center justify-center backdrop-blur-sm shadow-[0_0_50px_rgba(59,130,246,0.2)]"
            >
              <div className="w-32 h-32 rounded-full bg-gradient-brand blur-[20px] opacity-50 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center text-white/50 font-mono text-sm">
                MASTER CORE
              </div>
            </motion.div>
            
            {/* Orbiting Agents */}
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 rounded-full bg-brand-light shadow-[0_0_15px_rgba(139,92,246,0.8)]"
                style={{
                  top: "50%",
                  left: "50%",
                  marginTop: -8,
                  marginLeft: -8,
                }}
                animate={{
                  x: [
                    Math.cos((i * 72) * Math.PI / 180) * 150,
                    Math.cos(((i * 72) + 360) * Math.PI / 180) * 150,
                  ],
                  y: [
                    Math.sin((i * 72) * Math.PI / 180) * 150,
                    Math.sin(((i * 72) + 360) * Math.PI / 180) * 150,
                  ],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear" as any,
                }}
              />
            ))}
            
            {/* Connecting Lines (Simulated with simple rings for now) */}
            <div className="absolute w-[400px] h-[400px] rounded-full border border-white/5 border-dashed animate-[spin_60s_linear_infinite]" />
            <div className="absolute w-[500px] h-[500px] rounded-full border border-white/5 animate-[spin_80s_linear_infinite_reverse]" />
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-sm animate-bounce">
        <span>Scroll to explore the AI workforce</span>
        <ArrowRight className="rotate-90" size={16} />
      </div>
    </section>
  )
}
