"use client";

import { useState, useEffect, useRef } from "react";
import { usePublicClient, useAccount } from 'wagmi'
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import {getWalletBalances, TokenBalance} from "../../lib/clients/monorail/dataApi";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Loader2 } from "lucide-react";
import { fetchUserTokens, MagicEdenToken } from "@/lib/clients/magicEdenClient";
import Image from "next/image";

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
                        <>
                            {/* Portfolio Summary Card */}
                            <div className="w-full max-w-5xl rounded-xl border border-white/10 bg-gradient-to-r from-purple-800/60 via-blue-800/60 to-blue-900/60 backdrop-blur-md p-6 mb-2">
                                <div className="font-semibold text-center text-indigo-300 text-lg mb-4">Portfolio Summary</div>
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex-1 flex flex-col items-center">
                                        <span className="text-3xl md:text-4xl font-bold text-green-400 tabular-nums">
                                            {parseFloat(monBalance).toLocaleString("en-US", { maximumFractionDigits: 3 })}
                                        </span>
                                        <span className="text-sm text-green-200 mt-1">Native Token (MON)</span>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center">
                                        <span className="text-3xl md:text-4xl font-bold text-fuchsia-400 tabular-nums">
                                        {parseFloat(txCount?.toString() || "0").toLocaleString("en-US")}
                                        </span>
                                        <span className="text-sm text-fuchsia-200 mt-1">Transactions</span>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center">
                                        <span className="text-3xl md:text-4xl font-bold text-sky-400 tabular-nums">
                                            {balances.length}
                                        </span>
                                        <span className="text-sm text-sky-200 mt-1">Tokens Owned</span>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center">
                                        <span className="text-3xl md:text-4xl font-bold text-fuchsia-400 tabular-nums">
                                            {lstBalances.length}
                                        </span>
                                        <span className="text-sm text-fuchsia-200 mt-1">Staking Positions</span>
                                    </div>                                    
                                </div>
                            </div>
                        </>
                    )}
                    {selectedMenu === "Tokens" && (
                        <Card className="w-full max-w-5xl shadow-xl bg-zinc-900/50 backdrop-blur-sm border-purple-800/50">
                            <div className="flex flex-col items-center justify-center">
                                <h1 className="text-xl font-bold text-purple-400 mb-4">Tokens Owned</h1>
                            </div>
                            <CardHeader>
                                {balances.length > 0 ? (
                                    <div className="w-full space-y-6">
                                        {/* Group tokens by categories */}
                                        {Array.from(new Set(balances.flatMap(b => b.categories)))
                                            .sort((a, b) => {
                                                if (a === "native") return -1;
                                                if (b === "native") return 1;
                                                return a.localeCompare(b);
                                            })
                                            .map(category => {
                                                const categoryTokens = balances.filter(b => b.categories.includes(category));
                                                return (
                                                    <div key={category} className="space-y-3">
                                                        <CardDescription className="text-zinc-400 text-lg font-semibold capitalize">
                                                            {category}
                                                        </CardDescription>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {categoryTokens.map((balance) => (
                                                                <div 
                                                                    key={balance.symbol} 
                                                                    className="p-4 rounded-lg bg-zinc-800/50 border border-purple-800/30 hover:border-purple-500/50 transition-colors"
                                                                >
                                                                    <div className="flex justify-between items-start">
                                                                        <CardDescription className="text-zinc-400">
                                                                            {balance.symbol}
                                                                        </CardDescription>
                                                                        {balance.address && (
                                                                            <a 
                                                                                href={`https://testnet.monadexplorer.com/token/${balance.address}`} 
                                                                                target="_blank"
                                                                                className="text-purple-400 hover:text-purple-300"
                                                                            >
                                                                                <LiaExternalLinkAltSolid className="w-4 h-4" />
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                    <CardTitle className="text-2xl font-semibold tabular-nums break-all text-purple-400 mt-2">
                                                                        {parseFloat(balance.balance).toLocaleString("en-US", { maximumFractionDigits: 3 })}
                                                                    </CardTitle>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                ) : (
                                    <span className="text-zinc-400">No tokens found.</span>
                                )}
                            </CardHeader>
                        </Card>
                    )}
                    {selectedMenu === "Staking" && (
                        <Card className="w-full max-w-5xl shadow-xl bg-zinc-900/50 backdrop-blur-sm border-purple-800/50">
                            <div className="flex flex-col items-center justify-center">
                                <h1 className="text-xl font-bold text-purple-400 mb-4">Staking Positions</h1>
                            </div>
                            <CardHeader>
                                {lstBalances.length > 0 ? (
                                    <div className="w-full">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {lstBalances.map((balance) => (
                                                <div 
                                                    key={balance.symbol} 
                                                    className="p-4 rounded-lg bg-zinc-800/50 border border-purple-800/30 hover:border-purple-500/50 transition-colors"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <CardDescription className="text-zinc-400">
                                                            {balance.symbol}
                                                        </CardDescription>
                                                        {balance.address && (
                                                            <a 
                                                                href={`https://testnet.monadexplorer.com/token/${balance.address}`} 
                                                                target="_blank"
                                                                className="text-purple-400 hover:text-purple-300"
                                                            >
                                                                <LiaExternalLinkAltSolid className="w-4 h-4" />
                                                            </a>
                                                        )}
                                                    </div>
                                                    <CardTitle className="text-2xl font-semibold tabular-nums break-all text-purple-400 mt-2">
                                                        {parseFloat(balance.balance).toLocaleString("en-US", { maximumFractionDigits: 3 })}
                                                    </CardTitle>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-zinc-400">No staking positions found.</span>
                                )}
                            </CardHeader>
                        </Card>
                    )}
                    {selectedMenu === "NFTs" && (
                        <Card className="w-full max-w-5xl shadow-xl bg-zinc-900/50 backdrop-blur-sm border-purple-800/50">
                            <div className="flex flex-col items-center justify-center">
                                <h1 className="text-xl font-bold text-purple-400 mb-4">NFTs</h1>
                            </div>
                            <CardHeader>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {nfts?.map((nft) => (
                                        <Card key={`${nft.token.contract}-${nft.token.tokenId}`} className="bg-zinc-800/50 border-purple-800/30">
                                            <CardHeader className="p-4">
                                                <div className="w-[200px] h-[200px] mx-auto relative overflow-hidden rounded-lg aspect-square">
                                                    {nft.token.image ? (
                                                        <Image
                                                            src={nft.token.image}
                                                            alt={nft.token.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : nft.token.media ? (
                                                        nft.token.media.type === 'video' ? (
                                                            <video
                                                                src={nft.token.media.url}
                                                                className="w-full h-full object-cover"
                                                                controls
                                                                loop
                                                                muted
                                                            />
                                                        ) : (
                                                            <Image
                                                                src={nft.token.media.url}
                                                                alt={nft.token.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        )
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                                            <span className="text-zinc-600">No media</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mt-4">
                                                    <h3 className="text-sm font-semibold text-purple-400 truncate">
                                                        {nft.token.name}
                                                    </h3>
                                                    <p className="text-xs text-zinc-400 mt-1">
                                                        {nft.token.collection.name}
                                                    </p>
                                                    {nft.token.collection.floorAskPrice && (
                                                        <p className="text-xs text-zinc-400 mt-1">
                                                            Floor: {nft.token.collection.floorAskPrice.amount.decimal} {nft.token.collection.floorAskPrice.currency.symbol}
                                                        </p>
                                                    )}
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    ))}
                                </div>
                                {!nfts && (
                                    <div className="text-center py-8">
                                        <p className="text-zinc-400">Loading NFTs...</p>
                                    </div>
                                )}
                                {nfts?.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-zinc-400">No NFTs found.</p>
                                    </div>
                                )}
                                {continuation && (
                                    <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
                                        {loadingMore ? (
                                            <Loader2 className="animate-spin text-purple-400 w-6 h-6" />
                                        ) : (
                                            <span className="text-zinc-400">Scroll for more</span>
                                        )}
                                    </div>
                                )}
                            </CardHeader>
                        </Card>
                    )}
                </div>
            </div>
        </main>
    );
}