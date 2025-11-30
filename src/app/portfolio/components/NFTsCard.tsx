import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { Loader2, ExternalLink } from "lucide-react";
import { UserCollectionV4 } from "@/lib/clients/magicEdenClient";
import Link from "next/link";

interface NFTsCardProps {
    collections: UserCollectionV4[] | null;
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

export function NFTsCard({ collections }: NFTsCardProps) {
    return (
        <div className="w-full max-w-5xl rounded-xl border border-white/10 bg-gradient-to-r from-purple-800/60 via-blue-800/60 to-blue-900/60 backdrop-blur-md p-6 mb-2">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-xl font-bold text-purple-400 mb-4">NFTs</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {collections?.map((collection) => (
                    <div key={collection.id} className="bg-zinc-800/50 border border-purple-800/30 group relative rounded-lg p-4 flex flex-col transition-colors">
                        <div className="w-[200px] h-[200px] mx-auto relative overflow-hidden rounded-lg aspect-square">
                            {collection.media?.url ? (
                                <NFTImage
                                    src={collection.media.url}
                                    alt={collection.name}
                                    className="object-cover transition-transform group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                    <span className="text-zinc-600">No media</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                                <h3 className="text-white font-bold text-center mb-2 drop-shadow-md" style={{textShadow: '0 2px 8px #000, 0 0px 2px #000'}}>{collection.name}</h3>
                                {collection.description && (
                                    <p className="text-white/80 text-sm text-center mb-2 drop-shadow-md line-clamp-2" style={{textShadow: '0 2px 8px #000, 0 0px 2px #000'}}>{collection.description}</p>
                                )}
                                <p className="text-white/80 text-sm mb-2 drop-shadow-md" style={{textShadow: '0 2px 8px #000, 0 0px 2px #000'}}>
                                    Owned: {collection.ownedCount}
                                </p>
                                {collection.listedCount > 0 && (
                                    <p className="text-white/80 text-sm mb-4 drop-shadow-md" style={{textShadow: '0 2px 8px #000, 0 0px 2px #000'}}>
                                        Listed: {collection.listedCount}
                                    </p>
                                )}
                                <Link 
                                    href={`https://magiceden.io/collections/monad/${collection.chainData?.contract || collection.id}`}
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
                                {collection.name}
                            </h3>
                            {collection.verification && (
                                <p className="text-xs text-green-400 mt-1">
                                    {collection.verification}
                                </p>
                            )}
                            <p className="text-xs text-zinc-400 mt-1">
                                Owned: {collection.ownedCount}
                            </p>
                            {collection.listedCount > 0 && (
                                <p className="text-xs text-zinc-400 mt-1">
                                    Listed: {collection.listedCount}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {!collections && (
                <div className="text-center py-8">
                    <p className="text-zinc-400">Loading NFTs...</p>
                </div>
            )}
            {collections?.length === 0 && (
                <div className="flex items-center justify-center py-10">
                    <div className="w-full max-w-3xl bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Image src="/monad_white.png" alt="Monad" width={120} height={28} />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-purple-300 mb-4">Mainnet Soon.</h2>
                       
                    </div>
                </div>
            )}
        </div>
    );
} 