import { useState } from 'react';
import { Server, Database, Cloud, Network, HardDrive, Layers, Globe, Cpu, Zap, X, Plus } from 'lucide-react';

const COMPONENTS = [
  { id: 'web', name: 'Web Server', icon: Server, color: '#00d4ff', bg: 'rgba(0,212,255,0.15)', cost: 142.50, capacity: '5000 req/s', desc: 'Handles HTTP requests' },
  { id: 'app', name: 'App Server', icon: Cpu, color: '#7c5cfc', bg: 'rgba(124,92,252,0.15)', cost: 189.00, capacity: '3000 req/s', desc: 'Application logic' },
  { id: 'db', name: 'Database', icon: Database, color: '#00ff88', bg: 'rgba(0,255,136,0.15)', cost: 320.00, capacity: '1000 QPS', desc: 'Primary data store' },
  { id: 'lb', name: 'Load Balancer', icon: Network, color: '#ff9f43', bg: 'rgba(255,159,67,0.15)', cost: 95.00, capacity: '50000 req/s', desc: 'Distributes traffic' },
  { id: 'cdn', name: 'CDN', icon: Globe, color: '#e056fd', bg: 'rgba(224,86,253,0.15)', cost: 55.00, capacity: '100000 req/s', desc: 'Edge content delivery' },
  { id: 'cache', name: 'Cache (Redis)', icon: Zap, color: '#ff5757', bg: 'rgba(255,87,87,0.15)', cost: 78.00, capacity: '50000 ops/s', desc: 'In-memory cache' },
  { id: 'queue', name: 'Message Queue', icon: Layers, color: '#54a0ff', bg: 'rgba(84,160,255,0.15)', cost: 110.00, capacity: '20000 msg/s', desc: 'Async processing' },
  { id: 'storage', name: 'Object Storage', icon: HardDrive, color: '#5f6caf', bg: 'rgba(95,108,175,0.15)', cost: 45.00, capacity: 'Unlimited', desc: 'File storage' },
  { id: 'gateway', name: 'API Gateway', icon: Cloud, color: '#48dbfb', bg: 'rgba(72,219,251,0.15)', cost: 85.00, capacity: '20000 req/s', desc: 'API management' },
];

export default function ArchitectureBuilder() {
  const [placed, setPlaced] = useState([
    COMPONENTS[3], // Load Balancer
    COMPONENTS[0], // Web Server
    COMPONENTS[0], // Web Server
    COMPONENTS[1], // App Server
    COMPONENTS[2], // Database
    COMPONENTS[5], // Cache
  ]);

  const handleAdd = (comp) => {
    setPlaced([...placed, comp]);
  };

  const handleRemove = (index) => {
    setPlaced(placed.filter((_, i) => i !== index));
  };

  const totalCost = placed.reduce((sum, c) => sum + c.cost, 0);
  const totalCapacity = placed.reduce((sum, c) => sum + parseInt(c.capacity) || 0, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Architecture Builder</h2>
          <p>Design your cloud infrastructure — drag components from the palette</p>
        </div>
        <div className="header-actions">
          <button className="btn-ghost" onClick={() => setPlaced([])}>
            Clear All
          </button>
          <button className="btn-primary">
            <Zap size={14} />
            Deploy Architecture
          </button>
        </div>
      </div>

      <div className="builder-layout">
        {/* Component Palette */}
        <div className="component-palette">
          <div className="palette-title">Components</div>
          {COMPONENTS.map(comp => {
            const Icon = comp.icon;
            return (
              <div key={comp.id} className="palette-item" onClick={() => handleAdd(comp)} title={`Add ${comp.name}`}>
                <div className="palette-icon" style={{ background: comp.bg, color: comp.color }}>
                  <Icon size={18} />
                </div>
                <div className="palette-info">
                  <div className="palette-name">{comp.name}</div>
                  <div className="palette-cost">€{comp.cost.toFixed(2)}/mo · {comp.capacity}</div>
                </div>
                <Plus size={14} style={{ color: '#6b7892' }} />
              </div>
            );
          })}
        </div>

        {/* Canvas */}
        <div className="builder-canvas">
          {placed.length === 0 ? (
            <div className="canvas-empty">
              <div className="canvas-empty-icon">🏗️</div>
              <h3 style={{ fontSize: 18, color: '#e0e6f0', marginBottom: 8 }}>Start Building</h3>
              <p style={{ fontSize: 14 }}>Click components from the palette to add them to your architecture</p>
            </div>
          ) : (
            <div className="canvas-grid">
              {placed.map((comp, i) => {
                const Icon = comp.icon;
                return (
                  <div key={i} className="placed-component">
                    <button className="remove-btn" onClick={() => handleRemove(i)}>
                      <X size={14} />
                    </button>
                    <div className="component-icon" style={{ background: comp.bg, color: comp.color }}>
                      <Icon size={28} />
                    </div>
                    <div className="component-name">{comp.name}</div>
                    <div className="component-meta">{comp.desc}</div>
                    <div className="component-meta" style={{ marginTop: 4, color: comp.color }}>€{comp.cost.toFixed(2)}/mo</div>
                  </div>
                );
              })}
            </div>
          )}

          {placed.length > 0 && (
              <div className="builder-summary">
                <div className="summary-item">
                  <div className="summary-value">{placed.length}</div>
                  <div className="summary-label">Components</div>
                </div>
                <div className="summary-item">
                  <div className="summary-value">€{totalCost.toFixed(2)}</div>
                  <div className="summary-label">Monthly Cost</div>
                </div>
                <div className="summary-item">
                  <div className="summary-value">{(totalCapacity / 1000).toFixed(0)}K</div>
                  <div className="summary-label">Est. Capacity</div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
