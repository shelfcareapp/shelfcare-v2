'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

const OrderStartSection = () => {
  const t = useTranslations();
  const [selectedItem, setSelectedItem] = useState('');
  const router = useRouter();

  const goToSelectClothingItem = () => {
    setSelectedItem('clothing');
    router.push(`/${locale}/select-item`);
  };

  const goToCobblerService = () => {
    setSelectedItem('footwear');
    router.push(`/${locale}/cobbler-service`);
  };

  return (
    <section className="py-16 px-6 md:px-24 text-primary text-center">
      <h2 className="text-4xl font-bold mb-8">{t('home.order_start.title')}</h2>
      <p className="mb-6">{t('home.order_start.subtitle')}</p>
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`py-2 px-4 border rounded ${
            selectedItem === 'clothing'
              ? 'bg-secondary text-primary'
              : 'bg-white text-primary'
          }`}
          onClick={goToSelectClothingItem}
        >
          {t('home.order_start.clothing')}
        </button>
        <button
          className={`py-2 px-4 border rounded ${
            selectedItem === 'footwear'
              ? 'bg-secondary text-primary'
              : 'bg-white text-primary'
          }`}
          onClick={goToCobblerService}
        >
          {t('home.order_start.footwear')}
        </button>
      </div>
    </section>
  );
};

export default OrderStartSection;
