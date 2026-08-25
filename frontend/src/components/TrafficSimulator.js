import { useState, useEffect } from 'react';
import { Activity, Zap, AlertTriangle, TrendingDown } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { api } from '../api/api';

const TOOLTIP_STYLE = {
  backgroundColor: '#0f1525',
  border: '1px solid #1e2538',
  borderRadius: 8,
  fontSize: 12,
  color: '#e0e6f0',
};

export default function TrafficSimulator() {
  const [trafficLevel, setTrafficLevel] = useState(500);
  const [activeServers, setActiveServers] = useState(10);
  const [data, setData] = useState(api.getMockTrafficData());

  useEffect(() => {
    const interval = setInterval(() => {
      const base = trafficLevel / 2 + Math.sin(Date.now() / 3000) * (trafficLevel / 4);
      const t = api.getMockTrafficData(12).map((d, i) => ({
        ...d,
        requests: Math.round(base + Math.random() * (trafficLevel / 3)),
        errors: Math.round((base + Math.random() * (trafficLevel / 3)) * (0.005 + Math.random() * 0.03)),
        latency: Math.round(30 + (trafficLevel / 50) + Math.random() * 25),
      }));
      setData(t);
    }, 2000);
    return () => clearInterval(interval);
  }, [trafficLevel]);

  const currentRequests = data[data.length - 1]?.requests || 0;
  const currentErrors = data[data.length - 1]?.errors || 0;
  const currentLatency = data[data.length - 1]?.latency || 0;
  const throughput = Math.round(currentRequests * 0.85);
  const errorRate = currentRequests > 0 ? ((currentErrors / currentRequests) * 100).toFixed(2) : 0;

  const gaugeData = [
    { name: 'load', value: Math.min((currentRequests / trafficLevel) * 100, 100), fill: currentRequests > trafficLevel * 0.8 ? '#ff5757' : currentRequests > trafficLevel * 0.5 ? '#ff9f43' : '#00ff88' },
  ];

  const regionData = [
    { region: 'eu-central-1', traffic: Math.round(currentRequests * 0.35) },
    { region: 'eu-west-1', traffic: Math.round(currentRequests * 0.28) },
    { region: 'us-east-1', traffic: Math.round(currentRequests * 0.22) },
    { region: 'ap-southeast', traffic: Math.round(currentRequests * 0.15) },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Traffic Simulator</h2>
          <p>Simulate and monitor real-time traffic patterns</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary">
            <Zap size={14} />
            Stress Test
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="traffic-controls">
        <div className="control-group">
          <span className="control-label">Traffic Intensity</span>
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={trafficLevel}
            onChange={e => setTrafficLevel(parseInt(e.target.value))}
            className="slider"
          />
          <span className="control-value">{trafficLevel} req/s</span>
        </div>
        <div className="control-group">
          <span className="control-label">Active Servers</span>
          <input
            type="range"
            min="1"
            max="20"
            value={activeServers}
            onChange={e => setActiveServers(parseInt(e.target.value))}
            className="slider"
          />
          <span className="control-value">{activeServers} servers</span>
        </div>
      </div>

      {/* Live Stats */}
      <div className="stat-grid">
        <div className="stat-card" style={{ '--accent': '#00d4ff', '--icon-bg': 'rgba(0,212,255,0.15)' }}>
          <div className="stat-card-header">
            <div className="stat-icon" style={{ background: 'rgba(0,212,255,0.15)' }}>
              <Activity size={20} style={{ color: '#00d4ff' }} />
            </div>
          </div>
          <div className="stat-value">{currentRequests.toLocaleString()}</div>
          <div className="stat-label">Requests/sec</div>
        </div>
        <div className="stat-card" style={{ '--accent': '#00ff88', '--icon-bg': 'rgba(0,255,136,0.15)' }}>
          <div className="stat-card-header">
            <div className="stat-icon" style={{ background: 'rgba(0,255,136,0.15)' }}>
              <Zap size={20} style={{ color: '#00ff88' }} />
            </div>
          </div>
          <div className="stat-value">{throughput.toLocaleString()}</div>
          <div className="stat-label">Throughput (req/s)</div>
        </div>
        <div className="stat-card" style={{ '--accent': '#7c5cfc', '--icon-bg': 'rgba(124,92,252,0.15)' }}>
          <div className="stat-card-header">
            <div className="stat-icon" style={{ background: 'rgba(124,92,252,0.15)' }}>
              <TrendingDown size={20} style={{ color: '#7c5cfc' }} />
            </div>
          </div>
          <div className="stat-value">{currentLatency}ms</div>
          <div className="stat-label">Avg Latency</div>
        </div>
        <div className="stat-card" style={{ '--accent': '#ff5757', '--icon-bg': 'rgba(255,87,87,0.15)' }}>
          <div className="stat-card-header">
            <div className="stat-icon" style={{ background: 'rgba(255,87,87,0.15)' }}>
              <AlertTriangle size={20} style={{ color: '#ff5757' }} />
            </div>
          </div>
          <div className="stat-value">{errorRate}%</div>
          <div className="stat-label">Error Rate</div>
        </div>
      </div>

      {/* Charts */}
      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-card-title">Live Traffic Flow</div>
          <div className="chart-card-subtitle">Real-time requests and errors (updates every 2s)</div>
          <div className="chart-container">
            <ResponsiveContainer>
              <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="liveReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="liveErr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff5757" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#ff5757" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2538" />
                <XAxis dataKey="time" stroke="#6b7892" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7892" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="requests" stroke="#00d4ff" strokeWidth={2} fill="url(#liveReq)" isAnimationActive={true} animationDuration={800} />
                <Area type="monotone" dataKey="errors" stroke="#ff5757" strokeWidth={2} fill="url(#liveErr)" isAnimationActive={true} animationDuration={800} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-title">Load Gauge</div>
          <div className="chart-card-subtitle">Current capacity utilization</div>
          <div className="chart-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" data={gaugeData} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar dataKey="value" cornerRadius={10} background={{ fill: '#1e2538' }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ textAlign: 'center', marginTop: -40 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: gaugeData[0].fill }}>{Math.round(gaugeData[0].value)}%</div>
            <div style={{ fontSize: 12, color: '#6b7892' }}>Load Capacity</div>
          </div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-card-title">Latency Over Time</div>
          <div className="chart-card-subtitle">Response time tracking</div>
          <div className="chart-container">
            <ResponsiveContainer>
              <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2538" />
                <XAxis dataKey="time" stroke="#6b7892" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7892" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Line type="monotone" dataKey="latency" stroke="#7c5cfc" strokeWidth={2} dot={false} activeDot={{ r: 5 }} isAnimationActive={true} animationDuration={800} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-title">Traffic by Region</div>
          <div className="chart-card-subtitle">Geographic distribution</div>
          <div className="chart-container">
            <ResponsiveContainer>
              <BarChart data={regionData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2538" horizontal={false} />
                <XAxis type="number" stroke="#6b7892" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="region" stroke="#6b7892" fontSize={11} tickLine={false} axisLine={false} width={90} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(0,212,255,0.05)' }} />
                <Bar dataKey="traffic" radius={[0, 4, 4, 0]} fill="#00d4ff" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
