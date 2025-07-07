"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Terminal } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()
  return (
    <section className="py-12 text-center md:py-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 text-transparent bg-clip-text">
            Monad Tools
          </span>{" "}
          for the Community
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Explore a visual shell experience to navigate your blockchain tools faster and more efficiently
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Button
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-8 py-6 text-lg"
              onClick={() => router.push("/os")}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Terminal className={`h-5 w-5 transition-transform duration-300 ${isHovered ? "rotate-12" : ""}`} />
                Click & Try MonTools OS
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
          </motion.div>

          <Button
            variant="outline"
            size="lg"
            className="border-purple-500 text-purple-300 hover:text-white hover:bg-purple-950/50 px-8 py-6 text-lg bg-transparent"
            onClick={() => router.push("https://montools.xyz/docs")}
          >
            View Documentation
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
