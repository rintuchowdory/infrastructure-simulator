import { useState, useEffect } from 'react';
import { Server as ServerIcon, Activity, Zap, DollarSign, TrendingUp, AlertTriangle, Cpu, Globe, Clock } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../api/api';

const HERO_IMAGE = 'https://media.base44.com/images/public/6a88c713661e26134c7fedc6/b5706b836_generated_image.png';

const TOOLTIP_STYLE = {
  backgroundColor: '#0f1525',
  border: '1px solid #1e2538',
  borderRadius: 8,
  fontSize: 12,
  color: '#e0e6f0',
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [servers, setServers] = useState([]);
  const [traffic, setTraffic] = useState([]);
  const [costs, setCosts] = useState([]);

  useEffect(() => {
    Promise.all([
      api.getStats(),
      api.getServers(),
      api.getTrafficData(),
      api.getCostData(),
    ]).then(([s, srv, t, c]) => {
      setStats(s);
      setServers(srv);
      setTraffic(t);
      setCosts(c);
    });
  }, []);

  if (!stats) return <div style={{ color: '#6b7892', textAlign: 'center', padding: 60 }}>Loading dashboard…</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Infrastructure Dashboard</h2>
          <p>Real-time overview of your cloud infrastructure</p>
        </div>
        <div className="header-actions">
          <button className="btn-ghost">
            <Clock size={14} />
            Last 24h
          </button>
          <button className="btn-primary">
            <Zap size={14} />
            Run Simulation
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Welcome back to InfraSim 🚀</h2>
          <p>Your cloud infrastructure is running smoothly. Monitor, build, and optimize your architecture in real-time with our SimCity-inspired simulator.</p>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">{stats.totalServers}</div>
              <div className="hero-stat-label">Active Servers</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">{stats.uptime}%</div>
              <div className="hero-stat-label">Uptime</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">{stats.totalConnections.toLocaleString()}</div>
              <div className="hero-stat-label">Connections</div>
            </div>
          </div>
        </div>
        <img src={HERO_IMAGE} alt="Cloud Infrastructure" className="hero-image" />
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        <StatCard
          icon={<ServerIcon size={20} style={{ color: '#00d4ff' }} />}
          iconBg="rgba(0,212,255,0.15)"
          accent="#00d4ff"
          label="Total Servers"
          value={stats.totalServers}
          trend="+2"
          trendUp={true}
        />
        <StatCard
          icon={<Activity size={20} style={{ color: '#00ff88' }} />}
          iconBg="rgba(0,255,136,0.15)"
          accent="#00ff88"
          label="Healthy / Warning"
          value={`${stats.healthyServers} / ${stats.warningServers}`}
          trend={`${Math.round((stats.healthyServers / stats.totalServers) * 100)}% healthy`}
          trendUp={true}
        />
        <StatCard
          icon={<Zap size={20} style={{ color: '#7c5cfc' }} />}
          iconBg="rgba(124,92,252,0.15)"
          accent="#7c5cfc"
          label="Avg Response Time"
          value={`${stats.avgResponseTime}ms`}
          trend="-8ms"
          trendUp={true}
        />
        <StatCard
          icon={<DollarSign size={20} style={{ color: '#ff9f43' }} />}
          iconBg="rgba(255,159,67,0.15)"
          accent="#ff9f43"
          label="Monthly Cost"
          value={`€${stats.monthlyCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          trend="+€48"
          trendUp={false}
        />
      </div>

      {/* Charts */}
      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-card-title">Traffic Overview</div>
          <div className="chart-card-subtitle">Requests and errors over the last 24 hours</div>
          <div className="chart-container">
            <ResponsiveContainer>
              <AreaChart data={traffic} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="errGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff5757" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ff5757" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2538" />
                <XAxis dataKey="time" stroke="#6b7892" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7892" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="requests" stroke="#00d4ff" strokeWidth={2} fill="url(#reqGrad)" />
                <Area type="monotone" dataKey="errors" stroke="#ff5757" strokeWidth={2} fill="url(#errGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-title">Cost Breakdown</div>
          <div className="chart-card-subtitle">Monthly spend by category</div>
          <div className="chart-container">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={costs} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {costs.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(val) => `€${val}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
            {costs.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7892' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color }}></div>
                {c.name}: €{c.value}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-card-title">Server Load Distribution</div>
          <div className="chart-card-subtitle">CPU usage per server</div>
          <div className="chart-container">
            <ResponsiveContainer>
              <BarChart data={servers} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2538" />
                <XAxis dataKey="name" stroke="#6b7892" fontSize={10} tickLine={false} axisLine={false} angle={-30} textAnchor="end" height={50} />
                <YAxis stroke="#6b7892" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(0,212,255,0.05)' }} />
                <Bar dataKey="cpu" radius={[4, 4, 0, 0]} fill="#00d4ff" barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-title">Response Latency</div>
          <div className="chart-card-subtitle">Average response time (ms)</div>
          <div className="chart-container">
            <ResponsiveContainer>
              <LineChart data={traffic} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2538" />
                <XAxis dataKey="time" stroke="#6b7892" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7892" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Line type="monotone" dataKey="latency" stroke="#7c5cfc" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#7c5cfc' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Server List */}
      <div className="section-title">Infrastructure Servers</div>
      <div className="server-list">
        {servers.map(srv => (
          <div key={srv.id} className="server-card">
            <div className="server-card-header">
              <div className="server-name">
                <ServerIcon size={16} style={{ color: '#00d4ff' }} />
                {srv.name}
                <span className="server-type">{srv.type}</span>
              </div>
              <span className={`server-status ${srv.status}`}>{srv.status}</span>
            </div>
            <div className="metric-row">
              <div className="metric">
                <div className="metric-label">CPU</div>
                <div className="metric-bar"><div className="metric-fill cpu" style={{ width: `${srv.cpu}%` }}></div></div>
                <div className="metric-value">{srv.cpu}%</div>
              </div>
              <div className="metric">
                <div className="metric-label">Memory</div>
                <div className="metric-bar"><div className="metric-fill memory" style={{ width: `${srv.memory}%` }}></div></div>
                <div className="metric-value">{srv.memory}%</div>
              </div>
              <div className="metric">
                <div className="metric-label">Network</div>
                <div className="metric-bar"><div className="metric-fill network" style={{ width: `${Math.min(srv.network / 15, 100)}%` }}></div></div>
                <div className="metric-value">{srv.network} Mbps</div>
              </div>
            </div>
            <div className="server-footer">
              <span className="server-region"><Globe size={11} style={{ verticalAlign: 'middle' }} /> {srv.region} · Uptime: {srv.uptime}</span>
              <span className="server-cost">€{srv.cost.toFixed(2)}/mo</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon, iconBg, accent, label, value, trend, trendUp }) {
  return (
    <div className="stat-card" style={{ '--accent': accent, '--icon-bg': iconBg }}>
      <div className="stat-card-header">
        <div className="stat-icon" style={{ background: iconBg }}>{icon}</div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {trend && (
        <div className={`stat-trend ${trendUp ? 'up' : 'down'}`}>
          <TrendingUp size={12} style={{ transform: trendUp ? 'none' : 'rotate(180deg)' }} />
          {trend}
        </div>
      )}
    </div>
  );
}
