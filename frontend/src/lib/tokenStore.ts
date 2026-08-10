// Token storage — wraps localStorage so the rest of the codebase
// doesn't import localStorage keys directly.
const TOKEN_KEY = 'st_access_token';

export const tokenStore = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  set(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // storage may be unavailable (private mode, full quota)
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore
    }
  },
};
