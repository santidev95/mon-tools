import React from 'react';
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { TokenBalance } from "@/lib/clients/monorail/dataApi";
import { TbWorld } from "react-icons/tb";

interface StakingCardProps {
    lstBalances: TokenBalance[];
}

export function StakingCard({ lstBalances }: StakingCardProps) {
    return (
        <div className="w-full max-w-5xl rounded-xl border border-white/10 bg-gradient-to-r from-purple-800/60 via-blue-800/60 to-blue-900/60 backdrop-blur-md p-6 mb-2">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-xl font-bold text-purple-400 mb-4">Staking Positions</h1>
            </div>
            {lstBalances.length > 0 ? (
                <div className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {lstBalances.map((balance) => (
                            <div
                                key={balance.symbol}
                                className="bg-zinc-800/50 border border-purple-800/30 hover:border-purple-500/50 rounded-lg p-4 flex flex-col transition-colors"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-fuchsia-400 font-medium">{balance.symbol}</span>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={
                                                balance.symbol?.toLowerCase().includes('gmon') ? 'https://www.magmastaking.xyz/' :
                                                balance.symbol?.toLowerCase().includes('aprmon') ? 'https://stake.apr.io/' :
                                                balance.symbol?.toLowerCase().includes('shmon') ? 'https://shmonad.xyz/' :
                                                ''
                                            }
                                            target="_blank"
                                            className="text-purple-400 hover:text-purple-300"
                                        >
                                            <TbWorld className="w-4 h-4" />
                                        </a>
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
                                </div>
                                <span className="text-2xl font-semibold tabular-nums break-all text-green-400 mt-2">
                                    {parseFloat(balance.balance).toLocaleString("en-US", { maximumFractionDigits: 3 })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-8">
                    <span className="text-zinc-400">No staking positions found.</span>
                </div>
            )}
        </div>
    );
} 