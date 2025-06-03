import { createPublicClient, formatEther, http } from 'viem';
import { monadTestnet } from 'viem/chains';

const ENVIO_RPC_KEY = process.env.ENVIO_RPC_KEY;
const ENVIO_RPC_URL = `https://monad-testnet.rpc.hypersync.xyz/${ENVIO_RPC_KEY}`;

export const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(ENVIO_RPC_URL),
});

export const monadClient = createPublicClient({
  chain: monadTestnet,
  transport: http(monadTestnet.rpcUrls.default.http[0]),
}) as any;