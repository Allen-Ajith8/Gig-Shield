"use client"
import React, { useEffect, useState, useRef, useMemo } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"

// Core phases:
// 0: Black screen
// 1: Center point expanding
// 2: Signals & initial nodes
// 3: Labels appearing
// 4: Title reveal
// 5: Tagline 1
// 6: Tagline 2
// 7: Full active
type Phase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

const agents = [
  { id: "profiling", label: "PROFILING", angle: -90, desc: "Analyzes data quality and structure." },
  { id: "dictionary", label: "DICTIONARY", angle: -45, desc: "Generates contextual column intelligence." },
  { id: "quality", label: "QUALITY", angle: 0, desc: "Handles missing values and anomalies." },
  { id: "feature", label: "FEATURE", angle: 45, desc: "Creates derived features automatically." },
  { id: "synthetic", label: "SYNTHETIC DATA", angle: 90, desc: "Generates validated synthetic records when imbalance is detected." },
  { id: "ml", label: "ML", angle: 135, desc: "Trains optimal predictive models." },
  { id: "validation", label: "VALIDATION", angle: 180, desc: "Checks model robustness and prevents leakage." },
  { id: "prediction", label: "PREDICTION", angle: 225, desc: "Outputs final actionable insights." }
]

export function CinematicHero() {
  const [phase, setPhase] = useState<Phase>(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()

  // Scroll animations
  const titleY = useTransform(scrollY, [0, 500], [0, -150])
  const networkScale = useTransform(scrollY, [0, 500], [1, 1.4])
  const networkOpacity = useTransform(scrollY, [0, 500], [1, 0.4])
  const centerScale = useTransform(scrollY, [0, 500], [1, 0.5])

  // Parallax calculations based on mouse
  const mouseX = mounted ? (mousePos.x - window.innerWidth / 2) * 0.05 : 0
  const mouseY = mounted ? (mousePos.y - window.innerHeight / 2) * 0.05 : 0

  useEffect(() => {
    setMounted(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const sequence = async () => {
      const wait = (ms: number) => new Promise(r => setTimeout(r, ms))
      
      await wait(500)
      setPhase(1) // Center point
      
      await wait(1000)
      setPhase(2) // Signals & Nodes
      
      await wait(2000)
      setPhase(3) // Labels
      
      await wait(1500)
      setPhase(4) // Title reveal
      
      await wait(1500)
      setPhase(5) // Tagline 1
      
      await wait(800)
      setPhase(6) // Tagline 2
      
      await wait(1000)
      setPhase(7) // Full active
    }
    sequence()
  }, [])

  // Floating particles
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 100,
      duration: 3 + Math.random() * 5,
      delay: Math.random() * 5
    }))
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-[150vh] bg-[#050608] overflow-hidden">
      
      {/* BACKGROUND (Subtle Glows, Noise) */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div 
          className="absolute inset-0 opacity-20"
          style={{ 
            backgroundImage: "radial-gradient(circle at center, rgba(45,212,191,0.05) 0%, transparent 60%)",
            x: mouseX, y: mouseY
          }}
        />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "50px 50px", transform: "perspective(500px) rotateX(60deg) scale(2) translateY(-100px)" }} />
      </div>

      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* NETWORK VISUALIZATION */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ scale: networkScale, opacity: networkOpacity }}
        >
          {/* Center Point */}
          {phase >= 1 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: phase >= 7 ? [1, 1.2, 1] : 1, opacity: 1 }}
              transition={{ duration: phase >= 7 ? 4 : 1, repeat: phase >= 7 ? Infinity : 0, ease: "easeInOut" as any }}
              style={{ scale: centerScale, x: mouseX * 0.5, y: mouseY * 0.5 }}
              className="absolute w-2 h-2 rounded-full bg-[#2DD4BF] shadow-[0_0_20px_4px_rgba(45,212,191,0.6)] z-20"
            >
               {phase >= 3 && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white tracking-widest whitespace-nowrap">
                   AGENTIQ CORE
                 </motion.div>
               )}
            </motion.div>
          )}

          {/* Lines and Nodes */}
          {phase >= 2 && agents.map((agent, i) => {
            const rad = (agent.angle * Math.PI) / 180
            
            // Elliptical radius to clear wide text horizontally but stay within screen vertically
            const rx = mounted ? Math.min(window.innerWidth * 0.38, 550) : 400
            const ry = mounted ? Math.min(window.innerHeight * 0.35, 280) : 250
            
            const tx = Math.cos(rad) * rx
            const ty = Math.sin(rad) * ry
            
            const nodeDistance = Math.sqrt(tx*tx + ty*ty)
            const lineAngle = (Math.atan2(ty, tx) * 180) / Math.PI
            
            const isHovered = hoveredAgent === agent.id

            return (
              <motion.div key={agent.id} className="absolute inset-0 flex items-center justify-center" style={{ x: mouseX * 0.8, y: mouseY * 0.8 }}>
                {/* Connection Line */}
                <motion.div 
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: isHovered ? 0.8 : 0.2 }}
                  transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" as any }}
                  style={{ transformOrigin: "left", rotate: lineAngle, width: nodeDistance }}
                  className="absolute h-[1px] bg-gradient-to-r from-[#2DD4BF] to-transparent z-0"
                />

                {/* Traveling Data Particle */}
                {phase >= 7 && (
                  <motion.div 
                    animate={{ 
                      x: [0, tx], 
                      y: [0, ty],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2, ease: "easeInOut" as any }}
                    className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_12px_#fff] z-10"
                  />
                )}

                {/* Agent Node */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: isHovered ? 1.5 : 1 }}
                  transition={{ duration: 0.8, delay: 1 + i * 0.1 }}
                  style={{ x: tx, y: ty }}
                  className="absolute w-4 h-4 rounded-full bg-[#09090b] border-[1.5px] border-[#2DD4BF] shadow-[0_0_20px_rgba(45,212,191,0.5)] z-20 pointer-events-auto cursor-pointer flex items-center justify-center"
                  onMouseEnter={() => setHoveredAgent(agent.id)}
                  onMouseLeave={() => setHoveredAgent(null)}
                >
                  <div className={`w-2 h-2 rounded-full transition-colors ${isHovered ? 'bg-[#2DD4BF] shadow-[0_0_10px_#2DD4BF]' : 'bg-[#2DD4BF]/50'}`} />
                  
                  {/* Node Label */}
                  {phase >= 3 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`absolute whitespace-nowrap flex flex-col items-center ${
                        agent.angle > -90 && agent.angle < 90 ? "left-7" :
                        agent.angle > 90 && agent.angle < 270 ? "right-7" :
                        agent.angle === -90 ? "bottom-7" : "top-7"
                      }`}
                    >
                      <span className={`text-[11px] font-bold tracking-widest transition-colors ${isHovered ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-slate-300'}`}>
                        {agent.label}
                      </span>
                      
                      {/* Tooltip */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mt-2 bg-black/80 backdrop-blur-md border border-white/10 text-slate-300 text-xs p-3 rounded-lg w-48 text-center shadow-2xl pointer-events-none"
                          >
                            {agent.desc}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )
          })}

          {/* Ambient Floating Particles */}
          {phase >= 2 && particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute w-0.5 h-0.5 rounded-full bg-[#2DD4BF]/50 z-0"
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{ 
                x: `${p.x}vw`, 
                y: `${p.y}vh`, 
                opacity: [0, 0.5, 0] 
              }}
              transition={{ 
                duration: p.duration, 
                repeat: Infinity, 
                delay: p.delay,
                ease: "linear" as any
              }}
              style={{ x: mouseX * 1.5, y: mouseY * 1.5 }}
            />
          ))}
        </motion.div>

        {/* TYPOGRAPHY OVERLAY */}
        <div className="relative z-30 flex flex-col items-center justify-center pointer-events-none text-center h-full w-full">
          {/* Main Title */}
          {phase >= 4 && (
            <motion.div style={{ y: titleY }} className="relative">
              <h1 className="text-[12vw] md:text-[140px] font-black tracking-tighter text-white leading-none drop-shadow-2xl overflow-hidden flex">
                {"AGENTIQ".split("").map((char, i) => (
                  <motion.span 
                    key={i}
                    initial={{ opacity: 0, filter: "blur(20px)", scale: 1.5, x: -20 }}
                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1, x: 0 }}
                    transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block relative"
                  >
                    {char}
                    {phase >= 7 && (
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2DD4BF]/40 to-transparent bg-clip-text text-transparent"
                        animate={{ backgroundPosition: ["-200% 0", "200% 0"] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: "linear" as any }}
                      >
                        {char}
                      </motion.span>
                    )}
                  </motion.span>
                ))}
              </h1>
            </motion.div>
          )}

          {/* Tagline */}
          <motion.div style={{ y: titleY }} className="mt-4 flex flex-col items-center text-sm md:text-2xl font-bold tracking-[0.3em] drop-shadow-md relative h-20">
             {phase >= 5 && (
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut" as any }}
                  className="text-white"
                >
                  YOUR AUTONOMOUS
                </motion.span>
             )}
             {phase >= 6 && (
                <motion.span 
                  initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 1, ease: "easeOut" as any }}
                  className="text-[#2DD4BF] drop-shadow-[0_0_15px_rgba(45,212,191,0.4)] mt-1"
                >
                  DATA WORKFORCE
                </motion.span>
             )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
