export default function ActivityItem({ activity }) {
  const getIcon = t => t === "order" ? "📦" : "🚚";
  const colors = { processing: "text-blue-400", shipped: "text-green-400", received: "text-green-500", "in-transit": "text-yellow-400" };
  return (
    <div className="flex items-center gap-3 p-3 bg-[#181f2a] rounded-lg shadow-sm border-l-4 border-blue-500">
      <span className="text-2xl">{getIcon(activity.type)}</span>
      <div className="flex-1">
        <p className="font-semibold text-gray-100">{activity.product}</p>
        <p className="text-sm text-gray-400">{activity.type === "order" ? "Order" : "Supply"} • {activity.quantity} units</p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-medium ${colors[activity.status] || "text-gray-400"}`}>{activity.status}</p>
        <p className="text-xs text-gray-500">{activity.time}</p>
      </div>
    </div>
  );
} 