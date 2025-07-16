import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.MONORAIL_DATA_URL;

export async function GET(request: NextRequest, context: any) {
  try {
    const monorailPath = context?.params?.monorailPath;
    const path = Array.isArray(monorailPath) ? monorailPath.join("/") : "";
    const { searchParams } = new URL(request.url);
    let apiUrl = `${BASE_URL}/${path}`;
    const query = searchParams.toString();
    if (query) apiUrl += `?${query}`;
    
    const response = await fetch(apiUrl, { 
      headers: { "accept": "application/json" } 
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch data: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Remove wildcard CORS - let middleware handle origin control
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in monorail data API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 