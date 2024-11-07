'use client';

import { useState, useRef, useEffect } from 'react';
import { CiUser } from 'react-icons/ci';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useSession } from 'components/common/SessionContext';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { toast } from 'react-toastify';
import { FaInstagramSquare } from 'react-icons/fa';
import { AiFillTikTok } from 'react-icons/ai';
import { useAppSelector, useAppDispatch } from 'hooks/store';
import {
  markMessageAsRead,
  setHasNewNotification
} from 'store/slices/chat-slice';

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

  const handleChatClick = () => {
    dispatch(setHasNewNotification(false)); // Clear notification after click
    router.push('/chat');
  };

  useEffect(() => {
    const data = localStorage.getItem('not') === true;
    setNot(data);
    if (route == '/chat') {
      dispatch(markMessageAsRead(user.uid));
      localStorage.setItem('not', 'false');
    }
  }, [route, dispatch]);

  const showNotificationBadge = hasNewNotification || not;

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
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="relative p-1 border -base-100 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200"
              >
                <CiUser className="text-primary" size={28} />
                {showNotificationBadge && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg py-2">
                  <Link
                    href="/chat"
                    onClick={handleChatClick}
                    className="relative block px-4 py-2 text-primary hover:bg-gray-100 transition-colors duration-200"
                  >
                    {t('header.new_order')}
                    {showNotificationBadge && (
                      <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                    )}
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
            className="text-primary focus:outline-none relative p-1 transition-colors duration-200"
          >
            {showNotificationBadge && (
              <span className="absolute top-0 left-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
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
            <nav className="md:hidden border-t border-gray-200">
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
            <div className="md:hidden p-2 mb-2">
              {user && (
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
              )}
              <div className="flex flex-col gap-3 p-2">
                {!user && (
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
