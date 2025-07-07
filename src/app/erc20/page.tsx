"use client";

import { useState } from "react";
import TokenInfo from "@/components/TokenInfo";
import { detectErc20Info } from "@/lib/detectErc20Info";

export default function TokenInspectorPage() {
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
    <div className="mt-10 max-w-xl mx-auto px-4 py-10 bg-zinc-900/50 rounded-xl border border-zinc-800">
      <h1 className="text-xl font-bold text-violet-400 mb-4">ERC20 Token Inspector</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter ERC20 contract address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="px-4 py-2 rounded bg-zinc-900 border border-zinc-700 text-sm text-white"
        />
        <button
          type="submit"
          disabled={!address || loading}
          className="bg-violet-400 hover:bg-violet-500 text-white font-mono px-4 py-2 rounded disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Loading...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>

      {error && <p className="text-red-400 mt-4">{error}</p>}

      {info && <TokenInfo info={info} />}
    </div>
  );
}
