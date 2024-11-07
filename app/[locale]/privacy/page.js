'use client';

import { useTranslations } from 'next-intl';
import Layout from 'components/common/Layout';

const PrivacyPolicyPage = () => {
  const t = useTranslations('privacy'); // Directly access the 'privacy' namespace

  // Define the sections to render
  const sections = [
    'section1',
    'section2',
    'section3',
    'section4',
    'section5',
    'section6',
    'section7',
    'section8',
    'section9',
    'section10'
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
                <p className="text-lg text-gray-700 whitespace-pre-line">
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

export default PrivacyPolicyPage;
