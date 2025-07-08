import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";

const ALL_CATEGORIES = [
  { name: "Bulk Groceries", value: 3200 },
  { name: "Electronics", value: 1800 },
  { name: "Home Goods", value: 2100 },
  { name: "Toys", value: 900 },
  { name: "Health & Beauty", value: 1400 },
  { name: "Office Supplies", value: 800 },
  { name: "Automotive", value: 1100 },
  { name: "Sports", value: 1300 },
];

const DEMAND_CATEGORIES = [
  { name: "Bulk Groceries", demand: [1800, 2200, 1700, 2500, 2100, 3000, 2600, 2300, 3100, 2000, 2800, 1600] },
  { name: "Toys", demand: [900, 1500, 1200, 800, 1400, 1100, 1700, 950, 1300, 1000, 1750, 1200] },
  { name: "Electronics", demand: [1500, 1700, 1600, 1800, 1400, 2000, 1750, 1550, 2100, 1300, 2200, 1800] },
  { name: "Home Goods", demand: [1800, 1950, 1700, 2100, 1850, 2250, 2000, 2400, 2300, 1900, 2450, 2050] },
  { name: "Health & Beauty", demand: [1000, 1200, 1100, 1300, 1050, 1400, 1150, 1250, 1350, 1200, 1500, 1100] },
  { name: "Office Supplies", demand: [700, 900, 800, 950, 750, 1000, 850, 1050, 1150, 950, 1250, 800] },
  { name: "Automotive", demand: [900, 1100, 950, 1200, 1000, 1300, 1050, 1250, 1350, 1150, 1450, 1000] },
  { name: "Sports", demand: [1000, 1300, 1050, 1400, 1100, 1500, 1150, 1350, 1450, 1200, 1550, 1250] },
];

const LINE_COLORS = [
  "#a78bfa", "#0ea5e9", "#f59e42", "#22d3ee", "#f472b6", "#facc15", "#34d399", "#f87171", "#818cf8"
];

function Dashboard() {
  return (
    <div className="w-full max-w-3xl mx-auto mb-12 bg-[#181f2a] rounded-lg shadow p-6 border border-[#232b3a]">
      <h2 className="text-2xl font-bold text-center mb-1 text-cyan-400">Wholesaler Warehouse Dashboard</h2>
      <p className="text-center text-gray-400 mb-4">Current stock levels for major product categories in the Walmart supply chain</p>
      <div className="flex items-end h-56 space-x-4 overflow-x-auto justify-center pb-2">
        {ALL_CATEGORIES.map(item => (
          <div key={item.name} className="flex flex-col items-center min-w-[90px]">
            <div
              className="w-14 rounded-t-lg bg-cyan-500 transition-all duration-500 shadow-lg"
              style={{ height: `${item.value / 30}px` }}
            ></div>
            <span className="mt-2 text-gray-200 font-semibold text-sm text-center">{item.name}</span>
            <span className="text-xs text-gray-400">{item.value.toLocaleString()} units</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getLast12Months() {
  const now = new Date();
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toLocaleString('default', { month: 'short', year: 'numeric' }));
  }
  return months;
}

function DemandTrendDashboard({ categories }) {
  const months = getLast12Months();
  const allDemands = categories.flatMap(cat => cat.demand || []);
  const maxDemand = Math.max(1, ...allDemands);
  const minDemand = Math.min(0, ...allDemands);
  const width = 600;
  const height = 200;
  return (
    <div className="w-full max-w-3xl mx-auto mb-12 bg-[#181f2a] rounded-lg shadow p-6 border border-[#232b3a]">
      <h2 className="text-2xl font-bold text-center mb-1 text-purple-400">Demand Trend (Multiple Categories)</h2>
      <p className="text-center text-gray-400 mb-4">Monthly demand trend for selected categories (Quantity vs Months)</p>
      <div className="overflow-x-auto pb-4">
        <svg width={width} height={height + 30} className="block mx-auto">
          <line x1="20" y1={height-30} x2={width-20} y2={height-30} stroke="#444" strokeWidth="2" />
          <line x1="20" y1={height-30} x2="20" y2="30" stroke="#444" strokeWidth="2" />
          {categories.map((cat, idx) => {
            const points = (cat.demand || []).map((q, i) => {
              const x = (i / ((cat.demand || []).length - 1 || 1)) * (width - 40) + 20;
              const y = height - 30 - ((q - minDemand) / (maxDemand - minDemand || 1)) * (height - 60);
              return `${x},${y}`;
            }).join(" ");
            return (
              <polyline
                key={cat.name}
                fill="none"
                stroke={LINE_COLORS[idx % LINE_COLORS.length]}
                strokeWidth="3"
                points={points}
                style={{ filter: 'drop-shadow(0 0 4px ' + LINE_COLORS[idx % LINE_COLORS.length] + ')' }}
              />
            );
          })}
          {categories.map((cat, idx) =>
            (cat.demand || []).map((q, i) => {
              const x = (i / ((cat.demand || []).length - 1 || 1)) * (width - 40) + 20;
              const y = height - 30 - ((q - minDemand) / (maxDemand - minDemand || 1)) * (height - 60);
              return <circle key={cat.name + i} cx={x} cy={y} r="3" fill={LINE_COLORS[idx % LINE_COLORS.length]} />;
            })
          )}
          {months.map((m, i) => {
            const x = (i / (months.length - 1)) * (width - 40) + 20;
            return (
              <g key={m} transform={`translate(${x},${height-10}) rotate(-35)`}>
                <text fontSize="10" fill="#e0e7ef" textAnchor="end">{m}</text>
              </g>
            );
          })}
          <text x="0" y={height-30} fontSize="12" fill="#e0e7ef" textAnchor="end">{minDemand}</text>
          <text x="0" y={40} fontSize="12" fill="#e0e7ef" textAnchor="end">{maxDemand}</text>
        </svg>
        <div className="flex flex-wrap gap-4 justify-center mt-6 p-3 rounded-lg bg-[#232b3a]/70 border border-[#232b3a]">
          {categories.map((cat, idx) => (
            <div key={cat.name} className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full" style={{ background: LINE_COLORS[idx % LINE_COLORS.length] }}></span>
              <span className="text-sm text-gray-200">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LowStockAlert({ categories }) {
  const lowStock = categories.filter(cat => cat.value < 1200);
  return (
    <div className="bg-[#181f2a] border border-[#232b3a] rounded-lg shadow-md p-5 mb-6">
      <h3 className="text-lg font-semibold text-red-400 mb-2">Low Stock Alert</h3>
      {lowStock.length === 0 ? (
        <p className="text-gray-300">All categories have sufficient stock.</p>
      ) : (
        <ul className="list-disc pl-5 text-gray-200">
          {lowStock.map(cat => (
            <li key={cat.name}>
              <span className="font-semibold">{cat.name}:</span> {cat.value} units
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RestockSuggestion({ categories }) {
  const suggestions = categories.filter(cat => {
    const last3 = (cat.demand || []).slice(-3);
    const avgLast3 = last3.length ? last3.reduce((a, b) => a + b, 0) / last3.length : 0;
    return avgLast3 > (cat.value || 0);
  });
  return (
    <div className="bg-[#181f2a] border border-[#232b3a] rounded-lg shadow-md p-5 mb-6">
      <h3 className="text-lg font-semibold text-yellow-400 mb-2">Restock Suggestions</h3>
      {suggestions.length === 0 ? (
        <p className="text-gray-300">No immediate restocking needed.</p>
      ) : (
        <ul className="list-disc pl-5 text-gray-200">
          {suggestions.map(cat => (
            <li key={cat.name}>
              <span className="font-semibold">{cat.name}:</span> Avg recent demand {Math.round((cat.demand || []).slice(-3).reduce((a, b) => a + b, 0) / 3)} &gt; Stock {cat.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function InventorySummary({ categories }) {
  const total = categories.reduce((sum, cat) => sum + (cat.value || 0), 0);
  const avg = Math.round(total / categories.length);
  return (
    <div className="bg-[#181f2a] border border-[#232b3a] rounded-lg shadow-md p-5 mb-6">
      <h3 className="text-lg font-semibold text-cyan-400 mb-2">Inventory Summary</h3>
      <p className="text-gray-200 mb-1">Total Inventory: <span className="font-bold">{total.toLocaleString()}</span> units</p>
      <p className="text-gray-200">Average per Category: <span className="font-bold">{avg.toLocaleString()}</span> units</p>
    </div>
  );
}

export default function IM() {
  const [selectedCategories, setSelectedCategories] = useState([DEMAND_CATEGORIES[0].name]);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      const bg = document.getElementById("animated-bg");
      if (bg) {
        bg.style.backgroundPositionY = `${window.scrollY * 0.3}px`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const selectedCats = DEMAND_CATEGORIES.filter(cat => selectedCategories.includes(cat.name));

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-12 xl:px-24 pr-8 md:pr-20 xl:pr-40 py-6 md:py-12 overflow-x-hidden bg-[#101624] text-white">
      <div id="animated-bg" className="fixed inset-0 -z-10 w-full h-full overflow-hidden">
        <svg className="absolute w-full h-full" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="meshGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          <path fill="url(#meshGradient)" fillOpacity="0.18" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-2xl opacity-40" />
        <div className="absolute top-2/3 left-2/3 w-40 h-40 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full blur-2xl opacity-30" />
        <div className="absolute top-1/2 left-3/4 w-24 h-24 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full blur-2xl opacity-30" />
      </div>
      <div className="w-full mx-auto mb-8 px-2 md:px-8">
        <div className="rounded-xl bg-gradient-to-r from-purple-900/60 to-cyan-900/60 border border-[#232b3a] shadow p-4 md:p-8 flex flex-wrap gap-4 justify-center items-center">
          <span className="text-cyan-300 font-semibold mr-4">Filter Demand Trend:</span>
          {DEMAND_CATEGORIES.map((cat) => (
            <label key={cat.name} className="flex items-center gap-2 cursor-pointer text-purple-200">
              <input
                type="checkbox"
                value={cat.name}
                checked={selectedCategories.includes(cat.name)}
                onChange={e => {
                  if (e.target.checked) {
                    setSelectedCategories([...selectedCategories, cat.name]);
                  } else {
                    setSelectedCategories(selectedCategories.filter(n => n !== cat.name));
                  }
                }}
                className="accent-purple-400"
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 md:gap-12 mx-auto">
        <div className="w-full lg:w-1/4 flex-shrink-0 flex flex-col gap-4">
          <div className="mb-4 text-center px-2 md:px-4">
            <h2 className="text-3xl font-bold text-cyan-300 mb-2">Explore Inventory Features</h2>
            <p className="text-gray-300 mb-6">Discover powerful tools to optimize, track, and predict your inventory for smarter warehouse management.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:gap-8 px-2 md:px-4 pb-8">
            <Link to="/inventory/optimise" className="bg-[#181f2a] border border-[#232b3a] rounded-lg shadow-md p-6 flex flex-col items-center transition-transform duration-200 cursor-pointer hover:scale-105 hover:shadow-2xl hover:border-cyan-400 hover:bg-[#232b3a]/80">
              <h2 className="text-2xl font-semibold mb-2 text-cyan-400">Optimise Stock Level</h2>
              <p className="text-gray-300 text-center">Maintain optimal stock levels to prevent shortages and overstock, ensuring efficient inventory turnover and reduced holding costs.</p>
            </Link>
            <Link to="/inventory/tracking" className="bg-[#181f2a] border border-[#232b3a] rounded-lg shadow-md p-6 flex flex-col items-center transition-transform duration-200 cursor-pointer hover:scale-105 hover:shadow-2xl hover:border-cyan-400 hover:bg-[#232b3a]/80">
              <h2 className="text-2xl font-semibold mb-2 text-cyan-400">Real Time Inventory Tracking</h2>
              <p className="text-gray-300 text-center">Monitor your inventory in real time for accurate stock visibility, enabling quick response to changes in demand and supply.</p>
            </Link>
            <Link to="/inventory/predictive" className="bg-[#181f2a] border border-[#232b3a] rounded-lg shadow-md p-6 flex flex-col items-center transition-transform duration-200 cursor-pointer hover:scale-105 hover:shadow-2xl hover:border-cyan-400 hover:bg-[#232b3a]/80">
              <h2 className="text-2xl font-semibold mb-2 text-cyan-400">Predictive Demand Warehouse</h2>
              <p className="text-gray-300 text-center">Leverage predictive analytics to forecast demand and optimize warehouse operations for better stock allocation and reduced waste.</p>
            </Link>
          </div>
        </div>
        <div className="w-full lg:w-2/4 flex flex-col gap-8 md:gap-12">
          <div className="w-full overflow-x-auto px-2 md:px-6 py-4 md:py-8">
            <DemandTrendDashboard categories={selectedCats} />
          </div>
          <div className="w-full overflow-x-auto px-2 md:px-6 py-4 md:py-8">
            <Dashboard />
          </div>
        </div>
        <div className="w-full lg:w-1/4 flex-shrink-0">
          <div className="sticky top-8">
            <div
              className="bg-gradient-to-br from-cyan-900/70 via-purple-900/60 to-blue-900/70 border border-[#232b3a] rounded-2xl shadow-xl p-6 md:p-8 mb-8 cursor-pointer transition duration-150 hover:shadow-2xl hover:border-cyan-400 hover:bg-cyan-900/80"
              onClick={() => navigate('/inventory/tracking')}
              title="Go to Real Time Inventory Tracking"
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-cyan-300 tracking-wide">Inventory Insights</h2>
              <LowStockAlert categories={ALL_CATEGORIES} />
              <RestockSuggestion categories={ALL_CATEGORIES.map(cat => {
                const match = DEMAND_CATEGORIES.find(d => d.name === cat.name);
                return {...cat, demand: match ? match.demand : []};
              })} />
              <InventorySummary categories={ALL_CATEGORIES} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
