"use client";

import { useState } from "react";

export default function MerkleToolApp() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);

  const downloadProofs = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(result.proofs, null, 2)], {
      type: "application/json",
    });
    element.href = URL.createObjectURL(file);
    element.download = "proofs.json";
    document.body.appendChild(element);
    element.click();
  };

  const handleGenerate = async () => {
    const addresses = input
      .split("\n")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const res = await fetch("/api/merkle/generate", {
      method: "POST",
      body: JSON.stringify({ addresses }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="text-sm font-mono text-white p-3 w-[500px] max-h-[600vh] overflow-auto">
      <h2 className="text-base font-bold text-purple-300 mb-2">Merkle Proof Generator</h2>
      <textarea
        rows={8}
        className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-xs"
        placeholder="Enter one address per line"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={handleGenerate}
        className="mt-3 bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded text-xs"
      >
        Generate
      </button>

      {result && (
        <div className="mt-4">
          <p className="text-xs">
            <strong>Merkle Root:</strong> {result.root}
          </p>
          <p className="mt-2 text-xs font-bold">Proofs:</p>
          <pre className="bg-zinc-800 p-2 rounded text-xs max-h-40 overflow-auto whitespace-pre-wrap">
            {JSON.stringify(result.proofs, null, 2)}
          </pre>
          <button
            onClick={downloadProofs}
            className="mt-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white px-3 py-1 rounded text-xs"
          >
            ⬇ Download proofs.json
          </button>
        </div>
      )}
    </div>
  );
}
