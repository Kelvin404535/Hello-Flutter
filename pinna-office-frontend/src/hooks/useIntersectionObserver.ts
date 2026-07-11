import { useEffect, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  margin?: string;
  once?: boolean;
}

export const useIntersectionObserver = (
  ref: React.RefObject<HTMLElement>,
  options?: UseIntersectionObserverOptions
) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (options?.once) {
          observer.unobserve(element);
        }
      } else if (!options?.once) {
        setIsVisible(false);
      }
    }, {
      threshold: options?.threshold || 0.1,
      rootMargin: options?.margin || '0px',
    });

    observer.observe(element);

    return () => observer.unobserve(element);
  }, [ref, options]);

  return isVisible;
};
