import api from '@/lib/api';
import type {
  RegisterRequest,
  TokenResponse,
  UserResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
} from '@/types/auth';

const AUTH_PREFIX = '/api/v1/auth';

export const authService = {
  /**
   * POST /api/v1/auth/login
   */
  async login(
    email: string,
    password: string,
  ): Promise<TokenResponse> {
    const params = new URLSearchParams();

    params.append('username', email);
    params.append('password', password);

    const { data } = await api.post<TokenResponse>(
      `${AUTH_PREFIX}/login`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return data;
  },

  /**
 * POST /api/v1/auth/google
 */
  async googleLogin(
    credential: string,
  ): Promise<TokenResponse> {
    const { data } = await api.post<TokenResponse>(
      `${AUTH_PREFIX}/google`,
      {
        credential,
      },
    );

    return data;
  },

  /**
   * POST /api/v1/auth/register
   */
  async register(
    payload: RegisterRequest,
  ): Promise<TokenResponse> {
    const { data } = await api.post<TokenResponse>(
      `${AUTH_PREFIX}/register`,
      payload,
    );

    return data;
  },

  /**
   * GET /api/v1/auth/me
   */
  async me(): Promise<UserResponse> {
    const { data } = await api.get<UserResponse>(
      `${AUTH_PREFIX}/me`,
    );

    return data;
  },

  /**
   * POST /api/v1/auth/refresh
   *
   * Exchanges a refresh token for a new access-token pair.
   */
  async refresh(
    refreshToken: string,
  ): Promise<TokenResponse> {
    const { data } = await api.post<TokenResponse>(
      `${AUTH_PREFIX}/refresh`,
      {
        refresh_token: refreshToken,
      },
    );

    return data;
  },

  /**
   * POST /api/v1/auth/logout
   *
   * Revokes the current refresh token on the backend.
   */
  async logout(
    refreshToken: string,
  ): Promise<void> {
    await api.post(
      `${AUTH_PREFIX}/logout`,
      {
        refresh_token: refreshToken,
      },
    );
  },

  /**
   * POST /api/v1/auth/forgot-password
   */
  async forgotPassword(
    email: string,
  ): Promise<ForgotPasswordResponse> {
    const { data } = await api.post<ForgotPasswordResponse>(
      `${AUTH_PREFIX}/forgot-password`,
      {
        email,
      },
    );

    return data;
  },

  /**
   * POST /api/v1/auth/reset-password
   */
  async resetPassword(
    token: string,
    new_password: string,
  ): Promise<ResetPasswordResponse> {
    const { data } = await api.post<ResetPasswordResponse>(
      `${AUTH_PREFIX}/reset-password`,
      {
        token,
        new_password,
      },
    );

    return data;
  },

  /**
 * POST /api/v1/auth/change-password
 */
  async changePassword(
    current_password: string,
    new_password: string,
  ): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>(
      `${AUTH_PREFIX}/change-password`,
      {
        current_password,
        new_password,
      },
    );

    return data;
  },
};