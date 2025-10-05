
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';

export type ThemeColors = {
  sidebarBg: string;
  contentBg: string;
  topbarBg: string;
};

interface ThemeContextType {
  colors: ThemeColors;
  setColors: (colors: ThemeColors) => void;
  isMounted: boolean;
}

const defaultColors: ThemeColors = {
    sidebarBg: "#111827",
    contentBg: "#f0f9ff",
    topbarBg: "#ffffff",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colors, setColorsState] = useState<ThemeColors>(defaultColors);
  const [isMounted, setIsMounted] = useState(false);
  const { laboratory, loading: authLoading } = useAuth();

  useEffect(() => {
    setIsMounted(true);
    // Load from localStorage first as a fallback/default
    const savedColors = localStorage.getItem("ui.colors");
    if (savedColors) {
        try {
            const parsedColors = JSON.parse(savedColors);
            setColorsState(parsedColors);
        } catch (e) { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    // Once auth is loaded and we have lab data, override with lab-specific theme
    if (isMounted && !authLoading && laboratory?.themeColors) {
        setColorsState(laboratory.themeColors);
        localStorage.setItem("ui.colors", JSON.stringify(laboratory.themeColors));
    } else if (isMounted && !authLoading && !laboratory) {
        // If user logs out or has no lab, reset to default
        setColorsState(defaultColors);
        localStorage.setItem("ui.colors", JSON.stringify(defaultColors));
    }
  }, [laboratory, authLoading, isMounted]);

  const setColors = (newColors: ThemeColors) => {
    setColorsState(newColors);
    localStorage.setItem("ui.colors", JSON.stringify(newColors));
    // Here you would also update the laboratory document in Firestore
  }

  useEffect(() => {
    if (isMounted) {
      document.documentElement.style.setProperty("--custom-sidebar-bg", colors.sidebarBg);
      document.documentElement.style.setProperty("--custom-content-bg", colors.contentBg);
      document.documentElement.style.setProperty("--custom-topbar-bg", colors.topbarBg);
    }
  }, [colors, isMounted]);
  
  const value = { colors, setColors, isMounted };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
