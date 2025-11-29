"use client";
import { useState } from "react";
import AppIcon from "./AppIcon";
import OSWindow from "./OSWindow";
import Taskbar from "./Taskbar";
import TokenInspectorApp from "./apps/TokenInspectorApp";
import BulkTransferApp from "./apps/BulkTransferApp";
import MerkleToolApp from "./apps/MerkleToolApp";
import CollectionInspectorApp from "./apps/CollectionInspectorApp";
import SwapApp from "./apps/SwapApp";


type MonToolsOSProps = {
  backgroundImage?: string;
};

export default function MonToolsOS({ backgroundImage = "/back.png" }: MonToolsOSProps) {
  const [openApps, setOpenApps] = useState<{ [key: string]: boolean }>({
    inspector: false,
    bulktransfer: false,
    merkle: false,
    nft: false,
    swap: false,
  });

  const openApp = (app: string) =>
    setOpenApps((prev) => ({ ...prev, [app]: true }));

  const closeApp = (app: string) =>
    setOpenApps((prev) => ({ ...prev, [app]: false }));

  return (
    <div
      className="h-screen w-screen bg-no-repeat bg-center bg-cover relative overflow-hidden font-mono"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Ícones no Desktop */}
      <div className="absolute top-4 left-4 flex flex-col gap-4">        
        <AppIcon
          label="Token Inspector"
          icon="/logo.png"
          onClick={() => openApp("inspector")}
        />
        <AppIcon
          label="Bulk Transfer"
          icon="/logo.png"
          onClick={() => openApp("bulktransfer")}
        />      
        <AppIcon
          label="Merkle Tool"
          icon="/logo.png"
          onClick={() => openApp("merkle")}
        />
        <AppIcon
          label="NFT Inspector"
          icon="/logo.png"
          onClick={() => openApp("nft")}
        />
        <AppIcon
          label="Swap"
          icon="/logo.png"
          onClick={() => openApp("swap")}
        />
      </div>

      {/* Janelas */}
      {openApps.inspector && (
        <OSWindow
          title="Token Inspector"
          onClose={() => closeApp("inspector")}
          defaultSize={{ width: 360, height: 300 }} // 💡 NOVO: define tamanho ideal
        >
          <TokenInspectorApp />
        </OSWindow>
      )}

      {openApps.bulktransfer && (
        <OSWindow
          title="Bulk Transfer"
          onClose={() => closeApp("bulktransfer")}
          defaultSize={{ width: 800, height: 750 }}
        >
          <BulkTransferApp />
        </OSWindow>
      )}     

      {openApps.merkle && (
        <OSWindow
          title="Merkle Proof Tool"
          onClose={() => closeApp("merkle")}
          defaultSize={{ width: 600, height: 700 }}
        >
          <MerkleToolApp />
        </OSWindow>
      )}

      {openApps.nft && (
        <OSWindow
          title="NFT Inspector"
          onClose={() => closeApp("nft")}
          defaultSize={{ width: 400, height: 520 }}
        >
          <CollectionInspectorApp />
        </OSWindow>
      )}

      {openApps.swap && (
        <OSWindow
          title="Token Swap"
          onClose={() => closeApp("swap")}
          defaultSize={{ width: 1000, height: 750 }}
        >
          <SwapApp />
        </OSWindow>
      )}

      {/* Barra de Tarefas */}
      <Taskbar />
    </div>
  );
}
