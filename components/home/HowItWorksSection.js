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
    }
  ];

  return (
    <section className="py-16 px-0 bg-gradient-to-br from-white via-gray-50 to-white">
      <div className="w-full mx-0">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 text-center">
          {t('home.how_it_works.title')}
        </h2>
        <div className="flex flex-wrap items-stretch justify-center gap-5">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex justify-center w-full md:w-1/5 p-2"
            >
              <div className="flex flex-col justify-between items-center h-full p-4 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105">
                <div className="text-5xl font-bold text-primary mb-2 flex-shrink-0 leading-none">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-primary text-center leading-snug min-h-[40px]">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed min-h-[80px]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
