# MonTools

MonTools  is a modern, modular web application providing a suite of utilities for interacting with tokens and NFTs on EVM-compatible blockchains. It features a unique desktop-like interface (MonTools OS) for seamless navigation between tools, as well as traditional web navigation.

## Features

- **MonTools OS**: A desktop-inspired interface to launch and manage multiple tools in resizable windows, mimicking an operating system experience in your browser.
- **ERC-20 Token Deployer**: Easily deploy your own ERC-20 tokens with customizable parameters (name, symbol, supply, cap).
- **ERC-20 Inspector**: Inspect any ERC-20 token by contract address to view its details.
- **NFT Inspector**: View details of any NFT collection and check if your connected wallet is a holder.
- **Token Bulk Transfer**: Send a specified amount of a token to multiple addresses in a single operation.
- **Merkle Root Generator**: Generate a Merkle root and proofs from a list of addresses, with downloadable proofs.

## Deployed Version
### Access here: https://montools.xyz

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

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
3. Create a `.env.local` file, use `env.example` for environment variables as needed.

### Running Locally

Start the development server:
```bash
npm run dev
# or
yarn dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Main Tools

- **ERC-20 Token Deployer**: `/deployer`
- **ERC-20 Inspector**: `/erc20`
- **NFT Inspector**: `/nft`
- **Token Bulk Transfer**: `/bulktransfer`
- **Merkle Root Generator**: `/merklegenerate`
- **MonTools OS**: `/os` (or click "Try MonTools OS" on the homepage)

## Tool Details & Usage

### ERC-20 Token Deployer
- Deploy a new ERC-20 token with customizable name, symbol, initial supply, and (optionally) capped supply.
- Supports different token profiles (e.g., basic, capped).
- After deployment, a link to the transaction on Monad Explorer is provided.

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

## MonTools OS

- Launch from the homepage or `/os`.
- Desktop-like experience: open, move, and close tool windows.
- Taskbar for quick switching.
- Boot animations for immersion.
- Each tool runs in its own window, allowing multitasking.

## UI/UX

- Responsive, dark-themed interface using Tailwind CSS.
- ToolCard components for modular tool navigation.
- Framer Motion for smooth animations.
- Google Fonts (Geist Sans, Geist Mono) for a modern look.

## Extensibility

- Easily add new tools by creating a new page and ToolCard.
- Modular structure: API routes and UI components are easy to extend for new blockchain utilities.

## Roadmap

- Portfolio viewer (coming soon)
- Multi-chain bridge (coming soon)
- More advanced analytics and dashboards

## Contributing

1. Fork the repo and create your feature branch.
2. Commit your changes.
3. Push to the branch and open a pull request.

## License

MIT
