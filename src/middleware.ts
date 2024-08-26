import { NextRequest, NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { COOKIE_KEY } from '@/constant/common';

const middleware = (request: NextRequest) => {
  const checkAuthResult = checkAuth(request);
  if (checkAuthResult) {
    return checkAuthResult;
  }

  return NextResponse.next();
};

const checkAuth = (request: NextRequest) => {
  const nextCookies = cookies();
  const token = nextCookies.get(COOKIE_KEY.WORKSHOP_TOKEN);
  const prevPathname = request.nextUrl.pathname;

  if (WHITE_LIST.includes(prevPathname)) {
    return null;
  }

  if (!token?.value) {
    const nextUrl = request.nextUrl;
    nextUrl.pathname = '/login';

    const response = NextResponse.redirect(nextUrl);
    response.cookies.set(COOKIE_KEY.PREV_PATH, prevPathname);
    return response;
  }

  return null;
};

export default middleware;

const WHITE_LIST = ['/login', '/roulette', '/qr'];

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
