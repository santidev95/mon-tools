'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MoveRight, Rocket, BarChart2, Clock, Zap, Search, Share2, GitMerge, Layers, Hexagon } from "lucide-react"
import { HeroSection } from "@/components/HeroSection"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-950 to-slate-900">      
      <main className="container mx-auto px-4 py-8 flex-1">
        
        
        <HeroSection />
        
        
        <Tabs defaultValue="portfolio" className="mt-12">
          <TabsList className="flex w-full overflow-x-auto no-scrollbar mb-8 gap-2 sm:grid sm:grid-cols-3 min-w-0">
            <TabsTrigger value="portfolio" className="text-xs whitespace-nowrap px-2 py-1 min-w-[120px]">Portfolio & Analysis</TabsTrigger>
            <TabsTrigger value="tokens" className="text-xs whitespace-nowrap px-2 py-1 min-w-[120px]">Token Tools</TabsTrigger>
            <TabsTrigger value="nfts" className="text-xs whitespace-nowrap px-2 py-1 min-w-[120px]">NFTs & Interoperability</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FeatureCard
                title="Your Portfolio"
                description="See your address portfolio"
                icon={<Hexagon className="h-5 w-5" />}
                gradient="from-violet-500 to-purple-500"
                href="/portfolio"
              />
              <FeatureCard
                title="Monad Analytics"
                description="See analytics on Monad"
                icon={<BarChart2 className="h-5 w-5" />}
                gradient="from-fuchsia-500 to-pink-500"
                href="https://analytics.montools.xyz"               
              />
              <FeatureCard
                title="Monad Real-Time Transactions"
                description="See the latest transactions on Monad"
                icon={<Clock className="h-5 w-5" />}
                gradient="from-purple-500 to-indigo-500"
                href="https://monad-tx-viewer.vercel.app"
              />
            </div>
          </TabsContent>

          <TabsContent value="tokens" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FeatureCard
                title="ERC-20 Token Deployer"
                description="Deploy your customized ERC-20 token"
                icon={<Rocket className="h-5 w-5" />}
                gradient="from-cyan-500 to-blue-500"
                href="/deployer"
              />
              <FeatureCard
                title="ERC-20 Inspector"
                description="Inspect an ERC-20 token's details"
                icon={<Search className="h-5 w-5" />}
                gradient="from-blue-500 to-indigo-500"
                href="/erc20"
              />
              <FeatureCard
                title="Token Bulk Transfer"
                description="Send a token amount to multiple wallets"
                icon={<Share2 className="h-5 w-5" />}
                gradient="from-indigo-500 to-violet-500"
                href="/bulktransfer"
              />
              <FeatureCard
                title="Merkle Root Generator"
                description="Generate a merkle root and proofs"
                icon={<GitMerge className="h-5 w-5" />}
                gradient="from-violet-500 to-purple-500"
                href="/merklegenerate"
              />
            </div>
          </TabsContent>

          <TabsContent value="nfts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FeatureCard
                title="NFT Inspector"
                description="Details of any NFT collection"
                icon={<Layers className="h-5 w-5" />}
                gradient="from-amber-500 to-orange-500"
                href="/nft"
              />
              <FeatureCard
                title="Swap"
                description="Swap in tokens in Monad"
                icon={<Zap className="h-5 w-5" />}
                gradient="from-orange-500 to-red-500"
                href="/swap"
              />
              <FeatureCard
                title="MonBridge (soon)"
                description="Bridge to Multichain"
                icon={<GitMerge className="h-5 w-5" />}
                gradient="from-gray-500 to-slate-500"
                soon={true}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function FeatureCard({ title, description, icon, gradient, soon = false, href }: { title: string; description: string; icon: React.ReactNode; gradient: string; soon?: boolean; href?: string }) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-black/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
      <div className={`h-1 w-full bg-gradient-to-r ${gradient}`}></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold text-white">{title}</CardTitle>
        <div className={`p-2 rounded-full bg-gradient-to-r ${gradient}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-300">{description}</CardDescription>
        <div className="mt-4 flex items-center justify-between">
          {soon ? (
            <Badge variant="outline" className="text-gray-400 border-gray-700">
              Coming Soon
            </Badge>
          ) : href ? (
            <Link href={href}>
              <Button variant="ghost" className="text-white hover:text-purple-300 p-0 flex items-center gap-2">
                Explore <MoveRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Button variant="ghost" className="text-white hover:text-purple-300 p-0 flex items-center gap-2" disabled>
              Explore <MoveRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
