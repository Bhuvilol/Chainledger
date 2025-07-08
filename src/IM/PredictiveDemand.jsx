import { useState, useRef } from "react";

const DEMAND_DATA = [
  { month: "Jan", actual: 1200, predicted: 1300, occasion: "New Year", icon: "🎆" },
  { month: "Feb", actual: 1350, predicted: 1400, occasion: "Valentine's Day", icon: "💖" },
  { month: "Mar", actual: 1280, predicted: 1320, occasion: null, icon: null },
  { month: "Apr", actual: 1500, predicted: 1480, occasion: "Easter", icon: "🐣" },
  { month: "May", actual: 1600, predicted: 1580, occasion: null, icon: null },
  { month: "Jun", actual: 1700, predicted: 1720, occasion: null, icon: null },
  { month: "Jul", actual: 1650, predicted: 1680, occasion: null, icon: null },
  { month: "Aug", actual: 1750, predicted: 1780, occasion: "Back to School", icon: "🎒" },
  { month: "Sep", actual: 1800, predicted: 1850, occasion: null, icon: null },
  { month: "Oct", actual: 2100, predicted: 2200, occasion: "Diwali/Halloween", icon: "🎃" },
  { month: "Nov", actual: 2500, predicted: 2600, occasion: "Black Friday/Thanksgiving", icon: "🦃" },
  { month: "Dec", actual: 3200, predicted: 3300, occasion: "Christmas/New Year", icon: "🎄" },
];

const OCCASION_COLORS = {
  "New Year": "#7dd3fc",
  "Valentine's Day": "#fbcfe8",
  "Easter": "#bbf7d0",
  "Back to School": "#fde68a",
  "Diwali/Halloween": "#fca5a5",
  "Black Friday/Thanksgiving": "#c7d2fe",
  "Christmas/New Year": "#ddd6fe"
};

function SummaryCard({ title, value, color, icon }) {
  return (
    <div className={`flex flex-col items-center bg-[#1e2329] rounded-lg shadow min-w-[160px] border-t-4 ${color} px-8 py-6 mx-2 my-2`} style={{ boxShadow: "0 2px 12px 0 #0ea5e91a" }}>
      <span className="text-3xl mb-3" style={{ color: "#7dd3fc" }}>{icon}</span>
      <span className="text-lg font-semibold mb-2" style={{ color: "#bae6fd" }}>{title}</span>
      <span className="text-3xl font-bold" style={{ color: "#f1f5f9" }}>{value}</span>
    </div>
  );
}

function DemandChart({ data, showOccasions, onEdit, editable }) {
  const [hovered, setHovered] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: null });
  const containerRef = useRef();
  const max = Math.max(...data.map(d => Math.max(d.actual, d.predicted)));
  const min = Math.min(...data.map(d => Math.min(d.actual, d.predicted)));
  const height = 260, width = 700, pad = 50;
  const getX = i => pad + (i * (width - 2 * pad)) / (data.length - 1);
  const getY = v => height - pad - ((v - min) / (max - min)) * (height - 2 * pad);

  const handleIconMouseEnter = (i, d) => e => {
    const rect = containerRef.current.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: getX(i) + rect.left - containerRef.current.scrollLeft,
      y: pad - 10 + rect.top,
      content: <><b>{d.occasion}</b><br />{d.month}</>
    });
    setHovered(i);
  };
  const handleIconMouseLeave = () => {
    setTooltip(t => ({ ...t, visible: false }));
    setHovered(null);
  };

  return (
    <div className="relative" ref={containerRef} style={{ width }}>
      <svg width={width} height={height} className="bg-[#1e2329] rounded-lg shadow">
        {showOccasions && data.map((d, i) => d.occasion && (
          <defs key={d.occasion + i}>
            <linearGradient id={`band${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={OCCASION_COLORS[d.occasion]} stopOpacity="0.13" />
              <stop offset="100%" stopColor={OCCASION_COLORS[d.occasion]} stopOpacity="0.04" />
            </linearGradient>
          </defs>
        ))}
        {showOccasions && data.map((d, i) => d.occasion && (
          <rect
            key={d.occasion + i}
            x={getX(i) - 8}
            y={pad - 20}
            width={16}
            height={height - 2 * pad + 40}
            fill={`url(#band${i})`}
            opacity={1}
            rx={4}
          />
        ))}
        <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#334155" strokeWidth="2" />
        <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="#334155" strokeWidth="2" />
        <polyline fill="none" stroke="#7dd3fc" strokeWidth="3" points={data.map((d, i) => `${getX(i)},${getY(d.actual)}`).join(" ")} />
        <polyline fill="none" stroke="#a5b4fc" strokeDasharray="6 4" strokeWidth="3" points={data.map((d, i) => `${getX(i)},${getY(d.predicted)}`).join(" ")} />
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={getX(i)} cy={getY(d.actual)} r="4" fill="#7dd3fc" />
            <circle cx={getX(i)} cy={getY(d.predicted)} r="4" fill="#a5b4fc" />
            {editable && (
              <rect
                x={getX(i) - 10}
                y={getY(d.predicted) - 10}
                width={20}
                height={20}
                fill="#a5b4fc"
                opacity={0.1}
                style={{ cursor: 'ns-resize' }}
                onMouseDown={e => {
                  const startY = e.clientY;
                  const startPred = d.predicted;
                  const onMove = moveEvt => {
                    const dy = moveEvt.clientY - startY;
                    const valueChange = -Math.round((dy / (height - 2 * pad)) * (max - min));
                    onEdit(i, Math.max(min, Math.min(max, startPred + valueChange)));
                  };
                  const onUp = () => {
                    window.removeEventListener('mousemove', onMove);
                    window.removeEventListener('mouseup', onUp);
                  };
                  window.addEventListener('mousemove', onMove);
                  window.addEventListener('mouseup', onUp);
                }}
              />
            )}
          </g>
        ))}
        {data.map((d, i) => (
          <text key={i} x={getX(i)} y={height - pad + 25} fontSize="13" textAnchor="middle" fill="#bae6fd">{d.month}</text>
        ))}
        <text x={pad - 15} y={getY(max)} fontSize="12" textAnchor="end" fill="#bae6fd">{max}</text>
        <text x={pad - 15} y={getY(min)} fontSize="12" textAnchor="end" fill="#bae6fd">{min}</text>
      </svg>
      {showOccasions && (
        <div className="absolute left-0 top-0 w-full pointer-events-none" style={{ height: pad }}>
          {data.map((d, i) => d.occasion && (
            <div
              key={d.occasion + i}
              className="absolute flex flex-col items-center"
              style={{ pointerEvents: 'auto', left: `calc(${((getX(i) / width) * 100).toFixed(2)}% - 12px)` }}
              onMouseEnter={handleIconMouseEnter(i, d)}
              onMouseLeave={handleIconMouseLeave}
            >
              <span className="text-xl pointer-events-auto" style={{ color: OCCASION_COLORS[d.occasion], filter: hovered === i ? 'drop-shadow(0 2px 6px #fff)' : '' }}>{d.icon}</span>
            </div>
          ))}
        </div>
      )}
      {tooltip.visible && (
        <div
          className="fixed z-50 px-3 py-2 rounded bg-[#232936] border border-[#334155] shadow text-xs text-[#bae6fd] whitespace-nowrap"
          style={{ left: tooltip.x, top: tooltip.y }}
          onMouseEnter={() => setTooltip(t => ({ ...t, visible: true }))}
          onMouseLeave={handleIconMouseLeave}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}

function SeasonalityHighlights({ data }) {
  const highlights = data.filter(d => d.occasion);
  return (
    <div className="bg-[#1e2329] rounded-xl shadow p-6 mt-8">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "#7dd3fc" }}>🎉 Seasonality & Festive Demand</h3>
      <div className="flex flex-wrap gap-4">
        {highlights.map((d, i) => (
          <div key={i} className={`flex flex-col items-center px-4 py-2 rounded-lg`} style={{ background: OCCASION_COLORS[d.occasion] + '22', color: '#bae6fd' }}>
            <span className="font-semibold text-base">{d.icon} {d.occasion}</span>
            <span className="text-xs">{d.month}</span>
            <span className="text-xs mt-1">Predicted: <b>{d.predicted}</b></span>
            <span className="text-xs">Actual: <b>{d.actual}</b></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StockReallocation({ data, baseStock = 1500 }) {
  const recommendations = data.map(d => {
    const buffer = d.occasion ? Math.round(d.predicted * 0.1) : 0;
    return {
      month: d.month,
      occasion: d.occasion,
      icon: d.icon,
      recommended: d.predicted + buffer,
      buffer,
      color: d.occasion ? OCCASION_COLORS[d.occasion] : "#334155"
    };
  });
  return (
    <div className="bg-[#1e2329] rounded-xl shadow p-6 mt-8">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "#7dd3fc" }}>🔄 Stock Reallocation Suggestions</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr>
              <th className="p-2" style={{ color: "#7dd3fc" }}>Month</th>
              <th className="p-2" style={{ color: "#7dd3fc" }}>Occasion</th>
              <th className="p-2" style={{ color: "#7dd3fc" }}>Recommended Stock</th>
              <th className="p-2" style={{ color: "#7dd3fc" }}>Buffer</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((rec, i) => (
              <tr key={i} style={{ background: rec.occasion ? rec.color + '22' : undefined, color: '#bae6fd', fontWeight: rec.occasion ? 600 : 400 }}>
                <td className="p-2 flex items-center gap-2">{rec.icon} {rec.month}</td>
                <td className="p-2">{rec.occasion || '-'}</td>
                <td className="p-2">{rec.recommended}</td>
                <td className="p-2">{rec.buffer > 0 ? '+' + rec.buffer : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function PredictiveDemand() {
  const [showPred, setShowPred] = useState(true);
  const [showOccasions, setShowOccasions] = useState(true);
  const [editData, setEditData] = useState(DEMAND_DATA.map(d => ({ ...d })));
  const avgActual = Math.round(editData.reduce((a, b) => a + b.actual, 0) / editData.length);
  const avgPred = Math.round(editData.reduce((a, b) => a + b.predicted, 0) / editData.length);
  const growth = ((editData[editData.length-1].predicted - editData[0].actual) / editData[0].actual * 100).toFixed(1);
  const maxOccasion = editData.reduce((max, d) => d.occasion && d.predicted > max.predicted ? d : max, editData[0]);

  const handleEdit = (idx, newPred) => {
    setEditData(data => data.map((d, i) => i === idx ? { ...d, predicted: newPred } : d));
  };

  return (
    <div className="min-h-screen bg-[#1e2329] flex flex-col items-center py-10 px-2 md:px-0">
      <div className="max-w-3xl w-full mx-auto mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2" style={{ color: "#7dd3fc" }}>Predictive Demand Dashboard</h1>
        <p className="text-center mb-6 text-lg" style={{ color: "#bae6fd" }}>Forecast demand trends and optimize your warehouse with data-driven insights. See how festive seasons and occasions impact demand spikes. Drag the purple dots to adjust predictions and see updated stock suggestions.</p>
        <div className="flex flex-wrap gap-6 justify-center mb-8">
          <SummaryCard title="Avg Actual" value={avgActual} color="border-[#7dd3fc]" icon="📦" />
          <SummaryCard title="Avg Predicted" value={avgPred} color="border-[#a5b4fc]" icon="🔮" />
          <SummaryCard title="Forecast Growth" value={growth + '%'} color="border-[#bbf7d0]" icon="📈" />
          <SummaryCard title="Top Occasion" value={maxOccasion.occasion || '-'} color="border-[#fde68a]" icon="🎊" />
        </div>
        <div className="bg-[#232936] rounded-xl shadow p-6 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <span className="font-semibold" style={{ color: "#7dd3fc" }}>Show Prediction</span>
            <input type="checkbox" checked={showPred} onChange={() => setShowPred(v => !v)} className="accent-[#7dd3fc] w-5 h-5" />
            <span className="font-semibold ml-6" style={{ color: "#fde68a" }}>Show Occasions</span>
            <input type="checkbox" checked={showOccasions} onChange={() => setShowOccasions(v => !v)} className="accent-[#fde68a] w-5 h-5" />
          </div>
          <DemandChart
            data={showPred ? editData : editData.map(d => ({ ...d, predicted: d.actual }))}
            showOccasions={showOccasions}
            onEdit={handleEdit}
            editable={showPred}
          />
          <div className="flex gap-6 mt-6">
            <div className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full bg-[#7dd3fc]"></span><span className="text-[#bae6fd]">Actual</span></div>
            <div className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full bg-[#a5b4fc]"></span><span className="text-[#bae6fd]">Predicted</span></div>
          </div>
        </div>
        <SeasonalityHighlights data={editData} />
        <StockReallocation data={editData} />
      </div>
    </div>
  );
} 