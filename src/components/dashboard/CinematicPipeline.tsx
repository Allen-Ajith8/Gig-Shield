import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '@/lib/usePipelineStore';
import { useDatasetWebSocket } from '@/lib/useDatasetWebSocket';
import { ParticleScene } from './ParticleScene';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Play, Pause, Loader2 } from 'lucide-react';

interface CinematicPipelineProps {
  datasetId: string;
  onComplete: () => void;
}

export function CinematicPipeline({ datasetId, onComplete }: CinematicPipelineProps) {
  useDatasetWebSocket(datasetId);
  const store = usePipelineStore();
  
  const [localStage, setLocalStage] = useState<string | null>(null);

  useEffect(() => {
    if (store.activeStageId && store.activeStageId !== localStage) {
      setLocalStage(store.activeStageId);
    }
  }, [store.activeStageId, localStage]);

  const renderStageText = () => {
    switch (localStage) {
      case 'dataset':
        return (
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              className="text-6xl font-bold tracking-[0.2em] text-white mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
            >
              DATASET INGESTION
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="text-2xl text-cyan-300 font-light tracking-widest space-y-2"
            >
              <div>125,000 ROWS</div>
              <div>42 COLUMNS</div>
            </motion.div>
          </div>
        );
      case 'profiling':
      case 'dictionary':
        return (
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="text-5xl font-bold tracking-[0.1em] text-cyan-400 mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]"
            >
              PROFILING AGENT
            </motion.h1>
            <div className="grid grid-cols-2 gap-8 text-left text-lg text-white/80 font-mono">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>42 COLUMNS</motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>3.2% MISSING</motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>2.1% DUPLICATES</motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>8% MINORITY CLASS</motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
              className="mt-8 text-emerald-400 font-bold tracking-widest text-xl flex justify-center items-center gap-2"
            >
              <CheckCircle /> PROFILE COMPLETE
            </motion.div>
          </div>
        );
      case 'quality':
        return (
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }}
              className="text-5xl font-bold text-violet-400 mb-8 drop-shadow-[0_0_15px_rgba(139,92,246,0.8)]"
            >
              DATA QUALITY AGENT
            </motion.h1>
            <div className="flex justify-center gap-6 text-white/70 tracking-widest uppercase text-sm mb-8">
              <span>Completeness</span> • <span>Consistency</span> • <span>Validity</span> • <span>Uniqueness</span>
            </div>
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.5 }}
              className="w-48 h-48 mx-auto rounded-full border-4 border-violet-500/50 flex flex-col items-center justify-center bg-violet-500/10 backdrop-blur-sm"
            >
              <div className="text-sm text-violet-300 uppercase tracking-widest">Quality Score</div>
              <div className="text-5xl font-bold text-white mt-2">94.6%</div>
            </motion.div>
          </div>
        );
      case 'cleaning':
        return (
          <div className="text-center">
            <motion.h1 className="text-5xl font-bold text-emerald-400 mb-8">CLEANING AGENT</motion.h1>
            <div className="space-y-4 text-xl text-white/80 font-light tracking-wide">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>REMOVING DUPLICATES</motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>IMPUTING MISSING VALUES</motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>NORMALIZING DATA</motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
              className="mt-8 text-emerald-300 font-bold text-2xl flex justify-center items-center gap-2"
            >
              <CheckCircle size={28} /> DATA CLEANED
            </motion.div>
          </div>
        );
      case 'transformation':
        return (
          <div className="text-center">
            <motion.h1 className="text-5xl font-bold text-cyan-400 mb-8 tracking-widest">TRANSFORMATION</motion.h1>
            <div className="flex justify-center gap-12 text-2xl text-white/90 font-light">
              <motion.span initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>ENCODING</motion.span>
              <motion.span initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>SCALING</motion.span>
              <motion.span initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>NORMALIZATION</motion.span>
              <motion.span initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>DATE FEATURES</motion.span>
            </div>
          </div>
        );
      case 'feature_engineering':
        return (
          <div className="text-center">
            <motion.h1 className="text-5xl font-bold text-pink-400 mb-4 drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]">FEATURE ENGINEERING</motion.h1>
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-3xl text-white font-bold mb-8">
              +6 NEW FEATURES
            </motion.div>
            <div className="flex flex-col gap-3 text-xl text-pink-200/80 font-mono">
              <span>CustomerTenure</span>
              <span>AverageTransaction</span>
              <span>MonthlySpendRatio</span>
            </div>
          </div>
        );
      case 'synthetic_data':
        return (
          <div className="text-center">
            <motion.h1 className="text-5xl font-bold text-amber-400 mb-8">SYNTHETIC DATA AGENT</motion.h1>
            <div className="flex justify-center items-center gap-16 mb-8">
              <div className="text-right">
                <div className="text-white/50 text-sm mb-2">BEFORE</div>
                <div className="text-xl text-white flex items-center justify-end gap-4">92% <div className="w-32 h-2 bg-white/20 rounded-full"><div className="w-[92%] h-full bg-white rounded-full"></div></div></div>
                <div className="text-xl text-white flex items-center justify-end gap-4 mt-2">8% <div className="w-32 h-2 bg-white/20 rounded-full"><div className="w-[8%] h-full bg-amber-400 rounded-full"></div></div></div>
              </div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }} className="text-left">
                <div className="text-white/50 text-sm mb-2">AFTER</div>
                <div className="text-xl text-white flex items-center gap-4"><div className="w-32 h-2 bg-white/20 rounded-full"><div className="w-[75%] h-full bg-white rounded-full"></div></div> 75%</div>
                <div className="text-xl text-amber-400 flex items-center gap-4 mt-2"><div className="w-32 h-2 bg-white/20 rounded-full"><div className="w-[25%] h-full bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]"></div></div> 25%</div>
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="text-2xl text-amber-300 font-bold">
              +4,200 RECORDS GENERATED
            </motion.div>
          </div>
        );
      case 'model_strategy':
        return (
          <div className="text-center">
            <motion.h1 className="text-5xl font-bold text-violet-400 mb-6 drop-shadow-[0_0_20px_rgba(139,92,246,0.8)]">MODEL STRATEGY AGENT</motion.h1>
            <div className="bg-black/40 backdrop-blur-md border border-violet-500/30 p-6 rounded-2xl inline-block mb-8">
              <div className="text-violet-300 text-sm tracking-widest uppercase mb-1">Problem Detected</div>
              <div className="text-3xl text-white font-light">Binary Classification</div>
              <div className="w-full h-px bg-violet-500/30 my-4"></div>
              <div className="text-violet-300 text-sm tracking-widest uppercase mb-1">Target Variable</div>
              <div className="text-2xl text-white font-bold">Churn</div>
            </div>
            <div className="flex justify-center gap-8 text-white/60 font-mono text-sm">
              <span>XGBoost</span> • <span>Random Forest</span> • <span>LightGBM</span> • <span>Logistic Regression</span>
            </div>
          </div>
        );
      case 'model_selection':
        const winner = store.modelSelectionData?.winner || 'XGBoost';
        return (
          <div className="text-center">
            <motion.h1 className="text-4xl font-bold text-white mb-2">MODEL SELECTION</motion.h1>
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-cyan-400 tracking-widest mb-12">
              EVALUATING ARCHITECTURES...
            </motion.div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-4 text-left mx-auto w-fit mb-12">
              <div className="flex justify-between w-64 text-xl"><span className="text-white">XGBoost</span><span className="text-cyan-400 font-bold">92%</span></div>
              <div className="flex justify-between w-64 text-xl"><span className="text-white/60">Random Forest</span><span className="text-white/60">89%</span></div>
              <div className="flex justify-between w-64 text-xl"><span className="text-white/60">LightGBM</span><span className="text-white/60">91%</span></div>
              <div className="flex justify-between w-64 text-xl"><span className="text-white/60">Logistic Reg</span><span className="text-white/60">84%</span></div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }} className="text-3xl text-cyan-300 font-bold flex items-center justify-center gap-4">
              <span>🏆 {winner.toUpperCase()} SELECTED</span>
            </motion.div>
          </div>
        );
      case 'training':
        return (
          <div className="text-center w-full max-w-3xl mx-auto">
            <motion.h1 className="text-5xl font-bold text-cyan-400 mb-4 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">TRAINING MODEL</motion.h1>
            <div className="text-cyan-200/80 tracking-widest uppercase mb-12">Iteration 84 / 100</div>
            
            <div className="w-full h-2 bg-white/10 rounded-full mb-12 overflow-hidden">
              <motion.div 
                className="h-full bg-cyan-400" 
                initial={{ width: '0%' }} animate={{ width: '84%' }} transition={{ duration: 2 }}
              />
            </div>
            
            <div className="flex justify-around">
              <div className="bg-black/30 backdrop-blur border border-white/10 p-6 rounded-xl min-w-[200px]">
                <div className="text-sm text-gray-400 tracking-widest mb-2">F1 SCORE</div>
                <div className="text-3xl text-white font-bold flex items-center justify-center gap-3">
                  0.91 <span className="text-cyan-400">→</span> 0.92
                </div>
              </div>
              <div className="bg-black/30 backdrop-blur border border-white/10 p-6 rounded-xl min-w-[200px]">
                <div className="text-sm text-gray-400 tracking-widest mb-2">ROC-AUC</div>
                <div className="text-3xl text-white font-bold flex items-center justify-center gap-3">
                  0.94 <span className="text-emerald-400">→</span> 0.96
                </div>
              </div>
            </div>
          </div>
        );
      case 'validation':
        return (
          <div className="text-center">
            <motion.h1 className="text-5xl font-bold text-emerald-400 mb-8 drop-shadow-[0_0_20px_rgba(16,185,129,0.8)]">VALIDATION AGENT</motion.h1>
            <div className="space-y-3 text-xl text-white/80 font-light tracking-wide text-left mx-auto w-fit mb-12">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex gap-3 items-center"><CheckCircle className="text-emerald-400"/> PERFORMANCE</motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex gap-3 items-center"><CheckCircle className="text-emerald-400"/> GENERALIZATION</motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="flex gap-3 items-center"><CheckCircle className="text-emerald-400"/> ERROR ANALYSIS</motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="flex gap-3 items-center"><CheckCircle className="text-emerald-400"/> FEATURE IMPORTANCE</motion.div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }} className="bg-emerald-500/20 border border-emerald-500/50 p-6 rounded-2xl inline-block">
              <div className="text-emerald-300 font-bold text-2xl mb-4 tracking-widest">MODEL VALIDATED</div>
              <div className="flex gap-8 text-xl text-white">
                <div>F1: <span className="font-bold">0.92</span></div>
                <div>ROC-AUC: <span className="font-bold">0.96</span></div>
              </div>
            </motion.div>
          </div>
        );
      case 'final_model':
      case null:
        if (store.isComplete) {
          return (
            <div className="text-center bg-black/50 p-12 rounded-3xl backdrop-blur-md border border-white/10">
              <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}
                className="text-7xl font-black tracking-widest text-white mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,1)]"
              >
                AGENTIQ
              </motion.h1>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-2xl text-cyan-400 tracking-[0.3em] font-light mb-12">
                YOUR AUTONOMOUS DATA WORKFORCE
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-sm text-white/50 tracking-widest flex items-center justify-center gap-4">
                DATA <span className="text-cyan-500">→</span> INTELLIGENCE <span className="text-cyan-500">→</span> MODEL
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-12">
                <Button onClick={onComplete} size="lg" className="bg-white text-black hover:bg-gray-200 px-12 py-6 text-lg font-bold">
                  Enter Deployment Dashboard
                </Button>
              </motion.div>
            </div>
          );
        }
        return null;
      default:
        return (
          <motion.h1 className="text-4xl font-light text-white uppercase tracking-widest">
            {store.stages.find(s => s.id === localStage)?.name || localStage}
          </motion.h1>
        );
    }
  };

  const activeStageDetails = store.stages.find(s => s.id === localStage);
  const activeAgent = activeStageDetails?.agent || 'Master Orchestrator';
  const progressPercent = store.stages.length > 0 
    ? (Math.max(0, store.stages.findIndex(s => s.id === localStage)) / store.stages.length) * 100 
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden flex flex-col font-sans">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <ParticleScene activeStageId={localStage} />
        </Canvas>
      </div>

      {/* Cinematic Text Overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={localStage || 'init'}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex justify-center pointer-events-auto"
          >
            {renderStageText()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* UI Overlay - Minimal HUD */}
      <div className="absolute bottom-0 left-0 w-full p-8 z-20 pointer-events-auto flex items-end justify-between bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex flex-col gap-2">
          <div className="text-[10px] text-white/50 tracking-[0.2em] uppercase">Current Agent</div>
          <div className="text-xl text-white font-medium flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
            {activeAgent}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="text-[10px] text-white/50 tracking-[0.2em] uppercase">Status</div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 tracking-wider">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              PROCESSING
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4 w-1/3">
          <div className="flex items-center gap-4 w-full">
            <div className="text-xs text-cyan-400 font-mono">{Math.round(progressPercent)}%</div>
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white border border-white/10 bg-white/5 backdrop-blur-sm">
              <Pause className="w-4 h-4 mr-2" /> Pause
            </Button>
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white border border-white/10 bg-white/5 backdrop-blur-sm">
              View Logs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
