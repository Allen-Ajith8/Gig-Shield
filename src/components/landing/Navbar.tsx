"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState("Home")

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navItems = ["Home", "Platform", "Agents", "Workflow"]

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-500",
        scrolled ? "bg-[#050608]/80 backdrop-blur-xl border-b border-white/5 py-4 shadow-2xl" : "bg-transparent py-6 border-b border-transparent"
      )}
    >
      <div className="flex items-center gap-3 group cursor-pointer">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2DD4BF] to-[#8B5CF6] flex items-center justify-center font-black text-background shadow-[0_0_15px_rgba(45,212,191,0.3)] group-hover:shadow-[0_0_25px_rgba(45,212,191,0.5)] transition-shadow">
          IQ
        </div>
        <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#2DD4BF] transition-colors">AgentIQ</span>
      </div>
      
      <div className="hidden md:flex items-center gap-10 text-xs font-bold tracking-widest text-slate-400 uppercase">
        {navItems.map(item => (
          <Link 
            key={item} 
            href={item === "Home" ? "#" : `#${item.toLowerCase()}`}
            onClick={() => setActive(item)}
            className={cn(
              "relative py-2 transition-colors hover:text-white",
              active === item ? "text-white" : ""
            )}
          >
            {item}
            {active === item && (
              <motion.div 
                layoutId="nav-underline"
                className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#2DD4BF] shadow-[0_0_10px_rgba(45,212,191,0.8)]"
              />
            )}
          </Link>
        ))}
        
        <Link 
          href="/dashboard" 
          className="relative overflow-hidden px-6 py-2.5 rounded-full border border-[#2DD4BF]/30 text-[#2DD4BF] font-bold group transition-all hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:bg-[#2DD4BF]/10"
        >
          <span className="relative z-10">LAUNCH APP</span>
        </Link>
      </div>
    </motion.nav>
  )
}
