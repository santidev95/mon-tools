import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { headers } from "next/headers";
import ContextProvider from "@/context";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function OSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ContextProvider cookies={cookies}>
          <main>{children}</main>
          <Toaster position="bottom-center" />
        </ContextProvider>
      </body>
    </html>
  );
} 