import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.MONORAIL_PATHFINDER_URL;

// Whitelist of allowed path segments for security
const ALLOWED_PATHS = [
  'quote',
  'routes', 
  'tokens',
  'pools',
  'health'
];

function validatePath(pathSegments: string[]): boolean {
  if (!pathSegments || pathSegments.length === 0) {
    return false;
  }
  
  // Check each segment against whitelist
  return pathSegments.every(segment => {
    // Remove any path traversal attempts
    const cleanSegment = segment.replace(/[.\/\\]/g, '');
    // Check if it matches allowed patterns (alphanumeric, hyphens, underscores)
    return /^[a-zA-Z0-9_-]+$/.test(cleanSegment) && 
           ALLOWED_PATHS.some(allowed => cleanSegment.includes(allowed));
  });
}

export async function GET(request: NextRequest, context: any) {
  const monorailPath = context?.params?.monorailPath;
  const pathSegments = Array.isArray(monorailPath) ? monorailPath : [monorailPath].filter(Boolean);
  
  // Validate path segments
  if (!validatePath(pathSegments)) {
    return NextResponse.json(
      { error: "Invalid path" }, 
      { status: 400 }
    );
  }
  
  const path = pathSegments.join("/");
  const { searchParams } = new URL(request.url);
  
  // Validate BASE_URL is set
  if (!BASE_URL) {
    return NextResponse.json(
      { error: "Service configuration error" }, 
      { status: 500 }
    );
  }
  
  let apiUrl = `${BASE_URL}/${path}`;
  const query = searchParams.toString();
  if (query) apiUrl += `?${query}`;
  
  try {
    const response = await fetch(apiUrl, { 
      headers: { "accept": "application/json" },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: "External service error" }, 
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data, {
      headers: { "Access-Control-Allow-Origin": "*" }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Request failed" }, 
      { status: 500 }
    );
  }
} 