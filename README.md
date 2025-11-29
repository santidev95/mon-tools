# MonTools

MonTools is a modern, modular open source web application providing a suite of utilities for interacting with tokens and NFTs on EVM-compatible blockchains. It features a unique desktop-like interface (MonTools OS) for seamless navigation between tools, as well as traditional web navigation.

## Features

- **MonTools OS**: A desktop-inspired interface to launch and manage multiple tools in resizable windows, mimicking an operating system experience in your browser.
- **ERC-20 Inspector**: Inspect any ERC-20 token by contract address to view its details.
- **NFT Inspector**: View details of any NFT collection and check if your connected wallet is a holder.
- **Token Bulk Transfer**: Send a specified amount of a token to multiple addresses in a single operation.
- **Merkle Root Generator**: Generate a Merkle root and proofs from a list of addresses, with downloadable proofs.
- **Portfolio Viewer**: Comprehensive portfolio management with token balances, NFT collections, staking positions, and domain names.

## Tech Stack

- **Framework**: Next.js 15.3.1 with React 19
- **Styling**: Tailwind CSS 4 with custom animations
- **State Management**: TanStack Query (React Query)
- **Web3**: Wagmi v2, Viem, Ethers.js
- **UI Components**: Headless UI, Radix UI
- **Animations**: Framer Motion
- **Development**: TypeScript, ESLint, Turbopack

## Deployed Version
### Access here: https://montools.xyz

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Redis (for caching and session management)

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd monadic-tools
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy `env.example` to `.env.local`
   - Fill in the required environment variables:
     ```
     ALCHEMY_URL=''                    # Your Alchemy API URL
     REDIS_URL=redis://localhost:6379  # Redis connection URL
     MONORAIL_DATA_URL=""             # Monorail API URL
     MONORAIL_PATHFINDER_URL=""       # Monorail Pathfinder URL
     NEXT_PUBLIC_REOWN_PROJECT_ID=''  # Reown project ID
     NEXT_PUBLIC_USE_OS_LAYOUT=false  # Toggle OS layout
     ```

### Running Locally

Start the development server:
```bash
npm run dev
# or
yarn dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Main Tools

- **ERC-20 Inspector**: `/erc20`
- **NFT Inspector**: `/nft`
- **Token Bulk Transfer**: `/bulktransfer`
- **Merkle Root Generator**: `/merklegenerate`
- **MonTools OS**: `/os` (or click "Try MonTools OS" on the homepage)

## Tool Details & Usage

### ERC-20 Inspector
- Enter any ERC-20 contract address to view its name, symbol, and decimals.
- Uses on-chain calls and caches results for performance.

### NFT Inspector
- Enter a collection contract address to fetch collection details from Magic Eden.
- If your wallet is connected, it checks if you are a holder of the collection.

### Token Bulk Transfer
- Select a token and specify an amount to send to multiple addresses (one per line).
- Approves and sends in a single flow.
- Shows total to be sent and provides transaction feedback.
- Uses a dedicated bulk transfer contract.

### Merkle Root Generator
- Paste a list of addresses, generate a Merkle root and proofs.
- Download proofs as a JSON file for airdrops or allowlist use.

### Portfolio Viewer
- **Summary Dashboard**: View your total MON balance, transaction count, token holdings, and staking positions at a glance
- **Token Management**: 
  - Categorized view of all your token holdings
  - Real-time balance updates
  - Direct links to token explorers
  - Support for native and custom tokens
- **Staking Overview**:
  - Track all your staking positions
  - View staked amounts for different protocols
  - Quick access to staking platforms
- **NFT Gallery**:
  - Browse your NFT collections
  - View floor prices and collection details
  - Direct links to Magic Eden listings
  - Infinite scroll for large collections
- **Domain Management**:
  - View all your registered domains
  - Check expiration dates
  - Verify transferability status
  - Integration with AllDomains

## MonTools OS

- Launch from the homepage or `/os`.
- Desktop-like experience: open, move, and close tool windows.
- Taskbar for quick switching.
- Boot animations for immersion.
- Each tool runs in its own window, allowing multitasking.

## Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
mon-tools/
├── src/              # Source code
├── public/           # Static assets
├── components/       # React components
├── pages/           # Next.js pages
├── styles/          # Global styles
└── utils/           # Utility functions
```

## Contributing

1. Fork the repo and create your feature branch
2. Install dependencies and set up environment variables
3. Make your changes
4. Run tests and ensure linting passes
5. Submit a pull request

## License

MIT
