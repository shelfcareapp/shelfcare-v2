'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FiChevronDown } from 'react-icons/fi';

const LanguageSwitcher = ({ currentLang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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
        <span className="mr-1">{currentLang.toUpperCase()}</span>
        <FiChevronDown />
      </button>
      {isOpen && (
        <ul className="absolute mt-2 right-0 w-20 bg-white border border-gray-300 rounded-md shadow-lg">
          <li
            onClick={() => handleLanguageChange('en')}
            className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-primary"
          >
            EN
          </li>
          <li
            onClick={() => handleLanguageChange('fi')}
            className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-primary"
          >
            FI
          </li>
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
