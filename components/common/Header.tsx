'use client';

import { useState, useRef, useEffect } from 'react';
import { CiUser } from 'react-icons/ci';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useSession } from 'components/common/SessionContext';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { toast } from 'react-toastify';
import { FaInstagramSquare } from 'react-icons/fa';
import { AiFillTikTok } from 'react-icons/ai';
import { useAppSelector, useAppDispatch } from 'hooks/store';
import { markMessageAsRead } from 'store/slices/chat-slice';
import { useOnClickOutside } from 'usehooks-ts';

const Header = () => {
  const { hasNewNotification } = useAppSelector((state) => state.chat);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations();
  const router = useRouter();
  const { user } = useSession();
  const dropdownRef = useRef(null);
  const route = usePathname();
  const dispatch = useAppDispatch();
  const [not, setNot] = useState(false);
  const locale = useLocale();

  const handleOrderNow = () => {
    if (!user) {
      router.push('/sign-in');
    } else {
      router.push('/chat');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/sign-in');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const handleClickOutside = () => {
    setIsDropdownOpen(false);
  };

  useOnClickOutside(dropdownRef, handleClickOutside);

  useEffect(() => {
    const data = localStorage.getItem('not') === 'true';
    setNot(data);
    if (route == '/chat') {
      dispatch(markMessageAsRead(user.uid));
      localStorage.setItem('not', 'false');
    }
  }, [route, dispatch]);

  const showNotificationBadge = hasNewNotification || not;

  return (
    <header className="border-b-[0.5px] sticky top-0 bg-primary z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Logo />

        <nav className="hidden md:flex space-x-6">
          <Link
            href="/price-list"
            className={`nav-link !text-secondary ${
              pathname === '/price-list' ? 'nav-link-active' : ''
            }`}
          >
            {t('header.price_list')}
          </Link>
          <Link
            href="/measurement-guide"
            className={`nav-link !text-secondary ${
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
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="relative p-1 rounded-full hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-secondary transition-colors duration-200"
              >
                <CiUser className="text-secondary" size={28} />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white border rounded py-2">
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-primary hover:bg-gray-100"
                  >
                    {t('header.my_orders')}
                  </Link>

                  <div className="border-secondary"></div>
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
                    {t('header.sign_out')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="text-secondary px-4 py-2 border border-secondary rounded-lg hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-secondary transition-colors duration-200"
              onClick={() => router.push('/sign-in')}
            >
              {t('header.sign_in')}
            </button>
          )}
          <button className="btn-secondary relative" onClick={handleOrderNow}>
            <span>{locale === 'fi' ? 'Tilaa' : 'Order'}</span>
            {showNotificationBadge && (
              <div className="absolute top-0 right-0 h-4 w-4 p-2 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white text-xs">1</span>
              </div>
            )}
          </button>
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-secondary focus:outline-none relative p-1 transition-colors duration-200"
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
        <div
          className={`bg-gray-100 absolute left-0 right-0 transition-all duration-300 ease-in-out ${
            isOpen
              ? 'h-screen opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="flex flex-col ">
            <nav className="md:hidden border-t border-secondary">
              <Link
                href="/price-list"
                className={`block px-4 py-2 text-secondary nav-link ${
                  pathname === '/price-list' ? 'nav-link-active' : ''
                }`}
              >
                {t('header.price_list')}
              </Link>
              <Link
                href="/measurement-guide"
                className={`block px-4 py-2 text-secondary nav-link ${
                  pathname === '/measurement-guide' ? 'nav-link-active' : ''
                }`}
              >
                {t('header.measurement_guide')}
              </Link>
              {user && (
                <Link
                  href="/orders"
                  className="block px-4 py-2 text-primary hover:bg-gray-100"
                >
                  {t('header.my_orders')}
                </Link>
              )}
              {user && (
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-primary hover:bg-gray-100"
                >
                  {t('header.my_account')}
                </Link>
              )}
              {user && (
                <button
                  className="block w-full text-left font-semibold px-4 py-2 text-primary hover:bg-gray-100"
                  onClick={handleSignOut}
                >
                  {t('header.sign_out')}
                </button>
              )}
            </nav>
            <div className="md:hidden p-2 mb-2">
              <div className="flex flex-col gap-3 p-2">
                {!user && (
                  <button
                    className="btn-secondary"
                    onClick={() => router.push('/sign-in')}
                  >
                    {t('header.sign_in')}
                  </button>
                )}
                <button
                  className="btn-primary relative"
                  onClick={handleOrderNow}
                >
                  <span>{locale === 'fi' ? 'Tilaa' : 'Order'}</span>
                  {showNotificationBadge && (
                    <div className="absolute top-0 right-0 h-4 w-4 p-2 rounded-full bg-red-500 flex items-center justify-center m-1">
                      <span className="text-white text-xs">1</span>
                    </div>
                  )}
                </button>

                <div className="w-full flex items-center justify-center gap-4 mt-4 mb-4 text-center">
                  <div className="">
                    <LanguageSwitcher />
                  </div>
                  <a
                    href="https://www.instagram.com/shelfcare.app/"
                    target="_blank"
                  >
                    <FaInstagramSquare
                      className="text-primary hover:opacity-90"
                      size={30}
                    />
                  </a>
                  <a
                    href="https://www.tiktok.com/@shelfcare.app"
                    target="_blank"
                  >
                    <AiFillTikTok
                      className="text-primary hover:opacity-90"
                      size={30}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
