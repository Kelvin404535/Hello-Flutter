import { useState, useCallback } from 'react';

interface UseLocalStorageOptions<T> {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
}

export const useLocalStorage = <T,>(
  key: string,
  initialValue: T,
  options?: UseLocalStorageOptions<T>
) => {
  const serializer = options?.serializer || JSON.stringify;
  const deserializer = options?.deserializer || JSON.parse;

  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? deserializer(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
        setValue(valueToStore);
        localStorage.setItem(key, serializer(valueToStore));
      } catch (error) {
        console.error(`Error saving to localStorage (${key}):`, error);
      }
    },
    [key, value, serializer]
  );

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setValue(initialValue);
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
    }
  }, [key, initialValue]);

  return [value, setStoredValue, removeValue] as const;
};
