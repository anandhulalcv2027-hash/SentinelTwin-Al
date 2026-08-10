import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { tokenStore } from './tokenStore';
import { authService } from '@/services/authService';
import type { AuthContextValue, RegisterRequest, UserResponse } from '@/types/auth';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<UserResponse | null>(null);
  const [token, setToken]     = useState<string | null>(tokenStore.get());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // On first mount: if a token exists, validate it and load the user.
  useEffect(() => {
    const stored = tokenStore.get();
    if (!stored) {
      setIsLoading(false);
      return;
    }

    authService
      .me()
      .then((u) => {
        setUser(u);
        setToken(stored);
      })
      .catch(() => {
        // Token invalid or expired — clear it.
        tokenStore.clear();
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const resp = await authService.login(email, password);
    tokenStore.set(resp.access_token);
    setToken(resp.access_token);

    const me = await authService.me();
    setUser(me);
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    const resp = await authService.register(payload);
    tokenStore.set(resp.access_token);
    setToken(resp.access_token);

    const me = await authService.me();
    setUser(me);
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, isLoading, login, register, logout }),
    [user, token, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
