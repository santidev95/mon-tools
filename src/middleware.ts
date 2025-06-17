import { NextRequest, NextResponse } from 'next/server';

const INTERNAL_API_PREFIX = '/api/monorail/';
const ALLOWED_ORIGIN = 'https://testnet.montools.xyz';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const referer = req.headers.get("referer") || "";
    const origin = req.headers.get("origin") || "";

    const isInternalAPI = pathname.startsWith(INTERNAL_API_PREFIX);

    if (isInternalAPI && !(referer.startsWith(ALLOWED_ORIGIN) || origin.startsWith(ALLOWED_ORIGIN))) {
        console.info(`[Middleware] Request to ${req.nextUrl.pathname} from ${referer} or ${origin} is forbidden`);
        return new NextResponse("Forbidden", { status: 403 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/monorail/:path*'],
  };