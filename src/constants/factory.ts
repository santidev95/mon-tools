// src/constants/factory.ts
export const FACTORY_ADDRESS = "0xa23854Ccc7d998Be786B0596884E062Cc8767FA3";

export const FACTORY_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "profile", "type": "string" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "symbol", "type": "string" },
      { "internalType": "uint256", "name": "initialSupply", "type": "uint256" },
      { "internalType": "uint256", "name": "cap", "type": "uint256" },
      { "internalType": "address", "name": "owner", "type": "address" }
    ],
    "name": "createToken",
    "outputs": [{ "internalType": "address", "name": "token", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
