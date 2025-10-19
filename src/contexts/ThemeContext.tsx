import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "sun" | "moon";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  brightness: number;
  setBrightness: (brightness: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("prathvios-theme");
    return (saved as Theme) || "sun";
  });
  
  const [brightness, setBrightness] = useState(() => {
    const saved = localStorage.getItem("prathvios-brightness");
    return saved ? parseInt(saved) : 100;
  });

  useEffect(() => {
    localStorage.setItem("prathvios-theme", theme);
    if (theme === "moon") {
      document.documentElement.classList.add("theme-moon");
    } else {
      document.documentElement.classList.remove("theme-moon");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("prathvios-brightness", brightness.toString());
    document.documentElement.style.filter = `brightness(${brightness}%)`;
  }, [brightness]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, brightness, setBrightness }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
