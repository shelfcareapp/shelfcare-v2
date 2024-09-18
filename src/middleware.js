import { config as projectConfig } from '../config';
import createMiddleware from 'next-intl/middleware';

console.log(projectConfig.i18n.defaultLocale);

const intlMiddleware = createMiddleware({
  locales: Object.keys(projectConfig.i18n.locales),
  defaultLocale: projectConfig.i18n.defaultLocale,
  localePrefix: 'never'
});

export default async function middleware(req) {
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
