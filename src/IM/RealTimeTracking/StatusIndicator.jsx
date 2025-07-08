export default function StatusIndicator({ status }) {
  const colors = { stable: "bg-green-400", low: "bg-yellow-400", critical: "bg-red-500" };
  return <div className={`w-3 h-3 rounded-full ${colors[status]} animate-pulse`}></div>;
} 