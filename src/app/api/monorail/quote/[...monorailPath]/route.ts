import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.MONORAIL_PATHFINDER_URL;
const SOURCE_PARAM = process.env.MONORAIL_APP_ID;

export async function GET(request: NextRequest, context: any) {
  const monorailPath = context?.params?.monorailPath;
  const path = Array.isArray(monorailPath) ? monorailPath.join("/") : "";
  const { searchParams } = new URL(request.url);
  let apiUrl = `${BASE_URL}/${path}?source=${SOURCE_PARAM}`;
  const query = searchParams.toString();
  if (query) apiUrl += `&${query}`;
  const response = await fetch(apiUrl, { headers: { "accept": "application/json" } });
  const data = await response.json();
  return NextResponse.json(data, {
    headers: { "Access-Control-Origin": "*" }
  });
} 