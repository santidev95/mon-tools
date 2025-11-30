"use client";

import { useState, useEffect } from "react";
import { useBulkTransferWithApprove } from "@/lib/useBulkTransferWithApprove";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";
import { isAddress } from "ethers";
import { allDomainsClient } from "@/lib/clients/allDomains";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import TokenSelectModal from "@/components/TokenSelectModal";
import { getTokensByCategory, getWalletBalances, TokenResult, TokenBalance } from "@/lib/clients/monorail/dataApi";

const CATEGORIES = [
  { key: "verified", label: "Verified" },
  { key: "stable", label: "Stablecoin" },
  { key: "lst", label: "LST" },
  { key: "bridged", label: "Bridged" },
  { key: "meme", label: "Meme" },
];


export default function BulkTransferApp() {
  const [tokenAddress, setTokenAddress] = useState<"" | `0x${string}` | "native">("");
  const [decimals, setDecimals] = useState<number>(18);
  const [input, setInput] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState(CATEGORIES[0].key);
  const [modalTokens, setModalTokens] = useState<TokenResult[]>([]);
  const [tokensLoading, setTokensLoading] = useState(false);
  const [walletBalancesMap, setWalletBalancesMap] = useState<Record<string, string>>({});
  const [selectedToken, setSelectedToken] = useState<TokenResult | null>(null);

  const { execute } = useBulkTransferWithApprove();
  const { address: sender, isConnected } = useAccount();

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

  // Carrega mapa de saldos da wallet para exibir no modal
  useEffect(() => {
    (async () => {
      if (!sender) {
        setWalletBalancesMap({});
        return;
      }
      try {
        const balances = await getWalletBalances(sender);
        const map: Record<string, string> = {};
        for (const b of balances) {
          map[b.address.toLowerCase()] = b.balance;
        }
        setWalletBalancesMap(map);
      } catch (e) {
        setWalletBalancesMap({});
      }
    })();
  }, [sender]);

  // Carrega tokens do modal quando abre
  useEffect(() => {
    if (!modalOpen) return;
    setTokensLoading(true);
    
    // Categoria especial: My Wallet (mostra apenas tokens com saldo > 0)
    if (modalCategory === "mywallet") {
      if (!sender) {
        setModalTokens([]);
        setTokensLoading(false);
        return;
      }
      (async () => {
        try {
          const balances: TokenBalance[] = await getWalletBalances(sender);
          const withBalance = balances.filter(b => Number(b.balance) > 0);
          const converted: TokenResult[] = withBalance.map(token => ({
            address: token.address,
            categories: token.categories,
            decimals: token.decimals,
            name: token.name,
            symbol: token.symbol,
            id: token.id || token.address,
            balance: token.balance,
          })).sort((a, b) => Number(b.balance || 0) - Number(a.balance || 0));
          setModalTokens(converted);
        } catch (error) {
          console.error("Error fetching wallet balances for My Wallet:", error);
          setModalTokens([]);
        } finally {
          setTokensLoading(false);
        }
      })();
      return;
    }
    
    // Para outras categorias, busca todos os tokens da categoria da API
    getTokensByCategory(modalCategory)
      .then((data) => {
        setModalTokens(data);
      })
      .catch((error) => {
        console.error("Error fetching tokens by category:", error);
        setModalTokens([]);
      })
      .finally(() => setTokensLoading(false));
  }, [modalOpen, modalCategory, sender]);

  // Atualiza categoria padrão conforme conexão da carteira
  useEffect(() => {
    if (sender) {
      setModalCategory("mywallet");
    } else {
      setModalCategory("verified");
    }
  }, [sender]);

  // Atualiza selectedToken quando tokenAddress muda
  useEffect(() => {
    if (!tokenAddress) {
      setSelectedToken(null);
      return;
    }
    
    // Busca o token selecionado nos tokens do modal ou busca individualmente
    const findToken = async () => {
      if (tokenAddress === 'native') {
        // Para native, busca o token MON
        try {
          // Primeiro tenta encontrar nos tokens da wallet
          if (sender) {
            const balances = await getWalletBalances(sender);
            const monBalance = balances.find(b => b.symbol === 'MON');
            if (monBalance) {
              setSelectedToken({
                address: monBalance.address,
                categories: monBalance.categories,
                decimals: monBalance.decimals,
                name: monBalance.name,
                symbol: monBalance.symbol,
                id: monBalance.id || monBalance.address,
                balance: monBalance.balance,
              });
              return;
            }
          }
          // Se não encontrou na wallet, busca na API
          const monTokens = await getTokensByCategory("verified");
          const monToken = monTokens.find(t => t.symbol === 'MON');
          if (monToken) {
            setSelectedToken(monToken);
          }
        } catch (e) {
          console.error("Error finding MON token:", e);
        }
      } else {
        // Para outros tokens, primeiro verifica se está no modalTokens
        const tokenInModal = modalTokens.find(t => t.address.toLowerCase() === tokenAddress.toLowerCase());
        if (tokenInModal) {
          setSelectedToken(tokenInModal);
          return;
        }
        
        // Se não está no modal, busca na lista de tokens disponíveis
        try {
          const allCategories = await Promise.all(
            CATEGORIES.map(cat => getTokensByCategory(cat.key))
          );
          const allTokens = allCategories.flat();
          const token = allTokens.find(t => t.address.toLowerCase() === tokenAddress.toLowerCase());
          if (token) {
            setSelectedToken(token);
          }
        } catch (e) {
          console.error("Error finding token:", e);
        }
      }
    };
    
    findToken();
  }, [tokenAddress, sender, modalTokens]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-xl font-bold text-purple-400 mb-4">Bulk Transfer Tool</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="text-sm text-gray-400">Select token</label>
        <div 
          className="flex items-center bg-zinc-800 rounded-lg px-3 py-2 cursor-pointer hover:bg-zinc-700 transition"
          onClick={() => setModalOpen(true)}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="font-bold text-white font-mono text-base">
              {selectedToken?.symbol || "Select"}
            </span>
            <span className="text-xs text-violet-400 font-mono truncate max-w-[80px]">
              {selectedToken?.name || ""}
            </span>
          </div>
          {selectedToken && (() => {
            const addressKey = selectedToken.address.toLowerCase();
            const balance = walletBalancesMap[addressKey] || selectedToken.balance;
            return balance ? (
              <span className="text-xs text-violet-300 font-mono ml-2">
                {balance}
              </span>
            ) : null;
          })()}
        </div>
        
        <TokenSelectModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          category={modalCategory}
          setCategory={setModalCategory}
          tokens={modalTokens}
          loading={tokensLoading}
          onSelect={(token) => {
            // Se for MON, usa 'native', senão usa o endereço
            if (token.symbol === 'MON') {
              setTokenAddress('native');
              setDecimals(Number(token.decimals));
            } else {
              setTokenAddress(token.address as `0x${string}`);
              setDecimals(Number(token.decimals));
            }
            setSelectedToken(token);
            setModalOpen(false);
          }}
          hasWallet={Boolean(sender)}
          balances={walletBalancesMap}
        />

        <label className="text-sm text-gray-400">Amount to send (same for all)</label>
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
          className="px-4 py-2 rounded bg-zinc-900 border border-zinc-700 text-sm text-white font-mono"
        />

        <label className="text-sm text-gray-400">Recipient addresses (one per line)</label>
        <span className="text-xs text-gray-500 mb-1">You can enter either an EVM address or a TLD domain (e.g., santi.mon)</span>
        <textarea
          placeholder="0x123...\n0xabc... or santi.mon"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          className="px-4 py-2 rounded bg-zinc-900 border border-zinc-700 text-sm text-white font-mono"
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
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition"
        >
          {loading ? "Approving & Sending..." : "Approve & Transfer"}
        </button>
        {txHash && (
          <div className="mt-4 text-center">
            <span className="text-xs text-gray-400">Txn Hash:&nbsp;</span>
            <a
              href={`https://testnet.monadexplorer.com//tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-purple-400 break-all"
            >
              {txHash}
            </a>
          </div>
        )}
      </form>
      <br />
      <div className="flex justify-center gap-2">
        <label className="text-sm text-gray-400">Bulk Transfer Contract: 0x73Fc1b28F405df9B4B97960F1A0C64C656708524 </label>
        <a
          href="https://testnet.monadexplorer.com/address/0x73Fc1b28F405df9B4B97960F1A0C64C656708524"
          target="_blank"
          className="text-purple-400 hover:text-purple-300"
        >
          <LiaExternalLinkAltSolid className="w-4 h-4" />
        </a>
      </div>
      <div className="flex justify-center gap-2">
        <label className="text-sm text-gray-400">Native MultiSend Contract: 0xB135EC2dF1Af065a38B901CBc818e0E462e8A1c6 </label>
        <a
          href="https://testnet.monadexplorer.com/address/0xB135EC2dF1Af065a38B901CBc818e0E462e8A1c6"
          target="_blank"
          className="text-purple-400 hover:text-purple-300"
        >
          <LiaExternalLinkAltSolid className="w-4 h-4" />
        </a>
      </div>
      {status && <p className="mt-4 text-sm text-center">{status}</p>}
    </div>
  );
}
