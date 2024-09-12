'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { CiGlobe } from 'react-icons/ci';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';
import useTranslations from '@/hooks/useTranslations';

const LanguageSwitcher = ({ currentLang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { lang } = useLanguage();

  const t = useTranslations(lang, 'language');

  const handleLanguageChange = (lang) => {
    const newPath = pathname.replace(currentLang, lang);
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-primary focus:outline-none"
      >
        <CiGlobe />
        <span className="ml-1 mr-1">{currentLang.toUpperCase()}</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      {isOpen && (
        <ul className="absolute mt-2 md:right-0 w-20 bg-white border border-gray-300 rounded-md shadow-lg">
          <li
            onClick={() => handleLanguageChange('en')}
            className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-primary"
          >
            {t.en}
          </li>
          <li
            onClick={() => handleLanguageChange('fi')}
            className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-primary"
          >
            {t.fi}
          </li>
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
