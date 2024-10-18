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
import { useEffect } from 'react';

const secondaryNavigation = [
  {
    name: 'Chats',
    href: '/chats',
    icon: ChatBubbleBottomCenterIcon
  },
  {
    name: 'My Orders',
    href: '/orders',
    icon: ListBulletIcon
  },
  { name: 'Account', href: '/profile', icon: UserIcon }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface UserDashboardLayoutProps {
  children: React.ReactNode;
  // Optional for new order chat input props
  selectedChat?: any;
  handleFileChange?: any;
  handleSendMessage?: any;
  message?: string;
  setMessage?: any;
  image?: any;
  setImage?: any;
  uploading?: boolean;
}

export default function UserDashboardLayout({
  children,
  selectedChat,
  handleFileChange,
  handleSendMessage,
  message,
  setMessage,
  image,
  setImage,
  uploading
}: UserDashboardLayoutProps) {
  const pathname = usePathname();
  const isNewOrderPage = pathname === '/chats';

  // Request notification permission when the component mounts
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        }
      });
    }
  }, []);

  // Show browser notification when a new message is received
  const showNotification = (title: string, body: string) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: body,
        icon: '/chat-icon.png' // Optional: add an icon for the notification
      });
      notification.onclick = () => {
        window.focus(); // Bring window to the foreground on click
      };
    }
  };

  // Watch for new messages and trigger notification
  useEffect(() => {
    if (selectedChat && selectedChat.messages) {
      const lastMessage =
        selectedChat.messages[selectedChat.messages.length - 1];

      // Show notification only if the sender is not the current user
      if (lastMessage && lastMessage.sender !== 'Admin') {
        showNotification(
          'New Message',
          lastMessage.content || 'You have a new message!'
        );
      }
    }
  }, [selectedChat?.messages]); // Watching the selectedChat messages array

  return (
    <div className="mx-auto max-w-7xl lg:flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex-none w-full lg:w-64 border-b border-gray-900/5 lg:border-0">
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
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-between bg-white">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {/* Chat Input (For New Order Page) */}
        {isNewOrderPage && selectedChat && (
          <div className="sticky bottom-0 p-4 bg-white shadow flex items-center z-10">
            <label htmlFor="file-upload" className="cursor-pointer">
              <FiPaperclip className="text-gray-500 mr-2" />
            </label>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
            />

            {image && (
              <div className="flex items-center mr-2">
                <span className="mr-2 text-sm">{image.name}</span>
                <button
                  onClick={() => setImage(null)}
                  className="text-red-500 text-sm"
                >
                  {uploading ? (
                    <AiOutlineLoading className="animate-spin" />
                  ) : (
                    String.fromCharCode(10005)
                  )}
                </button>
              </div>
            )}

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-100 p-2 rounded-lg outline-none"
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
        )}
      </main>
    </div>
  );
}
