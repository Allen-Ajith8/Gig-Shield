import { useEffect, useRef } from 'react';
import { connectDatasetWebSocket } from './api';
import { usePipelineStore } from './usePipelineStore';

export function useDatasetWebSocket(datasetId: string | null) {
  const wsRef = useRef<WebSocket | null>(null);
  const { 
    setStages, 
    updateStageStatus, 
    addLog, 
    setModelSelectionData, 
    setTrainingData, 
    setComplete 
  } = usePipelineStore();

  useEffect(() => {
    if (!datasetId) return;

    const ws = connectDatasetWebSocket(datasetId);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { event_type, agent_name, message, data: payload, timestamp } = data;

        if (event_type === 'PIPELINE_INIT') {
          if (payload?.stages) {
            setStages(payload.stages);
          }
        } else if (event_type === 'STATUS_CHANGE') {
          if (agent_name && payload?.status) {
            updateStageStatus(agent_name, payload.status);
          }
        } else if (event_type === 'LOG') {
          if (agent_name) {
            addLog(agent_name, message, timestamp);
          }
        } else if (event_type === 'AGENT_STEP') {
          if (agent_name) {
            addLog(agent_name, message, timestamp);
            
            // Handle special payloads
            if (payload?.models && payload?.winner) {
              setModelSelectionData(payload);
            } else if (payload?.metrics) {
              setTrainingData(payload);
            }
          }
        } else if (event_type === 'PIPELINE_COMPLETE') {
          setComplete(true);
        }
      } catch (err) {
        console.error('WebSocket message parsing error:', err);
      }
    };

    ws.onclose = () => {
      console.log('Dataset WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, [datasetId, setStages, updateStageStatus, addLog, setModelSelectionData, setTrainingData, setComplete]);

  return wsRef.current;
}
