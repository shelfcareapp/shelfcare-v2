import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import {
  UserIcon,
  ListBulletIcon,
  ChatBubbleBottomCenterIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { classNames } from 'utils/classNames';
import { useNotificationBadge } from 'hooks/use-notification-badge';

const UserDashboardLeftbar = () => {
  const pathname = usePathname();
  const t = useTranslations('user-dashboard');
  const { showNotificationBadge, handleChatClick } = useNotificationBadge();

  const secondaryNavigation = [
    {
      name: t('chats'),
      href: '/chat',
      icon: ChatBubbleBottomCenterIcon,
      onClick: handleChatClick,
      hasBadge: showNotificationBadge
    },
    {
      name: t('orders'),
      href: '/orders',
      icon: ListBulletIcon
    },
    { name: t('account'), href: '/profile', icon: UserIcon }
  ];

  return (
    <aside className="flex-none w-full lg:w-64 border-b border-gray-900/5 border-l border-r sticky top-0 bg-white">
      <nav className="px-4 sm:px-6 lg:px-0 h-full">
        <ul
          role="list"
          className="flex gap-x-5 gap-y-1 whitespace-nowrap lg:flex-col"
        >
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
              {showNotificationBadge && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default UserDashboardLeftbar;
