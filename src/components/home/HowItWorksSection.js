'use client';

import { useTranslations } from 'next-intl';

const HowItWorksSection = () => {
  const t = useTranslations();

  const steps = [
    {
      number: 1,
      title: t('home.how_it_works.step1.title'),
      description: t('home.how_it_works.step1.description')
    },
    {
      number: 2,
      title: t('home.how_it_works.step2.title'),
      description: t('home.how_it_works.step2.description')
    },
    {
      number: 3,
      title: t('home.how_it_works.step3.title'),
      description: t('home.how_it_works.step3.description')
    },
    {
      number: 4,
      title: t('home.how_it_works.step4.title'),
      description: t('home.how_it_works.step4.description')
    }
  ];

  return (
    <section className="py-16 px-6 md:px-24 bg-gradient-to-br from-white via-gray-50 to-white">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8">
          {t('home.how_it_works.title')}
        </h2>
        <p className="text-gray-600 mb-12">{t('home.how_it_works.subtitle')}</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="relative flex flex-col justify-center items-center w-64 h-64 p-6 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105">
                <div className="text-6xl font-bold text-primary mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
