import ToolCard from "@/components/ToolCard";

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <ToolCard
          title="Token Inspector"
          description="View details of any Monad ERC20 token"
          href="/token/erc20"
        />
        <ToolCard
          title="NFT Inspector"
          description="View details of any Monad NFT"
          href="/token/nft"
        />
      </div>
    </main>
  );
}
