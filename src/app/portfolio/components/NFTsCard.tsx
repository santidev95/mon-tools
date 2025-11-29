import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { Loader2, ExternalLink } from "lucide-react";
import { MagicEdenToken } from "@/lib/clients/magicEdenClient";
import Link from "next/link";

interface NFTsCardProps {
    nfts: MagicEdenToken[] | null;
    continuation: string | null;
    loadingMore: boolean;
    onLoadMoreRefReady: (element: HTMLDivElement | null) => void;
}

// Custom Image component with error handling
function NFTImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    if (hasError) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                <span className="text-zinc-600">Image failed to load</span>
            </div>
        );
    }

    return (
        <>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                    <Loader2 className="animate-spin text-purple-400 w-6 h-6" />
                </div>
            )}
            <Image
                src={src}
                alt={alt}
                fill
                className={className}
                onError={() => setHasError(true)}
                onLoad={() => setIsLoading(false)}
                unoptimized={true} // Bypass Next.js optimization for external URLs with CORS issues
            />
        </>
    );
}

export function NFTsCard({ nfts, continuation, loadingMore, onLoadMoreRefReady }: NFTsCardProps) {
    // Clear the ref when there's no continuation
    useEffect(() => {
        if (!continuation) {
            onLoadMoreRefReady(null);
        }
    }, [continuation, onLoadMoreRefReady]);

    return (
        <div className="w-full max-w-5xl rounded-xl border border-white/10 bg-gradient-to-r from-purple-800/60 via-blue-800/60 to-blue-900/60 backdrop-blur-md p-6 mb-2">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-xl font-bold text-purple-400 mb-4">NFTs</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nfts?.map((nft) => (
                    <div key={`${nft.token.contract}-${nft.token.tokenId}`} className="bg-zinc-800/50 border border-purple-800/30 group relative rounded-lg p-4 flex flex-col transition-colors">
                        <div className="w-[200px] h-[200px] mx-auto relative overflow-hidden rounded-lg aspect-square">
                            {nft.token.image ? (
                                <NFTImage
                                    src={nft.token.image}
                                    alt={nft.token.name}
                                    className="object-cover transition-transform group-hover:scale-110"
                                />
                            ) : nft.token.media ? (
                                nft.token.media.toLowerCase().endsWith('.mp4') ? (
                                    <video
                                        src={nft.token.media}
                                        className="w-full h-full object-cover"
                                        controls
                                        loop
                                        muted
                                        autoPlay
                                        playsInline
                                    />
                                ) : (
                                    <NFTImage
                                        src={nft.token.media}
                                        alt={nft.token.name}
                                        className="object-cover transition-transform group-hover:scale-110"
                                    />
                                )
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                    <span className="text-zinc-600">No media</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                                <h3 className="text-white font-bold text-center mb-2 drop-shadow-md" style={{textShadow: '0 2px 8px #000, 0 0px 2px #000'}}>{nft.token.name}</h3>
                                <p className="text-white/80 text-sm text-center mb-4 drop-shadow-md" style={{textShadow: '0 2px 8px #000, 0 0px 2px #000'}}>{nft.token.collection.name}</p>
                                {nft.token.collection.floorAskPrice && (
                                    <p className="text-white/80 text-sm mb-4 drop-shadow-md" style={{textShadow: '0 2px 8px #000, 0 0px 2px #000'}}>
                                        Floor: {nft.token.collection.floorAskPrice.amount.decimal} {nft.token.collection.floorAskPrice.currency.symbol}
                                    </p>
                                )}
                                <Link 
                                    href={`https://magiceden.io/collections/monad/${nft.token.contract}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors drop-shadow-md"
                                    style={{textShadow: '0 2px 8px #000, 0 0px 2px #000'}}
                                >
                                    <span>View on Magic Eden</span>
                                    <ExternalLink className="w-4 h-4" />
                                </Link>
                            </div>
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
                    </div>
                ))}
            </div>
            {!nfts && (
                <div className="text-center py-8">
                    <p className="text-zinc-400">Loading NFTs...</p>
                </div>
            )}
            {nfts?.length === 0 && (
                <div className="flex items-center justify-center py-10">
                    <div className="w-full max-w-3xl bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Image src="/monad_white.png" alt="Monad" width={120} height={28} />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-purple-300 mb-4">Mainnet Soon.</h2>
                       
                    </div>
                </div>
            )}
            {continuation && (
                <div 
                    ref={onLoadMoreRefReady} 
                    className="h-20 flex items-center justify-center mt-4"
                >
                    {loadingMore ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="animate-spin text-purple-400 w-6 h-6" />
                            <span className="text-zinc-400 text-sm">Loading more NFTs...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-zinc-400 text-sm">Scroll for more</span>
                            <div className="w-8 h-1 bg-purple-400/30 rounded"></div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 