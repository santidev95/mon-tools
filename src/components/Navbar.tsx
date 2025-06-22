"use client";

import { useEffect, useState } from "react";
import ConnectButton from "./connectButton";
import Image from "next/image";
import Link from "next/link";
import { useAppKitAccount } from "@reown/appkit/react";
import { DisconnectButton } from "./DisconnectButton";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); 
  const { isConnected } = useAppKitAccount();

  return (
    <nav className="bg-zinc-950 text-gray-200 px-6 py-2 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo + nome (texto visível apenas no desktop) */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={65} height={65} />
            <span className="hidden md:inline text-base font-bold text-violet-400 font-mono">
              MonTools
            </span>
          </Link>
        </div>

        {/* Connect button - now visible on both mobile and desktop */}
        <div className="flex items-center">
        <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
