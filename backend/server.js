const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Blockchain storage file
const BLOCKCHAIN_FILE = path.join(__dirname, 'blockchain.json');
const USERS_FILE = path.join(__dirname, 'users.json');

// Initial stock values for each product
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

// Initialize blockchain with genesis block if file doesn't exist
function initializeBlockchain() {
  if (!fs.existsSync(BLOCKCHAIN_FILE)) {
    const genesisBlock = {
      index: 0,
      timestamp: new Date().toISOString(),
      data: {
        product: "Genesis",
        change: 0,
        note: "Genesis block",
        user: "system"
      },
      previousHash: "0",
      hash: "genesis_hash"
    };
    
    fs.writeFileSync(BLOCKCHAIN_FILE, JSON.stringify([genesisBlock], null, 2));
  }
}

// Read blockchain from file
function readBlockchain() {
  try {
    const data = fs.readFileSync(BLOCKCHAIN_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading blockchain:', error);
    return [];
  }
}

// Write blockchain to file
function writeBlockchain(blockchain) {
  try {
    fs.writeFileSync(BLOCKCHAIN_FILE, JSON.stringify(blockchain, null, 2));
  } catch (error) {
    console.error('Error writing blockchain:', error);
  }
}

// Simple hash function
function calculateHash(block) {
  const dataString = JSON.stringify(block.data) + block.previousHash + block.timestamp;
  let hash = 0;
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(16);
}

// Initialize blockchain on startup
initializeBlockchain();

// Read users from file
function readUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Write users to file
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Generate a simple session token
function generateToken() {
  return crypto.randomBytes(24).toString('hex');
}

// In-memory session store (for demo)
const sessions = {};

// Auth middleware
function requireAuth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token || !sessions[token]) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = sessions[token];
  next();
}

// Register a default admin user if users.json is empty
function ensureDefaultUser() {
  const users = readUsers();
  if (users.length === 0) {
    users.push({ username: 'admin', password: 'admin123' });
    writeUsers(users);
  }
}
ensureDefaultUser();

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  const token = generateToken();
  sessions[token] = { username: user.username };
  res.json({ token, username: user.username });
});

// Get current user
app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ username: req.user.username });
});

// Routes
app.get('/api/blockchain', (req, res) => {
  try {
    const blockchain = readBlockchain();
    res.json(blockchain);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read blockchain' });
  }
});

app.post('/api/blockchain/add', requireAuth, (req, res) => {
  try {
    const { product, change, note, user } = req.body;
    if (!product || change === undefined) {
      return res.status(400).json({ error: 'Product and change are required' });
    }
    const blockchain = readBlockchain();
    const previousBlock = blockchain[blockchain.length - 1];
    const newBlock = {
      index: blockchain.length,
      timestamp: new Date().toISOString(),
      data: {
        product,
        change: Number(change),
        note: note || '',
        user: user || 'anonymous',
        status: 'pending' // New blocks start as pending
      },
      previousHash: previousBlock.hash,
      hash: ''
    };
    newBlock.hash = calculateHash(newBlock);
    blockchain.push(newBlock);
    writeBlockchain(blockchain);
    res.json(newBlock);
  } catch (error) {
    console.error('Error adding block:', error);
    res.status(500).json({ error: 'Failed to add block' });
  }
});

// Endpoint to update block status (confirm or reject)
app.post('/api/blockchain/:index/status', requireAuth, (req, res) => {
  try {
    const { status } = req.body; // 'confirmed' or 'rejected'
    const { index } = req.params;
    if (!['confirmed', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const blockchain = readBlockchain();
    const block = blockchain.find(b => b.index === Number(index));
    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }
    if (block.data.status !== 'pending') {
      return res.status(400).json({ error: 'Block already processed' });
    }
    block.data.status = status;
    writeBlockchain(blockchain);
    res.json(block);
  } catch (error) {
    console.error('Error updating block status:', error);
    res.status(500).json({ error: 'Failed to update block status' });
  }
});

app.get('/api/inventory/summary', (req, res) => {
  try {
    const blockchain = readBlockchain();
    // Calculate inventory from blockchain
    const inventory = {};
    const activities = [];
    blockchain.forEach(block => {
      if (block.data.product && block.data.product !== 'Genesis') {
        const product = block.data.product;
        if (!inventory[product]) {
          inventory[product] = {
            initialStock: INITIAL_STOCK[product] || 0,
            currentStock: INITIAL_STOCK[product] || 0,
            changes: [],
            incomingConfirmed: 0,
            incomingPending: 0,
            pendingConfirmed: 0,
            pendingPending: 0
          };
        }
        // Only confirmed blocks affect inventory
        if (block.data.status === 'confirmed') {
          inventory[product].currentStock += block.data.change;
        }
        // Track incoming/pending by status
        if (block.data.change > 0) {
          if (block.data.status === 'confirmed') {
            inventory[product].incomingConfirmed += block.data.change;
          } else if (block.data.status === 'pending') {
            inventory[product].incomingPending += block.data.change;
          }
        } else if (block.data.change < 0) {
          if (block.data.status === 'confirmed') {
            inventory[product].pendingConfirmed += Math.abs(block.data.change);
          } else if (block.data.status === 'pending') {
            inventory[product].pendingPending += Math.abs(block.data.change);
          }
        }
        inventory[product].changes.push({
          change: block.data.change,
          timestamp: block.timestamp,
          note: block.data.note,
          user: block.data.user,
          status: block.data.status
        });
        // Add to activities (show all except rejected)
        if (block.data.status !== 'rejected') {
          activities.push({
            id: block.index,
            type: block.data.change > 0 ? 'supply' : 'order',
            product: product,
            quantity: Math.abs(block.data.change),
            time: new Date(block.timestamp).toLocaleString(),
            status: block.data.status
          });
        }
      }
    });
    // Ensure all products are present in inventory, even if no blocks exist for them
    Object.keys(INITIAL_STOCK).forEach(product => {
      if (!inventory[product]) {
        inventory[product] = {
          initialStock: INITIAL_STOCK[product],
          currentStock: INITIAL_STOCK[product],
          changes: [],
          incomingConfirmed: 0,
          incomingPending: 0,
          pendingConfirmed: 0,
          pendingPending: 0
        };
      }
    });
    res.json({
      inventory,
      activities: activities.slice(-10).reverse() // Last 10 activities
    });
  } catch (error) {
    console.error('Error calculating summary:', error);
    res.status(500).json({ error: 'Failed to calculate summary' });
  }
});

// Endpoint to clear the blockchain (reset to genesis block)
app.post('/api/blockchain/clear', requireAuth, (req, res) => {
  try {
    const genesisBlock = {
      index: 0,
      timestamp: new Date().toISOString(),
      data: {
        product: "Genesis",
        change: 0,
        note: "Genesis block",
        user: "system",
        status: "confirmed"
      },
      previousHash: "0",
      hash: "genesis_hash"
    };
    writeBlockchain([genesisBlock]);
    res.json({ message: 'Blockchain cleared' });
  } catch (error) {
    console.error('Error clearing blockchain:', error);
    res.status(500).json({ error: 'Failed to clear blockchain' });
  }
});

// Simple authentication endpoint for tamper override
app.post('/api/auth/verify', (req, res) => {
  const { password } = req.body;
  // In production, use env variable or secure storage
  const ADMIN_PASSWORD = 'admin123';
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false, error: 'Invalid password' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
