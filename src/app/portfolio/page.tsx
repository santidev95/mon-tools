"use client";

import { useState, useEffect } from "react";
import { usePublicClient, useAccount } from 'wagmi'
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


export default function PortfolioPage() {
    const { address } = useAccount();
    const publicClient = usePublicClient()
    const [monBalance, setMonBalance] = useState<string>("0");
    const [balances, setBalances] = useState<TokenBalance[]>([]);
    const [txCount, setTxCount] = useState<bigint | null>(null);

    useEffect(() => {
        const fetchTxCount = async () => {
          if (!publicClient || !address) return
          try {
            const count = await publicClient.getTransactionCount({ address })
            setTxCount(BigInt(count))
          } catch (err) {
            console.error('Error fetching tx count:', err)
          }
        }
    
        fetchTxCount()
      }, [publicClient, address])
    
    useEffect(() => {
        if (address) {
            getWalletBalances(address).then((balances) => {
                const monBalance = balances.find((balance) => balance.symbol === "MON");
                setMonBalance(monBalance?.balance || "0");
                setBalances(balances);
            });
        }
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

 return (
    <main>
        <div className="flex flex-col items-center justify-center mt-2">
            <h1 className="text-xl font-bold text-purple-400 mb-4">Your Portfolio</h1>
        </div>        
        <div className="flex  items-center justify-center mt-2">
            <Card className="@container/card w-full max-w-md shadow-xl bg-zinc-900 border-purple-800 mr-2">
                <CardHeader className="relative pb-2">
                    <CardDescription className="text-zinc-400">Native Balance</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums break-all">
                        <span className="text-purple-400">{parseFloat(monBalance).toLocaleString(undefined, { maximumFractionDigits: 3 })}</span> <span className="">MON</span>
                    </CardTitle>                    
                </CardHeader>                
            </Card>
            <Card className="@container/card w-full max-w-md shadow-xl bg-zinc-900 border-purple-800">
                <CardHeader className="relative pb-2">
                    <CardDescription className="text-zinc-400">Total Transactions</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums break-all">
                        <span className="text-md text-purple-400">{txCount ? ethers.formatUnits(txCount, 0) : "0"} </span>
                    </CardTitle>                    
                </CardHeader>                
            </Card>
        </div>
    </main>
 )
}