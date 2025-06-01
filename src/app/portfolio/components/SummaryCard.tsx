import React from 'react';

interface SummaryCardProps {
    monBalance: string;
    txCount: bigint | null;
    balances: any[];
    lstBalances: any[];
}

export function SummaryCard({ monBalance, txCount, balances, lstBalances }: SummaryCardProps) {
    return (
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
    );
} 