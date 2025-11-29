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
    
    // Check if migration mode is enabled
    const migrationMode = process.env.NEXT_PUBLIC_MIGRATION_MODE === 'true';
    
    // Block all routes except static assets and API routes when in migration mode
    if (migrationMode) {
        // Allow static assets (images, fonts, etc.)
        if (
            pathname.startsWith('/_next/') ||
            pathname.startsWith('/favicon.ico') ||
            pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/)
        ) {
            return NextResponse.next();
        }
        
        // Block everything else - redirect to home which will show migration screen
        if (pathname !== '/') {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

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
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
  };