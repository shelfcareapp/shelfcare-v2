import { NextResponse } from 'next/server';

const locales = ['en', 'fi'];
const defaultLocale = 'en';

function getLocale(request) {
  const acceptLang = request.headers.get('Accept-Language');
  if (!acceptLang) return defaultLocale;
  return acceptLang.split(',')[0].split('-')[0];
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  const locale = getLocale(request);
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
}

export const config = {
  matcher: '/((?!_next).*)'
};
