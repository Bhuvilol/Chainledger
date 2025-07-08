import StatusIndicator from "./StatusIndicator";

export default function InventoryCard({ item }) {
  const colors = {
    stable: "border-green-400 bg-[#1e293b]",
    low: "border-yellow-400 bg-[#2d2a18]",
    critical: "border-red-500 bg-[#2a1818]"
  };
  return (
    <div className={`p-4 rounded-lg border-2 ${colors[item.status] || "border-gray-700 bg-[#181f2a]"} transition-all duration-200 hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-100">{item.name}</h3>
        <div className="flex items-center gap-2">
          <StatusIndicator status={item.status} />
          <span className="text-xs text-gray-400">{item.lastUpdate}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-gray-100">{item.currentStock.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Current Stock</p>
          <p className="text-xs text-gray-500">(Initial: {item.initialStock})</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-green-400">
            +{item.incomingConfirmed}
            {item.incomingPending > 0 && <span className="text-yellow-300 text-xs"> (pending: +{item.incomingPending})</span>}
          </p>
          <p className="text-xs text-gray-400">Incoming</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-red-400">
            -{item.pendingConfirmed}
            {item.pendingPending > 0 && <span className="text-yellow-300 text-xs"> (pending: -{item.pendingPending})</span>}
          </p>
          <p className="text-xs text-gray-400">Pending</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Net Change:</span>
          <span className={`font-semibold ${(item.incomingConfirmed - item.pendingConfirmed) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {(item.incomingConfirmed - item.pendingConfirmed) >= 0 ? '+' : ''}{item.incomingConfirmed - item.pendingConfirmed}
          </span>
        </div>
      </div>
    </div>
  );
} 