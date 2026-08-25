"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/Card"
import { ArrowRight, BrainCircuit, LineChart, ShieldCheck, Workflow, Zap } from "lucide-react"

const stages = [
  { id: "RAW DATA", icon: null },
  { id: "OBSERVE", icon: BrainCircuit },
  { id: "PLAN", icon: Workflow },
  { id: "ACT", icon: Zap },
  { id: "VERIFY", icon: ShieldCheck },
  { id: "PREDICT", icon: LineChart },
]

export function PlatformOverview() {
  return (
    <section id="platform" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            From Raw Data to <span className="text-gradient-brand">Intelligent Decisions.</span>
          </h2>
          <p className="text-xl text-slate-400">
            AgentIQ does not execute a rigid data pipeline. It dynamically creates and adapts an AI workflow based on the dataset, business objective, and discoveries made by its agents.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 relative z-10">
          {stages.map((stage, index) => (
            <React.Fragment key={stage.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="flex flex-col items-center justify-center p-6 w-32 h-32 md:w-40 md:h-40 border-white/5 hover:border-brand-light/50 transition-colors group cursor-default">
                  {stage.icon ? (
                    <stage.icon className="w-8 h-8 text-slate-400 group-hover:text-brand-light mb-3 transition-colors" />
                  ) : (
                    <div className="text-slate-500 font-mono text-sm mb-3">{"{ ... }"}</div>
                  )}
                  <span className="font-bold text-sm tracking-wider text-slate-300 group-hover:text-white transition-colors">{stage.id}</span>
                </Card>
              </motion.div>

              {index < stages.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.1 }}
                  className="hidden md:block text-slate-600"
                >
                  <ArrowRight />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
