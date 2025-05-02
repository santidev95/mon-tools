import { useWalletClient } from "wagmi";
import { parseUnits, parseEther, type Abi } from "viem";

const ERC20_ABI: Abi = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ type: "bool" }]
  }
];

export function useBulkErc20Transfer() {
  const { data: walletClient } = useWalletClient();

  const sendTransfers = async (
    tokenAddress: `0x${string}` | "native",
    decimals: number,
    recipients: { to: string; amount: string }[]
  ) => {
    if (!walletClient) throw new Error("Wallet not connected");

    for (const { to, amount } of recipients) {
      const parsedAmount =
        tokenAddress === "native"
          ? parseEther(amount)
          : parseUnits(amount, decimals);

      if (tokenAddress === "native") {
        await walletClient.sendTransaction({
          to: to as `0x${string}`,
          value: parsedAmount,
        });
      } else {
        await walletClient.writeContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [to, parsedAmount],
        });
      }
    }
  };

  return { sendTransfers };
}
