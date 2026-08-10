import api from '@/lib/api';
import type { RegisterRequest, TokenResponse, UserResponse } from '@/types/auth';

const AUTH_PREFIX = '/api/v1/auth';

export const authService = {
  /**
   * POST /api/v1/auth/login
   * The backend uses OAuth2PasswordRequestForm, so the request must be
   * application/x-www-form-urlencoded with `username` containing the email.
   */
  async login(email: string, password: string): Promise<TokenResponse> {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    const { data } = await api.post<TokenResponse>(
      `${AUTH_PREFIX}/login`,
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
    return data;
  },

  /**
   * POST /api/v1/auth/register
   * Sends JSON. All seven fields are required.
   */
  async register(payload: RegisterRequest): Promise<TokenResponse> {
    const { data } = await api.post<TokenResponse>(
      `${AUTH_PREFIX}/register`,
      payload,
    );
    return data;
  },

  /**
   * GET /api/v1/auth/me
   * Returns the currently authenticated user.
   * Requires a valid Bearer token to already be in the client.
   */
  async me(): Promise<UserResponse> {
    const { data } = await api.get<UserResponse>(`${AUTH_PREFIX}/me`);
    return data;
  },
};
