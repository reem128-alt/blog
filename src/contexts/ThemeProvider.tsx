import { useLocalStorage } from "@mantine/hooks";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useLayoutEffect,
} from "react";

const Context = createContext<{
  toggleTheme: () => void;
  theme: "dark" | "light" | null;
}>({
  toggleTheme: () => {},
  theme: null,
});

export const useThemeToggle = () => useContext(Context);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean | undefined>({
    key: "theme",
  });
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      document.documentElement.classList.toggle("dark", !prev);
      return !prev;
    });
  };
  useLayoutEffect(() => {
    const isDark = JSON.parse(localStorage.getItem("theme") ?? "null") as
      | boolean
      | null;
    const isPreferDarkTheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (isDark == null) {
      document.documentElement.classList.toggle("dark", isPreferDarkTheme);
      setIsDarkMode(isPreferDarkTheme);
    } else if (isDark) {
      document.documentElement.classList.toggle("dark", isDark);
      setIsDarkMode(isDark);
    }
  }, []);

  const theme = isDarkMode ? "dark" : "light";

  return (
    <Context.Provider value={{ theme, toggleTheme }}>
      {children}
    </Context.Provider>
  );
};
