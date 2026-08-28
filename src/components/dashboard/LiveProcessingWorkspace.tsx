import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '@/lib/usePipelineStore';
import { useDatasetWebSocket } from '@/lib/useDatasetWebSocket';
import { PipelineNode } from './PipelineNode';
import { Card } from '@/components/ui/Card';
import { Terminal, Activity, Brain, Database, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LiveProcessingWorkspaceProps {
  datasetId: string;
  onComplete: () => void;
}

export function LiveProcessingWorkspace({ datasetId, onComplete }: LiveProcessingWorkspaceProps) {
  // Connect to live updates
  useDatasetWebSocket(datasetId);
  const store = usePipelineStore();
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // Automatically select the active stage if none is selected
  React.useEffect(() => {
    if (store.activeStageId && !selectedAgent) {
      const stage = store.stages.find(s => s.id === store.activeStageId);
      if (stage) setSelectedAgent(stage.agent);
    }
  }, [store.activeStageId, store.stages, selectedAgent]);

  // Filter logs for the selected agent, or all if none
  const displayLogs = selectedAgent 
    ? store.logs.filter(l => l.agent === selectedAgent)
    : store.logs;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] space-y-4">
      {/* Top: Horizontal Pipeline */}
      <Card className="p-6 shrink-0 overflow-x-auto glass">
        <div className="flex justify-between items-start min-w-max px-4 relative">
          {store.stages.map((stage, idx) => (
            <div key={stage.id} className="relative flex-1 min-w-[120px]">
              <PipelineNode 
                stage={stage} 
                isActive={stage.agent === selectedAgent || stage.id === store.activeStageId}
                isLast={idx === store.stages.length - 1}
                onClick={() => setSelectedAgent(stage.agent)}
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="flex flex-1 space-x-4 min-h-0">
        {/* Left: Agent Communication Stream */}
        <Card className="w-1/3 flex flex-col glass overflow-hidden border-cyan-900/30">
          <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-black/20">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-gray-200">Agent Intelligence Stream</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm">
            <AnimatePresence>
              {displayLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col p-3 rounded bg-black/40 border border-white/5"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-gray-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="text-xs font-bold text-cyan-300">
                      [{log.agent}]
                    </span>
                  </div>
                  <span className="text-gray-300">{log.message}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {displayLogs.length === 0 && (
              <div className="text-gray-500 italic">Waiting for agent activity...</div>
            )}
          </div>
        </Card>

        {/* Right: Dynamic Visualization Panel */}
        <Card className="flex-1 flex flex-col glass overflow-hidden relative">
          {/* We render a cool background mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.05),transparent_50%)] pointer-events-none" />
          
          <div className="p-4 border-b border-white/5 flex items-center justify-between z-10 bg-black/20">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[var(--brand-light)]" />
              <h3 className="font-semibold text-gray-200">Analysis & Visualization</h3>
            </div>
            {store.isComplete && (
              <Button onClick={onComplete} className="glow-violet">
                View Final Results <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 z-10">
            {/* Dynamic content based on what's running or selected */}
            <div className="h-full flex flex-col justify-center items-center text-center">
              {store.modelSelectionData ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full max-w-2xl"
                >
                  <Brain className="w-16 h-16 mx-auto mb-4 text-violet-400" />
                  <h2 className="text-2xl font-bold text-white mb-6">Model Architecture Selected</h2>
                  
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {store.modelSelectionData.models.map((m: any, i: number) => (
                      <div key={i} className={`p-4 rounded-xl border ${m.name === store.modelSelectionData.winner ? 'border-violet-500 bg-violet-500/20' : 'border-white/10 bg-black/40'}`}>
                        <div className="text-lg font-semibold text-gray-200">{m.name}</div>
                        <div className="text-3xl font-bold mt-2 text-white">{(m.score * 100).toFixed(1)}%</div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Confidence</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="inline-block px-6 py-2 rounded-full border border-cyan-400/50 bg-cyan-400/10 text-cyan-300 animate-pulse-glow">
                    Winner: {store.modelSelectionData.winner}
                  </div>
                </motion.div>
              ) : store.trainingData ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full max-w-md"
                >
                  <Activity className="w-16 h-16 mx-auto mb-4 text-cyan-400 animate-pulse" />
                  <h2 className="text-2xl font-bold text-white mb-6">Training Network</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-black/40 rounded-lg border border-white/5">
                      <span className="text-gray-400 uppercase text-xs tracking-wider">Accuracy</span>
                      <span className="text-xl font-bold text-cyan-400">{(store.trainingData.metrics.accuracy * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-black/40 rounded-lg border border-white/5">
                      <span className="text-gray-400 uppercase text-xs tracking-wider">Loss</span>
                      <span className="text-xl font-bold text-red-400">{store.trainingData.metrics.loss.toFixed(4)}</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="animate-pulse">
                  <Database className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl text-gray-400 font-light">
                    {store.activeStageId 
                      ? `Agent Node ${store.stages.find(s => s.id === store.activeStageId)?.name} is analyzing the dataset...`
                      : 'Connecting to Master Orchestrator...'}
                  </h3>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
