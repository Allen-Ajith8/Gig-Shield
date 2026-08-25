"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { 
  Brain, FileSearch, BookType, Sparkles, 
  FlaskConical, ShieldAlert, Cpu, 
  Activity, CheckCircle, Lightbulb
} from "lucide-react"

const agents = [
  { name: "Master Agent", icon: Brain, desc: "Plans and orchestrates the entire workflow.", status: "Active" },
  { name: "Data Profiling Agent", icon: FileSearch, desc: "Automatically analyzes data quality, structure, distributions and anomalies.", status: "Active" },
  { name: "Data Dictionary Agent", icon: BookType, desc: "Understands columns and generates contextual descriptions.", status: "Active" },
  { name: "Cleaning Agent", icon: Sparkles, desc: "Handles missing values, duplicates and inconsistent data.", status: "Active" },
  { name: "Feature Engineering", icon: FlaskConical, desc: "Creates useful features based on the prediction objective.", status: "Active" },
  { name: "Synthetic Data Agent", icon: Cpu, desc: "Generates additional synthetic records when more or balanced data is required.", status: "Active" },
  { name: "Privacy Agent", icon: ShieldAlert, desc: "Detects PII and privacy risks.", status: "Active" },
  { name: "ML Strategy Agent", icon: Brain, desc: "Determines the ML problem and selects suitable candidate models.", status: "Active" },
  { name: "Experiment Agent", icon: Activity, desc: "Runs and compares multiple ML pipelines.", status: "Active" },
  { name: "Validation Agent", icon: CheckCircle, desc: "Checks data quality, leakage and model reliability.", status: "Active" },
  { name: "Recommendation Agent", icon: Lightbulb, desc: "Converts predictions into actionable business recommendations.", status: "Active" },
]

export function AgentWorkforce() {
  return (
    <section id="agents" className="py-32 bg-slate-900/20 border-y border-white/5 relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Meet Your AI Workforce</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full group hover:-translate-y-1 transition-all duration-300 bg-black/40 backdrop-blur-xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-lg bg-brand-dark/10 flex items-center justify-center text-brand-light group-hover:bg-brand-dark group-hover:text-white transition-colors">
                    <agent.icon size={24} />
                  </div>
                  <Badge variant="success" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    {agent.status}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{agent.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{agent.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
