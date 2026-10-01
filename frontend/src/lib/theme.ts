export type Theme = 'dark' | 'light' | 'system';

const THEME_STORAGE_KEY = 'sentineltwin-theme';

export function getStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);

  if (
    stored === 'dark' ||
    stored === 'light' ||
    stored === 'system'
  ) {
    return stored;
  }

  return 'dark';
}

export function getSystemTheme(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;

  localStorage.setItem(THEME_STORAGE_KEY, theme);

  if (theme === 'system') {
    const systemTheme = getSystemTheme();

    root.removeAttribute('data-theme');
    root.style.colorScheme = systemTheme;
    return;
  }

  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
}