import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Providers } from '@/redux/Providers';
import ToastProvider from '@/components/common/ToastProvider';
import { SessionProvider } from '@/components/common/SessionContext';
import { validateRequest } from '@/lib/auth';

export const metadata = {
  title: 'ShelfCare - Sustainable Fashion and Wardrobe Care',
  description:
    'ShelfCare is dedicated to making clothing, shoe, and accessory repair and maintenance services accessible. We integrate these services into consumers’ wardrobe care routines, promoting sustainable fashion and personal style. Embrace quality over quantity with ShelfCare, where your beloved clothes and unique style are the focus.',
  keywords:
    'ShelfCare, sustainable fashion, wardrobe care, clothing repair, shoe maintenance, accessory repair, personal style, quality over quantity, fashion sustainability',
  openGraph: {
    title: 'ShelfCare - Sustainable Fashion and Wardrobe Care',
    description:
      'ShelfCare is dedicated to making clothing, shoe, and accessory repair and maintenance services accessible. We integrate these services into consumers’ wardrobe care routines, promoting sustainable fashion and personal style. Embrace quality over quantity with ShelfCare, where your beloved clothes and unique style are the focus.',
    url: 'https://shelfcare.app',
    type: 'website',
    images: [
      {
        url: 'https://shelfcare.app/favicon.png',
        width: 1200,
        height: 630,
        alt: 'ShelfCare'
      }
    ]
  },
  icons: {
    icon: 'https://shelfcare.app/favicon.png'
  }
};

async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();
  const session = await validateRequest();

  return (
    <html lang={locale}>
      <body>
        <SessionProvider value={session}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>
              <ToastProvider>
                <main className="flex-grow">{children}</main>
              </ToastProvider>
            </Providers>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

export default RootLayout;
