const API_BASE = "http://localhost:8000/api";
const WS_BASE = "ws://localhost:8000/ws";

export const api = {
  getStats: async () => {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  },
  
  uploadDataset: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await fetch(`${API_BASE}/dataset/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload dataset");
    return res.json();
  },
  
  getDatasetPreview: async (datasetId: string) => {
    const res = await fetch(`${API_BASE}/dataset/${datasetId}/preview`);
    if (!res.ok) throw new Error("Failed to fetch dataset preview");
    return res.json();
  },
  
  startWorkflow: async (goal: string, datasetId: string) => {
    const res = await fetch(`${API_BASE}/workflow/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ goal, dataset_id: datasetId }),
    });
    if (!res.ok) throw new Error("Failed to start workflow");
    return res.json();
  },
  
  getDictionary: async () => {
    const res = await fetch(`${API_BASE}/dictionary`);
    return res.json();
  },
  
  getFeatures: async () => {
    const res = await fetch(`${API_BASE}/features`);
    return res.json();
  },
  
  getSyntheticStats: async () => {
    const res = await fetch(`${API_BASE}/synthetic`);
    return res.json();
  },
  
  getExperiments: async () => {
    const res = await fetch(`${API_BASE}/experiments`);
    return res.json();
  },
  
  getPredictions: async () => {
    const res = await fetch(`${API_BASE}/predictions`);
    return res.json();
  }
};

// WebSocket singleton
class AgentLogsWebSocket {
  private ws: WebSocket | null = null;
  private listeners: Set<(data: any) => void> = new Set();
  
  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }
    
    this.ws = new WebSocket(`${WS_BASE}/agent-logs`);
    
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.listeners.forEach(listener => listener(data));
      } catch (e) {
        console.error("Failed to parse websocket message", e);
      }
    };
    
    this.ws.onclose = () => {
      console.log("WebSocket disconnected. Reconnecting in 3s...");
      setTimeout(() => this.connect(), 3000);
    };
  }
  
  subscribe(callback: (data: any) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const agentWebSocket = new AgentLogsWebSocket();
