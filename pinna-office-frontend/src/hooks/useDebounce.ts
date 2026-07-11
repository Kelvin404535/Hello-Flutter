import { useEffect, useRef } from 'react';

export const useDebounce = <T,>(value: T, delay: number) => {
  const debouncedValue = useRef<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      debouncedValue.current = value;
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue.current;
};
