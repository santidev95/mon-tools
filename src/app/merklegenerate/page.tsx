"use client";

import { useState } from "react";

export default function MerkleTool() {
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
    <div className="max-w-xl mx-auto px-4 py-10 text-white">
      <h1 className="text-xl font-bold text-purple-400 mb-4">Merkle Proof Generator</h1>
      <textarea
        rows={10}
        className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm"
        placeholder="Enter one address per line"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleGenerate} className="mt-4 bg-purple-500 px-4 py-2 rounded text-sm font-mono">
        Generate
      </button>

      {result && (
        <div className="mt-6 text-sm">
            <p><strong>Merkle Root:</strong> {result.root}</p>
            <p className="mt-2"><strong>Proofs:</strong></p>
            <pre className="bg-zinc-800 p-2 rounded text-xs max-h-64 overflow-auto">
            {JSON.stringify(result.proofs, null, 2)}
            </pre>
            <button
            onClick={downloadProofs}
            className="mt-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white px-4 py-1 rounded text-xs font-mono"
            >
            ⬇ Download proofs.json
            </button>
        </div>
        )}
    </div>
  );
}
