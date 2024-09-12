'use client';

import { FaArrowRight } from 'react-icons/fa'; // Import right arrow icon
import useTranslations from '@/hooks/useTranslations';
import { useLanguage } from '@/context/LanguageContext';

const HowItWorksSection = () => {
  const { lang } = useLanguage();
  const t = useTranslations(lang, 'home-how-it-works');

  const steps = [
    {
      number: 1,
      title: t.step1?.title,
      description: t.step1?.description
    },
    {
      number: 2,
      title: t.step2?.title,
      description: t.step2?.description
    },
    {
      number: 3,
      title: t.step3?.title,
      description: t.step3?.description
    },
    {
      number: 4,
      title: t.step4?.title,
      description: t.step4?.description
    }
  ];

  return (
    <section className="py-16 px-6 md:px-24 bg-gradient-to-br from-white via-gray-50 to-white">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8">
          {t.title || 'How It Works'}
        </h2>
        <p className="text-gray-600 mb-12">
          {t.subtitle || 'Get started with these easy steps:'}
        </p>
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
              {index < steps.length - 1 && (
                <FaArrowRight className="hidden lg:block text-primary text-2xl mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
