import { useState, useEffect, useCallback } from 'react';
import { Theme } from '../types';

export const useTheme = (): [Theme, (theme: Theme) => void] => {
  // Thème clair sobre par défaut
  const [theme, setThemeState] = useState<Theme>('light');

  const applyTheme = useCallback((selectedTheme: Theme) => {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark');

    if (selectedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = storedTheme || 'light';
    setThemeState(initialTheme);
    applyTheme(initialTheme);
  }, [applyTheme]);
  
  // Suppression du mode système (plus que light/dark)

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  return [theme, setTheme];
};