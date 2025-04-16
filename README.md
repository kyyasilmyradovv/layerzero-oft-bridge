# LayerZero V2 Cross-Chain Token Transfer Project

This project implements a simplified omnichain token (OFT) using LayerZero V2, along with a fullstack application that demonstrates token bridging and displays historical transfer events.

## Project Structure

```
layerzero-ofr-project
├── backend                # Backend application using Node.js and Express
│   ├── src
│   │   ├── controllers    # Controller for handling bridge logic
│   │   ├── routes         # Routes for the API
│   │   └── app.ts         # Entry point for the backend application
│   ├── package.json       # Backend dependencies and scripts
│   └── tsconfig.json      # TypeScript configuration for the backend
├── contracts              # Smart contracts for the omnichain token
│   └── SimpleOFT.sol      # Solidity contract implementing the OFT
├── subgraph               # Subgraph for indexing transfer events
│   ├── schema.graphql     # GraphQL schema definition
│   ├── mappings           # Mappings for parsing events
│   │   └── index.ts       # Event parsing logic
│   └── subgraph.yaml      # Subgraph configuration
├── frontend               # Frontend application using Next.js
│   ├── pages              # Next.js pages
│   │   ├── index.tsx      # Main page for the frontend
│   │   └── _app.tsx       # Custom App component
│   ├── components         # Reusable components
│   │   └── WalletConnect.tsx # Component for wallet connection
│   ├── package.json       # Frontend dependencies and scripts
│   └── next.config.js     # Next.js configuration
├── tests                  # Test cases for the smart contract and application
│   ├── mint.test.ts       # Tests for minting functionality
│   ├── crossChain.test.ts  # Tests for cross-chain transfers
│   └── hardhat.config.ts   # Hardhat configuration
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Hardhat
- MetaMask or WalletConnect for frontend wallet connection

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd layerzero-ofr-project
   ```

2. Install backend dependencies:

   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:

   ```
   cd frontend
   npm install
   ```

4. Install subgraph dependencies (if applicable):

   ```
   cd subgraph
   npm install
   ```

### Running the Application

1. Start the backend server:

   ```
   cd backend
   npm run start
   ```

2. Start the frontend application:

   ```
   cd frontend
   npm run dev
   ```

3. Deploy the smart contract:

   ```
   cd contracts
   npx hardhat run scripts/deploy.js --network <network-name>
   ```

4. Deploy the subgraph:

   ```
   cd subgraph
   graph deploy <subgraph-name>
   ```

### Testing

To run the tests for the smart contract, navigate to the tests directory and run:

```
cd tests
npx hardhat test
```

### Bonus Points

If time permits, consider adding:

- E2E integration tests with mock LayerZero endpoints.
- Deployment of contracts to Sepolia and Base Goerli testnets.

## License

This project is licensed under the MIT License. See the LICENSE file for details.