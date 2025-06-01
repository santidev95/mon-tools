"use client";

import { useState, useEffect, useRef } from "react";
import { usePublicClient, useAccount } from 'wagmi'
import { Loader2 } from "lucide-react";
import { getWalletBalances, TokenBalance } from "../../lib/clients/monorail/dataApi";
import { fetchUserTokens, MagicEdenToken } from "@/lib/clients/magicEdenClient";
import { SummaryCard } from "./components/SummaryCard";
import { TokensCard } from "./components/TokensCard";
import { StakingCard } from "./components/StakingCard";
import { NFTsCard } from "./components/NFTsCard";

export default function PortfolioPage() {
    const { address } = useAccount();
    const publicClient = usePublicClient()
    const [monBalance, setMonBalance] = useState<string>("0");
    const [balances, setBalances] = useState<TokenBalance[]>([]);
    const [txCount, setTxCount] = useState<bigint | null>(null);
    const [lstBalances, setLstBalances] = useState<TokenBalance[]>([]);
    const [memeBalances, setMemeBalances] = useState<TokenBalance[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedMenu, setSelectedMenu] = useState<string>("Summary");
    const [nfts, setNfts] = useState<MagicEdenToken[] | null>(null);
    const [continuation, setContinuation] = useState<string | null>(null);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let count = null;
                if (publicClient && address) {
                    count = await publicClient.getTransactionCount({ address });
                    setTxCount(BigInt(count));
                }
                if (address) {
                    const balances = await getWalletBalances(address);
                    const monBalance = balances.find((balance) => balance.symbol === "MON");
                    setMonBalance(monBalance?.balance || "0");
                    setBalances(balances);
                    setLstBalances(balances.filter((balance) => balance.categories.includes("lst")));
                    setMemeBalances(balances.filter((balance) => balance.categories.includes("meme")));
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [publicClient, address]);

    useEffect(() => {
        const fetchNFTs = async () => {
            if (address) {
                const result = await fetchUserTokens(address);
                if (result) {
                    setNfts(result.tokens);
                    setContinuation(result.continuation);
                }
            }
        };

        fetchNFTs();
    }, [address]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            async (entries) => {
                const target = entries[0];
                if (target.isIntersecting && continuation && !loadingMore && selectedMenu === "NFTs") {
                    setLoadingMore(true);
                    try {
                        const result = await fetchUserTokens(address!, 20, continuation);
                        if (result) {
                            setNfts(prev => prev ? [...prev, ...result.tokens] : result.tokens);
                            setContinuation(result.continuation);
                        }
                    } catch (error) {
                        console.error('Error loading more NFTs:', error);
                    } finally {
                        setLoadingMore(false);
                    }
                }
            },
            { threshold: 1.0 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [continuation, loadingMore, address, selectedMenu]);

    if (!address) {
        return (
            <main>
                <div className="flex flex-col items-center justify-center mt-10">
                    <h1 className="text-xl text-red-400 mb-4">Connect your wallet to view your portfolio</h1>
                </div>
            </main>
        );
    }

    if (loading) {
        return (
            <main>
                <div className="flex flex-col items-center justify-center mt-20">
                    <Loader2 className="animate-spin text-purple-400 w-12 h-12 mb-4" />
                    <span className="text-zinc-400">Loading portfolio data...</span>
                </div>
            </main>
        );
    }

    // Menu options
    const menuOptions = [
        { label: "Summary", text: "Portfolio Summary" },
        { label: "Tokens", text: "Tokens Owned" },
        { label: "Staking", text: "Staking Positions" },
        { label: "NFTs", text: "NFTs" },
    ];

    return (
        <main className="w-full flex flex-col items-center mt-2 gap-6">
            {/* Horizontal Menu */}
            <div className="flex flex-row gap-2 w-full max-w-2xl justify-center rounded-xl border border-white/10 bg-gradient-to-b from-purple-900/40 via-blue-900/30 to-blue-900/20 backdrop-blur-md p-4">
                {menuOptions.map((option) => (
                    <button
                        key={option.label}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-zinc-200 hover:bg-purple-800/40 hover:text-purple-300 ${selectedMenu === option.label ? "bg-purple-800/60 text-purple-300" : ""}`}
                        onClick={() => setSelectedMenu(option.label)}
                    >
                        {option.text}
                    </button>
                ))}
            </div>
            {/* Main Content */}
            <div className="w-full flex justify-center">
                <div className="w-full max-w-5xl flex flex-col items-center gap-6">
                    {selectedMenu === "Summary" && (
                        <SummaryCard
                            monBalance={monBalance}
                            txCount={txCount}
                            balances={balances}
                            lstBalances={lstBalances}
                        />
                    )}
                    {selectedMenu === "Tokens" && (
                        <TokensCard balances={balances} />
                    )}
                    {selectedMenu === "Staking" && (
                        <StakingCard lstBalances={lstBalances} />
                    )}
                    {selectedMenu === "NFTs" && (
                        <NFTsCard
                            nfts={nfts}
                            continuation={continuation}
                            loadingMore={loadingMore}
                            loadMoreRef={loadMoreRef}
                        />
                    )}
                </div>
            </div>
        </main>
    );
}