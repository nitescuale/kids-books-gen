import { useState, useEffect } from 'react';

export const useTextAnimation = (baseText, isActive, interval = 500) => {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setDotCount(0);
      return;
    }

    const timer = setInterval(() => {
      setDotCount(prev => (prev + 1) % 4); // 0, 1, 2, 3, then back to 0
    }, interval);

    return () => clearInterval(timer);
  }, [isActive, interval]);

  const dots = '.'.repeat(dotCount);
  return `${baseText}${dots}`;
};