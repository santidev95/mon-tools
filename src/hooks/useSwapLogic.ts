import { useState, useEffect, useRef } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { getTokensByCategory, TokenResult, getWalletBalances, TokenBalance } from "@/lib/clients/monorail/dataApi";
import { getQuote } from "@/lib/clients/monorail/quoteApi";
import { parseUnits, type Abi } from "viem";

const CATEGORIES = [
  { key: "verified", label: "Verified" },
  { key: "stable", label: "Stablecoin" },
  { key: "lst", label: "LST" },
  { key: "bridged", label: "Bridged" },
  { key: "meme", label: "Meme" },
];

const QUOTE_EXPIRY_SECONDS = 60;

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

export function useSwapLogic() {
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
  const [manualReloading, setManualReloading] = useState(false);
  const [quoteTimestamp, setQuoteTimestamp] = useState<number | null>(null);
  const [quoteExpiry, setQuoteExpiry] = useState(QUOTE_EXPIRY_SECONDS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [modalTokens, setModalTokens] = useState<TokenResult[]>([]);
  const [fromTokenBalance, setFromTokenBalance] = useState<string>("");
  const [fromTokenBalanceFormatted, setFromTokenBalanceFormatted] = useState<string>("");
  const [balanceLoading, setBalanceLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getTokensByCategory(category)
      .then(async (data) => {
        // Se a categoria não retornou tokens e há uma wallet conectada, usa os tokens da wallet
        if (data.length === 0 && sender) {
          try {
            const walletTokens = await getWalletBalances(sender);
            if (walletTokens.length > 0) {
              // Converte TokenBalance para TokenResult
              const convertedTokens: TokenResult[] = walletTokens.map(token => ({
                address: token.address,
                categories: token.categories,
                decimals: token.decimals,
                name: token.name,
                symbol: token.symbol,
                id: token.id || token.address,
              }));
              setTokens(convertedTokens);
              const monToken = convertedTokens.find(t => t.symbol === "MON");
              if (!fromToken || !convertedTokens.find(t => t.address === fromToken.address)) setFromToken(monToken || convertedTokens[0] || null);
              const usdcToken = convertedTokens.find(t => t.symbol === "USDC");
              if (!toToken || !convertedTokens.find(t => t.address === toToken.address)) setToToken(usdcToken || convertedTokens[1] || null);
              return;
            }
          } catch (error) {
            console.error("Error fetching wallet balances as fallback:", error);
          }
        }
        
        // Lógica original
        setTokens(data);
        const monToken = data.find(t => t.symbol === "MON");
        if (!fromToken || !data.find(t => t.address === fromToken.address)) setFromToken(monToken || data[0] || null);
        const usdcToken = data.find(t => t.symbol === "USDC");
        if (!toToken || !data.find(t => t.address === toToken.address)) setToToken(usdcToken || data[1] || null);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [category, sender]);

  useEffect(() => {
    fetchQuote();
    // eslint-disable-next-line
  }, [fromToken, toToken, fromValue, sender]);

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

  useEffect(() => {
    if (!modalOpen) return;
    setLoading(true);
    getTokensByCategory(modalCategory)
      .then(async (data) => {
        // Se a categoria não retornou tokens e há uma wallet conectada, usa os tokens da wallet
        if (data.length === 0 && sender) {
          try {
            const walletTokens = await getWalletBalances(sender);
            if (walletTokens.length > 0) {
              // Converte TokenBalance para TokenResult
              const convertedTokens: TokenResult[] = walletTokens.map(token => ({
                address: token.address,
                categories: token.categories,
                decimals: token.decimals,
                name: token.name,
                symbol: token.symbol,
                id: token.id || token.address,
              }));
              setModalTokens(convertedTokens);
              return;
            }
          } catch (error) {
            console.error("Error fetching wallet balances as fallback for modal:", error);
          }
        }
        
        // Lógica original
        setModalTokens(data);
      })
      .finally(() => setLoading(false));
  }, [modalOpen, modalCategory, sender]);

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
      const amount = fromValue.replace(',', '.');
      const quote = await getQuote({
        from: fromToken.address,
        to: toToken.address,
        amount,
        sender: sender || "",
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

  return {
    CATEGORIES,
    category, setCategory,
    modalCategory, setModalCategory,
    tokens, setTokens,
    loading, setLoading,
    fromToken, setFromToken,
    toToken, setToToken,
    fromValue, setFromValue,
    toValue, setToValue,
    price, setPrice,
    minReceived, setMinReceived,
    marketImpact, setMarketImpact,
    modalOpen, setModalOpen,
    sender,
    quoteLoading, setQuoteLoading,
    quoteError, setQuoteError,
    quoteData, setQuoteData,
    sending, setSending,
    sendError, setSendError,
    txHash, setTxHash,
    walletClient,
    publicClient,
    manualReloading, setManualReloading,
    quoteTimestamp, setQuoteTimestamp,
    quoteExpiry, setQuoteExpiry,
    timerRef,
    modalTokens, setModalTokens,
    fromTokenBalance, setFromTokenBalance,
    fromTokenBalanceFormatted, setFromTokenBalanceFormatted,
    balanceLoading, setBalanceLoading,
    fetchBalance,
    fetchQuote,
    handleSwitch,
    bestRouteArr,
    ERC20_ABI,
    QUOTE_EXPIRY_SECONDS
  };
} 