"use client";

import { useState } from "react";
import { detectTokenType, TokenType } from "../../../lib/detectTokenType";
import TokenInfo from "@/components/TokenInfo";

export default function TokenInspectorPage() {
  const [address, setAddress] = useState("");
  const [type, setType] = useState<TokenType>("Desconhecido");
  const [info, setInfo] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo(null);
    setLoading(true);

    try {
      const result = await detectTokenType(address as `0x${string}`);
      setType(result.type);
      setInfo(result);
    } catch (err) {
      setError("Failed to fetch token data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-xl font-bold text-purple-400 mb-4">Token Inspector</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter token contract address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="px-4 py-2 rounded bg-zinc-900 border border-zinc-700 text-sm text-white"
        />
        <button
          type="submit"
          disabled={!address || loading}
          className="bg-purple-400 hover:bg-purple-500 text-white font-mono px-4 py-2 rounded disabled:opacity-50 transition flex items-center justify-center gap-2"
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

      {info && <TokenInfo type={type} info={info} />}
    </div>
  );
}
