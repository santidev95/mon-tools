import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import LayoutClient from "@/components/LayoutClient";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MonTools",
  description: "MonTools is a modern, modular, and open-source web platform designed to streamline interactions on the Monad Testnet",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "MonTools",
    description: "MonTools is a modern, modular, and open-source web platform designed to streamline interactions on the Monad Testnet",
    url:"https://montools.xyz/",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",      
      },
    ]
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en">
      <head>
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9940089922871413"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LayoutClient cookies={cookies}>{children}</LayoutClient>
      </body>
    </html>
  );
}
