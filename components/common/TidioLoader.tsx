'use client';

import { useEffect } from 'react';

const TidioLoader = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = process.env.NEXT_PUBLIC_TIDIO_CHAT_SCRIPT_URL;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null;
};

export default TidioLoader;
