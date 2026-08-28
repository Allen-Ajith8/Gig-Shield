import { create } from 'zustand';

export type PipelineStage = {
  id: string;
  name: string;
  agent: string;
  status: 'WAITING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'NEEDS_REVIEW';
  progress?: number;
};

export type LogMessage = {
  id: string;
  timestamp: string;
  agent: string;
  message: string;
};

export type PipelineState = {
  stages: PipelineStage[];
  activeStageId: string | null;
  logs: LogMessage[];
  modelSelectionData: any | null;
  trainingData: any | null;
  isComplete: boolean;

  setStages: (stages: any[]) => void;
  updateStageStatus: (agent: string, status: PipelineStage['status']) => void;
  addLog: (agent: string, message: string, timestamp?: string) => void;
  setModelSelectionData: (data: any) => void;
  setTrainingData: (data: any) => void;
  setComplete: (complete: boolean) => void;
  reset: () => void;
};

export const usePipelineStore = create<PipelineState>((set) => ({
  stages: [],
  activeStageId: null,
  logs: [],
  modelSelectionData: null,
  trainingData: null,
  isComplete: false,

  setStages: (stages) => set({ 
    stages: stages.map(s => ({ ...s, status: 'WAITING' })),
    isComplete: false
  }),
  
  updateStageStatus: (agent, status) => set((state) => {
    const updatedStages = state.stages.map(s => 
      s.agent === agent ? { ...s, status } : s
    );
    
    // Find the currently active one
    const activeStage = updatedStages.find(s => s.status === 'RUNNING');
    
    return {
      stages: updatedStages,
      activeStageId: activeStage ? activeStage.id : state.activeStageId
    };
  }),
  
  addLog: (agent, message, timestamp) => set((state) => ({
    logs: [...state.logs, {
      id: Math.random().toString(36).substring(7),
      timestamp: timestamp || new Date().toISOString(),
      agent,
      message
    }]
  })),

  setModelSelectionData: (data) => set({ modelSelectionData: data }),
  
  setTrainingData: (data) => set({ trainingData: data }),
  
  setComplete: (complete) => set({ isComplete: complete }),
  
  reset: () => set({
    stages: [],
    activeStageId: null,
    logs: [],
    modelSelectionData: null,
    trainingData: null,
    isComplete: false
  })
}));
