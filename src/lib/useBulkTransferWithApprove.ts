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

const BULK_TRANSFER_ADDRESS = "0x78f80583c6d78B46c6558EA0b35Bf284E0F9D380";
const MULSEEND_CONTRACT: `0x${string}` = "0x1B403f2382E6efb87eA415e28cD55F89C2faF19f";

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
      // Monta o calldata: cada endereço 20 bytes, sem prefixo 0x
      const calldata = ("0x" + recipients.map(addr => addr.slice(2)).join("")) as `0x${string}`;
      // Valor total em wei
      const parsedAmount = parseEther(amountEach);
      const totalValue = parsedAmount * BigInt(recipients.length);
      // Envia UMA transação para o contrato Mulsend
      const txHash = await walletClient.sendTransaction({
        to: MULSEEND_CONTRACT as `0x${string}`,
        data: calldata,
        value: totalValue,
      });
      return String(txHash);
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
