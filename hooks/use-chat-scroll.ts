import { useEffect, useRef, useState } from 'react';

const useChatScroll = (messages) => {
  const chatRef = useRef<HTMLDivElement>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  const handleScroll = () => {
    if (chatRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
      const isAtBottom = scrollHeight - scrollTop === clientHeight;
      setIsAutoScrollEnabled(isAtBottom);
    }
  };

  useEffect(() => {
    if (isAutoScrollEnabled && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isAutoScrollEnabled]);

  useEffect(() => {
    const chatContainer = chatRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return chatRef;
};

export default useChatScroll;
