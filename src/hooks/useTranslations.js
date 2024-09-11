'use client';

import { useState, useEffect } from 'react';
import { getDictionary } from '@/app/[lang]/dictionaries';

const useTranslations = (lang, section) => {
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dictionary = await getDictionary(lang);
        setTranslations(dictionary[section]);
      } catch (error) {
        console.error('Error loading translations:', error);
      }
    };

    loadDictionary();
  }, [lang, section]);

  return translations;
};

export default useTranslations;
