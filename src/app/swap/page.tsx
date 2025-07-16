"use client";

import dynamic from "next/dynamic";

// Dynamically import Swap component to reduce initial bundle size
const Swap = dynamic(() => import("@/components/Swap"), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mb-4"></div>
        <p>Loading Swap Interface...</p>
      </div>
    </div>
  ),
  ssr: false
});

export default function SwapPage() {
  return <Swap />;
}
