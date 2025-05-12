"use client";

import { useState } from "react";
import { useBulkTransferWithApprove } from "@/lib/useBulkTransferWithApprove";
import { useTokenBalances } from "@/lib/useTokenBalances";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";

const tokenList = [
  "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701",
  "0xaEef2f6B429Cb59C9B2D7bB2141ADa993E8571c3",
  "0x3a98250F98Dd388C211206983453837C8365BDc1",
  "0xe1d2439b75fb9746E7Bc6cB777Ae10AA7f7ef9c5",
  "0x268E4E24E0051EC27b3D27A95977E71cE6875a05",
  "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea",
  "0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D",
  "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37",
  "0xA296f47E8Ff895Ed7A092b4a9498bb13C46ac768",
  "0x0C0c92FcF37Ae2CBCc512e59714Cd3a1A1cbc411",
  "0x8507F576EB214d172012065d58cfb38a4540b0a6",
] as `0x${string}`[];

export default function BulkTransferApp() {
  const [tokenAddress, setTokenAddress] = useState<"" | `0x${string}` | "native">("");
  const [decimals, setDecimals] = useState<number>(18);
  const [input, setInput] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const { execute } = useBulkTransferWithApprove();
  const { tokens, loading: tokensLoading } = useTokenBalances(tokenList);
  const { isConnected } = useAccount();

  const parseRecipients = () =>
    input
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    const recipients = parseRecipients();

    if (!tokenAddress) {
      toast.error("Select a token first.");
      return;
    }

    if (!amount || isNaN(Number(amount))) {
      toast.error("Invalid amount.");
      return;
    }

    const txPromise = execute(tokenAddress, decimals, recipients, amount);

    toast.promise(txPromise, {
      loading: "Processing transfer...",
      success: (txResult) => {
        if (Array.isArray(txResult)) {
          return `✅ ${txResult.length} txns sent.`;
        }
        if (typeof txResult === "string") {
          return (
            <span>
              Transfer success:{" "}
              <a
                href={`https://monadscan.dev/tx/${txResult}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-300"
              >
                View TX
              </a>
            </span>
          );
        }
        return "Transfers completed!";
      },
      error: (err) => `❌ ${err?.message || "Error during transfer."}`,
    }).finally(() => setLoading(false));
  };

  const totalToSend = () => {
    const count = parseRecipients().length;
    const total = parseFloat(amount || "0") * count;
    return `${total || 0}`;
  };

  return (
    <div className="text-sm font-mono text-white p-3 w-[360px] max-h-[70vh] overflow-auto">
      <h2 className="text-base font-bold text-purple-300 mb-2">Bulk Transfer Tool</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="text-xs text-gray-400">Select token</label>
        <select
          disabled={tokensLoading || loading}
          value={tokenAddress}
          onChange={(e) => {
            const value = e.target.value;
            const selected = tokens.find((t) => t.address === value);
            if (selected) {
              setTokenAddress(selected.address);
              setDecimals(selected.decimals);
            } else {
              setTokenAddress("");
            }
          }}
          className="px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-xs text-white"
        >
          <option value="">
            {tokensLoading ? "Loading tokens..." : "-- Select a token --"}
          </option>
          {!tokensLoading &&
            tokens.map((t) => (
              <option key={t.address} value={t.address}>
                {t.symbol} – {t.formattedBalance}
              </option>
            ))}
        </select>

        <label className="text-xs text-gray-400">Amount to send (same for all)</label>
        <input
          type="text"
          placeholder="Ex: 10.5"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-xs text-white font-mono"
        />

        <label className="text-xs text-gray-400">Recipient addresses</label>
        <textarea
          placeholder="0x123...\n0xabc..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          className="px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-xs text-white font-mono"
        />

        {amount && (
          <p className="text-xs text-gray-500">
            Total to send: <strong>{totalToSend()}</strong>
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          onClick={(e) => {
            if (!isConnected) {
              e.preventDefault();
              toast.error("Please connect your wallet to continue.");
              return;
            }
          }}
          className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-xs"
        >
          {loading ? "Approving & Sending..." : "Approve & Transfer"}
        </button>
      </form>

      <p className="mt-3 text-xs text-gray-400">
        Bulk Transfer Contract:{" "}
        <code className="text-gray-300 break-all">
          0x73Fc1b28F405df9B4B97960F1A0C64C656708524
        </code>
      </p>

      {status && <p className="mt-2 text-sm text-center">{status}</p>}
    </div>
  );
}
