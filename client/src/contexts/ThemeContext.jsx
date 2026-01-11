import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const themes = {
  sunset: {
    name: "sunset",
    displayColor: "#F7B2AD",
    cssVars: {
      "--color-background": "#fff2e2",
      "--color-foreground": "#3d3936",
      "--color-primary": "#ff5c5c",
      "--color-primary-text": "#ffffff",
      "--color-secondary": "#CECDFA",
      "--color-secondary-text": "#3d3936",
      "--color-secondary-hover": "#a9a8f2",
      "--color-secondary-hover-text": "#ffffff",
      "--color-border": "#CECDFA",
      "--color-card": "#FCFAF5",
      "--color-progress": "#CECDFA",
    },
  },

  midnight: {
    name: "midnight",
    displayColor: "#A8A2C8",
    cssVars: {
      "--color-background": "#0a0a0a",
      "--color-foreground": "#ffffff",
      "--color-primary": "#3C2A6E",
      "--color-primary-text": "#ffffff",
      "--color-secondary": "#2a2a2a",
      "--color-secondary-text": "#ffffff",
      "--color-secondary-hover": "#3a3a3a",
      "--color-secondary-hover-text": "#ffffff",
      "--color-border": "#333333",
      "--color-card": "#181818",
      "--color-progress": "#9E8DC0",
    },
  },

  matcha: {
    name: "matcha",
    displayColor: "#C9D8B6",
    cssVars: {
      "--color-background": "#f3f6f1",
      "--color-foreground": "#2f3d2e",
      "--color-primary": "#5fa573",
      "--color-primary-text": "#ffffff",
      "--color-secondary": "#d7e7d1",
      "--color-secondary-text": "#2f3d2e",
      "--color-secondary-hover": "#c6dbbe",
      "--color-secondary-hover-text": "#1f2a1f",
      "--color-border": "#b5c9b1",
      "--color-card": "#f9faf8",
      "--color-progress": "#6fc784",
    },
  },

  snow: {
    name: "snow",
    displayColor: "#BEE6F5",
    cssVars: {
      "--color-background": "#edf7fb",
      "--color-foreground": "#1b2c38",
      "--color-primary": "#4a90e2",
      "--color-primary-text": "#ffffff",
      "--color-secondary": "#D1E8FF",
      "--color-secondary-text": "#1b2c38",
      "--color-secondary-hover": "#bcdfff",
      "--color-secondary-hover-text": "#12212d",
      "--color-border": "#a0cfe0",
      "--color-card": "#f6fbfd",
      "--color-progress": "#5ab0ff",
    },
  },

  mono: {
    name: "mono",
    displayColor: "#D9D9D9",
    cssVars: {
      "--color-background": "#ffffff",
      "--color-foreground": "#0e0e0e",
      "--color-primary": "#2e2e2e",
      "--color-primary-text": "#ffffff",
      "--color-secondary": "#eaeaea",
      "--color-secondary-text": "#222222",
      "--color-secondary-hover": "#d6d6d6",
      "--color-secondary-hover-text": "#111111",
      "--color-border": "#d1d1d1",
      "--color-card": "#f9f9f9",
      "--color-progress": "#4e4e4e",
    },
  },

  periwinkle: {
    name: "periwinkle",
    displayColor: "#b3b5f4",
    cssVars: {
      "--color-background": "#f2edf0",
      "--color-foreground": "#2521ac",
      "--color-primary": "#0904e3",
      "--color-primary-text": "#FFFFFF",
      "--color-secondary": "#a4a2fa",
      "--color-secondary-text": "#241fa4",
      "--color-secondary-hover": "#8283C8",
      "--color-secondary-hover-text": "#FFFFFF",
      "--color-border": "#8F90D0",
      "--color-card": "#e8e3f0",
      "--color-progress": "#1C1BD1",
    },
  },

  bloom: {
    name: "bloom",
    displayColor: "#FF8FB7",
    cssVars: {
      "--color-background": "#F8F4EC",
      "--color-foreground": "#43334C",
      "--color-primary": "#E83C91",
      "--color-primary-text": "#ffffff",
      "--color-secondary": "#ffd4e5",
      "--color-secondary-text": "#43334C",
      "--color-secondary-hover": "#FF8FB7",
      "--color-secondary-hover-text": "#ffffff",
      "--color-border": "#f5c9db",
      "--color-card": "#fcf9f3",
      "--color-progress": "#E83C91",
    },
  },
};

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem("pomodoroTheme");
    return saved || "sunset";
  });

  useEffect(() => {
    localStorage.setItem("pomodoroTheme", currentTheme);

    // Apply CSS variables to root
    const root = document.documentElement;
    const themeVars = themes[currentTheme].cssVars;
    Object.entries(themeVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [currentTheme]);

  const theme = themes[currentTheme];

  return (
    <ThemeContext.Provider
      value={{ theme, currentTheme, setCurrentTheme, themes }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
