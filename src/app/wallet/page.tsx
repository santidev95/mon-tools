'use client';

import { useEffect, useState } from 'react';
import Jazzicon from 'react-jazzicon';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';

type Token = {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
};

type WalletData = {
  address: string;
  nativeToken: Token;
  tokens: Token[];
};

function classifyWallet(data: WalletData): string {
  const tokenCount = data.tokens.length;
  const monBalance = BigInt(data.nativeToken.balance);

  if (tokenCount === 0 && monBalance === 0n) return 'Inactive';
  if (tokenCount > 5) return 'Holder';
  if (tokenCount > 0 && monBalance > 0n) return 'Active User';
  if (monBalance > 1_000_000_000_000_000_000n) return 'Whale 🐋';
  return 'Holder';
}

export default function WalletProfilerPage() {
  const { address, isConnected } = useAccount();
  const [data, setData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address || !isConnected) return;
    fetch(`/api/wallet/${address}`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .finally(() => setLoading(false));
  }, [address, isConnected]);

  if (!isConnected) return <div className="p-8 text-white bg-black">Connect a wallet to view the profile.</div>;
  if (loading) return <div className="p-8 text-white bg-black">Loading wallet data...</div>;
  if (!data) return <div className="p-8 text-red-400 bg-black">Error.</div>;

  return (
    <div className="min-h-screen p-8 space-y-6 bg-[#0a0a0a] text-white">
      <div className="flex items-center space-x-4">
        <Jazzicon seed={parseInt(data.address.slice(2, 10), 16)} diameter={40} />
        <div>
          <div className="text-xl font-semibold break-all text-white">{data.address}</div>
          <div className="text-sm text-purple-400">Profile: {classifyWallet(data)}</div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#1a1a1a] shadow-md">
        <div className="text-sm text-gray-400 mb-1">MON balance</div>
        <div className="text-2xl font-bold text-purple-300">
          {parseFloat(formatUnits(BigInt(data.nativeToken.balance), 18)).toFixed(4)} MON
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-purple-400 mb-2">Tokens ERC20</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.tokens.map((token) => (
            <div key={token.address} className="p-4 rounded-xl bg-[#111111] shadow-inner">
              <div className="font-semibold text-white">{token.name} ({token.symbol})</div>
              <div className="text-xs text-gray-500 break-all">{token.address}</div>
              <div className="mt-1 font-mono text-sm text-purple-300">
                {parseFloat(formatUnits(BigInt(token.balance), token.decimals)).toFixed(4)} {token.symbol}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
