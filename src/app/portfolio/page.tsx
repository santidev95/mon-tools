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
import { ethers } from "ethers";
import { Badge } from "lucide-react";
import { Loader2 } from "lucide-react";

// Tabs component
function Tabs({ tabs, current, onChange }: { tabs: string[]; current: string; onChange: (tab: string) => void }) {
  return (
    <div className="flex border-b border-purple-800 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2 text-md font-semibold focus:outline-none transition-colors duration-200 ${
            current === tab ? "text-purple-400 border-b-2 border-purple-400" : "text-zinc-400 hover:text-purple-300"
          }`}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default function PortfolioPage() {
    const { address } = useAccount();
    const publicClient = usePublicClient()
    const [monBalance, setMonBalance] = useState<string>("0");
    const [balances, setBalances] = useState<TokenBalance[]>([]);
    const [txCount, setTxCount] = useState<bigint | null>(null);
    const [lstBalances, setLstBalances] = useState<TokenBalance[]>([]);
    const [memeBalances, setMemeBalances] = useState<TokenBalance[]>([]);
    const [tab, setTab] = useState<string>("General");
    const [loading, setLoading] = useState<boolean>(true);

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

 return (
    <main>
        
        <div className="flex flex-col items-center justify-center mt-2">
            
          <Card className="w-full max-w-3xl shadow-xl bg-zinc-900 border-purple-800">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-xl font-bold text-purple-400 mb-4">Your Portfolio</h1>
            </div>
            <CardHeader>
              <Tabs tabs={["General", "Staking", "Tokens"]} current={tab} onChange={setTab} />
            </CardHeader>
            <CardFooter>
              {tab === "General" && (
                <div className="w-full flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row gap-4 w-full">
                    <div className="flex-1">
                      <CardDescription className="text-zinc-400">Native Balance</CardDescription>
                      <CardTitle className="text-2xl font-semibold tabular-nums break-all text-purple-400">
                        {parseFloat(monBalance).toLocaleString("en-US", { maximumFractionDigits: 3 })} <span className="text-zinc-400">MON</span>
                      </CardTitle>
                    </div>
                    <div className="flex-1">
                      <CardDescription className="text-zinc-400">Total Transactions</CardDescription>
                      <CardTitle className="text-2xl font-semibold tabular-nums break-all text-purple-400">
                        {txCount ? ethers.formatUnits(txCount, 0) : "0"}
                      </CardTitle>
                    </div>
                  </div>
                </div>
              )}
              {tab === "Staking" && (
                <div className="w-full flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {lstBalances.length === 0 && <span className="text-zinc-400">No staking tokens found.</span>}
                    {lstBalances.map((balance) => (
                      <div key={balance.symbol} className="flex-1 min-w-[120px]">
                        <CardDescription className="text-zinc-400">{balance.symbol} <a href={`https://testnet.monadexplorer.com/token/${balance.address}`} target="_blank"><LiaExternalLinkAltSolid className="inline-block text-purple-400" /></a></CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums break-all text-purple-400">
                          {parseFloat(balance.balance).toLocaleString("en-US", { maximumFractionDigits: 3 })}
                        </CardTitle>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tab === "Tokens" && (
                <div className="w-full flex flex-col gap-4">
                    {balances.length === 0 && <span className="text-zinc-400">No tokens found.</span>}
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
    </main>
 )
}