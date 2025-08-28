import { NextRequest, NextResponse } from 'next/server';

const INTERNAL_API_PREFIX = '/api/monorail/';
const ALLOWED_ORIGIN = [
    'https://testnet.montools.xyz', 
    'http://localhost:3000',
    'http://localhost:3001',
    'https://montools.xyz'
];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const referer = req.headers.get("referer") || "";
    const origin = req.headers.get("origin") || "";

    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        return new NextResponse(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    }

    const isInternalAPI = pathname.startsWith(INTERNAL_API_PREFIX);

    if (isInternalAPI && !ALLOWED_ORIGIN.some(allowedOrigin => 
        referer.startsWith(allowedOrigin) || origin === allowedOrigin || req.headers.get('host')?.includes('localhost')
    )) {
        console.info(`[Middleware] Request to ${req.nextUrl.pathname} from ${referer} or ${origin} is forbidden`);
        return new NextResponse("Forbidden", { status: 403 });
    }

    // Add CORS headers to the response
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
}

export const config = {
    matcher: ['/api/monorail/:path*', '/api/magiceden/:path*'],
  };