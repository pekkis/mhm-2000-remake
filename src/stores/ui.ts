import { createStore } from "@xstate/store";

export type ThemePreference = "system" | "light" | "dark";

const THEME_STORAGE_KEY = "mhm97:theme";

const readStoredTheme = (): ThemePreference => {
  if (typeof window === "undefined") {
    return "system";
  }
  const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
  return raw === "light" || raw === "dark" || raw === "system" ? raw : "system";
};

const applyTheme = (theme: ThemePreference): void => {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.style.colorScheme =
    theme === "system" ? "light dark" : theme;
};

export type UiStoreContext = {
  menu: boolean;
  theme: ThemePreference;
};

export const uiStore = createStore({
  context: {
    menu: false as boolean,
    theme: readStoredTheme()
  },
  on: {
    toggleMenu: (context) => ({
      ...context,
      menu: !context.menu
    }),
    closeMenu: (context) => ({
      ...context,
      menu: false
    }),
    setTheme: (context, event: { theme: ThemePreference }) => ({
      ...context,
      theme: event.theme
    }),
    reset: (context) => ({
      menu: false,
      theme: context.theme
    })
  }
});

// Apply on boot, then keep DOM + storage in sync with store changes.
applyTheme(uiStore.getSnapshot().context.theme);

uiStore.subscribe((snapshot) => {
  const { theme } = snapshot.context;
  applyTheme(theme);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
});
