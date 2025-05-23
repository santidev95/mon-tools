import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://testnet-pathfinder-v2.monorail.xyz/v3";

export async function GET(req: NextRequest, { params }: { params: { monorailPath: string[] } }) {
  const path = params.monorailPath.join("/");
  const search = req.nextUrl.search;
  const apiUrl = `${BASE_URL}/${path}${search}`;
  const response = await fetch(apiUrl, { headers: { "accept": "application/json" } });
  const data = await response.json();
  return NextResponse.json(data, {
    headers: { "Access-Control-Allow-Origin": "*" }
  });
} 