import { createPublicClient, http, getContract } from "viem";
import { monadTestnet } from "viem/chains";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "redis";

const ERC20_ABI = [
  { name: "symbol", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { name: "name", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { name: "decimals", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { name: "balanceOf", type: "function", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }] },
];

const viemClient = createPublicClient({
  chain: monadTestnet,
  transport: http("https://monad-testnet.g.alchemy.com/v2/FZhCjyj9iYvSCrnRcV4CcDXKzFrfrp5m"),
});

const TOKEN_ADDRESSES = [
  "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701",
  "0xaEef2f6B429Cb59C9B2D7bB2141ADa993E8571c3",
  "0x3a98250F98Dd388C211206983453837C8365BDc1",
  "0xe1d2439b75fb9746E7Bc6cB777Ae10AA7f7ef9c5",
  "0x268E4E24E0051EC27b3D27A95977E71cE6875a05",
  "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea",
  "0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D",
  "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37",
  "0xA296f47E8Ff895Ed7A092b4a9498bb13C46ac768",
  "0x0C0c92FcF37Ae2CBCc512e59714Cd3a1A1cbc411",
];

export async function GET(
  req: NextRequest,
  { params }: { params: { address: string } }
) {
  const address = params.address.toLowerCase();
  const redis = createClient();
  await redis.connect();

  try {
    const tokenResults = await Promise.all(
      TOKEN_ADDRESSES.map(async (tokenAddress) => {
        const contract = getContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          client: viemClient,
        });

        const balance = await contract.read.balanceOf([address]) as bigint;
        if (balance === 0n) return null;

        const cacheKey = `token-meta:${tokenAddress}`;
        let meta: any;

        const cached = await redis.get(cacheKey);
        if (cached) {
          meta = JSON.parse(cached);
        } else {
          const [symbol, name, decimals] = await Promise.all([
            contract.read.symbol(),
            contract.read.name(),
            contract.read.decimals(),
          ]);
          meta = { symbol, name, decimals };
          await redis.set(cacheKey, JSON.stringify(meta), { EX: 60 * 60 * 24 * 7 }); // 7 dias
        }

        return {
          address: tokenAddress,
          balance: balance.toString(),
          ...meta,
        };
      })
    );

    const nativeBalance = await viemClient.getBalance({ address: address as `0x${string}` });

    const filteredTokens = tokenResults.filter(Boolean);

    await redis.quit();
    return NextResponse.json({
      address,
      nativeToken: {
        symbol: "MON",
        name: "Monad",
        decimals: 18,
        balance: nativeBalance.toString(),
      },
      tokens: filteredTokens,
    });
  } catch (err) {
    console.error("Wallet profiler error:", err);
    try {
      await redis.quit();
    } catch {}
    return new NextResponse("Erro interno", { status: 500 });
  }
}
