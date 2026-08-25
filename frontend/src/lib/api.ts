const API_BASE = 'http://localhost:8000';
const WS_BASE = 'ws://localhost:8000';

export const api = {
  async triggerIncident(payload: {
    service: string;
    severity: string;
    description: string;
    raw_log: string;
    metrics: object;
    source: string;
    scenario: string;
  }) {
    const res = await fetch(`${API_BASE}/api/v1/incidents/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to trigger incident: ${res.statusText}`);
    return res.json();
  },

  async getIncident(incidentId: string) {
    const res = await fetch(`${API_BASE}/api/v1/incidents/${incidentId}`);
    if (!res.ok) throw new Error(`Failed to get incident: ${res.statusText}`);
    return res.json();
  },

  async listIncidents() {
    const res = await fetch(`${API_BASE}/api/v1/incidents`);
    if (!res.ok) throw new Error(`Failed to list incidents: ${res.statusText}`);
    return res.json();
  },

  async submitApproval(
    incidentId: string,
    approved: boolean,
    reviewer?: string,
    comment?: string,
  ) {
    const res = await fetch(`${API_BASE}/api/v1/incidents/${incidentId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        approved,
        reviewer: reviewer ?? '',
        comment: comment ?? '',
      }),
    });
    if (!res.ok) throw new Error(`Failed to submit approval: ${res.statusText}`);
    return res.json();
  },

  async uploadDataset(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/api/dataset/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(`Failed to upload dataset: ${res.statusText}`);
    return res.json();
  },

  async getDatasetPreview(datasetId: string) {
    const res = await fetch(`${API_BASE}/api/dataset/${datasetId}/preview`);
    if (!res.ok) throw new Error(`Failed to get dataset preview: ${res.statusText}`);
    return res.json();
  },

  async analyzeDataset(datasetId: string) {
    const res = await fetch(`${API_BASE}/api/dataset/${datasetId}/analyze`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error(`Failed to analyze dataset: ${res.statusText}`);
    return res.json();
  },

  getDownloadUrl(datasetId: string) {
    return `${API_BASE}/api/dataset/${datasetId}/download`;
  }
};

export function connectIncidentWebSocket(incidentId: string): WebSocket {
  return new WebSocket(`${WS_BASE}/ws/incidents/${incidentId}`);
}
