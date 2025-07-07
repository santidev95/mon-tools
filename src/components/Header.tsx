"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ConnectButton from "./connectButton"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-900/20 backdrop-blur-lg bg-black/20">
      <div className="flex h-20 items-center justify-between px-4 md:px-10 lg:px-20 xl:px-40">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10">
              <Image src="/logo.png" alt="MonTools Logo" width={40} height={40} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 text-transparent bg-clip-text">
              MonTools
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
        <Link href="/" className="text-sm font-medium text-purple-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/portfolio" className="text-sm font-medium text-purple-300 hover:text-white transition-colors">
            Portfolio
          </Link>
          <Link href="/swap" className="text-sm font-medium text-purple-300 hover:text-white transition-colors">
            Swap
          </Link>             
        </nav>

        <div className="flex items-center gap-4">
          <ConnectButton />

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden border-purple-800 bg-transparent">
                <Menu className="h-5 w-5 text-purple-300" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-slate-900 border-purple-900 w-[85vw] max-w-xs px-4 py-6 overflow-y-auto">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <div className="relative h-8 w-8">
                    <Image src="/logo.png" alt="MonTools Logo" width={32} height={32} />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-violet-300 text-transparent bg-clip-text">
                    MonTools
                  </span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5 text-purple-300" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>
              <nav className="mt-8 flex flex-col gap-4">
                <Link
                  href="#"
                  className="text-base md:text-sm font-medium text-gray-200 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="text-base md:text-sm font-medium text-gray-200 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Tools
                </Link>                
                <ConnectButton />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
