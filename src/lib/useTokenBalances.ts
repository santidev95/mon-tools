import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import {
  createPublicClient,
  getContract,
  formatUnits,
  http,
  type Address,
} from "viem";
import { monadTestnet } from "viem/chains";

const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
});

const ERC20_ABI = [
  { name: "name", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { name: "symbol", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { name: "decimals", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }]
  }
];

export interface TokenBalance {
  address: `0x${string}` | "native";
  name: string;
  symbol: string;
  decimals: number;
  formattedBalance: string;
}

export function useTokenBalances(tokenContracts: `0x${string}`[]) {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address || !walletClient) return;

    const load = async () => {
      setLoading(true);
      const result: TokenBalance[] = [];

      // 1. Native MON
      try {
        const monBalance = await publicClient.getBalance({ address });
        if (monBalance > 0n) {
          result.push({
            address: "native",
            name: "Monad",
            symbol: "MON",
            decimals: 18,
            formattedBalance: formatUnits(monBalance, 18),
          });
        }
      } catch (err) {
        console.warn("Error reading MON balance:", err);
      }

      // 2. ERC-20 tokens
      for (const tokenAddress of tokenContracts) {
        try {
          const contract = getContract({
            address: tokenAddress,
            abi: ERC20_ABI,
            client: publicClient,
          });

          const [name, symbol, decimals, rawBalance] = await Promise.all([
            contract.read.name() as Promise<string>,
            contract.read.symbol() as Promise<string>,
            contract.read.decimals() as Promise<number>,
            contract.read.balanceOf([address]) as Promise<bigint>,
          ]);

          if (rawBalance > 0n) {
            result.push({
              address: tokenAddress,
              name,
              symbol,
              decimals,
              formattedBalance: formatUnits(rawBalance, decimals),
            });
          }
        } catch (err) {
          console.warn(`Error reading token ${tokenAddress}:`, err);
        }
      }

      setTokens(result);
      setLoading(false);
    };

    load();
  }, [address, walletClient, tokenContracts]);

  return { tokens, loading };
}
