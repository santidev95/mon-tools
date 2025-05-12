"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import CollectionCard from "@/components/CollectionCard";
import { motion, AnimatePresence } from "framer-motion";

export default function CollectionInspectorApp() {
  const [contract, setContract] = useState("");
  const [collection, setCollection] = useState<any>(null);
  const [isHolder, setIsHolder] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [holderChecked, setHolderChecked] = useState(false);

  const { address } = useAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCollection(null);
    setError("");
    setIsHolder(false);
    setHolderChecked(false);
    setLoading(true);

    try {
      const res = await fetch(`/api/magiceden/collection/${contract}`);
      if (!res.ok) throw new Error("Collection not found");

      const result = await res.json();
      const collectionData = result.collections?.[0];

      if (!collectionData) {
        setError("Collection not found or empty.");
        return;
      }

      setCollection(collectionData);

      if (address) {
        const userRes = await fetch(`/api/magiceden/user-collection/${address}/${contract}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.collections.length > 0) {
            setIsHolder(true);
          }
        }
      }

      setHolderChecked(true);
    } catch {
      setError("Failed to fetch collection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-sm font-mono text-white p-3 w-[360px] max-h-[70vh] overflow-auto">
      <h2 className="text-base font-bold text-purple-300 mb-3">Collection Inspector</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Enter collection contract address"
          value={contract}
          onChange={(e) => setContract(e.target.value)}
          className="px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-xs text-white"
        />
        <button
          type="submit"
          disabled={!contract || loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Loading...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>

      {error && <p className="text-red-400 mt-3">{error}</p>}

      {collection && holderChecked && (
        <>
          {address && (
            <AnimatePresence mode="wait">
              <motion.div
                key={isHolder ? "holder" : "not-holder"}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className={`mt-4 px-3 py-2 rounded-lg border text-xs 
                  ${isHolder ? "border-green-400 text-green-300 bg-green-900/10" : "border-red-400 text-red-300 bg-red-900/10"}`}
              >
                <span className="inline-flex items-center gap-2">
                  {isHolder ? (
                    <>
                      <span className="animate-pulse text-green-400">✅</span>
                      <span>You are a holder of this collection</span>
                    </>
                  ) : (
                    <>
                      <span className="text-red-400">❌</span>
                      <span>You are <strong>not</strong> a holder of this collection</span>
                    </>
                  )}
                </span>
              </motion.div>
            </AnimatePresence>
          )}
          <div className="mt-4">
            <CollectionCard data={collection} />
          </div>
        </>
      )}
    </div>
  );
}
