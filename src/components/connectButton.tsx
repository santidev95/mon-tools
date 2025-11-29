"use client";

import { useAppKit, useAppKitAccount, useAppKitBalance } from "@reown/appkit/react";
import { allDomainsClient } from "@/lib/clients/allDomains";
import { useEffect, useState } from "react";
import { ClipLoader } from 'react-spinners';

function formatAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export default function ConnectButton() {
  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount();
  const [mainDomain, setMainDomain] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const { fetchBalance } = useAppKitBalance();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (address) {
      setLoading(true);
      const fetchMainDomain = async () => {
        const domain = await allDomainsClient.getMainDomain(address);
        setMainDomain(domain ? `${domain.domain_name}${domain.tld}` : address);
      };
      const fetchWalletBalance = async () => {
        const balance = await fetchBalance();
        setBalance(Number(balance.data?.balance) || 0);
      };
      Promise.all([fetchWalletBalance(), fetchMainDomain()]).finally(() => setLoading(false));
    }
  }, [isConnected]);

  useEffect(() => {
    if (!isConnected) {
        setMainDomain(null);
    }
  }, [isConnected]);

  return (
    <button
      onClick={() => {
        open({ view: isConnected ? "Account" : "Connect" });
      }}
      style={{
        backgroundColor: isConnected ? "#000000" : "#c084fc",
        color: isConnected ? "#c084fc" : "#000000",
        padding: "6px 15px",
        border: isConnected ? "2px solid #c084fc" : "none",
        borderRadius: "50px",
        fontSize: "15px",
        fontFamily: "monospace",
        cursor: "pointer",
      }}
    >
      {isConnected ? (
        loading ? <ClipLoader color="#c084fc" size={15} />:
        <div style={{   
          display: "flex", 
          alignItems: "center" 
        }}>
          <span style={{ marginRight: "12px", fontSize: "15px" }}>{mainDomain ? mainDomain : address ? formatAddress(address) : ""}</span>
          <span>{balance?.toFixed(2)} MON</span>
        </div>
      ) : (
        "Connect Wallet"
      )}
    </button>
  );
}