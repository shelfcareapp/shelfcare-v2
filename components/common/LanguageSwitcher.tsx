'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { CiGlobe } from 'react-icons/ci';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useLocale } from 'next-intl';
import { useRouter } from 'hooks/router';
import { usePathname } from '../../modules/i18n';
import { config } from '../../config';

const { locales } = config.i18n;

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(currentLocale);
  const dropdownRef = useRef(null);

  const handleLanguageChange = (locale) => {
    setValue(locale);
    router.replace(`/${locale}${pathname}?${searchParams.toString()}`);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-primary md:text-secondary lg:text-secondary focus:outline-none"
      >
        <CiGlobe />
        <span className="ml-1 mr-1">{value.toUpperCase()}</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      {isOpen && (
        <ul className="absolute mt-2 md:right-0 w-24 bg-white border border-gray-300 rounded-md shadow-lg">
          {Object.entries(locales).map(([locale, { label }]) => (
            <li
              key={locale}
              onClick={() => handleLanguageChange(locale)}
              className="px-4 py-3 cursor-pointer hover:bg-gray-100 text-primary text-sm"
            >
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
