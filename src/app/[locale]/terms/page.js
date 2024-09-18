'use client';

import { useTranslations } from 'next-intl';
import Layout from '@/components/common/Layout';

const TermsPage = () => {
  const t = useTranslations('terms'); // Access the 'terms' namespace directly

  // Define the keys based on your terms structure
  const sections = [
    'general',
    'ordering',
    'pricing',
    'transport',
    'handling',
    'liability',
    'cancellation',
    'privacy',
    'other',
    'contact'
  ];

  return (
    <Layout>
      <section className="py-16 px-6 md:px-24 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl font-bold text-primary mb-12 text-center">
            {t('title')}
          </h1>
          <div className="space-y-12 text-primary leading-relaxed">
            {sections.map((section, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl mb-4 border-b pb-2 text-primary">
                  {t(`${section}.heading`)}
                </h2>
                <p className="text-lg text-gray-700">
                  {t(`${section}.content`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsPage;
