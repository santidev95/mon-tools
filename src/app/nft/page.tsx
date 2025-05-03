"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import CollectionCard from "@/components/CollectionCard";
import { motion, AnimatePresence } from "framer-motion";

export default function CollectionInspectorPage() {
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
    setHolderChecked(false); // reset antes da checagem
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
  
      setHolderChecked(true); // só ativa depois de checar
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

      {collection && holderChecked && (
        <>        
        {address && (
          <>
          <AnimatePresence mode="wait">
            <motion.div
              key={isHolder ? "holder" : "not-holder"}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className={`mt-4 px-4 py-3 rounded-lg border text-sm font-mono 
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
          </>
        )}         

          <CollectionCard data={collection} />
        </>
      )}
    </div>
  );
}
