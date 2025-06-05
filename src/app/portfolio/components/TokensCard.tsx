import React from 'react';
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { TokenBalance } from "@/lib/clients/monorail/dataApi";

interface TokensCardProps {
    balances: TokenBalance[];
}

export function TokensCard({ balances }: TokensCardProps) {
    const categories = Array.from(new Set(balances.flatMap(b => b.categories)))
        .sort((a, b) => {
            if (a === "native") return -1;
            if (b === "native") return 1;
            return a.localeCompare(b);
        });

    return (
        <div className="w-full max-w-5xl rounded-xl border border-white/10 bg-gradient-to-r from-purple-800/60 via-blue-800/60 to-blue-900/60 backdrop-blur-md p-6 mb-2">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-xl font-bold text-purple-400 mb-4">Tokens Owned</h1>
            </div>
            {balances.length > 0 ? (
                <div className="w-full space-y-8">
                    {categories.map(category => {
                        const categoryTokens = balances.filter(b => b.categories.includes(category));
                        return (
                            <div key={category} className="space-y-3">
                                <div className="text-fuchsia-400 text-lg font-semibold capitalize mb-2">
                                    {category}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {categoryTokens.map((balance) => (
                                        <div
                                            key={balance.symbol}
                                            className="bg-zinc-800/50 border border-purple-800/30 hover:border-purple-500/50 rounded-lg p-4 flex flex-col transition-colors"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-zinc-400 font-medium">{balance.symbol}</span>
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
                                            <span
                                                className={`text-2xl font-semibold tabular-nums break-all mt-2 ${
                                                    parseFloat(balance.balance) <= 0.00001 ? "text-red-400" : "text-green-400"
                                                }`}
                                            >
                                                {parseFloat(balance.balance).toLocaleString("en-US", { maximumFractionDigits: 6 })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8">
                    <span className="text-zinc-400">No tokens found.</span>
                </div>
            )}
        </div>
    );
} 