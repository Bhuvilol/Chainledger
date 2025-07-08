import { useState } from "react";

const ROUTES = [
  { route: "Warehouse → Zone A", avgTime: 32, cost: 18, success: 98, suggestion: "OK" },
  { route: "Warehouse → Zone B", avgTime: 45, cost: 25, success: 92, suggestion: "Optimize Route" },
  { route: "Warehouse → Zone C", avgTime: 28, cost: 15, success: 99, suggestion: "OK" },
  { route: "Warehouse → Zone D", avgTime: 60, cost: 30, success: 85, suggestion: "Add Drop Point" },
  { route: "Warehouse → Zone E", avgTime: 38, cost: 20, success: 95, suggestion: "OK" },
];

function SummaryCard({ title, value, color }) {
  return (
    <div className={`flex flex-col items-center bg-[#1e2329] rounded-lg shadow min-w-[140px] border-t-4 ${color} px-6 py-4 mx-2 my-2`} style={{ boxShadow: "0 2px 12px 0 #0ea5e91a" }}>
      <span className="text-lg font-semibold mb-1" style={{ color: "#bae6fd" }}>{title}</span>
      <span className="text-2xl font-bold" style={{ color: "#f1f5f9" }}>{value}</span>
    </div>
  );
}

function RouteTable({ routes }) {
  return (
    <div className="bg-[#232936] rounded-xl shadow p-6 mb-8">
      <h3 className="text-lg font-bold mb-4" style={{ color: "#7dd3fc" }}>Delivery Routes & Suggestions</h3>
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr>
            <th className="p-2" style={{ color: "#7dd3fc" }}>Route</th>
            <th className="p-2" style={{ color: "#bbf7d0" }}>Avg Time (min)</th>
            <th className="p-2" style={{ color: "#fde68a" }}>Cost ($)</th>
            <th className="p-2" style={{ color: "#bbf7d0" }}>Success (%)</th>
            <th className="p-2" style={{ color: "#fca5a5" }}>Suggestion</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((r, i) => (
            <tr key={r.route} style={{ color: "#bae6fd", fontWeight: 500 }}>
              <td className="p-2">{r.route}</td>
              <td className="p-2">{r.avgTime}</td>
              <td className="p-2">{r.cost}</td>
              <td className="p-2">{r.success}</td>
              <td className="p-2" style={{ color: r.suggestion === "OK" ? "#bbf7d0" : r.suggestion === "Optimize Route" ? "#fde68a" : "#fca5a5" }}>{r.suggestion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RouteMapMock() {
  return (
    <div className="bg-[#232936] rounded-xl shadow p-6 mb-8 flex flex-col items-center">
      <h3 className="text-lg font-bold mb-4" style={{ color: "#7dd3fc" }}>Route Visualisation (Mock)</h3>
      <div className="w-full flex justify-center">
        <svg width="320" height="120" className="rounded bg-[#1e2329]">
          <circle cx="40" cy="60" r="18" fill="#7dd3fc" />
          <text x="40" y="65" textAnchor="middle" fontSize="13" fill="#232936">WH</text>
          <line x1="58" y1="60" x2="120" y2="40" stroke="#bbf7d0" strokeWidth="4" />
          <circle cx="120" cy="40" r="12" fill="#bbf7d0" />
          <text x="120" y="45" textAnchor="middle" fontSize="12" fill="#232936">A</text>
          <line x1="58" y1="60" x2="120" y2="80" stroke="#fde68a" strokeWidth="4" />
          <circle cx="120" cy="80" r="12" fill="#fde68a" />
          <text x="120" y="85" textAnchor="middle" fontSize="12" fill="#232936">B</text>
          <line x1="58" y1="60" x2="200" y2="60" stroke="#fca5a5" strokeWidth="4" />
          <circle cx="200" cy="60" r="12" fill="#fca5a5" />
          <text x="200" y="65" textAnchor="middle" fontSize="12" fill="#232936">C</text>
        </svg>
      </div>
      <div className="flex gap-4 mt-4">
        <div className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full bg-[#7dd3fc]"></span><span className="text-xs text-[#bae6fd]">Warehouse</span></div>
        <div className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full bg-[#bbf7d0]"></span><span className="text-xs text-[#bbf7d0]">Zone A/B</span></div>
        <div className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full bg-[#fca5a5]"></span><span className="text-xs text-[#fca5a5]">Zone C</span></div>
      </div>
    </div>
  );
}

function AdvancedTips() {
  return (
    <div className="bg-[#1e2329] rounded-xl shadow p-6 mt-8">
      <h3 className="text-lg font-bold mb-3" style={{ color: "#7dd3fc" }}>Advanced Last Mile Optimisation Tips</h3>
      <ul className="list-disc pl-6 text-[#bae6fd] text-sm space-y-2">
        <li>Use dynamic route planning with real-time traffic and weather data.</li>
        <li>Cluster deliveries for high-density drop points to reduce travel time.</li>
        <li>Leverage local micro-fulfillment centers for faster delivery.</li>
        <li>Offer flexible delivery windows to increase first-attempt success.</li>
        <li>Integrate with crowdsourced delivery partners for surge capacity.</li>
      </ul>
      <h4 className="text-md font-bold mt-6 mb-2" style={{ color: "#fde68a" }}>How This Improves on Common Market Solutions</h4>
      <ul className="list-disc pl-6 text-[#fde68a] text-sm space-y-2">
        <li>Most solutions use static routes; this approach adapts in real time.</li>
        <li>Market tools rarely optimize for both cost and success rate together.</li>
        <li>Our dashboard highlights actionable suggestions, not just analytics.</li>
        <li>Visual route feedback and clustering are rarely integrated in one view.</li>
      </ul>
    </div>
  );
}

function CrowdsourcingPanel() {
  const drivers = [
    { name: "Alex", rating: 4.9, deliveries: 120 },
    { name: "Priya", rating: 4.8, deliveries: 98 },
    { name: "Sam", rating: 4.7, deliveries: 75 },
    { name: "Lee", rating: 4.6, deliveries: 60 },
  ];
  return (
    <div className="bg-[#232936] rounded-xl shadow p-6 mb-8">
      <h3 className="text-lg font-bold mb-4" style={{ color: "#7dd3fc" }}>Crowdsourced Drivers</h3>
      <div className="flex flex-wrap gap-4">
        {drivers.map((d) => (
          <div key={d.name} className="flex flex-col items-center bg-[#1e2329] rounded-lg px-4 py-3 min-w-[120px] border border-[#232936]">
            <span className="font-semibold text-[#bae6fd]">{d.name}</span>
            <span className="text-xs text-[#bbf7d0]">⭐ {d.rating}</span>
            <span className="text-xs text-[#fde68a]">{d.deliveries} deliveries</span>
            <button className="mt-2 px-3 py-1 rounded bg-[#7dd3fc] text-[#232936] text-xs font-bold hover:bg-[#bae6fd]">Recruit</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function GamificationLeaderboard() {
  const leaders = [
    { name: "Alex", score: 98 },
    { name: "Priya", score: 95 },
    { name: "Sam", score: 90 },
  ];
  return (
    <div className="bg-[#232936] rounded-xl shadow p-6 mb-8">
      <h3 className="text-lg font-bold mb-4" style={{ color: "#7dd3fc" }}>Driver Leaderboard</h3>
      <ol className="list-decimal pl-6 text-[#bae6fd] space-y-1">
        {leaders.map((l, i) => (
          <li key={l.name} className="flex justify-between w-48"><span>{l.name}</span><span className="font-bold">{l.score} pts</span></li>
        ))}
      </ol>
      <div className="text-xs text-[#fde68a] mt-2">Top drivers earn rewards!</div>
    </div>
  );
}

function LiveHeatmapMock() {
  return (
    <div className="bg-[#232936] rounded-xl shadow p-6 mb-8 flex flex-col items-center">
      <h3 className="text-lg font-bold mb-4" style={{ color: "#7dd3fc" }}>Live Delivery Heatmap (Mock)</h3>
      <div className="w-full flex justify-center">
        <svg width="320" height="120" className="rounded bg-[#1e2329]">
          <ellipse cx="80" cy="60" rx="60" ry="30" fill="#7dd3fc33" />
          <ellipse cx="200" cy="60" rx="40" ry="20" fill="#fca5a533" />
          <ellipse cx="160" cy="90" rx="30" ry="10" fill="#fde68a33" />
        </svg>
      </div>
      <div className="flex gap-4 mt-4">
        <span className="text-xs text-[#7dd3fc]">High Density</span>
        <span className="text-xs text-[#fca5a5]">Bottleneck</span>
        <span className="text-xs text-[#fde68a]">Normal</span>
      </div>
    </div>
  );
}

function CommunityDropoffWidget() {
  const [points, setPoints] = useState([
    { name: "Cafe Plaza", votes: 12 },
    { name: "Library Entrance", votes: 8 },
    { name: "Park Gate", votes: 5 },
  ]);
  const vote = (idx) => setPoints(points.map((p, i) => i === idx ? { ...p, votes: p.votes + 1 } : p));
  return (
    <div className="bg-[#232936] rounded-xl shadow p-6 mb-8">
      <h3 className="text-lg font-bold mb-4" style={{ color: "#7dd3fc" }}>Suggest & Vote: Community Drop-off Points</h3>
      <ul className="space-y-2">
        {points.map((p, i) => (
          <li key={p.name} className="flex justify-between items-center text-[#bae6fd]">
            <span>{p.name}</span>
            <button className="ml-2 px-2 py-1 rounded bg-[#7dd3fc] text-[#232936] text-xs font-bold hover:bg-[#bae6fd]" onClick={() => vote(i)}>+{p.votes}</button>
          </li>
        ))}
      </ul>
      <div className="text-xs text-[#fde68a] mt-2">Most-voted points get prioritized!</div>
    </div>
  );
}

function InstantFeedbackPanel() {
  const feedback = [
    { user: "Ravi", msg: "Delivery was super fast!" },
    { user: "Sara", msg: "Would love more evening slots." },
    { user: "John", msg: "Drop-off at park gate is convenient." },
  ];
  return (
    <div className="bg-[#232936] rounded-xl shadow p-6 mb-8">
      <h3 className="text-lg font-bold mb-4" style={{ color: "#7dd3fc" }}>Instant Recipient Feedback</h3>
      <ul className="space-y-2">
        {feedback.map((f, i) => (
          <li key={i} className="text-[#bae6fd] text-sm"><span className="font-bold">{f.user}:</span> {f.msg}</li>
        ))}
      </ul>
    </div>
  );
}

function RouteInputSimulator({ onSimulate }) {
  const [traffic, setTraffic] = useState('Normal');
  const [weather, setWeather] = useState('Clear');
  const [urgency, setUrgency] = useState('Standard');
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
      <div>
        <label className="text-[#bae6fd] text-sm mr-2">Traffic:</label>
        <select className="rounded bg-[#232936] text-[#bae6fd] px-2 py-1" value={traffic} onChange={e => setTraffic(e.target.value)}>
          <option>Normal</option><option>Heavy</option><option>Light</option>
        </select>
      </div>
      <div>
        <label className="text-[#bae6fd] text-sm mr-2">Weather:</label>
        <select className="rounded bg-[#232936] text-[#bae6fd] px-2 py-1" value={weather} onChange={e => setWeather(e.target.value)}>
          <option>Clear</option><option>Rainy</option><option>Stormy</option>
        </select>
      </div>
      <div>
        <label className="text-[#bae6fd] text-sm mr-2">Urgency:</label>
        <select className="rounded bg-[#232936] text-[#bae6fd] px-2 py-1" value={urgency} onChange={e => setUrgency(e.target.value)}>
          <option>Standard</option><option>High</option><option>Low</option>
        </select>
      </div>
      <button className="ml-2 px-4 py-1 rounded bg-[#7dd3fc] text-[#232936] font-bold hover:bg-[#bae6fd]" onClick={() => onSimulate({ traffic, weather, urgency })}>Optimize</button>
    </div>
  );
}

function RouteMapComparison({ scenario }) {
  const color = scenario.traffic === 'Heavy' ? '#fca5a5' : scenario.weather === 'Stormy' ? '#fde68a' : '#7dd3fc';
  return (
    <div className="flex flex-col md:flex-row gap-6 items-center justify-center mb-4">
      <div className="flex flex-col items-center">
        <span className="text-xs text-[#bae6fd] mb-1">Before</span>
        <svg width="120" height="80" className="rounded bg-[#1e2329]">
          <circle cx="30" cy="40" r="12" fill="#7dd3fc" />
          <line x1="42" y1="40" x2="100" y2="40" stroke="#fca5a5" strokeWidth="4" />
          <circle cx="100" cy="40" r="12" fill="#fca5a5" />
        </svg>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs text-[#bbf7d0] mb-1">After</span>
        <svg width="120" height="80" className="rounded bg-[#1e2329]">
          <circle cx="30" cy="40" r="12" fill="#7dd3fc" />
          <line x1="42" y1="40" x2="100" y2="40" stroke={color} strokeWidth="4" />
          <circle cx="100" cy="40" r="12" fill={color} />
        </svg>
      </div>
    </div>
  );
}

function ImpactMetricsCards({ scenario }) {
  let time = 32, cost = 18, co2 = 2.1;
  if (scenario.traffic === 'Heavy') time += 10;
  if (scenario.weather === 'Stormy') time += 8;
  if (scenario.urgency === 'High') time -= 5;
  if (scenario.traffic === 'Heavy') cost += 4;
  if (scenario.weather === 'Stormy') cost += 3;
  if (scenario.urgency === 'High') cost += 2;
  if (scenario.traffic === 'Heavy') co2 += 0.5;
  if (scenario.weather === 'Stormy') co2 += 0.3;
  if (scenario.urgency === 'High') co2 += 0.1;
  return (
    <div className="flex gap-4 justify-center mb-4">
      <SummaryCard title="Time Saved" value={Math.max(0, 40 - time) + ' min'} color="border-[#7dd3fc]" />
      <SummaryCard title="Cost Reduced" value={'$' + Math.max(0, 25 - cost)} color="border-[#fde68a]" />
      <SummaryCard title="CO₂ Saved" value={Math.max(0, 3.0 - co2).toFixed(2) + ' kg'} color="border-[#bbf7d0]" />
    </div>
  );
}

function RouteOptimizerPanel() {
  const [scenario, setScenario] = useState({ traffic: 'Normal', weather: 'Clear', urgency: 'Standard' });
  return (
    <div className="bg-[#232936] rounded-xl shadow p-6 mb-8">
      <h2 className="text-2xl font-bold mb-2" style={{ color: '#7dd3fc' }}>AI-Powered Dynamic Route Optimizer</h2>
      <p className="text-[#bae6fd] mb-4 text-sm">Simulate real-world conditions and see how AI optimizes your last mile delivery for speed, cost, and sustainability.</p>
      <RouteInputSimulator onSimulate={setScenario} />
      <RouteMapComparison scenario={scenario} />
      <ImpactMetricsCards scenario={scenario} />
    </div>
  );
}

function CO2SavingsCard() {
  return (
    <div className="flex flex-col items-center bg-[#1e2329] rounded-lg shadow min-w-[140px] border-t-4 border-[#bbf7d0] px-6 py-4 mx-2 my-2">
      <span className="text-lg font-semibold mb-1" style={{ color: '#bbf7d0' }}>CO₂ Saved</span>
      <span className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>12.4 kg</span>
    </div>
  );
}

function GreenScoreBar() {
  return (
    <div className="w-full mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-[#bae6fd] text-sm">Green Score</span>
        <span className="text-[#bbf7d0] text-sm font-bold">87/100</span>
      </div>
      <div className="w-full h-3 bg-[#1e2329] rounded">
        <div className="h-3 rounded bg-[#bbf7d0]" style={{ width: '87%' }}></div>
      </div>
    </div>
  );
}

function EmissionsComparisonChart() {
  return (
    <div className="w-full flex flex-col items-center mb-4">
      <span className="text-[#bae6fd] text-sm mb-2">Emissions Before vs After Optimization</span>
      <div className="flex gap-4 items-end h-20">
        <div className="flex flex-col items-center">
          <div className="w-8 h-16 bg-[#fca5a5] rounded-t"></div>
          <span className="text-xs text-[#fca5a5] mt-1">Before</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-10 bg-[#bbf7d0] rounded-t"></div>
          <span className="text-xs text-[#bbf7d0] mt-1">After</span>
        </div>
      </div>
    </div>
  );
}

function SustainabilityTips() {
  return (
    <div className="bg-[#1e2329] rounded-lg p-4 mt-2">
      <span className="text-[#fde68a] text-sm font-bold">Tips for More Sustainable Delivery:</span>
      <ul className="list-disc pl-6 text-[#bae6fd] text-xs mt-1 space-y-1">
        <li>Use electric vehicles for short routes.</li>
        <li>Batch deliveries in the same area.</li>
        <li>Encourage eco-friendly packaging.</li>
      </ul>
    </div>
  );
}

function SustainabilityDashboard() {
  return (
    <div className="bg-[#232936] rounded-xl shadow p-6 mb-8">
      <h2 className="text-2xl font-bold mb-2" style={{ color: '#bbf7d0' }}>Sustainability Dashboard</h2>
      <p className="text-[#bae6fd] mb-4 text-sm">Track your environmental impact and discover ways to make your last mile greener.</p>
      <div className="flex flex-wrap gap-4 mb-4">
        <CO2SavingsCard />
        <GreenScoreBar />
      </div>
      <EmissionsComparisonChart />
      <SustainabilityTips />
    </div>
  );
}

function DeliveryHeatmap() {
  return (
    <div className="flex flex-col items-center mb-4">
      <span className="text-[#bae6fd] text-sm mb-2">Delivery Bottleneck Heatmap</span>
      <div className="grid grid-cols-8 gap-1">
        {[...Array(32)].map((_, i) => (
          <div key={i} className={`w-4 h-4 rounded ${i % 9 === 0 ? 'bg-[#fca5a5]' : i % 7 === 0 ? 'bg-[#fde68a]' : 'bg-[#bbf7d0]'}`}></div>
        ))}
      </div>
    </div>
  );
}

function BottleneckAlertList() {
  const alerts = [
    { area: 'Zone B', issue: 'Heavy traffic', suggestion: 'Reroute via Zone C' },
    { area: 'Zone D', issue: 'Repeated delays', suggestion: 'Add drop point' },
  ];
  return (
    <div className="mb-4">
      <span className="text-[#fde68a] text-sm font-bold">Current Bottlenecks:</span>
      <ul className="list-disc pl-6 text-[#bae6fd] text-xs mt-1 space-y-1">
        {alerts.map((a, i) => (
          <li key={i}><span className="font-bold">{a.area}:</span> {a.issue} – <span className="text-[#bbf7d0]">{a.suggestion}</span></li>
        ))}
      </ul>
    </div>
  );
}

function BottleneckTrendGraph() {
  return (
    <div className="flex flex-col items-center mb-4">
      <span className="text-[#bae6fd] text-sm mb-2">Bottleneck Trend (Last 7 Days)</span>
      <svg width="180" height="60" className="bg-[#1e2329] rounded">
        <polyline points="0,50 30,40 60,30 90,35 120,20 150,25 180,10" fill="none" stroke="#fca5a5" strokeWidth="3" />
      </svg>
    </div>
  );
}

function ResolutionSuggestions() {
  return (
    <div className="bg-[#1e2329] rounded-lg p-4 mt-2">
      <span className="text-[#fde68a] text-sm font-bold">AI Suggestions:</span>
      <ul className="list-disc pl-6 text-[#bae6fd] text-xs mt-1 space-y-1">
        <li>Reroute deliveries during peak hours.</li>
        <li>Increase driver incentives for bottleneck zones.</li>
      </ul>
    </div>
  );
}

function BottleneckDetectionPanel() {
  return (
    <div className="bg-[#232936] rounded-xl shadow p-6 mb-8">
      <h2 className="text-2xl font-bold mb-2" style={{ color: '#fca5a5' }}>Bottleneck & Anomaly Detection</h2>
      <p className="text-[#bae6fd] mb-4 text-sm">Identify and resolve delivery bottlenecks in real time with AI-powered insights.</p>
      <DeliveryHeatmap />
      <BottleneckAlertList />
      <BottleneckTrendGraph />
      <ResolutionSuggestions />
    </div>
  );
}

export default function LM() {
  const avgTime = Math.round(ROUTES.reduce((a, b) => a + b.avgTime, 0) / ROUTES.length);
  const avgCost = Math.round(ROUTES.reduce((a, b) => a + b.cost, 0) / ROUTES.length);
  const avgSuccess = Math.round(ROUTES.reduce((a, b) => a + b.success, 0) / ROUTES.length);
  return (
    <div className="min-h-screen bg-[#1e2329] flex flex-col items-center py-10 px-2 md:px-0">
      <div className="max-w-3xl w-full mx-auto mb-8">
        <RouteOptimizerPanel />
        <SustainabilityDashboard />
        <BottleneckDetectionPanel />
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2" style={{ color: "#7dd3fc" }}>Last Mile Delivery Optimisation</h1>
        <p className="text-center mb-6 text-lg" style={{ color: "#bae6fd" }}>Optimise your last mile delivery for speed, cost, and reliability. Go beyond common market solutions with actionable suggestions and visual feedback.</p>
        <div className="flex flex-wrap gap-6 justify-center mb-8">
          <SummaryCard title="Avg Delivery Time" value={avgTime + ' min'} color="border-[#7dd3fc]" />
          <SummaryCard title="Avg Cost" value={'$' + avgCost} color="border-[#fde68a]" />
          <SummaryCard title="Success Rate" value={avgSuccess + '%'} color="border-[#bbf7d0]" />
        </div>
        <RouteMapMock />
        <RouteTable routes={ROUTES} />
        <AdvancedTips />
        <CrowdsourcingPanel />
        <GamificationLeaderboard />
        <LiveHeatmapMock />
        <CommunityDropoffWidget />
        <InstantFeedbackPanel />
      </div>
    </div>
  );
}
