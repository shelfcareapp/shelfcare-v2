'use client';

import {
  UserIcon,
  ListBulletIcon,
  ChatBubbleBottomCenterIcon
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const secondaryNavigation = [
  {
    name: 'New Order',
    href: '/new-order',
    icon: ChatBubbleBottomCenterIcon
  },
  {
    name: 'My Orders',
    href: '/orders',
    icon: ListBulletIcon
  },

  { name: 'Account', href: '/profile', icon: UserIcon }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function UserDashboardLayout({ children }) {
  const pathname = usePathname();

  // screen height minus the header and footer (assuming 16rem combined height)
  const screenHeight = 'calc(100vh - 7rem)';

  return (
    <>
      <div
        className="mx-auto max-w-7xl lg:flex"
        style={{ height: screenHeight }}
      >
        {/* Sidebar */}
        <aside className="flex overflow-x-auto border-b border-gray-900/5 lg:block lg:w-64 lg:flex-none lg:border-0 ">
          <nav className="flex-none px-4 sm:px-6 lg:px-0">
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
                        'h-6 w-6 shrink-0'
                      )}
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className="w-full overflow-y-auto"
          style={{ height: screenHeight }}
        >
          <div className="h-full">{children}</div>
        </main>
      </div>
    </>
  );
}
