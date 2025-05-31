"use client";

import { useState, useEffect } from "react";
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

export default function PortfolioPage() {
    const { address } = useAccount();
    const publicClient = usePublicClient()
    const [monBalance, setMonBalance] = useState<string>("0");
    const [balances, setBalances] = useState<TokenBalance[]>([]);
    const [txCount, setTxCount] = useState<bigint | null>(null);
    const [lstBalances, setLstBalances] = useState<TokenBalance[]>([]);
    const [memeBalances, setMemeBalances] = useState<TokenBalance[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedMenu, setSelectedMenu] = useState<string>("Resumo");

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
        { label: "Summary" },
        { label: "Tokens" },
        { label: "Staking" },
        { label: "NFTs" },
    ];

    return (
        <main>
            <div className="flex flex-row w-full justify-center mt-2 gap-6">
                {/* Sidebar Menu */}
                <aside className="hidden md:flex flex-col rounded-xl border border-white/10 bg-gradient-to-b from-purple-900/40 via-blue-900/30 to-blue-900/20 backdrop-blur-md p-4 min-w-[200px] max-w-[220px] h-fit ml-4 mt-0">
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-indigo-300 text-lg font-semibold">Menu</span>
                    </div>
                    {menuOptions.map((option) => (
                        <button
                            key={option.label}
                            className={`w-full text-left px-4 py-2 my-1 rounded-lg font-semibold transition-colors duration-200 text-zinc-200 hover:bg-purple-800/40 hover:text-purple-300 ${selectedMenu === option.label ? "bg-purple-800/60 text-purple-300" : ""}`}
                            onClick={() => setSelectedMenu(option.label)}
                        >
                            {option.label}
                        </button>
                    ))}
                </aside>
                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center gap-6">
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
                                <h1 className="text-xl font-bold text-purple-400 mb-4">Your Tokens</h1>
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
                                <h1 className="text-xl font-bold text-purple-400 mb-4">Your Staking Positions</h1>
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
                        <Card className="w-full max-w-3xl shadow-xl bg-zinc-900/50 backdrop-blur-sm border-purple-800/50">
                            <div className="flex flex-col items-center justify-center">
                                <h1 className="text-xl font-bold text-purple-400 mb-4">NFTs</h1>
                            </div>
                            <CardHeader>
                                <span className="text-zinc-400">NFTs feature coming soon.</span>
                            </CardHeader>
                        </Card>
                    )}
                </div>
            </div>
        </main>
    );
}