import { NextRequest, NextResponse } from "next/server";

const API_KEY = "d79f52a1-1a8c-42a0-9d6b-7afaf5a6e54c";

export async function GET(
  req: NextRequest,
  context: any
) {
  const contract  = context?.params?.contract;
  const wallet  = context?.params?.wallet;

  const url = `https://api-mainnet.magiceden.dev/v3/rtp/monad-testnet/users/${wallet}/collections/v3?collection=${contract}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${API_KEY}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return new NextResponse("Magic Eden user collection error", { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Magic Eden user collection proxy error:", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
