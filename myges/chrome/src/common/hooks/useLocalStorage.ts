import { useState, useEffect } from "react";

function getStorageValue<T>(key: string, defaultValue?: T) {
  const saved = localStorage.getItem(key);
  return !saved ? defaultValue : JSON.parse(saved);
}
export function useLocalStorage<T>(key: string, defaultValue?: T) {
  const [value, setValue] = useState<T>(() => {
    return getStorageValue<T>(key, defaultValue);
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}
