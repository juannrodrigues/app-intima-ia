'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'dark' | 'light' | 'purple' | 'blue' | 'green';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themes = {
  dark: {
    '--bg-primary': '#0D0D0D',
    '--bg-secondary': '#1A1A1A',
    '--text-primary': '#FFFFFF',
    '--text-secondary': '#FFFFFF80',
    '--accent-primary': '#9B4DFF',
    '--accent-secondary': '#6A0DAD',
    '--border-color': '#FFFFFF10',
    '--card-bg': '#FFFFFF05',
  },
  light: {
    '--bg-primary': '#FFFFFF',
    '--bg-secondary': '#F8F9FA',
    '--text-primary': '#000000',
    '--text-secondary': '#666666',
    '--accent-primary': '#9B4DFF',
    '--accent-secondary': '#6A0DAD',
    '--border-color': '#E5E7EB',
    '--card-bg': '#FFFFFF',
  },
  purple: {
    '--bg-primary': '#1A0033',
    '--bg-secondary': '#2D1B4E',
    '--text-primary': '#FFFFFF',
    '--text-secondary': '#FFFFFF80',
    '--accent-primary': '#9B4DFF',
    '--accent-secondary': '#6A0DAD',
    '--border-color': '#9B4DFF40',
    '--card-bg': '#9B4DFF10',
  },
  blue: {
    '--bg-primary': '#001122',
    '--bg-secondary': '#002244',
    '--text-primary': '#FFFFFF',
    '--text-secondary': '#FFFFFF80',
    '--accent-primary': '#00D4FF',
    '--accent-secondary': '#0099CC',
    '--border-color': '#00D4FF40',
    '--card-bg': '#00D4FF10',
  },
  green: {
    '--bg-primary': '#001100',
    '--bg-secondary': '#002200',
    '--text-primary': '#FFFFFF',
    '--text-secondary': '#FFFFFF80',
    '--accent-primary': '#00FF88',
    '--accent-secondary': '#00CC66',
    '--border-color': '#00FF8840',
    '--card-bg': '#00FF8810',
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    // Carregar tema do localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && themes[savedTheme]) {
      setTheme(savedTheme);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);

    // Aplicar variáveis CSS
    const root = document.documentElement;
    const themeVars = themes[newTheme];

    Object.entries(themeVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  };

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}