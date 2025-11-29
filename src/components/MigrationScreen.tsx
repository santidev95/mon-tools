'use client'

import { Rocket, Loader2, Sparkles } from "lucide-react"

export default function MigrationScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1333] via-[#2d1e5e] to-[#393bb2] p-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
        {/* Animated Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 p-6 rounded-full">
              <Rocket className="h-16 w-16 text-white animate-bounce" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            MonTools is Migrating
          </h1>
          <div className="flex items-center justify-center gap-2 text-purple-300">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <p className="text-xl md:text-2xl font-semibold">
              To Monad Mainnet
            </p>
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
        </div>

        {/* Message */}
        <div className="bg-black/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 space-y-4">
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
            We're working hard to bring MonTools to Monad mainnet!
          </p>
          <p className="text-base md:text-lg text-gray-300">
            Our platform will be available soon with all features 
            optimized for the mainnet.
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex items-center justify-center gap-2 text-purple-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm md:text-base font-medium">
            Preparing the best experience...
          </span>
        </div>
      </div>
    </div>
  )
}

