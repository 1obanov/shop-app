import { useEffect } from "react";

export const useLocalStorageSync = (key, data) => {
  useEffect(() => {
    if (data) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }, [key, data]);
};
