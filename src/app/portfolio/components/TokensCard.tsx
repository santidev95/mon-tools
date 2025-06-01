import React from 'react';
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { TokenBalance } from "@/lib/clients/monorail/dataApi";

interface TokensCardProps {
    balances: TokenBalance[];
}

export function TokensCard({ balances }: TokensCardProps) {
    return (
        <Card className="w-full max-w-5xl shadow-xl bg-zinc-900/50 backdrop-blur-sm border-purple-800/50">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-xl font-bold text-purple-400 mb-4">Tokens Owned</h1>
            </div>
            <CardHeader>
                {balances.length > 0 ? (
                    <div className="w-full space-y-6">
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
    );
} 