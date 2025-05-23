"use client";

import Swap from "@/components/Swap";

export default function SwapApp() {
  return (
    <div className="text-xs font-mono p-2">
      <h2 className="text-base font-bold text-purple-300 mb-2">Token Swap</h2>
      <Swap />
    </div>
  );
} 