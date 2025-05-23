import { useState, useEffect, useRef } from "react";
import { TokenResult } from "@/lib/clients/monorail/dataApi";

const CATEGORIES = [
  { key: "verified", label: "Verified" },
  { key: "stable", label: "Stablecoin" },
  { key: "lst", label: "LST" },
  { key: "bridged", label: "Bridged" },
  { key: "meme", label: "Meme" },
];

interface TokenSelectModalProps {
  open: boolean;
  onClose: () => void;
  category: string;
  setCategory: (cat: string) => void;
  tokens: TokenResult[];
  loading: boolean;
  onSelect: (token: TokenResult) => void;
}

export default function TokenSelectModal({
  open,
  onClose,
  category,
  setCategory,
  tokens,
  loading,
  onSelect,
}: TokenSelectModalProps) {
  const [search, setSearch] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setSearch("");
  }, [open]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  const filteredTokens = tokens.filter(
    (t) =>
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.address.toLowerCase().includes(search.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 token-scroll">
      <div
        ref={modalRef}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-violet-400 text-xl font-bold"
        >
          ×
        </button>
        <h2 className="text-lg font-bold text-white mb-2 font-mono">Select a token</h2>
        <input
          autoFocus
          type="text"
          placeholder="Search by token name or address"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-sm text-white font-mono focus:border-violet-500 outline-none"
        />
        <div className="flex gap-2 mb-3 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`px-3 py-1 rounded-full text-xs font-mono transition font-bold ${category === cat.key ? "bg-violet-600 text-white" : "bg-zinc-800 text-violet-300 hover:bg-violet-700"}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="max-h-72 overflow-y-auto mt-2 ">
          {loading ? (
            <div className="text-center text-violet-400 py-8 font-mono">Loading tokens...</div>
          ) : filteredTokens.length === 0 ? (
            <div className="text-center text-gray-400 py-8 font-mono">No tokens found.</div>
          ) : (
            <ul className="divide-y divide-zinc-800">
              {filteredTokens.map((token) => (
                <li
                  key={token.address}
                  className="py-3 flex items-center gap-3 cursor-pointer hover:bg-zinc-800 rounded transition"
                  onClick={() => { onSelect(token); onClose(); }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-mono text-base">{token.symbol}</span>
                      <span className="text-xs text-violet-400 font-mono">{token.name}</span>
                    </div>
                    <div className="text-xs text-gray-400 font-mono truncate">{token.address}</div>
                  </div>
                  {/* Preço e saldo podem ser adicionados aqui se disponíveis */}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}