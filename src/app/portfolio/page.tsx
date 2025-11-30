"use client";

import { useState, useEffect, useRef } from "react";
import { usePublicClient, useAccount } from 'wagmi'
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { getWalletBalances, TokenBalance } from "../../lib/clients/monorail/dataApi";
import { fetchUserTokens, UserCollectionV4 } from "@/lib/clients/magicEdenClient";

// Dynamically import heavy components with named exports
const SummaryCard = dynamic(() => import("./components/SummaryCard").then(mod => ({ default: mod.SummaryCard })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
});

const TokensCard = dynamic(() => import("./components/TokensCard").then(mod => ({ default: mod.TokensCard })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
});

const StakingCard = dynamic(() => import("./components/StakingCard").then(mod => ({ default: mod.StakingCard })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
});

const NFTsCard = dynamic(() => import("./components/NFTsCard").then(mod => ({ default: mod.NFTsCard })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
});

const DomainsCard = dynamic(() => import("./components/DomainsCard").then(mod => ({ default: mod.DomainsCard })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
});


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
    const [collections, setCollections] = useState<UserCollectionV4[] | null>(null);



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
                    console.log(balances);
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
                    setCollections(result.collections);
                } else {
                    setCollections([]);
                }
            }
        };

        fetchNFTs();
    }, [address]);


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
        { label: "Domains", text: "Domains" },
    ];

    return (
        <main className="w-full flex flex-col items-center mt-2 gap-6">
            {/* Horizontal Menu */}
            <div className="flex flex-row gap-2 w-full max-w-3xl justify-center rounded-xl border border-white/10 bg-gradient-to-b from-purple-900/40 via-blue-900/30 to-blue-900/20 backdrop-blur-md p-4">
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
                            collections={collections}
                        />
                    )}
                    {selectedMenu === "Domains" && (
                        <DomainsCard />

                    )}
                </div>
            </div>
        </main>
    );
}