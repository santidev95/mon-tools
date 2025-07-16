import { NextRequest, NextResponse } from 'next/server';

const INTERNAL_API_PREFIX = '/api/monorail/';
const ALLOWED_ORIGIN = ['https://testnet.montools.xyz', 'http://localhost:3000'];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const referer = req.headers.get("referer") || "";
    const origin = req.headers.get("origin") || "";

    const isInternalAPI = pathname.startsWith(INTERNAL_API_PREFIX);

    if (isInternalAPI && !ALLOWED_ORIGIN.some(allowedOrigin => referer.startsWith(allowedOrigin) || origin.startsWith(allowedOrigin))) {
        console.info(`[Middleware] Request to ${req.nextUrl.pathname} from ${referer} or ${origin} is forbidden`);
        return new NextResponse("Forbidden", { status: 403 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/monorail/:path*', '/api/magiceden/:path*'],
  };