"use client";

interface Props {
  info: {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
  } | null;
}

export default function TokenInfo({ info }: Props) {
  if (!info) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg text-sm text-gray-300 space-y-2 mt-6">
      <p className="text-violet-400 font-bold">ERC20 Token</p>

      <p><strong>Name:</strong> {info.name}</p>
      <p><strong>Symbol:</strong> {info.symbol}</p>
      <p><strong>Decimals:</strong> {info.decimals}</p>
      <p><strong>Total Supply:</strong> {info.totalSupply}</p>
    </div>
  );
}
