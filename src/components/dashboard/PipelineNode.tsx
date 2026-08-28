import React from 'react';
import { motion } from 'framer-motion';
import { PipelineStage } from '@/lib/usePipelineStore';
import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';

interface PipelineNodeProps {
  stage: PipelineStage;
  isActive: boolean;
  isLast: boolean;
  onClick: () => void;
}

export function PipelineNode({ stage, isActive, isLast, onClick }: PipelineNodeProps) {
  const getStatusColor = () => {
    switch (stage.status) {
      case 'COMPLETED': return 'text-[var(--brand-light)] border-[var(--brand-light)]';
      case 'RUNNING': return 'text-cyan-400 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]';
      case 'FAILED': return 'text-red-400 border-red-400';
      default: return 'text-gray-500 border-gray-700';
    }
  };

  const getIcon = () => {
    switch (stage.status) {
      case 'COMPLETED': return <CheckCircle2 className="w-5 h-5" />;
      case 'RUNNING': return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'FAILED': return <XCircle className="w-5 h-5" />;
      default: return <Circle className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col items-center cursor-pointer group" onClick={onClick}>
      <motion.div 
        layout
        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center bg-[var(--bg-base)] transition-all duration-300 z-10 relative
          ${getStatusColor()}
          ${isActive ? 'scale-110' : 'scale-100'}
        `}
      >
        {getIcon()}
        
        {/* Pulsing ring for running state */}
        {stage.status === 'RUNNING' && (
          <span className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-50" />
        )}
      </motion.div>
      
      <div className="mt-2 text-center">
        <span className={`text-xs font-medium tracking-wider uppercase transition-colors
          ${stage.status === 'RUNNING' ? 'text-cyan-400' : 'text-gray-400 group-hover:text-gray-200'}
        `}>
          {stage.name}
        </span>
        <div className="text-[10px] text-gray-500 mt-0.5">{stage.agent}</div>
      </div>
      
      {/* Connector line (if not last) */}
      {!isLast && (
        <div className="absolute top-6 left-1/2 w-full h-[2px] -z-10">
          <div className="h-full bg-gray-800 w-full relative">
            {stage.status === 'COMPLETED' && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--brand-light)] to-cyan-400"
              />
            )}
            {stage.status === 'RUNNING' && (
              <div className="absolute top-0 left-0 h-full w-1/2 bg-cyan-400/50 animate-pulse" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
