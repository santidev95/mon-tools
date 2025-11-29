import { NextRequest, NextResponse } from "next/server";

const API_KEY = "d79f52a1-1a8c-42a0-9d6b-7afaf5a6e54c";

export async function GET(
  req: NextRequest,
  context: any
) {
  const { params } = context;
  const contract  = (await params).contract;
  console.log("contract",contract);
  const url = `https://api-mainnet.magiceden.dev/v4/evm-public/collections`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collectionIds: [contract],
        chain: "monad",
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return new NextResponse("Magic Eden error", { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Magic Eden proxy error:", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
