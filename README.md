# Chainledger - Blockchain Inventory Management

A modern, blockchain-based inventory management system with real-time tracking and authentication.

## 🚀 Features

- **Blockchain Integration**: Secure, immutable inventory transactions
- **Real-time Tracking**: Live inventory status and activity monitoring
- **Authentication System**: Secure login with session management
- **Manual Stock Updates**: Add inventory changes with blockchain verification
- **Pending Transactions**: Review and approve/reject inventory changes
- **Activity History**: Complete audit trail of all inventory operations

## 🛠️ Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Blockchain**: Custom implementation with hash verification
- **Deployment**: Vercel (Frontend & Backend)

## 🚀 Live Demo

- **Frontend**: https://chainledger-j1u0xadyt-bhuvilols-projects.vercel.app
- **Backend**: https://backend1-d2hagqro6-bhuvilols-projects.vercel.app

## 🔐 Login Credentials

- **Username**: `admin`
- **Password**: `admin123`

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 Backend Setup

```bash
cd backend
npm install
node server.js
```

## 📁 Project Structure

```
Chainledger/
├── 📄 README.md                    # Project documentation
├── 📄 package.json                 # Frontend dependencies
├── 📄 package-lock.json            # Lock file
├── 📄 index.html                   # HTML entry point
├── 📄 vite.config.js               # Vite configuration
├── 📄 tailwind.config.js           # Tailwind CSS config
├── 📄 postcss.config.js            # PostCSS config
├── 📄 eslint.config.js             # ESLint configuration
├── 📄 vercel.json                  # Vercel deployment config
├── 📄 .gitignore                   # Git ignore rules
├── 📁 .vercel/                     # Vercel deployment files
├── 📁 node_modules/                # Frontend dependencies
├── 📁 public/
│   └── 📄 vite.svg                 # App icon
├── 📁 src/
│   ├── 📄 App.jsx                  # Main app component
│   ├── 📄 main.jsx                 # React entry point
│   ├── 📄 index.css                # Global styles
│   └── 📁 IM/
│       ├── 📄 RealTimeTracking.jsx # Main dashboard
│       └── 📁 RealTimeTracking/
│           ├── 📄 ActivityItem.jsx  # Activity component
│           ├── 📄 InventoryCard.jsx # Inventory card
│           └── 📄 StatusIndicator.jsx # Status indicator
└── 📁 backend/
    ├── 📄 server.js                # Express server
    ├── 📄 package.json             # Backend dependencies
    ├── 📄 package-lock.json        # Backend lock file
    ├── 📄 vercel.json              # Backend Vercel config
    ├── 📄 .gitignore               # Backend git ignore
    ├── 📄 blockchain.json          # Blockchain data
    ├── 📄 users.json               # User data
    ├── 📁 .vercel/                 # Backend Vercel files
    └── 📁 node_modules/            # Backend dependencies
```

## 🔗 API Endpoints

- `GET /api/blockchain` - Get blockchain data
- `POST /api/blockchain/add` - Add new transaction
- `POST /api/blockchain/:index/status` - Update transaction status
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user

## 🎯 Key Features

1. **Blockchain Verification**: All inventory changes are recorded in an immutable blockchain
2. **Real-time Updates**: Live inventory status with automatic refresh
3. **Transaction Management**: Review and approve pending inventory changes
4. **Activity Monitoring**: Complete audit trail of all operations
5. **Responsive Design**: Works on desktop and mobile devices

## 🚀 Deployment

The application is deployed on Vercel with both frontend and backend services.

### Environment Variables

Set the following environment variable in your Vercel dashboard:
- `VITE_API_URL`: Your backend API URL (e.g., `https://your-backend.vercel.app/api`)

## 🧹 Project Cleanup

This project has been optimized by removing:
- Unused components and assets
- Unnecessary dependencies
- Temporary files and build artifacts
- Redundant configuration files

### Benefits of Cleanup:
- **Reduced Bundle Size**: Removed unused dependencies and assets
- **Faster Development**: Less files to navigate and maintain
- **Cleaner Structure**: Focused on core functionality
- **Better Performance**: Smaller application footprint
- **Easier Maintenance**: Only essential files remain

## 🔧 Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Local Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Start backend: `cd backend && npm install && node server.js`
4. Start frontend: `npm run dev`
5. Open http://localhost:5173

### Building for Production
```bash
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For issues and questions:
1. Check the [Issues](https://github.com/your-repo/chainledger/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

---

**Chainledger** - Where blockchain meets inventory management! 🚀
