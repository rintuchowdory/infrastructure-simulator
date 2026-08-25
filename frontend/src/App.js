import { useState, useEffect } from 'react';
import { BarChart3, Layout, Activity, DollarSign, Server, Settings, Cpu, Database, Globe, Zap, HardDrive, Cloud, Network, Layers, AlertCircle } from 'lucide-react';
import './App.css';
import Dashboard from './components/Dashboard';
import ArchitectureBuilder from './components/ArchitectureBuilder';
import TrafficSimulator from './components/TrafficSimulator';
import CostAnalysis from './components/CostAnalysis';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'architecture', label: 'Architecture Builder', icon: Layout },
  { id: 'traffic', label: 'Traffic Simulator', icon: Activity },
  { id: 'costs', label: 'Cost Analysis', icon: DollarSign },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="App">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>
            <Cpu size={22} style={{ color: '#00d4ff' }} />
            InfraSim
          </h1>
          <span>Cloud Infrastructure Simulator</span>
        </div>
        <nav className="nav-items">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => setActivePage(item.id)}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <div className="status-badge">
            <span className="status-dot"></span>
            All systems operational
          </div>
        </div>
      </aside>

      <main className="main-content">
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'architecture' && <ArchitectureBuilder />}
        {activePage === 'traffic' && <TrafficSimulator />}
        {activePage === 'costs' && <CostAnalysis />}
        {activePage === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
}

function SettingsPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Settings</h2>
          <p>Configure your infrastructure simulator</p>
        </div>
      </div>
      <div className="chart-card" style={{ maxWidth: 600 }}>
        <div className="chart-card-title">Simulation Settings</div>
        <div className="chart-card-subtitle">Adjust simulation parameters and preferences</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 20 }}>
          <div>
            <label style={{ fontSize: 13, color: '#6b7892', display: 'block', marginBottom: 8 }}>Simulation Speed</label>
            <select style={{ width: '100%', padding: 10, background: '#0f1525', color: '#e0e6f0', border: '1px solid #1e2538', borderRadius: 8, fontSize: 14 }}>
              <option>Real-time (1x)</option>
              <option>Fast (5x)</option>
              <option>Turbo (20x)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#6b7892', display: 'block', marginBottom: 8 }}>Default Region</label>
            <select style={{ width: '100%', padding: 10, background: '#0f1525', color: '#e0e6f0', border: '1px solid #1e2538', borderRadius: 8, fontSize: 14 }}>
              <option>eu-central-1 (Frankfurt)</option>
              <option>eu-west-1 (Dublin)</option>
              <option>us-east-1 (Virginia)</option>
              <option>ap-southeast-1 (Singapore)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#6b7892', display: 'block', marginBottom: 8 }}>Cost Currency</label>
            <select style={{ width: '100%', padding: 10, background: '#0f1525', color: '#e0e6f0', border: '1px solid #1e2538', borderRadius: 8, fontSize: 14 }}>
              <option>EUR (€)</option>
              <option>USD ($)</option>
              <option>GBP (£)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
