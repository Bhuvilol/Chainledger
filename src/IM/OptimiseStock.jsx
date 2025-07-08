import { useState } from "react";

const PRODUCTS = [
  { name: "Bulk Groceries", current: 3200, optimal: 3000 },
  { name: "Electronics", current: 1800, optimal: 2000 },
  { name: "Home Goods", current: 2100, optimal: 2200 },
  { name: "Toys", current: 900, optimal: 1200 },
  { name: "Health & Beauty", current: 1400, optimal: 1500 },
  { name: "Office Supplies", current: 800, optimal: 1000 },
  { name: "Automotive", current: 1100, optimal: 1200 },
  { name: "Sports", current: 1300, optimal: 1400 },
];

function SummaryCard({ title, value, color }) {
  return (
    <div className={`flex flex-col items-center bg-[#1e2329] rounded-lg shadow min-w-[140px] border-t-4 ${color} px-6 py-4 mx-2 my-2`} style={{ boxShadow: "0 2px 12px 0 #0ea5e91a" }}>
      <span className="text-lg font-semibold mb-1" style={{ color: "#bae6fd" }}>{title}</span>
      <span className="text-2xl font-bold" style={{ color: "#f1f5f9" }}>{value}</span>
    </div>
  );
}

function StockBarChart({ products }) {
  const max = Math.max(...products.map(p => Math.max(p.current, p.optimal)));
  return (
    <div className="bg-[#232936] rounded-xl shadow p-6 mb-8">
      <h3 className="text-lg font-bold mb-4" style={{ color: "#7dd3fc" }}>Stock vs. Optimal (Units)</h3>
      <div className="flex flex-col gap-3">
        {products.map((p, i) => (
          <div key={p.name} className="flex items-center gap-4">
            <span className="w-32 text-sm text-[#bae6fd]">{p.name}</span>
            <div className="flex-1 flex items-center gap-2">
              <div className="h-4 rounded bg-[#7dd3fc]" style={{ width: `${(p.current / max) * 60 + 10}%`, minWidth: 30 }} />
              <span className="text-xs text-[#7dd3fc]">{p.current}</span>
              <div className="h-4 rounded bg-[#bbf7d0]" style={{ width: `${(p.optimal / max) * 60 + 10}%`, minWidth: 30, marginLeft: 8 }} />
              <span className="text-xs text-[#bbf7d0]">{p.optimal}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-6 mt-4 ml-32">
        <div className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded bg-[#7dd3fc]"></span><span className="text-xs text-[#bae6fd]">Current</span></div>
        <div className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded bg-[#bbf7d0]"></span><span className="text-xs text-[#bbf7d0]">Optimal</span></div>
      </div>
    </div>
  );
}

function OptimisationTable({ products }) {
  return (
    <div className="bg-[#232936] rounded-xl shadow p-6 mb-8">
      <h3 className="text-lg font-bold mb-4" style={{ color: "#7dd3fc" }}>Product Stock Actions</h3>
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr>
            <th className="p-2" style={{ color: "#7dd3fc" }}>Product</th>
            <th className="p-2" style={{ color: "#7dd3fc" }}>Current</th>
            <th className="p-2" style={{ color: "#bbf7d0" }}>Optimal</th>
            <th className="p-2" style={{ color: "#fde68a" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => {
            let action = "Hold";
            if (p.current < p.optimal * 0.95) action = "Restock";
            else if (p.current > p.optimal * 1.05) action = "Reduce";
            return (
              <tr key={p.name} style={{ color: "#bae6fd", fontWeight: 500 }}>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.current}</td>
                <td className="p-2">{p.optimal}</td>
                <td className="p-2" style={{ color: action === "Restock" ? "#bbf7d0" : action === "Reduce" ? "#fca5a5" : "#fde68a" }}>{action}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function OptimisationTips() {
  return (
    <div className="bg-[#1e2329] rounded-xl shadow p-6 mt-8">
      <h3 className="text-lg font-bold mb-3" style={{ color: "#7dd3fc" }}>Tips for Stock Optimisation</h3>
      <ul className="list-disc pl-6 text-[#bae6fd] text-sm space-y-2">
        <li>Review fast- and slow-moving products monthly.</li>
        <li>Automate reorder points for high-volume items.</li>
        <li>Reduce overstock by bundling or promotions.</li>
        <li>Monitor supplier lead times and adjust safety stock.</li>
        <li>Leverage predictive analytics for seasonal demand.</li>
      </ul>
    </div>
  );
}

export default function OptimiseStock() {
  const totalCurrent = PRODUCTS.reduce((a, b) => a + b.current, 0);
  const totalOptimal = PRODUCTS.reduce((a, b) => a + b.optimal, 0);
  return (
    <div className="min-h-screen bg-[#1e2329] flex flex-col items-center py-10 px-2 md:px-0">
      <div className="max-w-3xl w-full mx-auto mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2" style={{ color: "#7dd3fc" }}>Stock Optimisation Dashboard</h1>
        <p className="text-center mb-6 text-lg" style={{ color: "#bae6fd" }}>Maintain optimal stock levels to prevent shortages and overstock, ensuring efficient inventory turnover and reduced holding costs.</p>
        <div className="flex flex-wrap gap-6 justify-center mb-8">
          <SummaryCard title="Total Current" value={totalCurrent} color="border-[#7dd3fc]" />
          <SummaryCard title="Total Optimal" value={totalOptimal} color="border-[#bbf7d0]" />
        </div>
        <StockBarChart products={PRODUCTS} />
        <OptimisationTable products={PRODUCTS} />
        <OptimisationTips />
      </div>
    </div>
  );
} 