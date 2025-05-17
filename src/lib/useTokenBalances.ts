import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import {
  createPublicClient,
  getContract,
  formatUnits,
  http,
} from "viem";
import { monadTestnet } from "viem/chains";

const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(process.env.ALCHEMY_URL),
});

const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
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

      for (const tokenAddress of tokenContracts) {
        try {
          const contract = getContract({
            address: tokenAddress,
            abi: ERC20_ABI,
            client: publicClient,
          });

          const balance = await contract.read.balanceOf([address]) as bigint;
          if (balance === 0n) continue;

          console.log("tokenAddress",tokenAddress);
          const res = await fetch(`/api/token-meta/${tokenAddress}`);
          console.log("red",res);
          if (!res.ok) throw new Error("Failed to fetch metadata");

          const { name, symbol, decimals } = await res.json();

          result.push({
            address: tokenAddress,
            name,
            symbol,
            decimals,
            formattedBalance: formatUnits(balance, decimals),
          });
        } catch (err) {
          console.warn(`Error loading metadata for ${tokenAddress}:`, err);
        }
      }

      setTokens(result);
      setLoading(false);
    };

    load();
  }, [address, walletClient, tokenContracts]);

  return { tokens, loading };
}
