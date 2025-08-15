"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "padma-ui-theme", // selaras dg providers.tsx
}: ThemeProviderProps) {
  // ➜ Jangan akses localStorage saat initial render (SSR)
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  // Load preferensi dari localStorage setelah mount (client only)
  useEffect(() => {
    try {
      const stored = typeof window !== "undefined"
        ? (localStorage.getItem(storageKey) as Theme | null)
        : null;
      if (stored) setThemeState(stored);
    } catch {}
  }, [storageKey, defaultTheme]);

  // Terapkan kelas pada <html> saat theme berubah
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      root.classList.add(mql.matches ? "dark" : "light");

      const onChange = (e: MediaQueryListEvent) => {
        root.classList.remove("light", "dark");
        root.classList.add(e.matches ? "dark" : "light");
      };
      mql.addEventListener?.("change", onChange);
      return () => mql.removeEventListener?.("change", onChange);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const value: ThemeProviderState = {
    theme,
    setTheme: (t: Theme) => {
      try {
        if (typeof window !== "undefined") localStorage.setItem(storageKey, t);
      } catch {}
      setThemeState(t);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
