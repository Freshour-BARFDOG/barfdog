import { NextResponse } from 'next/server';

export function middleware(req) {
  if (process.env.MAINTENANCE_MODE === 'true') {
    return NextResponse.rewrite(new URL('/siteMaintenance', req.url));
  }
}

export const config = {
  matcher: ['/((?!_next|favicon|siteMaintenance|api|.*\\..*).*)'],
};
