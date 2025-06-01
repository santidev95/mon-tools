import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";

export interface TokenBalance {
  id: string;
  address: `0x${string}` | "native";
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  categories: string[];
  mon_per_token: string;
  pconf: string;
  formattedBalance?: string;
}

export function useTokenBalances() {
  const { address } = useAccount();
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;

    const load = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/monorail/data/wallet/${address}/balances`);
        if (!response.ok) {
          throw new Error("Failed to fetch balances");
        }

        const data = await response.json();
        // Add formattedBalance to each token
        const formattedData = data.map((token: TokenBalance) => {
          // Convert decimal balance to integer by multiplying by 10^decimals
          const balanceFloat = parseFloat(token.balance);
          const balanceInt = BigInt(Math.floor(balanceFloat * Math.pow(10, token.decimals)));
          
          return {
            ...token,
            formattedBalance: formatUnits(balanceInt, token.decimals)
          };
        });
        setTokens(formattedData);
      } catch (err) {
        console.error("Error loading token balances:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [address]);

  return { tokens, loading };
}
