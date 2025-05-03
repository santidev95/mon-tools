import ToolCard from "@/components/ToolCard";

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <ToolCard
          title="ERC-20 tool"
          description="Inspect a ERC-20 token details"
          href="/erc20"
        />
        <ToolCard
          title="NFT Inspector"
          description="Details of any NFT collection"
          href="/nft"
        />
        <ToolCard
          title="Token Bulk Transfer"
          description="Send a token amount to multiple wallets"
          href="/bulktransfer"
        />        
      </div>
    </main>
  );
}
