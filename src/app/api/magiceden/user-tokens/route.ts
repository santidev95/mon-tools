import { NextResponse } from "next/server";

const API_URL = "https://api-mainnet.magiceden.dev/v3/rtp/monad-testnet/users";
const API_KEY = "d79f52a1-1a8c-42a0-9d6b-7afaf5a6e54c";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet");
  const limit = searchParams.get("limit") || "20";
  const continuation = searchParams.get("continuation");

  if (!wallet) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
  }

  const params = new URLSearchParams({
    normalizeRoyalties: "false",
    sortBy: "acquiredAt",
    sortDirection: "desc",
    limit,
    includeTopBid: "false",
    includeAttributes: "false",
    includeLastSale: "false",
    includeRawData: "false",
    filterSpamTokens: "true",
    useNonFlaggedFloorAsk: "false",
  });

  if (continuation) {
    params.append("continuation", continuation);
  }

  const url = `${API_URL}/${wallet}/tokens/v7?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      console.warn("Magic Eden user tokens API error:", response.status);
      return NextResponse.json({ error: "Failed to fetch user tokens" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching user tokens:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 