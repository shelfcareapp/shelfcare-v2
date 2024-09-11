'use client';

import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children, initialLang }) => {
  const [lang, setLang] = useState(initialLang);

  const changeLanguage = (newLang) => {
    setLang(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};
