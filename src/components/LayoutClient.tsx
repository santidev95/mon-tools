"use client";
import { usePathname } from "next/navigation";
import ContextProvider from "@/context";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { FaXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";

export default function LayoutClient({ children, cookies }: { children: React.ReactNode; cookies: string | null }) {
  const pathname = usePathname();
  const hideNavAndFooter = pathname.startsWith("/os");
  const gradientBg =
    !hideNavAndFooter
      ? "bg-gradient-to-br from-[#1a1333] via-[#2d1e5e] to-[#393bb2]"
      : "";

  return (
    <ContextProvider cookies={cookies}>
      <div className={`relative flex flex-col min-h-screen ${gradientBg}`}>
        {!hideNavAndFooter && <Navbar />}
        <main>{children}</main>
        <Toaster position="bottom-center" />
        {!hideNavAndFooter && (
          <footer className="w-full text-center text-sm py-2 absolute bottom-0">
            <span className="text-indigo-300 font-mono flex items-center justify-center gap-2">    
              <a href="https://github.com/SantiSjp/mon-tools" target="_blank" rel="noopener noreferrer">
                  <FaGithub className="text-indigo-300" />  
              </a>          
              <a href="https://x.com/montools_xyz" target="_blank" rel="noopener noreferrer">
                <FaXTwitter className="text-indigo-300" />  
              </a>              
              <span className="text-indigo-300">| Built by</span>
              <a href="https://x.com/gabriell_santi" target="_blank" rel="noopener noreferrer">
               <strong>Santi</strong>
              </a>              
            </span>
          </footer>
        )}
      </div>
    </ContextProvider>
  );
} 