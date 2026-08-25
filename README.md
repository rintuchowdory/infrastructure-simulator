# Infrastructure Simulator 🎮

A **SimCity-inspired cloud infrastructure simulator** where users design, build, and optimize cloud architectures to handle traffic, scale efficiently, and minimize costs.

![Infrastructure Simulator](https://media.base44.com/images/public/6a88c713661e26134c7fedc6/b5706b836_generated_image.png)

---

## ✨ Features

### 📊 Dashboard
- Real-time KPI cards (servers, health, response time, cost)
- Traffic overview with area charts
- Cost breakdown with pie charts
- Server load distribution bar charts
- Response latency line charts
- Detailed server cards with CPU, memory, and network metrics
- Hero banner with infrastructure visualization

### 🏗️ Architecture Builder
- Interactive component palette (Web Server, App Server, Database, Load Balancer, CDN, Cache, Message Queue, Object Storage, API Gateway)
- Click-to-place architecture canvas
- Real-time cost and capacity summary
- Component removal and clear functionality

### 📡 Traffic Simulator
- Adjustable traffic intensity (100–2000 req/s)
- Configurable active server count
- Live-updating charts (refreshes every 2 seconds)
- Load gauge with color-coded capacity indicators
- Traffic by region distribution
- Real-time latency tracking

### 💰 Cost Analysis
- Monthly cost breakdown by category
- 8-month cost trend visualization
- Per-server cost comparison
- 4 cost optimization recommendations with potential savings
- Projected annual cost and average cost per server

### ⚙️ Settings
- Simulation speed configuration
- Default region selection
- Currency display options

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Recharts, Lucide Icons |
| Backend | Express 5, Node.js |
| Styling | Custom CSS (Dark theme) |
| Charts | Recharts (Area, Bar, Line, Pie, RadialBar) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Frontend
```bash
cd frontend
npm install
npm start
```
The app runs on `http://localhost:3000`

### Backend
```bash
cd backend
npm install
npm start
```
The API runs on `http://localhost:5000`

> The frontend works standalone with built-in mock data. The backend enhances it with live API endpoints.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/api/stats` | Infrastructure statistics |
| GET | `/api/servers` | List all servers |
| GET | `/api/servers/:id` | Get server by ID |
| GET | `/api/traffic` | 24h traffic data |
| GET | `/api/costs` | Cost breakdown |
| POST | `/api/simulate` | Run traffic simulation |

---

## 🎨 Design

- **Theme:** Dark mode (enterprise DevOps aesthetic)
- **Primary:** `#00d4ff` (Cyan)
- **Secondary:** `#7c5cfc` (Purple)
- **Accent:** `#00ff88` (Green/Healthy)
- **Warning:** `#ff9f43` (Orange)
- **Error:** `#ff5757` (Red)
- **Font:** Inter

---

## 📄 License

MIT
