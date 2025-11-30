import { NextResponse } from "next/server";

const API_URL = "https://api-mainnet.magiceden.dev/v4/evm-public/collections/user-collections";
const API_KEY = "d79f52a1-1a8c-42a0-9d6b-7afaf5a6e54c";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet");

  if (!wallet) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        walletAddresses: [wallet],
        chain: "monad",
      }),
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