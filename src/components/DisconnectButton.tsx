"use client";
import { useDisconnect } from "@reown/appkit/react";

export function DisconnectButton() {
  const { disconnect } = useDisconnect();

  return (
    <button
      onClick={() => disconnect()}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      Desconectar
    </button>
  );
}
