'use client';

import { FaBoxOpen, FaTruck, FaTools, FaUndo } from 'react-icons/fa'; // Example icons
import useTranslations from '@/hooks/useTranslations';
import { useLanguage } from '@/context/LanguageContext';

const HowItWorksSection = () => {
  const { lang } = useLanguage();
  const t = useTranslations(lang, 'home-how-it-works');

  const steps = [
    {
      number: 1,
      title: t.step1?.title,
      description: t.step1?.description,
      icon: (
        <FaBoxOpen className="absolute opacity-5 text-primary inset-0 w-full h-full" />
      )
    },
    {
      number: 2,
      title: t.step2?.title,
      description: t.step2?.description,
      icon: (
        <FaTruck className="absolute opacity-5 text-primary inset-0 w-full h-full" />
      )
    },
    {
      number: 3,
      title: t.step3?.title,
      description: t.step3?.description,
      icon: (
        <FaTools className="absolute opacity-5 text-primary inset-0 w-full h-full" />
      )
    },
    {
      number: 4,
      title: t.step4?.title,
      description: t.step4?.description,
      icon: (
        <FaUndo className="absolute opacity-5 text-primary inset-0 w-full h-full" />
      )
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col p-6 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105"
            >
              <div className="text-6xl font-bold text-primary relative z-10 mb-4">
                {step.number}
              </div>
              {step.icon}
              <h3 className="text-xl font-semibold text-primary relative z-10 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 relative z-10">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
