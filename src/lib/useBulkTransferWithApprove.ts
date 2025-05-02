import { useWalletClient } from "wagmi";
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

  const execute = async (
    token: `0x${string}` | "native",
    decimals: number,
    recipients: string[],
    amountEach: string
  ) => {
    if (!walletClient) throw new Error("Wallet not connected");

    if (token === "native") {
      const parsedAmount = parseEther(amountEach);

      for (const to of recipients) {
        await walletClient.sendTransaction({
          to: to as `0x${string}`,
          value: parsedAmount,
        });
      }

      return;
    }

    // ERC20 logic
    const parsedAmount = parseUnits(amountEach, decimals);
    const totalAmount = parsedAmount * BigInt(recipients.length);

    // Step 1: approve
    await walletClient.writeContract({
      address: token,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [BULK_TRANSFER_ADDRESS, totalAmount]
    });

    // Step 2: call batchTransfer
    await walletClient.writeContract({
      address: BULK_TRANSFER_ADDRESS,
      abi: BULK_TRANSFER_ABI,
      functionName: "batchTransfer",
      args: [token, recipients as `0x${string}`[], parsedAmount]
    });
  };

  return { execute };
}
