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
  const [newMessages, setNewMessages] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
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

  // Fetch new admin messages from Firestore
  useEffect(() => {
    if (user) {
      const chatsRef = collection(db, 'admin-chats'); // Fetching from 'admin-chats'
      const q = query(chatsRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedMessages = [];
        snapshot.forEach((chatDoc) => {
          const chatData = chatDoc.data();
          if (chatData.messages) {
            const lastMessage = chatData.messages[chatData.messages.length - 1];
            if (lastMessage && lastMessage.sender === 'Admin') {
              fetchedMessages.push({
                content: lastMessage.content,
                sender: lastMessage.sender,
                chatId: chatDoc.id,
                time: lastMessage.time
              });
            }
          }
        });
        setNewMessages(fetchedMessages);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleNotificationClick = () => {
    setNotificationOpen(!notificationOpen);
  };

  const handleNotificationItemClick = (chatId) => {
    router.push(`/chat/${chatId}`); // Navigate to chat page with chat ID
    setNotificationOpen(false);
  };

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setIsDropdownOpen(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [dropdownRef]);

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

          {/* Notification Icon */}
          {/* {user && (
            <div className="relative">
              <button className="" onClick={handleNotificationClick}>
                <IoIosNotificationsOutline className="h-6 w-6 text-primary" />
                {newMessages.length > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {newMessages.length}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-4 z-50">
                  <h3 className="font-semibold text-lg mb-2">New Messages</h3>
                  <ul>
                    {newMessages.length > 0 ? (
                      newMessages.map((msg, index) => (
                        <li
                          key={index}
                          className="border-b last:border-none pb-2 mb-2 last:mb-0 cursor-pointer"
                          onClick={() =>
                            handleNotificationItemClick(msg.chatId)
                          }
                        >
                          <p className="font-semibold">{msg.sender} replied:</p>
                          <p className="text-sm text-gray-600 truncate">
                            {msg.content}
                          </p>
                          <p className="text-xs text-gray-400">{msg.time}</p>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">No new messages.</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )} */}

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
