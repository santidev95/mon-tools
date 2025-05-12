"use client";
import { useEffect, useState } from "react";
import ConnectButton from "../connectButton";

export default function Taskbar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setTime(formatted);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-0 w-full h-10 bg-black border-t-2 border-black flex justify-between items-center px-4 text-xs text-purple-300 font-mono">
      <div className="h-10 flex items-center mr-2">
        <ConnectButton />
      </div>
      {time}
    </div>
  );
}
