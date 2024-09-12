'use client';

import { useLanguage } from '@/context/LanguageContext';
import useTranslations from '@/hooks/useTranslations';

const MeasurementGuide = () => {
  const { lang } = useLanguage();
  const t = useTranslations(lang, 'measurement-guide');

  return (
    <section className="py-16 px-6 md:px-24 bg-gradient-to-r from-blue-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-pattern bg-opacity-10"></div>
      <div className="container mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-12 text-center">
          {t.title}
        </h1>
        <div className="space-y-10 text-primary">
          {t.sections?.map((section, index) => (
            <div
              key={index}
              className="p-6 md:p-8 bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
                {section.heading}
              </h2>
              {section.instructions.map((instruction, idx) => (
                <p key={idx} className="mb-2 text-gray-700 leading-relaxed">
                  {instruction}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeasurementGuide;
