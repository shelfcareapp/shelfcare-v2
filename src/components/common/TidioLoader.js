'use client';

import { useEffect } from 'react';

const TidioLoader = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//code.tidio.co/ibifdcibhhofg7acsfhtoyey6io6evwr.js';
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
