const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Mock data generators for offline mode
const mockServers = [
  { id: 'srv-01', name: 'web-prod-01', type: 'Web Server', status: 'healthy', cpu: 45, memory: 62, network: 128, uptime: '99.97%', region: 'eu-central-1', cost: 142.50 },
  { id: 'srv-02', name: 'web-prod-02', type: 'Web Server', status: 'healthy', cpu: 38, memory: 55, network: 110, uptime: '99.95%', region: 'eu-central-1', cost: 142.50 },
  { id: 'srv-03', name: 'app-prod-01', type: 'App Server', status: 'healthy', cpu: 72, memory: 78, network: 340, uptime: '99.92%', region: 'eu-west-1', cost: 189.00 },
  { id: 'srv-04', name: 'app-prod-02', type: 'App Server', status: 'warning', cpu: 89, memory: 91, network: 420, uptime: '98.84%', region: 'eu-west-1', cost: 189.00 },
  { id: 'srv-05', name: 'db-primary', type: 'Database', status: 'healthy', cpu: 54, memory: 72, network: 256, uptime: '99.99%', region: 'eu-central-1', cost: 320.00 },
  { id: 'srv-06', name: 'db-replica-01', type: 'Database', status: 'healthy', cpu: 41, memory: 68, network: 180, uptime: '99.98%', region: 'eu-west-1', cost: 280.00 },
  { id: 'srv-07', name: 'lb-prod-01', type: 'Load Balancer', status: 'healthy', cpu: 22, memory: 35, network: 890, uptime: '99.99%', region: 'eu-central-1', cost: 95.00 },
  { id: 'srv-08', name: 'cache-redis-01', type: 'Cache', status: 'healthy', cpu: 18, memory: 48, network: 620, uptime: '99.96%', region: 'eu-central-1', cost: 78.00 },
  { id: 'srv-09', name: 'cdn-edge-01', type: 'CDN', status: 'healthy', cpu: 15, memory: 28, network: 1240, uptime: '99.98%', region: 'global', cost: 55.00 },
  { id: 'srv-10', name: 'queue-01', type: 'Message Queue', status: 'warning', cpu: 76, memory: 65, network: 480, uptime: '98.90%', region: 'eu-central-1', cost: 110.00 },
];

function generateTrafficData(points = 24) {
  return Array.from({ length: points }, (_, i) => {
    const hour = i;
    const base = 200 + Math.sin(i / 3) * 80 + Math.random() * 60;
    return {
      time: `${hour}:00`,
      requests: Math.round(base),
      errors: Math.round(base * (0.005 + Math.random() * 0.02)),
      latency: Math.round(40 + Math.sin(i / 4) * 15 + Math.random() * 20),
    };
  });
}

function generateCostData() {
  return [
    { name: 'Compute', value: 1426, color: '#00d4ff' },
    { name: 'Database', value: 600, color: '#7c5cfc' },
    { name: 'Network', value: 320, color: '#00ff88' },
    { name: 'Storage', value: 180, color: '#ff9f43' },
    { name: 'Cache', value: 78, color: '#ff5757' },
    { name: 'CDN', value: 55, color: '#e056fd' },
  ];
}

async function fetchWithFallback(url, fallback) {
  try {
    const res = await fetch(url, { timeout: 3000 });
    if (!res.ok) throw new Error('Not ok');
    return await res.json();
  } catch {
    return fallback;
  }
}

export const api = {
  async getServers() {
    return fetchWithFallback(`${API_BASE}/servers`, mockServers);
  },

  async getStats() {
    const servers = mockServers;
    const totalCost = servers.reduce((sum, s) => sum + s.cost, 0);
    const healthy = servers.filter(s => s.status === 'healthy').length;
    const avgCpu = Math.round(servers.reduce((sum, s) => sum + s.cpu, 0) / servers.length);
    return fetchWithFallback(`${API_BASE}/stats`, {
      totalServers: servers.length,
      healthyServers: healthy,
      warningServers: servers.filter(s => s.status === 'warning').length,
      totalConnections: 4892,
      avgResponseTime: 42,
      monthlyCost: totalCost,
      uptime: 99.94,
    });
  },

  async getTrafficData() {
    return fetchWithFallback(`${API_BASE}/traffic`, generateTrafficData());
  },

  async getCostData() {
    return fetchWithFallback(`${API_BASE}/costs`, generateCostData());
  },

  getMockTrafficData: generateTrafficData,
  getMockCostData: generateCostData,
};
