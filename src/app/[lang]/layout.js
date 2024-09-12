import '../globals.css';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import TidioLoader from '@/components/common/TidioLoader';
import { LanguageProvider } from '@/context/LanguageContext';
import { getDictionary } from '@/app/[lang]/dictionaries';

export const metadata = async ({ params = {} }) => {
  const lang = params.lang || 'en';
  const dictionary = await getDictionary(lang);
  const meta = dictionary.metadata;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: 'https://shelfcare.app',
      type: 'website',
      images: [
        {
          url: 'https://shelfcare.app/favicon.png',
          width: 1200,
          height: 630,
          alt: meta.title
        }
      ]
    },
    icons: {
      icon: 'https://shelfcare.app/favicon.png'
    }
  };
};

function RootLayout({ children, params }) {
  return (
    <html lang={params.lang}>
      <body className="flex flex-col min-h-screen">
        <LanguageProvider initialLang={params.lang}>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <TidioLoader />
        </LanguageProvider>
      </body>
    </html>
  );
}

export default RootLayout;
