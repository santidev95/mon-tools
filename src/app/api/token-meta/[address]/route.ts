import { createClient } from 'redis';
import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, getContract, http } from 'viem';
import { monadTestnet } from 'viem/chains';

const ERC20_ABI = [
  { name: 'symbol', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { name: 'name', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { name: 'decimals', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
];

const viemClient = createPublicClient({
  chain: monadTestnet,
  transport: http("https://monad-testnet.g.alchemy.com/v2/FZhCjyj9iYvSCrnRcV4CcDXKzFrfrp5m"),
});

// Global Redis client with connection pooling
let redisClient: any = null;

async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 1000)
      }
    });
    
    redisClient.on('error', (err: any) => {
      console.error('Redis Client Error:', err);
    });
    
    await redisClient.connect();
  }
  return redisClient;
}

function validateAddress(input: string): `0x${string}` | null {
  if (!input || typeof input !== 'string') {
    return null;
  }
  
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

  try {
    const redis = await getRedisClient();

    // Try to get from cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    // If not in cache, fetch from blockchain
    const contract = getContract({
      address: token,
      abi: ERC20_ABI,
      client: viemClient,
    });

    const [symbol, name, decimals] = await Promise.all([
      contract.read.symbol().catch(() => "UNKNOWN"),
      contract.read.name().catch(() => "Unknown Token"),
      contract.read.decimals().catch(() => 18),
    ]);

    const meta = { symbol, name, decimals };

    // Cache for 7 days
    await redis.set(cacheKey, JSON.stringify(meta), {
      EX: 60 * 60 * 24 * 7,
    });

    return NextResponse.json(meta);
    
  } catch (err: any) {
    console.error("Error fetching or caching token metadata:", err);
    
    // Return a fallback response instead of 500 error
    return NextResponse.json(
      { 
        symbol: "UNKNOWN", 
        name: "Unknown Token", 
        decimals: 18,
        error: "Could not fetch token metadata"
      }, 
      { status: 200 }
    );
  }
}

// Cleanup function for graceful shutdown (should be called in a cleanup handler)
export async function cleanup() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}
