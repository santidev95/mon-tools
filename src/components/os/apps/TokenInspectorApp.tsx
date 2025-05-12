"use client";

import { useState } from "react";
import TokenInfo from "@/components/TokenInfo";
import { detectErc20Info } from "@/lib/detectErc20Info";

export default function TokenInspectorApp() {
  const [address, setAddress] = useState("");
  const [info, setInfo] = useState<null | any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo(null);
    setLoading(true);

    try {
      const result = await detectErc20Info(address as `0x${string}`);
      if (!result) {
        setError("Could not fetch token information.");
      } else {
        setInfo(result);
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-xs font-mono p-2">
      <h2 className="text-base font-bold text-purple-300">ERC20 Token Inspector</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Enter ERC20 contract address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="px-2 py-1 rounded bg-white border border-gray-400 text-xs"
        />
        <button
          type="submit"
          disabled={!address || loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Loading...
            </>
          ) : (
            "Inspect"
          )}
        </button>
      </form>

      {error && <p className="text-red-600 mt-2">{error}</p>}
      {info && (
        <div className="mt-2">
          <TokenInfo info={info} />
        </div>
      )}
    </div>
  );
}
