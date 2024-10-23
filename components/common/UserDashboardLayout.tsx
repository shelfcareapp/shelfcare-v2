import {
  UserIcon,
  ListBulletIcon,
  ChatBubbleBottomCenterIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiPaperclip } from 'react-icons/fi';
import { AiOutlineLoading } from 'react-icons/ai';
import { useEffect, useRef } from 'react';
import { Chat } from '../types';
import { useTranslations } from 'next-intl';
import { HiOutlineViewList } from 'react-icons/hi';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface UserDashboardLayoutProps {
  children: React.ReactNode;
  selectedChat?: (Chat & { id: string }) | null;
  handleFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendMessage?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  message?: string;
  setMessage?: any;
  imagePreviews?: string[];
  setImagePreviews?: any;
  uploading?: boolean;
  removeImage?: (index: number) => void;
  toggleChatList?: () => void;
}

export default function UserDashboardLayout({
  children,
  selectedChat,
  handleFileChange,
  handleSendMessage,
  message,
  setMessage,
  imagePreviews,
  uploading,
  removeImage,
  toggleChatList
}: UserDashboardLayoutProps) {
  const pathname = usePathname();
  const isNewOrderPage = pathname === '/chats';
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('user-dashboard');

  const secondaryNavigation = [
    {
      name: t('chats'),
      href: '/chats',
      icon: ChatBubbleBottomCenterIcon
    },
    {
      name: t('orders'),
      href: '/orders',
      icon: ListBulletIcon
    },
    { name: t('account'), href: '/profile', icon: UserIcon }
  ];

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        }
      });
    }
  }, []);

  const showImagePreviews = () => {
    if (imagePreviews.length > 0) {
      return (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {imagePreviews.map((url, i) => (
            <div key={i} className="relative">
              <img
                src={url}
                alt={`Image ${i + 1}`}
                className="w-20 h-20 object-cover rounded-md border border-gray-200"
              />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-0 right-0 bg-white rounded-full text-red-500 hover:text-red-700 p-1"
                style={{ transform: 'translate(50%, -50%)' }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      );
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat?.messages]);

  const handleSendOnEnter = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSendMessage(e);
    }
  };

  return (
    <div className="mx-auto max-w-7xl lg:flex min-h-screen">
      <aside className="flex-none w-full lg:w-64 border-b border-gray-900/5 lg:border-0">
        <nav className="px-4 sm:px-6 lg:px-0 h-full">
          <ul
            role="list"
            className="flex gap-x-5 gap-y-1 whitespace-nowrap lg:flex-col"
          >
            <button className="lg:hidden rounded" onClick={toggleChatList}>
              <HiOutlineViewList size={30} className="text-gray-800" />
            </button>
            {secondaryNavigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={classNames(
                    pathname === item.href
                      ? 'bg-gray-50 text-primary'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary',
                    'group flex gap-x-3 rounded-md py-4 pl-2 pr-3 font-semibold leading-6'
                  )}
                >
                  <item.icon
                    aria-hidden="true"
                    className={classNames(
                      pathname === item.href
                        ? 'text-primary'
                        : 'text-gray-400 group-hover:text-primary',
                      'h-6 w-6 shrink-0 hidden lg:block'
                    )}
                  />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col justify-between bg-white">
        <div className="flex-1 overflow-y-auto">{children}</div>

        {isNewOrderPage && selectedChat && (
          <div className="sticky bottom-0 p-4 bg-white shadow flex flex-col z-10">
            {/* Image Previews */}
            {showImagePreviews()}

            <div className="flex items-center">
              <label htmlFor="file-upload" className="cursor-pointer">
                <FiPaperclip className="text-gray-500 mr-2" />
              </label>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
              />

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('type-message')}
                className="flex-1 bg-gray-100 p-2 rounded-lg outline-none"
                onKeyDown={handleSendOnEnter}
              />

              <button
                onClick={handleSendMessage}
                className={`ml-4 bg-primary text-white p-2 rounded-lg ${
                  uploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                }`}
                disabled={uploading}
              >
                {uploading ? (
                  <AiOutlineLoading className="animate-spin" />
                ) : (
                  <PaperAirplaneIcon className="h-5 w-5 -rotate-45" />
                )}
              </button>
            </div>
          </div>
        )}
      </main>
      <div ref={messagesEndRef} />
    </div>
  );
}
