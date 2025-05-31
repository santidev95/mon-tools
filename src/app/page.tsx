"use client";

import ToolCard from "@/components/ToolCard";
import MonToolsOS from "@/components/os/MonToolsOS";
import { useRouter } from "next/navigation";

const useOSLayout = process.env.NEXT_PUBLIC_USE_OS_LAYOUT === "true";

export default function HomePage() {
  const router = useRouter();

  if (useOSLayout) {
    return <MonToolsOS />;
  }

  // Function to "activate" the OS (now redirects to /os)
  const handleTryOS = () => {
    router.push("/os");
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col items-center mb-8">       
        <button onClick={handleTryOS} className="mb-2 relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
          Click & Try MonTools OS 🚀
          </span>
        </button>
        <span className="text-indigo-300 text-sm">Explore a visual shell experience to navigate your tools faster</span>       
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <ToolCard
          title="Your Portfolio (soon)"
          description="See your address portfolio"
          href="/portfolio"
          active={true}
        />
        <ToolCard
          title="MonBridge (soon)"
          description="Bridge in Multichains"
          href="/bridge"
          active={false}
        />        
        <ToolCard
          title="Swap"
          description="Swap in tokens in Monad"
          href="/swap"
          active={true}
        />
        <ToolCard
          title="ERC-20 Token Deployer"
          description="Deploy your customized ERC-20 token"
          href="/deployer"
          active={true}
        />
        <ToolCard
          title="ERC-20 Inspector"
          description="Inspect an ERC-20 token's details"
          href="/erc20"
          active={true}
        />
        <ToolCard
          title="NFT Inspector"
          description="Details of any NFT collection"
          href="/nft"
          active={true}
        />
        <ToolCard
          title="Token Bulk Transfer"
          description="Send a token amount to multiple wallets"
          href="/bulktransfer"
          active={true}
        />
        <ToolCard
          title="Merkle Root Generator"
          description="Generate a merkle root and proofs"
          href="/merklegenerate"
          active={true}
        />
        <ToolCard
          title="Monad Real-Time Transactions"
          description="See the latest transactions on Monad"
          href="https://monad-tx-viewer.vercel.app"
          active={true}
          blank={true}
        />
      </div>
    </main>
  );
}
