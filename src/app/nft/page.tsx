"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import CollectionCard from "@/components/CollectionCard";
import { fetchMagicEdenCollection, fetchUserCollectionByContract } from "@/lib/clients/magicEdenClient";

export default function CollectionInspectorPage() {
  const [contract, setContract] = useState("");
  const [collection, setCollection] = useState<any>(null);
  const [isHolder, setIsHolder] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { address } = useAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCollection(null);
    setError("");
    setIsHolder(false);
    setLoading(true);

    try {
      const result = await fetchMagicEdenCollection(contract as `0x${string}`);
      if (!result) {
        setError("Collection not found or invalid contract.");
        return;
      }

      setCollection(result);

      if (address) {
        const userData = await fetchUserCollectionByContract(address, contract);
        if (userData && parseInt(userData.ownership.tokenCount) > 0) {
          setIsHolder(true);
        }
      }
    } catch {
      setError("Failed to fetch collection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-xl font-bold text-purple-400 mb-4">Collection Inspector</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter collection contract address"
          value={contract}
          onChange={(e) => setContract(e.target.value)}
          className="px-4 py-2 rounded bg-zinc-900 border border-zinc-700 text-sm text-white"
        />
        <button
          type="submit"
          disabled={!contract || loading}
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

      {collection && (
        <>
          {isHolder && (
            <p className="mt-4 text-green-400 font-mono text-sm">✅ You are a holder of this collection!</p>
          )}
          <CollectionCard data={collection} />
        </>
      )}
    </div>
  );
}
