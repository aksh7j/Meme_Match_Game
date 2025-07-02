# Meme Match - Gorbagana Testnet Multiplayer Game

A fast-paced browser-based memory matching game featuring meme-themed cards, built specifically for the Gorbagana testnet with native test token integration and Backpack wallet support.

## 🎮 Game Overview

**Meme Match** is a Nintendo-style memory game where players race against time to match pairs of popular meme faces. The game features:

- **Single Player Mode**: Classic memory matching with timer
- **Multiplayer Mode**: Real-time competitive gameplay via WebSocket
- **Meme Cards**: 8 different meme types (Pepe, Wojak, Doge, Cheems, Chad, Stonks, Distracted Boyfriend, Gigachad)
- **4x4 Grid**: 16 cards total (8 pairs) for optimal gameplay balance
- **Token Integration**: Native GOR token usage for game mechanics

### Game Mechanics
- **Timer**: 2-minute countdown for single player, competitive timing for multiplayer
- **Scoring**: Points awarded for successful matches
- **Win Conditions**: Match all pairs before time expires
- **Token Economy**: Entry fees, winner rewards, and faucet integration

## 🔗 Gorbagana Integration

### Testnet Details
- **Network**: Gorbagana Testnet v1 (Solana fork)
- **Native Token**: $GOR (Gorbagana token)
- **RPC Endpoint**: `https://rpc.gorbagana.wtf` (with Solana devnet fallback)
- **Network Type**: High-performance blockchain based on Solana's architecture

### Token Economics
- **Game Entry**: 10 GOR tokens to start single player
- **Room Creation**: 25 GOR tokens to create multiplayer room
- **Room Joining**: 5 GOR tokens to join existing room
- **Winner Reward**: 50+ GOR tokens (varies by room entry fees)
- **Faucet Integration**: Built-in faucet for test token distribution

### Blockchain Features
- **Proof of History (PoH)** consensus mechanism
- **Sub-second finality** for fast game transactions
- **Minimal transaction costs** paid in GOR tokens
- **Smart contract support** for future game mechanics

## 🎯 Backpack Wallet Support

The game supports **Backpack wallet** through the Solana Wallet Standard:

### Wallet Integration Features
- **Auto-detection**: Automatically detects installed Backpack extension
- **Seamless Connection**: One-click wallet connection via Wallet Standard
- **Balance Display**: Real-time GOR token balance updates
- **Transaction Handling**: Secure token transfers for game mechanics
- **Mobile Support**: Compatible with Backpack mobile app

### Wallet Connection Process
1. Install Backpack browser extension or mobile app
2. Click "Connect Wallet" in the game interface
3. Approve connection in Backpack wallet
4. Start playing with native GOR tokens

### Security Features
- **No Private Key Exposure**: All transactions signed in wallet
- **Transaction Approval**: User confirms each token transaction
- **Session Persistence**: Wallet connection maintained across sessions

## 🚀 Live Demo

**[Play Meme Match on Gorbagana Testnet →](https://your-deployment-url.vercel.app)**

### Quick Start
1. Install [Backpack Wallet](https://backpack.app)
2. Visit the live demo URL
3. Connect your Backpack wallet
4. Get test GOR tokens from the integrated faucet
5. Start playing single player or create/join multiplayer rooms

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ and npm
- Backpack wallet extension for testing
- Git for cloning the repository

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/meme-match-gorbagana.git
cd meme-match-gorbagana

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Environment
The application will be available at `http://localhost:5000` with:
- **Frontend**: React + Vite with hot module reload
- **Backend**: Express.js with TypeScript and Socket.IO
- **Database**: In-memory storage for development (PostgreSQL for production)

### Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components (Game, Multiplayer)
│   │   ├── lib/            # Utilities and configurations
│   │   └── hooks/          # Custom React hooks
├── server/                 # Backend Express.js application
│   ├── index.ts           # Main server entry point
│   ├── routes.ts          # API routes
│   ├── multiplayer.ts     # Socket.IO multiplayer handlers
│   └── storage.ts         # Data storage interface
├── shared/                # Shared TypeScript types
└── README.md             # This file
```

## 🎲 How to Play

### Single Player Mode
1. Connect your Backpack wallet
2. Ensure you have 10+ GOR tokens
3. Click "Start Game" on the main screen
4. Click cards to flip and reveal memes
5. Match pairs before the 2-minute timer expires
6. Win rewards and climb the leaderboard

### Multiplayer Mode
1. Navigate to "/multiplayer" route
2. Enter your username
3. **Create Room**: Pay 25 GOR to host a new game
4. **Join Room**: Pay 5 GOR to join an existing room
5. Wait for other players (2-4 players supported)
6. Host starts the game when ready
7. Compete to match the most pairs
8. Winner takes the token pool

### Game Rules
- **Flip Limit**: Only 2 cards can be flipped at once
- **Match Scoring**: +1 point for each successful pair
- **Time Pressure**: Game ends when timer reaches zero
- **Winner Selection**: Highest score wins, fastest completion time breaks ties

## 🌐 Deployment

### Vercel Deployment (Recommended)

1. **GitHub Integration**:
   ```bash
   # Push to GitHub repository
   git add .
   git commit -m "Deploy Meme Match game"
   git push origin main
   ```

2. **Vercel Setup**:
   - Connect GitHub repository to Vercel
   - Auto-detected as Vite project
   - Build command: `npm run build`
   - Output directory: `dist/public`

3. **Environment Variables**:
   ```env
   NODE_ENV=production
   DATABASE_URL=your_postgres_url_here
   ```

### Alternative Deployments
- **Netlify**: Drag-and-drop deployment support
- **Railway**: Full-stack deployment with database
- **Replit**: Direct deployment from development environment

## 🔧 Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Shadcn/ui** components with Radix UI primitives
- **Tailwind CSS** for responsive design
- **Socket.IO Client** for real-time multiplayer
- **Wouter** for lightweight routing

### Backend Stack
- **Node.js** with Express.js framework
- **Socket.IO** for WebSocket multiplayer communication
- **TypeScript** with ES modules
- **Drizzle ORM** with PostgreSQL
- **In-memory storage** for development

### Blockchain Integration
- **@solana/web3.js** for Gorbagana/Solana interaction
- **Wallet Standard** for Backpack wallet compatibility
- **Custom RPC** handling with fallbacks
- **Token transaction** management

## 🏆 Submission Compliance

### ✅ Competition Requirements Met

1. **✅ Working Prototype**: 
   - Live URL: [Deployed on Vercel](https://your-deployment-url.vercel.app)
   - GitHub Repository: Full source code available

2. **✅ Gorbagana Testnet Integration**:
   - Native GOR token usage for all game mechanics
   - Gorbagana RPC endpoint integration with Solana fallback
   - Token-based entry fees and winner rewards

3. **✅ Backpack Wallet Support**:
   - Full Wallet Standard compliance
   - Seamless connection and transaction signing
   - Mobile app compatibility

4. **✅ Multiplayer Functionality**:
   - Real-time Socket.IO based multiplayer
   - Room creation and joining system
   - Competitive scoring and winner determination

5. **✅ Complete Documentation**:
   - Comprehensive README with all required sections
   - Game overview and mechanics explanation
   - Local development instructions
   - Deployment guide

## 🎨 Design & User Experience

### Visual Design
- **Nintendo-inspired** aesthetics with clean, modern touches
- **Meme-themed** card designs with emoji representations
- **Responsive layout** working on desktop and mobile
- **Dark/light theme** support with professional typography

### Fonts & Typography
- **Poppins**: Clean, modern font for body text and UI elements
- **Space Grotesk**: Technical font for gaming aesthetics
- **Proper contrast** ratios for accessibility compliance

### User Interface
- **Intuitive controls** with clear visual feedback
- **Loading states** and error handling
- **Toast notifications** for user actions
- **Modal dialogs** for game state changes

## 🔒 Security & Best Practices

### Wallet Security
- **No private key exposure** - all transactions signed in wallet
- **Transaction verification** before execution
- **Connection state management** with proper cleanup

### Code Quality
- **TypeScript** throughout for type safety
- **ESLint** and Prettier for code consistency
- **Error boundaries** for graceful failure handling
- **Input validation** on all user inputs

## 📊 Game Analytics & Future Features

### Current Metrics
- Player game statistics (games played, won, tokens earned)
- Room creation and participation tracking
- Token transaction history

### Planned Features
- **Leaderboards**: Global and seasonal rankings
- **NFT Integration**: Collectible meme cards
- **Tournament Mode**: Scheduled competitive events
- **Custom Rooms**: Private games with custom rules
- **Staking Mechanics**: Lock tokens for special rewards

## 🤝 Contributing

We welcome contributions to improve Meme Match! Please:

1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Submit a pull request

### Development Guidelines
- Follow existing code style and patterns
- Add TypeScript types for new features
- Test wallet integration thoroughly
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Gorbagana Community** for the testnet infrastructure
- **Backpack Team** for excellent wallet development
- **Solana Foundation** for the underlying blockchain technology
- **React & Vite Teams** for amazing development tools

---

**Ready to match some memes?** [Start Playing Now →](https://your-deployment-url.vercel.app)