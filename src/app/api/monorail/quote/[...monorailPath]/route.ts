import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://testnet-pathfinder-v2.monorail.xyz/v3";

export async function GET(request: NextRequest, context: any) {
  const monorailPath = context?.params?.monorailPath;
  const path = Array.isArray(monorailPath) ? monorailPath.join("/") : "";
  const { searchParams } = new URL(request.url);
  let apiUrl = `${BASE_URL}/${path}`;
  const query = searchParams.toString();
  if (query) apiUrl += `?${query}`;
  const response = await fetch(apiUrl, { headers: { "accept": "application/json" } });
  const data = await response.json();
  return NextResponse.json(data, {
    headers: { "Access-Control-Allow-Origin": "*" }
  });
} 