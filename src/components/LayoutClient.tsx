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
import MigrationScreen from "./MigrationScreen";

export default function LayoutClient({ children, cookies }: { children: React.ReactNode; cookies: string | null }) {
  const pathname = usePathname();
  const migrationMode = process.env.NEXT_PUBLIC_MIGRATION_MODE === 'true';

  // Show migration screen if migration mode is enabled
  if (migrationMode) {
    return <MigrationScreen />;
  }

  const hideNavAndFooter = pathname.startsWith("/os");
  const gradientBg =
    !hideNavAndFooter
      ? "bg-gradient-to-br from-[#1a1333] via-[#2d1e5e] to-[#393bb2]"
      : "";

  return (
    <ContextProvider cookies={cookies}>
      <div className={`relative flex flex-col min-h-screen ${gradientBg} overflow-x-hidden`}>
        {!hideNavAndFooter && (
          <>
            <StickyBanner config={bannerConfig} />
            <Header />
          </>
        )}
        <main className="flex-1 overflow-x-hidden">{children}
        </main>
        <Toaster position="bottom-center" />
        {!hideNavAndFooter && (         
          <Footer />
        )}
      </div>
    </ContextProvider>
  );
} 