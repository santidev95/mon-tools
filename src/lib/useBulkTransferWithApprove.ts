import { useWalletClient, usePublicClient } from "wagmi";
import { parseUnits, parseEther, type Abi } from "viem";

const ERC20_ABI: Abi = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ type: "bool" }]
  }
];

const BULK_TRANSFER_ABI: Abi = [
  {
    name: "batchTransfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "token", type: "address" },
      { name: "recipients", type: "address[]" },
      { name: "amountEach", type: "uint256" }
    ],
    outputs: []
  }
];

const BULK_TRANSFER_ADDRESS = "0x73Fc1b28F405df9B4B97960F1A0C64C656708524";

export function useBulkTransferWithApprove() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const execute = async (
    token: `0x${string}` | "native",
    decimals: number,
    recipients: string[],
    amountEach: string
  ) => {
    if (!walletClient || !publicClient) throw new Error("Wallet or public client not connected");

    if (token === "native") {
      const parsedAmount = parseEther(amountEach);
      const txHashes: string[] = [];

      for (const to of recipients) {
        const tx = await walletClient.sendTransaction({
          to: to as `0x${string}`,
          value: parsedAmount,
        });
        txHashes.push(tx);
      }

      return txHashes;
    }

    const parsedAmount = parseUnits(amountEach, decimals);
    const totalAmount = parsedAmount * BigInt(recipients.length);

    // Step 1: approve
    const approveHash = await walletClient.writeContract({
      address: token,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [BULK_TRANSFER_ADDRESS, totalAmount],
    });

    // ✅ Espera confirmação do approve
    await publicClient.waitForTransactionReceipt({ hash: approveHash });

    // Step 2: batchTransfer
    const batchTransferHash = await walletClient.writeContract({
      address: BULK_TRANSFER_ADDRESS,
      abi: BULK_TRANSFER_ABI,
      functionName: "batchTransfer",
      args: [token, recipients as `0x${string}`[], parsedAmount],
    });
    return batchTransferHash;
  };

  return { execute };
}