"use client";

import { TokenType } from "../../lib/detectTokenType";

interface Props {
  type: TokenType;
  info: any;
}

export default function TokenInfo({ type, info }: Props) {
  if (!info) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg text-sm text-gray-300 space-y-2 mt-6">
      <p className="text-purple-400 font-bold">{type}</p>

      {info.name && <p><strong>Name:</strong> {info.name}</p>}
      {info.symbol && <p><strong>Symbol:</strong> {info.symbol}</p>}

      {type === "ERC20" && (
        <>
          <p><strong>Decimals:</strong> {info.decimals}</p>
          <p><strong>Total Supply:</strong> {info.totalSupply}</p>
        </>
      )}
    </div>
  );
}
