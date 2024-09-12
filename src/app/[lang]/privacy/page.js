'use client';

import { useLanguage } from '@/context/LanguageContext';
import useTranslations from '@/hooks/useTranslations';

const PrivacyPolicyPage = () => {
  const { lang } = useLanguage();
  const t = useTranslations(lang, 'privacy');

  return (
    <section className="py-16 px-6 md:px-24 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-5xl font-bold text-primary mb-12 text-center">
          {t.title}
        </h1>
        <div className="space-y-12 text-primary leading-relaxed">
          {Object.keys(t).map(
            (key, index) =>
              key !== 'title' && (
                <div key={index} className="p-6 bg-white rounded-lg shadow-md">
                  <h2 className="text-3xl  mb-4 border-b pb-2 text-primary">
                    {t[key].heading}
                  </h2>
                  <p className="text-lg text-gray-700">{t[key].content}</p>
                </div>
              )
          )}
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicyPage;
