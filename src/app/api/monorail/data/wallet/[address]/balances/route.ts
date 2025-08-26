import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.MONORAIL_DATA_URL;
const SOURCE_PARAM = process.env.MONORAIL_APP_ID;

export async function GET(request: NextRequest, context: any) {
  const address = context?.params?.address;
  
  if (!address) {
    return NextResponse.json(
      { error: "Wallet address is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${BASE_URL}/wallet/${address}/balances?source=${SOURCE_PARAM}`, {
      headers: { "accept": "application/json" }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch balances: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: { "Access-Control-Allow-Origin": "*" }
    });
  } catch (error) {
    console.error("Error fetching wallet balances:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet balances" },
      { status: 500 }
    );
  }
} 