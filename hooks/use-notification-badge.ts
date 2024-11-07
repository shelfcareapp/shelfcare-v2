import { useAppSelector, useAppDispatch } from 'hooks/store';
import {
  markMessageAsRead,
  setHasNewNotification
} from 'store/slices/chat-slice';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'components/common/SessionContext';

export const useNotificationBadge = () => {
  const { hasNewNotification } = useAppSelector((state) => state.chat);
  const route = usePathname();
  const dispatch = useAppDispatch();
  const [not, setNot] = useState(false);
  const router = useRouter();
  const { user } = useSession();

  useEffect(() => {
    const data = localStorage.getItem('not') === 'true';
    setNot(data);
    if (route == '/chat') {
      dispatch(markMessageAsRead(user.uid));
      localStorage.setItem('not', 'false');
    }
  }, [route, dispatch]);

  const handleChatClick = () => {
    dispatch(setHasNewNotification(false)); // Clear notification after click
    router.push('/chat');
  };

  const showNotificationBadge = hasNewNotification || not;

  return { showNotificationBadge, handleChatClick };
};
