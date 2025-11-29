import { createClient } from 'redis';
import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, getContract, http } from 'viem';
import { monad } from 'viem/chains';

const ERC20_ABI = [
  { name: 'symbol', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { name: 'name', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { name: 'decimals', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
];

const viemClient = createPublicClient({
  chain: monad,
  transport: http("https://monad-mainnet.g.alchemy.com/v2/VfXPhiNTDFhlT8Unne9WW"),
});

function validateAddress(input: string): `0x${string}` | null {
  const cleaned = input.trim().toLowerCase().replace(/^0x/, "");
  if (/^[a-f0-9]{40}$/.test(cleaned)) return `0x${cleaned}` as `0x${string}`;
  return null;
}

export async function GET(
  req: NextRequest,
  context: any
) {
  const address = context?.params?.address;
  const token = validateAddress(address);
  if (!token) {
    return new NextResponse("Invalid address format", { status: 400 });
  }

  const cacheKey = `token-meta:${token}`;

  const redis = createClient({
    url: process.env.REDIS_URL,
  });

  try {
    await redis.connect();

    const cached = await redis.get(cacheKey);
    if (cached) {
      await redis.quit();
      return NextResponse.json(JSON.parse(cached));
    }

    const contract = getContract({
      address: token,
      abi: ERC20_ABI,
      client: viemClient,
    });

    const [symbol, name, decimals] = await Promise.all([
      contract.read.symbol(),
      contract.read.name(),
      contract.read.decimals(),
    ]);

    const meta = { symbol, name, decimals };

    await redis.set(cacheKey, JSON.stringify(meta), {
      EX: 60 * 60 * 24 * 7,
    });

    await redis.quit();
    return NextResponse.json(meta);
  } catch (err: any) {
    console.error("Error fetching or caching token metadata:", err);
    try {
      await redis.quit();
    } catch {}
    return new NextResponse("Internal error", { status: 500 });
  }
}
