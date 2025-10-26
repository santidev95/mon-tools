"use client";
import { usePathname } from "next/navigation";
import ContextProvider from "@/context";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { FaXTwitter, FaBook } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { StickyBanner } from "./ui/Banner";
import { bannerConfig } from "@/config/banner";

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
        {!hideNavAndFooter && (
          <>
            <StickyBanner config={bannerConfig} />
            <Header />
          </>
        )}
        <main className="flex-1">{children}
        </main>
        <Toaster position="bottom-center" />
        {!hideNavAndFooter && (         
          <Footer />
        )}
      </div>
    </ContextProvider>
  );
} 