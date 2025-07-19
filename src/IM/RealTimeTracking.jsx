import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StatusIndicator from "./RealTimeTracking/StatusIndicator";
import ActivityItem from "./RealTimeTracking/ActivityItem";
import InventoryCard from "./RealTimeTracking/InventoryCard";

// Add API base URL - use environment variable or fallback to localhost
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Add this fallback data at the top of your file
const FALLBACK_INVENTORY = [
  { id: 1, name: "Bulk Groceries", currentStock: 2847, incomingSupply: 500, pendingOrders: 320, status: "stable", lastUpdate: "2 min ago" },
  { id: 2, name: "Electronics", currentStock: 1650, incomingSupply: 200, pendingOrders: 180, status: "low", lastUpdate: "1 min ago" },
  { id: 3, name: "Home Goods", currentStock: 1980, incomingSupply: 300, pendingOrders: 250, status: "stable", lastUpdate: "3 min ago" },
  { id: 4, name: "Toys", currentStock: 750, incomingSupply: 150, pendingOrders: 120, status: "critical", lastUpdate: "30 sec ago" },
  { id: 5, name: "Health & Beauty", currentStock: 1320, incomingSupply: 180, pendingOrders: 140, status: "stable", lastUpdate: "1 min ago" },
  { id: 6, name: "Office Supplies", currentStock: 680, incomingSupply: 100, pendingOrders: 90, status: "low", lastUpdate: "2 min ago" },
  { id: 7, name: "Automotive", currentStock: 980, incomingSupply: 120, pendingOrders: 110, status: "stable", lastUpdate: "45 sec ago" },
  { id: 8, name: "Sports", currentStock: 1180, incomingSupply: 160, pendingOrders: 130, status: "stable", lastUpdate: "1 min ago" },
];

const FALLBACK_ACTIVITIES = [
  { id: 1, type: "order", product: "Electronics", quantity: 50, time: "2 min ago", status: "processing" },
  { id: 2, type: "supply", product: "Bulk Groceries", quantity: 200, time: "5 min ago", status: "received" },
  { id: 3, type: "order", product: "Toys", quantity: 30, time: "8 min ago", status: "shipped" },
  { id: 4, type: "supply", product: "Home Goods", quantity: 150, time: "12 min ago", status: "in-transit" },
  { id: 5, type: "order", product: "Health & Beauty", quantity: 25, time: "15 min ago", status: "processing" },
];

// Initial stock values for each product (frontend fallback)
const INITIAL_STOCK = {
  "Bulk Groceries": 2847,
  "Electronics": 1650,
  "Home Goods": 1980,
  "Toys": 750,
  "Health & Beauty": 1320,
  "Office Supplies": 680,
  "Automotive": 980,
  "Sports": 1180
};

export default function RealTimeTracking() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLive, setIsLive] = useState(true);
  const [blockchain, setBlockchain] = useState([]);
  const [inventoryData, setInventoryData] = useState(FALLBACK_INVENTORY);
  const [recentActivities, setRecentActivities] = useState([]);
  const [manualUpdate, setManualUpdate] = useState({ product: '', change: 0, note: '' });
  const [updating, setUpdating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [loading, setLoading] = useState(true);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Helper to get/set token
  const getToken = () => localStorage.getItem('session_token');
  const setToken = token => token ? localStorage.setItem('session_token', token) : localStorage.removeItem('session_token');

  // Fetch current user if token exists
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetch(`${API_BASE}/auth/me`, { headers: { Authorization: token } })
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data) setUser(data); })
        .catch(() => setUser(null));
    }
  }, []);

  // Fetch blockchain and inventory data
  const fetchData = async () => {
    try {
      const token = getToken();
      const [blockchainRes, summaryRes] = await Promise.all([
        fetch(`${API_BASE}/blockchain`, token ? { headers: { Authorization: token } } : {}),
        fetch(`${API_BASE}/inventory/summary`, token ? { headers: { Authorization: token } } : {})
      ]);
      
      if (!blockchainRes.ok || !summaryRes.ok) {
        const errText = await blockchainRes.text() || await summaryRes.text();
        throw new Error('Backend not available');
      }
      
      const blockchainData = await blockchainRes.json();
      const summaryData = await summaryRes.json();
      
      setBlockchain(blockchainData);
      // Extract pending transactions
      setPendingTransactions(blockchainData.filter(block => block.data && block.data.status === 'pending'));
      // Use backend-calculated inventory if available
      const transformedInventory = Object.entries(summaryData.inventory).map(([name, data]) => ({
        id: name,
        name,
        initialStock: data.initialStock,
        currentStock: data.currentStock,
        incomingConfirmed: data.incomingConfirmed || 0,
        incomingPending: data.incomingPending || 0,
        pendingConfirmed: data.pendingConfirmed || 0,
        pendingPending: data.pendingPending || 0,
        status: data.currentStock < 1000 ? 'critical' : data.currentStock < 1500 ? 'low' : 'stable',
        lastUpdate: data.changes.length > 0 ? 
          new Date(data.changes[data.changes.length - 1].timestamp).toLocaleString() : 'Never'
      }));
      if (transformedInventory.length === 0) {
        setInventoryData(FALLBACK_INVENTORY.map(item => ({
          ...item,
          initialStock: INITIAL_STOCK[item.name] || 0,
          currentStock: INITIAL_STOCK[item.name] || 0
        })));
      } else {
        setInventoryData(transformedInventory);
      }
      setRecentActivities(summaryData.activities.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Use fallback data and calculate current stock from blockchain (if any)
      setBlockchain([]);
      setPendingTransactions([]);
      setInventoryData(FALLBACK_INVENTORY.map(item => ({
        ...item,
        initialStock: INITIAL_STOCK[item.name] || 0,
        currentStock: INITIAL_STOCK[item.name] || 0
      })));
      setRecentActivities(FALLBACK_ACTIVITIES);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const refreshTimer = setInterval(fetchData, 30000);
    return () => clearInterval(refreshTimer);
  }, []);

  const handleManualUpdate = async (e) => {
    e.preventDefault();
    if (!manualUpdate.product) return;
    setUpdating(true);
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/blockchain/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: token } : {})
        },
        body: JSON.stringify({
          ...manualUpdate,
          user: user ? user.username : 'admin'
        })
      });
      if (!response.ok) {
        if (response.status === 401) {
          alert('Session expired or unauthorized. Please log in again.');
          setUser(null);
          setToken(null);
          setLoginOpen(true);
        } else {
          const err = await response.text();
          alert('Failed to add block: ' + err);
        }
        setUpdating(false);
        return;
      }
      setManualUpdate({ product: '', change: 0, note: '' });
      await fetchData(); // Refresh data
    } catch (error) {
      alert('Failed to add block.');
    }
    setUpdating(false);
  };

  function getBlockchainStock(productName) {
    const productData = inventoryData.find(item => item.name === productName);
    return productData ? productData.currentStock : (INITIAL_STOCK[productName] || 0);
  }

  // Calculate totals from blockchain data
  const totalStock = inventoryData.reduce((sum, item) => sum + item.currentStock, 0);
  const totalIncoming = inventoryData.reduce((sum, item) => sum + item.incomingSupply, 0);
  const totalPending = inventoryData.reduce((sum, item) => sum + item.pendingOrders, 0);

  // Confirm or reject a pending transaction
  const handleUpdateStatus = async (blockIndex, status) => {
    try {
      const token = getToken();
      await fetch(`${API_BASE}/blockchain/${blockIndex}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: token } : {})
        },
        body: JSON.stringify({ status })
      });
      await fetchData();
    } catch (error) {
      alert('Failed to update transaction status.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#101624] to-[#232b3a] flex items-center justify-center">
        <div className="text-white text-xl">Loading blockchain data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101624] to-[#232b3a] p-2 md:p-6">
      {/* Login Modal */}
      {(loginOpen || !user) && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#232b3a] border border-gray-700 rounded-lg p-8 shadow-lg w-full max-w-xs flex flex-col gap-4">
            <h2 className="text-xl font-bold text-cyan-300 mb-2 text-center">Sign In</h2>
            <form
              className="flex flex-col gap-3"
              onSubmit={async e => {
                e.preventDefault();
                setLoginError('');
                try {
                  const res = await fetch(`${API_BASE}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: loginUsername, password: loginPassword })
                  });
                  if (res.ok) {
                    const data = await res.json();
                    setToken(data.token);
                    setUser({ username: data.username });
                    setLoginOpen(false);
                  } else {
                    setLoginError('Invalid username or password.');
                  }
                } catch {
                  setLoginError('Server error.');
                }
              }}
            >
              <input
                type="text"
                className="bg-[#181f2a] text-white p-2 rounded border border-gray-600"
                placeholder="Username"
                value={loginUsername}
                onChange={e => setLoginUsername(e.target.value)}
                required
                autoFocus
              />
              <input
                type="password"
                className="bg-[#181f2a] text-white p-2 rounded border border-gray-600"
                placeholder="Password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition shadow"
              >
                Login
              </button>
              {loginError && <div className="text-red-300 text-sm mt-1">{loginError}</div>}
            </form>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
        {/* Main Column */}
        <div className="flex flex-col gap-6">
          {/* Dashboard Header */}
          <div className="pb-2 border-b border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-5xl md:text-6xl font-extrabold text-cyan-300 tracking-tight mb-4 uppercase drop-shadow-lg">Inventory Blockchain Dashboard</h1>
                <p className="text-gray-400 text-base md:text-lg font-medium">Real-time inventory, blockchain ledger, and supply chain activities</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-400' : 'bg-gray-600'} animate-pulse`}></div>
                  <span className="text-sm font-medium text-gray-200">
                    {isLive ? 'LIVE' : 'OFFLINE'}
                  </span>
                </div>
                <div className="text-sm text-gray-400 font-mono">
                  {currentTime.toLocaleTimeString()}
                </div>
                {user && (
                  <div className="text-sm text-cyan-200 font-semibold flex items-center gap-2">
                    <span className="material-icons text-cyan-300">person</span> {user.username}
                    <button
                      className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-800 text-gray-300"
                      onClick={() => {
                        setUser(null);
                        setToken(null);
                        setLoginOpen(true);
                      }}
                    >Logout</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Manual Stock Update Form */}
          <div className="bg-[#181f2a] p-4 rounded-lg border border-gray-700 shadow-md">
            <h2 className="text-lg md:text-xl font-bold text-cyan-300 mb-3">Manual Stock Update</h2>
            <form onSubmit={handleManualUpdate} className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
              <select
                className="bg-[#232b3a] text-white p-2 rounded w-full md:w-auto"
                value={manualUpdate.product}
                onChange={e => setManualUpdate({ ...manualUpdate, product: e.target.value })}
                required
              >
                <option value="">Select Product</option>
                {inventoryData.map(item => (
                  <option key={item.name} value={item.name}>{item.name}</option>
                ))}
              </select>
              <input
                type="number"
                className="bg-[#232b3a] text-white p-2 rounded w-full md:w-28"
                placeholder="Change (+/-)"
                value={manualUpdate.change}
                onChange={e => setManualUpdate({ ...manualUpdate, change: Number(e.target.value) })}
                required
              />
              <input
                type="text"
                className="bg-[#232b3a] text-white p-2 rounded w-full md:w-48"
                placeholder="Note"
                value={manualUpdate.note}
                onChange={e => setManualUpdate({ ...manualUpdate, note: e.target.value })}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition shadow w-full md:w-auto"
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Add Block'}
              </button>
            </form>
          </div>
          {/* Pending Transactions Section */}
          {pendingTransactions.length > 0 && (
            <div className="bg-yellow-900/60 border border-yellow-400 rounded-lg p-4 shadow-md">
              <h2 className="text-lg font-bold text-yellow-200 mb-2 flex items-center gap-2">
                <span className="material-icons text-yellow-300"></span> Pending Transactions
              </h2>
              <div className="space-y-2">
                {pendingTransactions.map(block => (
                  <div key={block.index} className="flex flex-col md:flex-row md:items-center md:justify-between bg-yellow-800/40 p-3 rounded shadow-sm">
                    <div className="flex-1 text-yellow-100">
                      <span className="font-semibold">{block.data.product}</span> &mdash; {block.data.change > 0 ? '+' : ''}{block.data.change} units
                      <span className="ml-2 text-xs text-yellow-300">{block.data.note}</span>
                      <span className="ml-2 text-xs text-yellow-400">({new Date(block.timestamp).toLocaleString()})</span>
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded shadow"
                        onClick={() => handleUpdateStatus(block.index, 'confirmed')}
                      >
                        Confirm
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow"
                        onClick={() => handleUpdateStatus(block.index, 'rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Recent Activities */}
          <div className="bg-[#181f2a] p-4 rounded-lg border border-gray-700 shadow-md">
            <h2 className="text-lg md:text-xl font-semibold text-gray-100 mb-3">Recent Activities</h2>
            <div className="space-y-3">
              {recentActivities.map(activity => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
          {/* Blockchain Ledger and Product Filter */}
          <div className="bg-[#181f2a] p-4 rounded-lg border border-gray-700 shadow-md">
            <h2 className="text-lg font-bold text-cyan-300 mb-3">Blockchain Ledger</h2>
            <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4">
              <label className="text-gray-200 font-semibold">
                View Blockchain History for Product:
                <select
                  className="ml-2 bg-[#232b3a] text-white p-2 rounded"
                  value={selectedProduct}
                  onChange={e => setSelectedProduct(e.target.value)}
                >
                  <option value="">All Products</option>
                  {inventoryData.map(item => (
                    <option key={item.name} value={item.name}>{item.name}</option>
                  ))}
                </select>
              </label>
            </div>
            {selectedProduct && (
              <div className="mb-4 text-cyan-200 font-semibold">
                Blockchain-calculated stock for <span className="text-cyan-300">{selectedProduct}</span>:{" "}
                <span className="text-white">{getBlockchainStock(selectedProduct)}</span>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs text-left text-gray-300">
                <thead>
                  <tr>
                    <th className="p-2">#</th>
                    <th className="p-2">Data</th>
                    <th className="p-2">Hash</th>
                    <th className="p-2">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {blockchain
                    .filter(block =>
                      !selectedProduct ||
                      (block.data.product && block.data.product === selectedProduct)
                    )
                    .map((block, idx) => (
                      <tr key={block.hash || idx}>
                        <td className="p-2">{block.index}</td>
                        <td className="p-2">{JSON.stringify(block.data)}</td>
                        <td className="p-2 break-all">{block.hash}</td>
                        <td className="p-2">{block.data.change || '-'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Color Legend Card */}
          <div className="bg-[#232b3a] border border-gray-700 rounded-lg p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-400 inline-block"></span>
              <span className="text-gray-100 font-semibold">Stable</span>
              <span className="text-gray-400 text-sm">(Stock ≥ 1500)</span>
            </div>a
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-yellow-400 inline-block"></span>
              <span className="text-gray-100 font-semibold">Low</span>
              <span className="text-gray-400 text-sm">(1000 ≤ Stock &lt; 1500)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-red-500 inline-block"></span>
              <span className="text-gray-100 font-semibold">Critical</span>
              <span className="text-gray-400 text-sm">(Stock &lt; 1000)</span>
            </div>
          </div>
          <button
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition shadow w-full md:w-auto"
            onClick={async () => {
              try {
                const token = getToken();
                const res = await fetch(`${API_BASE}/blockchain/clear`, {
                  method: 'POST',
                  headers: {
                    ...(token ? { Authorization: token } : {})
                  }
                });
                if (!res.ok) {
                  if (res.status === 401) {
                    alert('You must be logged in to clear the blockchain.');
                  } else {
                    alert('Failed to clear blockchain.');
                  }
                  return;
                }
                await fetchData();
              } catch (error) {
                alert('Failed to clear blockchain.');
              }
            }}
          >
            Clear Blockchain (Reset)
          </button>
          {/* Download Log Statement Button */}
          <button
            className="mt-2 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition shadow w-full md:w-auto"
            onClick={() => {
              // Prettify blockchain ledger
              const prettified = blockchain.map(block => {
                return [
                  `Block #${block.index}`,
                  `Timestamp: ${block.timestamp}`,
                  `Product: ${block.data.product}`,
                  `Change: ${block.data.change}`,
                  `Note: ${block.data.note}`,
                  `User: ${block.data.user}`,
                  `Status: ${block.data.status}`,
                  `Hash: ${block.hash}`,
                  `Previous Hash: ${block.previousHash}`,
                  '---'
                ].join('\n');
              }).join('\n\n');
              const blob = new Blob([prettified], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'blockchain_log.txt';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
          >
            Download Log Statement
          </button>
        </div>
        {/* Right Column: Live Inventory Status */}
        <div className="flex flex-col gap-6 sticky top-4 h-fit">
          <div className="bg-[#181f2a] p-4 rounded-lg border border-gray-700 shadow-md">
            <h2 className="text-lg md:text-xl font-semibold text-gray-100 mb-3">Live Inventory Status</h2>
            <div className="grid grid-cols-1 gap-3">
              {inventoryData
                .slice()
                .sort((a, b) => {
                  const statusOrder = { critical: 0, low: 1, stable: 2 };
                  return statusOrder[a.status] - statusOrder[b.status];
                })
                .map(item => (
                  <InventoryCard key={item.id} item={item} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 