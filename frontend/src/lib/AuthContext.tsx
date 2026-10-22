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

import type {
  AuthContextValue,
  RegisterRequest,
  UserResponse,
} from '@/types/auth';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);

  const [token, setToken] = useState<string | null>(
    tokenStore.getAccessToken(),
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore the existing session when the application starts.
  useEffect(() => {
    const accessToken = tokenStore.getAccessToken();
    const refreshToken = tokenStore.getRefreshToken();

    if (!accessToken || !refreshToken) {
      tokenStore.clear();
      setToken(null);
      setUser(null);
      setIsLoading(false);
      return;
    }

    authService
      .me()
      .then((currentUser) => {
        setUser(currentUser);
        setToken(accessToken);
      })
      .catch(async () => {
        // Access token may have expired.
        // Try refreshing the session before logging the user out.
        try {
          const refreshed = await authService.refresh(refreshToken);

          tokenStore.setTokens(
            refreshed.access_token,
            refreshed.refresh_token,
          );

          setToken(refreshed.access_token);

          const currentUser = await authService.me();
          setUser(currentUser);
        } catch {
          // Refresh token is also invalid/expired.
          tokenStore.clear();
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const resp = await authService.login(email, password);

      tokenStore.setTokens(
        resp.access_token,
        resp.refresh_token,
      );

      setToken(resp.access_token);

      const me = await authService.me();
      setUser(me);
    },
    [],
  );

  const register = useCallback(
    async (payload: RegisterRequest) => {
      const resp = await authService.register(payload);

      tokenStore.setTokens(
        resp.access_token,
        resp.refresh_token,
      );

      setToken(resp.access_token);

      const me = await authService.me();
      setUser(me);
    },
    [],
  );

  const googleLogin = useCallback(
    async (credential: string) => {
      const resp = await authService.googleLogin(credential);

      tokenStore.setTokens(
        resp.access_token,
        resp.refresh_token,
      );

      setToken(resp.access_token);

      const me = await authService.me();
      setUser(me);
    },
    [],
  );

  const logout = useCallback(async () => {
    const refreshToken = tokenStore.getRefreshToken();

    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch {
      // Even if the server logout fails,
      // clear the local session.
    } finally {
      tokenStore.clear();
      setToken(null);
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      login,
      register,
      googleLogin,
      logout,
    }),
    [
      user,
      token,
      isLoading,
      login,
      register,
      logout,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      'useAuth must be used inside <AuthProvider>',
    );
  }

  return ctx;
}
