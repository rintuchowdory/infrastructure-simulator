import { useState, useEffect } from 'react';
import { DollarSign, TrendingDown, Lightbulb, ArrowDown } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../api/api';

const TOOLTIP_STYLE = {
  backgroundColor: '#0f1525',
  border: '1px solid #1e2538',
  borderRadius: 8,
  fontSize: 12,
  color: '#e0e6f0',
};

const OPTIMIZATIONS = [
  {
    title: 'Right-size app-prod-02',
    desc: 'Server is running at 89% CPU consistently. Consider upgrading to a larger instance or adding auto-scaling.',
    save: '€45/mo',
  },
  {
    title: 'Migrate to Reserved Instances',
    desc: '3 servers have been running 24/7 for 6+ months. Switch to reserved instances for a 40% discount.',
    save: '€280/mo',
  },
  {
    title: 'Consolidate message queues',
    desc: 'queue-01 is underutilized at 15% capacity. Consider merging with another queue or downgrading.',
    save: '€35/mo',
  },
  {
    title: 'Enable CDN for static assets',
    desc: 'Web servers are serving static content directly. Moving to CDN edge would reduce origin load by ~60%.',
    save: '€85/mo',
  },
];

const monthlyTrend = [
  { month: 'Jan', cost: 2150 },
  { month: 'Feb', cost: 2280 },
  { month: 'Mar', cost: 2350 },
  { month: 'Apr', cost: 2480 },
  { month: 'May', cost: 2560 },
  { month: 'Jun', cost: 2599 },
  { month: 'Jul', cost: 2659 },
  { month: 'Aug', cost: 2659 },
];

export default function CostAnalysis() {
  const [costs, setCosts] = useState([]);
  const [servers, setServers] = useState([]);

  useEffect(() => {
    Promise.all([api.getCostData(), api.getServers()]).then(([c, s]) => {
      setCosts(c);
      setServers(s);
    });
  }, []);

  const totalCost = costs.reduce((sum, c) => sum + c.value, 0);
  const potentialSavings = OPTIMIZATIONS.reduce((sum, o) => sum + parseInt(o.save.replace(/[^0-9]/g, '')), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Cost Analysis</h2>
          <p>Track, analyze, and optimize your infrastructure spending</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary">
            <ArrowDown size={14} />
            Export Report
          </button>
        </div>
      </div>

      {/* Top stats */}
      <div className="stat-grid">
        <div className="stat-card" style={{ '--accent': '#ff9f43', '--icon-bg': 'rgba(255,159,67,0.15)' }}>
          <div className="stat-card-header">
            <div className="stat-icon" style={{ background: 'rgba(255,159,67,0.15)' }}>
              <DollarSign size={20} style={{ color: '#ff9f43' }} />
            </div>
          </div>
          <div className="stat-value">€{totalCost.toLocaleString()}</div>
          <div className="stat-label">Monthly Cost</div>
          <div className="stat-trend up">+€99 vs last month</div>
        </div>
        <div className="stat-card" style={{ '--accent': '#00ff88', '--icon-bg': 'rgba(0,255,136,0.15)' }}>
          <div className="stat-card-header">
            <div className="stat-icon" style={{ background: 'rgba(0,255,136,0.15)' }}>
              <TrendingDown size={20} style={{ color: '#00ff88' }} />
            </div>
          </div>
          <div className="stat-value">€{potentialSavings}</div>
          <div className="stat-label">Potential Savings / mo</div>
          <div className="stat-trend up">{OPTIMIZATIONS.length} recommendations</div>
        </div>
        <div className="stat-card" style={{ '--accent': '#00d4ff', '--icon-bg': 'rgba(0,212,255,0.15)' }}>
          <div className="stat-card-header">
            <div className="stat-icon" style={{ background: 'rgba(0,212,255,0.15)' }}>
              <DollarSign size={20} style={{ color: '#00d4ff' }} />
            </div>
          </div>
          <div className="stat-value">€{(totalCost * 12).toLocaleString()}</div>
          <div className="stat-label">Projected Annual Cost</div>
        </div>
        <div className="stat-card" style={{ '--accent': '#7c5cfc', '--icon-bg': 'rgba(124,92,252,0.15)' }}>
          <div className="stat-card-header">
            <div className="stat-icon" style={{ background: 'rgba(124,92,252,0.15)' }}>
              <DollarSign size={20} style={{ color: '#7c5cfc' }} />
            </div>
          </div>
          <div className="stat-value">€{Math.round(totalCost / servers.length).toLocaleString()}</div>
          <div className="stat-label">Avg Cost / Server</div>
        </div>
      </div>

      {/* Charts */}
      <div className="cost-grid">
        <div className="chart-card">
          <div className="chart-card-title">Cost Breakdown by Category</div>
          <div className="chart-card-subtitle">How your monthly budget is distributed</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div className="chart-container" style={{ width: '50%', height: 240 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={costs} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={85} paddingAngle={3}>
                    {costs.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(val) => `€${val}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1 }}>
              {costs.map((c, i) => (
                <div key={i} className="cost-breakdown-item">
                  <div className="cost-color-dot" style={{ background: c.color }}></div>
                  <span className="cost-breakdown-name">{c.name}</span>
                  <span className="cost-breakdown-value">€{c.value}</span>
                  <span className="cost-breakdown-percent">{Math.round((c.value / totalCost) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-title">Monthly Cost Trend</div>
          <div className="chart-card-subtitle">Spending over the last 8 months</div>
          <div className="chart-container">
            <ResponsiveContainer>
              <AreaChart data={monthlyTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff9f43" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#ff9f43" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2538" />
                <XAxis dataKey="month" stroke="#6b7892" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7892" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(val) => [`€${val}`, 'Cost']} />
                <Area type="monotone" dataKey="cost" stroke="#ff9f43" strokeWidth={2} fill="url(#costGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Server costs bar chart */}
      <div className="chart-card" style={{ marginBottom: 24 }}>
        <div className="chart-card-title">Cost per Server</div>
        <div className="chart-card-subtitle">Individual server monthly costs</div>
        <div className="chart-container">
          <ResponsiveContainer>
            <BarChart data={servers.map(s => ({ name: s.name, cost: s.cost }))} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2538" />
              <XAxis dataKey="name" stroke="#6b7892" fontSize={10} tickLine={false} axisLine={false} angle={-30} textAnchor="end" height={50} />
              <YAxis stroke="#6b7892" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(0,212,255,0.05)' }} formatter={(val) => `€${val}`} />
              <Bar dataKey="cost" radius={[4, 4, 0, 0]} fill="#00d4ff" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Optimizations */}
      <div className="section-title">
        <Lightbulb size={16} style={{ verticalAlign: 'middle', marginRight: 8, color: '#ff9f43' }} />
        Cost Optimization Recommendations
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {OPTIMIZATIONS.map((opt, i) => (
          <div key={i} className="optimization-card">
            <div className="optimization-icon">💡</div>
            <div>
              <div className="optimization-title">{opt.title}</div>
              <div className="optimization-desc">{opt.desc}</div>
              <div className="optimization-save">Potential savings: {opt.save}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
