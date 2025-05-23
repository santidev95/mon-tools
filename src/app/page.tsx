"use client";

import ToolCard from "@/components/ToolCard";
import MonToolsOS from "@/components/os/MonToolsOS";
import { HoverBorderGradient } from "@/components/ui/hoverBoardGradient";
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
        <HoverBorderGradient
          onClick={handleTryOS}
          as="button"
          containerClassName="mb-2"
        >
          Click & Try MonTools OS 🚀
        </HoverBorderGradient>
        <span className="text-gray-500 text-sm">A new navigation experience for your tools</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <ToolCard
          title="Your Portfolio (soon)"
          description="See your address portfolio"
          href="/portfolio"
          active={false}
        />
        <ToolCard
          title="MonBridge (soon)"
          description="Bridge in Multichains"
          href="/portfolio"
          active={false}
        />
        <ToolCard
          title="MonSwap"
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
      </div>
    </main>
  );
}
