"use client";

import { useState, useEffect, useRef } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { getTokensByCategory, TokenResult, getWalletBalances, TokenBalance } from "@/lib/clients/monorail/dataApi";
import TokenSelectModal from "./TokenSelectModal";
import { getQuote } from "@/lib/clients/monorail/quoteApi";
import React from "react";
import { FiRefreshCw } from "react-icons/fi";
import { IoSwapVerticalSharp } from "react-icons/io5";
import toast from 'react-hot-toast';
import { parseUnits, type Abi } from "viem";

const CATEGORIES = [
  { key: "verified", label: "Verified" },
  { key: "stable", label: "Stablecoin" },
  { key: "lst", label: "LST" },
  { key: "bridged", label: "Bridged" },
  { key: "meme", label: "Meme" },
];

const QUOTE_EXPIRY_SECONDS = 60;

// ABI padrão ERC20 para approve
const ERC20_ABI: Abi = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ type: "bool" }]
  }
];

export default function Swap() {
  const [category, setCategory] = useState(CATEGORIES[0].key);
  const [modalCategory, setModalCategory] = useState(CATEGORIES[0].key);
  const [tokens, setTokens] = useState<TokenResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [fromToken, setFromToken] = useState<TokenResult | null>(null);
  const [toToken, setToToken] = useState<TokenResult | null>(null);
  const [fromValue, setFromValue] = useState("1");
  const [toValue, setToValue] = useState("");
  const [price, setPrice] = useState("");
  const [minReceived, setMinReceived] = useState("");
  const [marketImpact, setMarketImpact] = useState("");
  const [modalOpen, setModalOpen] = useState<"from" | "to" | null>(null);
  const { address: sender } = useAccount();
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [quoteData, setQuoteData] = useState<any>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  // Função para recarregar o quote manualmente
  const [manualReloading, setManualReloading] = useState(false);
  const [quoteTimestamp, setQuoteTimestamp] = useState<number | null>(null);
  const [quoteExpiry, setQuoteExpiry] = useState(QUOTE_EXPIRY_SECONDS); // seconds
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [modalTokens, setModalTokens] = useState<TokenResult[]>([]);
  const [fromTokenBalance, setFromTokenBalance] = useState<string>("");
  const [fromTokenBalanceFormatted, setFromTokenBalanceFormatted] = useState<string>("");
  const [balanceLoading, setBalanceLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getTokensByCategory(category)
      .then((data) => {
        setTokens(data);
        // Find MON token by symbol
        const monToken = data.find(t => t.symbol === "MON");
        if (!fromToken || !data.find(t => t.address === fromToken.address)) setFromToken(monToken || data[0] || null);
        // Find USDC token by symbol
        const usdcToken = data.find(t => t.symbol === "USDC");
        if (!toToken || !data.find(t => t.address === toToken.address)) setToToken(usdcToken || data[1] || null);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [category]);

  // useEffect para atualizar quote automaticamente
  useEffect(() => {
    fetchQuote();
    // eslint-disable-next-line
  }, [fromToken, toToken, fromValue, sender]);

  // Atualiza o timer de expiração
  useEffect(() => {
    if (!quoteTimestamp) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - quoteTimestamp) / 1000);
      const remaining = Math.max(0, QUOTE_EXPIRY_SECONDS - elapsed);
      setQuoteExpiry(remaining);
      if (remaining === 0) {
        clearInterval(timerRef.current!);
        fetchQuote();
      }
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quoteTimestamp]);

  // Atualiza tokens da modal ao abrir ou trocar categoria na modal
  useEffect(() => {
    if (!modalOpen) return;
    setLoading(true);
    getTokensByCategory(modalCategory)
      .then((data) => {
        setModalTokens(data);
      })
      .finally(() => setLoading(false));
  }, [modalOpen, modalCategory]);

  // Buscar saldo do token selecionado
  const fetchBalance = async () => {
    if (!sender || !fromToken) {
      setFromTokenBalance("");
      setFromTokenBalanceFormatted("");
      return;
    }
    setBalanceLoading(true);
    try {
      const balances: TokenBalance[] = await getWalletBalances(sender);
      const token = balances.find(b => b.address.toLowerCase() === fromToken.address.toLowerCase());
      if (token) {
        setFromTokenBalance(token.balance);         
        setFromTokenBalanceFormatted(token.balance);
      } else {
        setFromTokenBalance("0");
        setFromTokenBalanceFormatted("0");
      }
    } catch (e) {
      setFromTokenBalance("");
      setFromTokenBalanceFormatted("");
    } finally {
      setBalanceLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [sender, fromToken]);

  // Função para recarregar o quote manualmente
  const fetchQuote = async () => {
    if (!fromToken || !toToken || !fromValue || Number(fromValue) <= 0) {
      setToValue("");
      setPrice("");
      setMinReceived("");
      setMarketImpact("");
      setQuoteData(null);
      setQuoteTimestamp(null);
      setQuoteExpiry(QUOTE_EXPIRY_SECONDS);
      return;
    }
    setQuoteLoading(true);
    setManualReloading(true);
    setQuoteError(null);
    try {
      const amount = fromValue;
      const quote = await getQuote({
        from: fromToken.address,
        to: toToken.address,
        amount,
        sender: sender || undefined,
        deadline: QUOTE_EXPIRY_SECONDS,
        source: "montools"
      });
      setQuoteData(quote);
      setToValue(quote.output_formatted);
      let priceValue = "";
      if (quote.input_formatted && quote.output_formatted) {
        const input = Number(quote.input_formatted);
        const output = Number(quote.output_formatted);
        if (input > 0) {
          priceValue = (output / input).toFixed(6);
        }
      }
      setPrice(priceValue);
      setMinReceived(quote.min_output_formatted);
      const weightedImpact = quote.routes?.[0]?.[0]?.weighted_price_impact;
      setMarketImpact(
        weightedImpact ? Number(weightedImpact).toFixed(2) : ""
      );
      setQuoteTimestamp(Date.now());
      setQuoteExpiry(QUOTE_EXPIRY_SECONDS);
    } catch (err: any) {
      setQuoteError(err?.message || "Failed to fetch quote");
      setToValue("");
      setPrice("");
      setMinReceived("");
      setMarketImpact("");
      setQuoteData(null);
      setQuoteTimestamp(null);
      setQuoteExpiry(QUOTE_EXPIRY_SECONDS);
    } finally {
      setQuoteLoading(false);
      setManualReloading(false);
    }
  };

  const handleSwitch = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  // Escolher a rota de menor fee total
  let bestRouteArr: any[] = [];
  if (Array.isArray(quoteData?.routes) && quoteData.routes.length > 0) {
    let minFee = null;
    for (const routeArr of quoteData.routes) {
      const totalFee = routeArr.reduce(
        (acc: number, route: any) =>
          acc + (route.splits?.reduce((a: number, split: any) => a + Number(split.fee), 0) ?? 0),
        0
      );
      if (minFee === null || totalFee < minFee) {
        minFee = totalFee;
        bestRouteArr = routeArr;
      }
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 justify-center items-center w-full min-h-[70vh] py-10">
      {/* Painel de Swap */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg p-6 w-full max-w-lg min-w-[500px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-violet-400 font-mono">MonTools Swap</h2>
          <div className="flex items-center gap-3">
            {/* Círculo de progresso ao redor do contador */}
            <div className="relative flex items-center justify-center w-10 h-10">
              <svg className="absolute top-0 left-0 w-10 h-10" viewBox="0 0 40 40">
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="none"
                  stroke="#27272a"
                  strokeWidth="3"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="3"
                  strokeDasharray={2 * Math.PI * 18}
                  strokeDashoffset={2 * Math.PI * 18 * (1 - quoteExpiry / 60)}
                  style={{ transition: 'stroke-dashoffset 0.5s linear' }}
                />
              </svg>
              {/* Tempo restante centralizado */}
              <span className="absolute inset-0 flex items-center justify-center text-xs font-mono text-violet-400 select-none">
                {quoteExpiry}s
              </span>
            </div>
            {/* Botão de reload ao lado */}
            <button
              className="text-gray-400 hover:text-violet-400 transition text-xl p-1 z-10 bg-transparent"
              title="Reload quote"
              onClick={fetchQuote}
              disabled={manualReloading || quoteLoading}
              style={{ width: 40, height: 40, borderRadius: 20, position: 'relative' }}
            >
              {manualReloading || quoteLoading ? (
                <span className="animate-spin"><FiRefreshCw /></span>
              ) : (
                <FiRefreshCw />
              )}
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {/* Categoria Tabs */}        
          {/* From */}
          <div>
            <label className="block text-xs text-gray-400 mb-1 font-mono">From</label>
            {/* Botões de porcentagem */}
            {sender && fromToken && (
            <div className="flex gap-2 mb-1 justify-between">
              <div className="flex gap-2 mb-1">
                {[10, 25, 50, 100].map(percent => (
                  <button
                    key={percent}
                    type="button"
                    className="px-2 py-1 rounded bg-zinc-800 text-xs text-violet-300 hover:bg-violet-700 font-mono border border-zinc-700"
                    disabled={balanceLoading || !fromTokenBalanceFormatted || Number(fromTokenBalanceFormatted) === 0}
                    onClick={e => {
                      e.stopPropagation();
                      if (!fromTokenBalanceFormatted) return;
                      const value = (Number(fromTokenBalanceFormatted) * percent / 100).toFixed(6);
                      setFromValue(value.replace(/\.0+$/, ""));
                    }}
                  >
                    {percent === 100 ? "Max" : `${percent}%`}
                  </button>
                ))}
              </div>              
                 <div>
                    <span className="text-xs text-gray-400 font-mono">
                      Balance: {balanceLoading ? "..." : `${fromTokenBalanceFormatted} ${fromToken?.symbol ?? ""}`}
                    </span>
                </div>
            </div>
            )}

            <div className="flex items-center bg-zinc-800 rounded-lg px-3 py-2 cursor-pointer" onClick={() => {
              setModalCategory(category);
              setModalOpen("from");
            }}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-bold text-white font-mono text-base">{fromToken?.symbol || "Select"}</span>
                <span className="text-xs text-violet-400 font-mono truncate max-w-[80px]">{fromToken?.name}</span>
              </div>
              <input
                type="number"
                min="0"
                value={fromValue}
                onChange={e => setFromValue(e.target.value)}
                className="bg-transparent text-white font-mono text-right flex-1 outline-none text-xl px-2"
                onClick={e => e.stopPropagation()}
              />              
            </div>
          </div>
          {/* Switch */}
          <div className="flex justify-center my-2">
            <button
              onClick={handleSwitch}
              className="bg-zinc-800 border border-zinc-700 rounded-full p-2 hover:bg-zinc-700 text-violet-400 transition"
              title="Switch"
            >
              <IoSwapVerticalSharp />
            </button>
          </div>
          {/* To */}
          <div>
            <label className="block text-xs text-gray-400 mb-1 font-mono">To</label>
            <div className="flex items-center bg-zinc-800 rounded-lg px-3 py-2 cursor-pointer" onClick={() => {
              setModalCategory(category);
              setModalOpen("to");
            }}> 
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-bold text-white font-mono text-base">{toToken?.symbol || "Select"}</span>
                <span className="text-xs text-violet-400 font-mono truncate max-w-[80px]">{toToken?.name}</span>
              </div>
              <input
                type="text"
                value={quoteLoading ? "..." : toValue}
                readOnly
                className="bg-transparent text-white font-mono text-right flex-1 outline-none text-xl px-2"
                onClick={e => e.stopPropagation()}
              />
            </div>
            {quoteError && <div className="text-xs text-red-400 mt-1 font-mono">{quoteError}</div>}
          </div>
        </div>
        <div className="mt-6">
          <button
            className={`w-full py-2 rounded font-bold transition text-white ${sending ? "bg-gray-500" : "bg-violet-500 hover:bg-violet-600"}`}
            disabled={sending || !quoteData?.transaction || !walletClient}
            onClick={async () => {
              setSendError(null);
              setTxHash(null);
              if (!walletClient || !quoteData?.transaction) return;
              setSending(true);
              const toastId = toast.loading('Approving token...');
              try {
                // If not native token, do approve first
                if (fromToken && fromToken.symbol !== "MON") {
                  const amount = parseUnits(fromValue, Number(fromToken.decimals));
                  const approveHash = await walletClient.writeContract({
                    address: fromToken.address as `0x${string}`,
                    abi: ERC20_ABI,
                    functionName: "approve",
                    args: [quoteData.transaction.to, amount],
                  });
                  toast.loading('Waiting for approve confirmation...', { id: toastId });
                  if (!publicClient) throw new Error("Public client not available");
                  await publicClient.waitForTransactionReceipt({ hash: approveHash });
                  toast.success('Approve confirmed!', { id: toastId });
                }
                toast.loading('Sending swap...', { id: toastId });
                const tx = await walletClient.sendTransaction({
                  to: quoteData.transaction.to as `0x${string}`,
                  data: quoteData.transaction.data as `0x${string}`,
                  value: quoteData.transaction.value ? BigInt(quoteData.transaction.value) : 0n,
                });
                setTxHash(tx);
                // Show transaction sent toast
                toast.custom((t) => (
                  <div className="bg-zinc-900 border border-green-400 rounded-lg p-4 text-white font-mono shadow-lg min-w-[220px]">
                    <div className="font-bold mb-1">Transaction sent!</div>
                    <a
                      href={`https://testnet.monadexplorer.com/tx/${tx}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-400 underline break-all text-xs"
                    >
                      View on Monad Explorer
                    </a>
                  </div>
                ), { id: toastId, duration: 6000 });
                // Update balance after 3s
                setTimeout(() => { fetchBalance(); }, 5000);
              } catch (err: any) {
                const errorMsg = err?.message || "Error sending transaction";
                setSendError(errorMsg);
                toast.custom((t) => (
                  <div className="bg-zinc-900 border border-red-400 rounded-lg p-4 text-white font-mono shadow-lg min-w-[220px]">
                    <div className="font-bold mb-1 text-red-400">Failed to send transaction</div>
                  </div>
                ), { id: toastId, duration: 6000 });
              } finally {
                setSending(false);
              }
            }}
          >
            {sending ? "Sending..." : !sender ? "Connect wallet" : "Swap"}
          </button>          
        </div>
      </div>

      {/* Painel de Detalhes */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg p-6 w-full max-w-sm min-w-[280px]">
        <div className="mb-4">
          <div className="text-gray-400 text-xs font-mono">Price</div>
          <div className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            {quoteLoading ? "..." : price} <span className="text-violet-400">{toToken?.symbol}</span>
            <span className="text-lg text-gray-400 font-normal">per {fromToken?.symbol}</span>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 font-mono mb-2">
          <span>Minimum Received</span>
          <span className="text-white font-bold">{quoteLoading ? "..." : minReceived} {toToken?.symbol}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-400 font-mono mb-4">
          <span>Market impact</span>
          <span
            className={(() => {
              if (quoteLoading) return "text-white font-bold";
              const impact = parseFloat(
                String(marketImpact)
                  .replace(',', '.')
                  .replace('%', '')
                  .trim()
              );
              if (isNaN(impact)) return "text-white font-bold";
              if (impact > 50) return "text-red-400 font-bold";
              if (impact >= 20) return "text-yellow-400 font-bold";
              return "text-white font-bold";
            })()}
          >
            {quoteLoading ? "..." : marketImpact}%
          </span>
        </div>
        <div className="border-t border-zinc-700 pt-4">
          <div className="text-violet-400 text-xs font-mono mb-2 flex items-center gap-1">
            <span className="material-icons text-base"></span> Smart Route
          </div>
          <div className="space-y-2 text-xs text-gray-300 font-mono">
            {quoteLoading ? (
              <div>Loading route...</div>
            ) : (
              quoteError ? (
                <div className="text-red-400">{quoteError}</div>
              ) : (
                bestRouteArr.length > 0 ? (
                  <div className="flex flex-col items-center gap-2">
                    {bestRouteArr.map((route: any, idx: number, arr: any[]) => {
                      const numAMMs = route.splits?.length || 0;
                      const avgFee = numAMMs > 0 ? (route.splits.reduce((acc: number, split: any) => acc + Number(split.fee), 0) / numAMMs) : 0;
                      const marketImpact = route.weighted_price_impact ? Number(route.weighted_price_impact) : null;
                      return (
                        <React.Fragment key={idx}>
                          <div className="flex flex-col items-center">
                            <span className="text-white text-base font-bold">{route.from_symbol}</span>
                            <span className="text-gray-400">{numAMMs} AMM{numAMMs !== 1 ? 's' : ''}  - ~{avgFee.toFixed(2)}% avg fee</span>
                            <span className="text-violet-400">100%</span>
                            {marketImpact !== null && marketImpact > 0 && (
                              <span className={marketImpact > 10 ? "text-orange-400" : "text-gray-400"}>
                                {marketImpact.toFixed(2)}% market impact
                              </span>
                            )}
                          </div>
                          {(arr.length === 1 || idx < arr.length - 1) && (
                            <span className="text-violet-400 text-lg my-1">↓</span>
                          )}
                        </React.Fragment>
                      );
                    })}
                    <span className="text-white text-base font-bold mt-2">{toToken?.symbol}</span>
                  </div>
                ) : (
                  <div>No route found.</div>
                )
              )
            )}
          </div>         
        </div>      
        <div className="flex justify-center mt-5">
            <span className="text-xs text-violet-400 font-mono">Data by <a href="https://monorail.xyz" target="_blank" rel="noopener noreferrer" className="">monorail.xyz</a></span>
        </div> 
      </div>

      {/* Modal de seleção de token */}
      <TokenSelectModal
        open={modalOpen !== null}
        onClose={() => setModalOpen(null)}
        category={modalCategory}
        setCategory={setModalCategory}
        tokens={modalTokens}
        loading={loading}
        onSelect={token => {
          if (modalOpen === "from") setFromToken(token);
          if (modalOpen === "to") setToToken(token);
          setModalOpen(null);
        }}
      />
    </div>
  );
} 