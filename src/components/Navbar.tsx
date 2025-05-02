"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import ConnectButton from "./connectButton";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-zinc-950 text-gray-200 px-6 py-2 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo compacta + nome (opcional) */}
        <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={70} height={70} />
            <span className="text-base font-bold text-purple-400 font-mono">
                Monadic Tools
            </span>
        </div>

        {/* Menu desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <ConnectButton />
        </div>

        {/* Botão mobile */}
        <button
          className="md:hidden text-purple-400"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="md:hidden mt-3 space-y-2">
          <ConnectButton />
        </div>
      )}
    </nav>
  );
}
