"use client";
import { useState } from "react";
import AppIcon from "./AppIcon";
import OSWindow from "./OSWindow";
import Taskbar from "./Taskbar";
import TokenInspectorApp from "./apps/TokenInspectorApp";
import TokenDeployerApp from "./apps/TokenDeployerApp";
import BulkTransferApp from "./apps/BulkTransferApp";
import MerkleToolApp from "./apps/MerkleToolApp";
import CollectionInspectorApp from "./apps/CollectionInspectorApp";
import SwapApp from "./apps/SwapApp";


type MonToolsOSProps = {
  backgroundImage?: string;
};

export default function MonToolsOS({ backgroundImage = "/back.png" }: MonToolsOSProps) {
  const [openApps, setOpenApps] = useState<{ [key: string]: boolean }>({
    deployer: false,
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
          src="/logo.png"
          alt="ERC20 Token Deployer"
          onClick={() => openApp("deployer")}
        />
        <AppIcon
          src="/logo.png"
          alt="Token Inspector"
          onClick={() => openApp("inspector")}
        />
        <AppIcon
          src="/logo.png"
          alt="Bulk Transfer"
          onClick={() => openApp("bulktransfer")}
        />      
        <AppIcon
          src="/logo.png"
          alt="Merkle Tool"
          onClick={() => openApp("merkle")}
        />
        <AppIcon
          src="/logo.png"
          alt="NFT Inspector"
          onClick={() => openApp("nft")}
        />
        <AppIcon
          src="/logo.png"
          alt="Swap"
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
      
      {openApps.deployer && (
        <OSWindow
          title="Token Deployer"
          onClose={() => closeApp("deployer")}
          defaultSize={{ width: 400, height: 500 }}
        >
          <TokenDeployerApp />
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
