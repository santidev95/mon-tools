"use client";

import { useState } from "react";
import { useBulkTransferWithApprove } from "@/lib/useBulkTransferWithApprove";
import { useTokenBalances } from "@/lib/useTokenBalances";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { isAddress } from "ethers";
import { allDomainsClient } from "@/lib/clients/allDomains";


export default function BulkTransferApp() {
  const [tokenAddress, setTokenAddress] = useState<"" | `0x${string}` | "native">("");
  const [decimals, setDecimals] = useState<number>(18);
  const [input, setInput] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState<string>("");

  const { execute } = useBulkTransferWithApprove();
  const { tokens, loading: tokensLoading } = useTokenBalances();
  const { isConnected } = useAccount();

  const validateAddress = (address: string): boolean => {
    try {
      return isAddress(address);
    } catch {
      return false;
    }
  };

  const parseRecipients = async (): Promise<string[]> => {
    const lines = input
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const resolvedAddresses: string[] = [];
    const invalidEntries: string[] = [];
    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
    
    for (const line of lines) {
      if (line.includes('.')) {
        try {
          const address = await allDomainsClient.getOwnerFromDomainTld(line);
          if (address) {
            const ownerAddress = address.toString();
            if (ownerAddress.toLowerCase() === ZERO_ADDRESS.toLowerCase()) {
              invalidEntries.push(line);
            } else {
              resolvedAddresses.push(ownerAddress);
            }
          } else {
            invalidEntries.push(line);
          }
        } catch {
          invalidEntries.push(line);
        }
      } else {
        if (validateAddress(line) && line.toLowerCase() !== ZERO_ADDRESS.toLowerCase()) {
          resolvedAddresses.push(line);
        } else {
          invalidEntries.push(line);
        }
      }
    }

    if (invalidEntries.length > 0) {
      toast.error(`Invalid entry: ${invalidEntries[0]}`);
      return [];
    }

    return resolvedAddresses;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");
    setTxHash("");
    setLoading(true);

    try {
      const recipients = await parseRecipients();

      if (!tokenAddress) {
        toast.error("Select a token first.");
        setLoading(false);
        return;
      }

      if (!amount || isNaN(Number(amount))) {
        toast.error("Invalid amount.");
        setLoading(false);
        return;
      }

      if (recipients.length === 0) {
        toast.error("No valid recipients found.");
        setLoading(false);
        return;
      }

      const txPromise = execute(tokenAddress, decimals, recipients, amount);

      toast.promise(txPromise, {
        loading: "Processing transfer...",
        success: (txResult) => {
          setInput("");
          setAmount("");
          setTokenAddress("");
          let hash = "";
          if (Array.isArray(txResult)) {
            hash = txResult[0];
          } else if (typeof txResult === "string") {
            hash = txResult;
          }
          if (hash) {
            setTxHash(hash);
            return (
              <div style={{ wordBreak: "break-all" }}>
                <div>Transfer success:</div>
                <div className="font-mono text-xs text-gray-800">{hash}</div>
                <a
                  href={`https://testnet.monadexplorer.com/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-500 block mt-1"
                >
                  View TX
                </a>
              </div>
            );
          }
          return "Transfers completed!";
        },
        error: (err) => `❌ ${err?.message || "Error during transfer."}`,
      }).finally(() => setLoading(false));
    } catch (error: any) {
      toast.error(`Error during submission: ${error?.message || 'Unknown error'}`);
      setLoading(false);
    }
  };

  const totalToSend = () => {
    const count = input.split("\n").filter(Boolean).length;
    const total = parseFloat(amount || "0") * count;
    return `${total || 0}`;
  };

  const selectedToken = tokens.find(t => {
    if (t.symbol === 'MON') {
      return tokenAddress === 'native';
    }
    return t.address === tokenAddress;
  }) || null;

  return (
    <div className="text-sm font-mono text-white p-3 w-[360px] max-h-[70vh] overflow-auto">
      <h2 className="text-base font-bold text-purple-300 mb-2">Bulk Transfer Tool</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="text-xs text-gray-400">Select token</label>
        <Listbox
          value={tokenAddress}
          onChange={(value) => {
            if (value === 'native') {
              const monToken = tokens.find(t => t.symbol === 'MON');
              if (monToken) {
                setTokenAddress('native');
                setDecimals(monToken.decimals);
              }
            } else {
              const selected = tokens.find(t => t.address === value);
              if (selected) {
                setTokenAddress(selected.address);
                setDecimals(selected.decimals);
              } else {
                setTokenAddress("");
              }
            }
          }}
          disabled={tokensLoading || loading}
        >
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-pointer rounded bg-zinc-900 border border-zinc-700 py-1 pl-2 pr-8 text-left text-xs text-white">
              <span className="block truncate">
                {selectedToken
                  ? `${selectedToken.symbol} – ${selectedToken.formattedBalance}`
                  : (tokensLoading ? "Loading tokens..." : "-- Select a token --")}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-zinc-900 py-1 text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {tokens.map((t) => {
                const value = t.symbol === 'MON' ? 'native' : t.address;
                return (
                  <Listbox.Option
                    key={value}
                    value={value}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-1 pl-2 pr-8 ${
                        active ? 'bg-purple-600 text-white' : 'text-white'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>
                          {t.symbol} – {t.formattedBalance}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-white">
                            <CheckIcon className="h-4 w-4" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </div>
        </Listbox>

        <label className="text-xs text-gray-400">Amount to send (same for all)</label>
        <input
          type="text"
          placeholder="Ex: 10.5"
          value={amount}
          onChange={(e) => {
            const value = e.target.value;
            if (/^[0-9]*\.?[0-9]*$/.test(value) || value === "") {
              setAmount(value);
            }
          }}
          className="px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-xs text-white font-mono"
        />

        <label className="text-xs text-gray-400">Recipient addresses</label>
        <span className="text-xs text-gray-500 mb-1">You can enter either an EVM address or a TLD domain (e.g., santi.mon)</span>
        <textarea
          placeholder="0x123...\n0xabc... or santi.mon"
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
