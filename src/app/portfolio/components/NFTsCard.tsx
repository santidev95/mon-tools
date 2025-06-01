import React from 'react';
import Image from "next/image";
import { Loader2 } from "lucide-react";
import {
    Card,
    CardHeader,
} from "@/components/ui/card";
import { MagicEdenToken } from "@/lib/clients/magicEdenClient";

interface NFTsCardProps {
    nfts: MagicEdenToken[] | null;
    continuation: string | null;
    loadingMore: boolean;
    loadMoreRef: React.RefObject<HTMLDivElement | null>;
}

export function NFTsCard({ nfts, continuation, loadingMore, loadMoreRef }: NFTsCardProps) {
    return (
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
                                        nft.token.media.toLowerCase().endsWith('.mp4') ? (
                                            <video
                                                src={nft.token.media}
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
    );
} 