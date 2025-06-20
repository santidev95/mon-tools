"use client";

import { useEffect, useState } from "react";
import MonToolsOS from "@/components/os/MonToolsOS";

const bootMessages = [
  "Booting MonToolsOS...",
  "Loading base modules...",
  "Verifying smart contract interfaces...",
  "Injecting utility libraries into memory...",
  "Connecting to RPC endpoints...",
  "Mounting token toolchain...",
  "Loading NFT inspection suite...",
  "Spawning Merkle root processes...",
  "Calibrating user dashboard interface...",
  "System ready. Launching MonToolsOS."
];

function LinuxStyleBootScreen({ onFinish }: { onFinish: () => void }) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < bootMessages.length) {
        setVisibleLines((prev) => [...prev, bootMessages[index]]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(onFinish, 1000);
      }
    }, 700);
    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="bg-black text-green-400 font-mono text-sm h-screen w-screen p-4">
      {visibleLines.map((line, idx) => (
        <div key={idx}>{line}</div>
      ))}
    </div>
  );
}

function BootScreen() {
    const [progress, setProgress] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 60); // 60ms × 50 steps = ~3s
  
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-purple-900 text-white font-mono text-sm">
        <img src="/logo.png" alt="Boot Logo" className="w-20 h-20 mb-4" />
        <p className="mb-2">MonToolsOS V1.5.0</p>
        <div className="w-64 h-3 bg-black border border-white">
          <div
            className="h-full bg-purple-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2">Initializing system components...</p>
      </div>
    );
  }
  

export default function OSPage() {
  const [stage, setStage] = useState<"linux" | "loading" | "os">("linux");

  useEffect(() => {
    if (stage === "linux") {
      const linuxBootTime = 700 * bootMessages.length + 1000;
      setTimeout(() => setStage("loading"), linuxBootTime);
    } else if (stage === "loading") {
      const loadingTimeout = setTimeout(() => setStage("os"), 3000);
      return () => clearTimeout(loadingTimeout);
    }
  }, [stage]);

  if (stage === "linux") return <LinuxStyleBootScreen onFinish={() => setStage("loading")} />;
  if (stage === "loading") return <BootScreen />;
  return <MonToolsOS />;
}