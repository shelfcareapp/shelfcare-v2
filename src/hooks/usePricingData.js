'use client';

import { useMemo } from 'react';
import useTranslations from '@/hooks/useTranslations';
import { useLanguage } from '@/context/LanguageContext';

const usePricingData = () => {
  const { lang } = useLanguage();
  const t = useTranslations(lang, 'pricing');

  const combinedPricingData = useMemo(() => {
    return [
      ...(t?.tailoring?.groups || []),
      ...(t?.cobbler?.groups || []),
      ...(t?.laundry?.groups || [])
    ];
  }, [t]);

  const categories = useMemo(() => {
    return combinedPricingData.map((group) => group.category);
  }, [combinedPricingData]);

  return { categories, combinedPricingData };
};

export default usePricingData;
