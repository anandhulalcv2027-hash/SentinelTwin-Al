import { useEffect, useState, type ChangeEvent } from 'react';
import {
  applyTheme,
  getStoredTheme,
  getSystemTheme,
  type Theme,
} from '@/lib/theme';

export function PreferencesSettings() {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());

  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>(() =>
    getSystemTheme()
  );

  useEffect(() => {
    applyTheme(theme);

    if (theme !== 'system') {
      return;
    }

    const mediaQuery = window.matchMedia(
      '(prefers-color-scheme: light)'
    );

    const handleSystemThemeChange = () => {
      const nextTheme = mediaQuery.matches ? 'light' : 'dark';

      setSystemTheme(nextTheme);
      applyTheme('system');
    };

    setSystemTheme(mediaQuery.matches ? 'light' : 'dark');

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextTheme = event.target.value as Theme;

    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const currentAppearance =
    theme === 'system'
      ? `System (${systemTheme})`
      : theme === 'dark'
        ? 'Dark'
        : 'Light';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
    >
      <div>
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}
        >
          Preferences
        </h2>

        <p
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: '0.85rem',
          }}
        >
          Manage your personal dashboard layout and display settings.
        </p>
      </div>

      <div className="st-card">
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            marginBottom: '1rem',
            color: 'var(--color-text-primary)',
          }}
        >
          Appearance
        </h3>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxWidth: '340px',
          }}
        >
          <div>
            <label className="st-label" htmlFor="theme-select">
              Theme
            </label>

            <select
              id="theme-select"
              className="st-input"
              value={theme}
              onChange={handleThemeChange}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System Preference</option>
            </select>

            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                marginTop: '0.5rem',
                lineHeight: 1.5,
              }}
            >
              Current appearance: {currentAppearance}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}