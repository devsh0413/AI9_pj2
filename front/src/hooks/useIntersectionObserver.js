import { useState, useEffect } from 'react';

export const useIntersectionObserver = ({
  root = null,
  threshold = 0.5,
  rootMargin = '0px',
  onIntersect,
}) => { 
  const [target, setTarget] = useState(null);

  useEffect(() => {
    let observer;
    if (target) {
      observer = new IntersectionObserver(onIntersect, { root, rootMargin, threshold });
      observer.observe(target);
    }

    return () => observer && observer.disconnect();
  }, [target, root, rootMargin, threshold, onIntersect]);

  return [setTarget];
};

