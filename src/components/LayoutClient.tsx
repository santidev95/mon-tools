"use client";
import { usePathname } from "next/navigation";
import ContextProvider from "@/context";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

export default function LayoutClient({ children, cookies }: { children: React.ReactNode; cookies: string | null }) {
  const pathname = usePathname();
  const hideNavAndFooter = pathname.startsWith("/os");

  return (
    <ContextProvider cookies={cookies}>
      <div className={`relative flex flex-col min-h-screen`}>
        {!hideNavAndFooter && <Navbar />}
        <main>{children}</main>
        <Toaster position="bottom-center" />
        {!hideNavAndFooter && (
          <footer className="w-full text-center text-sm py-2 absolute bottom-0">
            <span className="text-violet-400 font-mono">
              <a href="https://x.com/gabriell_santi" target="_blank" rel="noopener noreferrer">
                Built by <strong>Santi</strong>
              </a>
            </span>
          </footer>
        )}
      </div>
    </ContextProvider>
  );
} 