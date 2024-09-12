'use client';

import { useState } from 'react';
import useTranslations from '@/hooks/useTranslations';
import { useLanguage } from '@/context/LanguageContext';

const PricingPage = () => {
  const { lang } = useLanguage();
  const t = useTranslations(lang, 'pricing');
  const categories = t.categories || {};
  const [activeTab, setActiveTab] = useState('tailoring');

  const renderServiceGroup = (groups) =>
    groups?.map((group, index) => (
      <div key={index} className="mb-8">
        <h3 className="text-xl font-semibold mb-2">{group.category}</h3>
        {group.services.map((service, idx) => (
          <div key={idx} className="flex justify-between py-2 border-b">
            <span>{service.name}</span>
            <span>{service.price} €</span>
          </div>
        ))}
      </div>
    ));

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'tailoring':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {t.tailoring?.title || 'Tailoring'}
            </h2>
            {renderServiceGroup(t.tailoring?.groups)}
          </div>
        );
      case 'cobbler':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {t.cobbler?.title || 'Cobbler'}
            </h2>
            {renderServiceGroup(t.cobbler?.groups)}
          </div>
        );
      case 'laundry':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {t.laundry?.title || 'Laundry'}
            </h2>
            {renderServiceGroup(t.laundry?.groups)}
          </div>
        );
      default:
        return <p>{t.noData || 'No data available for this category.'}</p>;
    }
  };

  return (
    <section className="py-16 px-6 md:px-24 bg-gradient-to-r from-blue-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-white to-gray-100 opacity-50 pointer-events-none"></div>
      <div className="container mx-auto relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold text-primary mb-12 text-center">
          {t.title || 'Pricing Guidelines'}
        </h1>
        <p className="text-sm text-gray-500 mb-8 text-center">
          {t.disclaimer || 'Prices may vary based on service details.'}
        </p>
        <div className="tabs mb-12 flex justify-center space-x-4">
          {Object.keys(categories).map((category) => (
            <button
              key={category}
              className={`py-2 px-6 rounded-full font-medium transition-all ${
                activeTab === category
                  ? 'bg-primary text-white shadow-md transform scale-105'
                  : 'bg-gray-200 text-primary hover:bg-primary hover:text-white hover:shadow-md'
              }`}
              onClick={() => setActiveTab(category)}
            >
              {t.categories[category] || category}
            </button>
          ))}
        </div>
        <div>{renderActiveTabContent()}</div>
      </div>
    </section>
  );
};

export default PricingPage;
