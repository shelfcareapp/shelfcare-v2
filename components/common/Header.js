'use client';

import { useState, useEffect, useRef } from 'react';
import { CiUser } from 'react-icons/ci';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { useSession } from 'components/common/SessionContext';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { toast } from 'react-toastify';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations();
  const router = useRouter();
  const { user } = useSession();
  const dropdownRef = useRef(null);

  const handleOrderNow = () => {
    if (!user) {
      router.push('/sign-in');
    } else {
      router.push('/chats');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <header className="border-b-[0.5px] sticky top-0 bg-white z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Logo />

        <nav className="hidden md:flex space-x-6">
          <Link
            href="/price-list"
            className={`nav-link ${
              pathname === '/price-list' ? 'nav-link-active' : ''
            }`}
          >
            {t('header.price_list')}
          </Link>
          <Link
            href="/measurement-guide"
            className={`nav-link ${
              pathname === '/measurement-guide' ? 'nav-link-active' : ''
            }`}
          >
            {t('header.measurement_guide')}
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <LanguageSwitcher />

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <CiUser className="text-primary" size={28} />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg py-2">
                  <Link
                    href="/chats"
                    className="block px-4 py-2 text-primary hover:bg-gray-100"
                  >
                    {t('header.new_order')}
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-primary hover:bg-gray-100"
                  >
                    {t('header.my_orders')}
                  </Link>

                  <div className="border-t border-gray-200"></div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-primary hover:bg-gray-100"
                  >
                    {t('header.my_account')}
                  </Link>
                  <button
                    className="block w-full font-semibold text-left px-4 py-2 text-primary hover:bg-gray-100"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="btn-secondary"
              onClick={() => router.push('/sign-in')}
            >
              {t('header.sign_in')}
            </button>
          )}
          <button className="btn-primary" onClick={handleOrderNow}>
            {user ? t('header.new_order') : t('header.order_now')}
          </button>
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-primary focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div>
          <nav className="md:hidden bg-white border-t border-gray-200">
            <Link
              href="/price-list"
              className={`block px-4 py-2 text-primary nav-link ${
                pathname === '/price-list' ? 'nav-link-active' : ''
              }`}
            >
              {t('header.price_list')}
            </Link>
            <Link
              href="/measurement-guide"
              className={`block px-4 py-2 text-primary nav-link ${
                pathname === '/measurement-guide' ? 'nav-link-active' : ''
              }`}
            >
              {t('header.measurement_guide')}
            </Link>
          </nav>

          <div className="md:hidden p-2 mt-2">
            {user ? (
              <>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <CiUser className="text-primary" size={28} />
                </button>
                {isDropdownOpen && (
                  <div className="bg-white border rounded shadow-lg py-2">
                    <Link
                      href="/new-chats"
                      className="block px-4 py-2 text-primary hover:bg-gray-100"
                    >
                      New Order
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-primary hover:bg-gray-100"
                    >
                      My Orders
                    </Link>

                    <div className="border-t border-gray-200"></div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-primary hover:bg-gray-100"
                    >
                      My Account
                    </Link>
                    <button
                      className="block w-full text-left font-semibold px-4 py-2 text-primary hover:bg-gray-100"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                className="btn-secondary mb-2"
                onClick={() => router.push('/sign-in')}
              >
                {t('header.sign_in')}
              </button>
            )}
            <button className="btn-primary mb-2" onClick={handleOrderNow}>
              {user ? t('header.new_order') : t('header.order_now')}
            </button>
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
