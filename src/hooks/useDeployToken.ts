// src/hooks/useDeployToken.ts
import { useAccount, useWriteContract } from 'wagmi';
import { FACTORY_ABI, FACTORY_ADDRESS } from '@/constants/factory';
import { parseUnits } from 'viem/utils';
import { TokenProfile } from '@/constants/presets';

export function useDeployToken() {
  const { address: owner } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  async function deployToken({
    profile,
    name,
    symbol,
    supply,
    cap,
  }: {
    profile: TokenProfile;
    name: string;
    symbol: string;
    supply: string;
    cap?: string;
  }) {
    if (!owner) throw new Error("Wallet not connected");

    const args = [
      profile,
      name,
      symbol,
      parseUnits(supply, 18),
      parseUnits(cap || '0', 18),
      owner,
    ] as const;

    const hash = await writeContractAsync({
      abi: FACTORY_ABI,
      address: FACTORY_ADDRESS,
      functionName: 'createToken',
      args,
    });

    return hash;
  }

  return { deployToken, isPending };
}
