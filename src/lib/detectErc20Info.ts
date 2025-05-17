import {
    createPublicClient,
    getContract,
    http,
    formatUnits,
  } from "viem";
  import { monadTestnet } from "viem/chains";
  
  const client = createPublicClient({
    chain: monadTestnet,
    transport: http(process.env.ALCHEMY_URL),
  });
  
  export async function detectErc20Info(address: `0x${string}`) {
    try {
      const bytecode = await client.getBytecode({ address });
      if (!bytecode || bytecode === "0x") {
        throw new Error("Address is not a deployed contract.");
      }
  
      const erc20 = getContract({
        address,
        abi: [
          { name: "name", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
          { name: "symbol", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
          { name: "decimals", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
          { name: "totalSupply", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
        ],
        client,
      });
  
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        erc20.read.name(),
        erc20.read.symbol(),
        erc20.read.decimals(),
        erc20.read.totalSupply(),
      ]);
  
      return {
        name,
        symbol,
        decimals,
        totalSupply: formatUnits(totalSupply, decimals),
      };
    } catch (e) {
      console.warn("Failed to fetch ERC20 info:", e);
      return null;
    }
  }
  