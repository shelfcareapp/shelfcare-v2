'use client';

import { useTranslations } from 'next-intl';
import Layout from 'components/common/Layout';

const MeasurementGuide = () => {
  const t = useTranslations('measurement-guide');

  const sectionKeys = [
    'section-1',
    'section-2',
    'section-3',
    'section-4',
    'section-5',
    'section-6',
    'section-7',
    'section-8',
    'section-9',
    'section-10',
    'section-11',
    'section-12'
  ];

  return (
    <Layout>
      <section className="py-16 px-6 md:px-24 bg-slate-100">
        <div className="absolute inset-0 pointer-events-none bg-pattern bg-opacity-10"></div>
        <div className="container mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-12 text-center">
            {t('title')}
          </h1>
          <div className="space-y-10 text-primary">
            {sectionKeys.map((key, index) => {
              const heading = t(`sections.${key}.heading`);
              const instructions = t.raw(`sections.${key}.instructions`) || {};

              return (
                <div key={index} className="p-6 md:p-8 bg-white rounded-lg">
                  <p className="text-lg font-semibold text-primary mb-4">
                    {heading}
                  </p>
                  {Object.keys(instructions).map((instKey) => (
                    <p
                      key={instKey}
                      className="mb-4 text-sm text-gray-700 leading-relaxed"
                    >
                      {instructions[instKey]}
                    </p>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MeasurementGuide;
