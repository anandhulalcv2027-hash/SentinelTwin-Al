// ─── Auth Schemas (match backend exactly) ────────────────────────────────────

/**
 * The backend forgot-password endpoint returns a plain string in development.
 * In production this will be replaced by an email send with no token in the body.
 * We model it as `string` to accommodate both cases.
 */
export type ForgotPasswordResponse = string;

/**
 * The backend reset-password endpoint returns a plain success string.
 */
export type ResetPasswordResponse = string;

export interface RegisterRequest {
  organization_name: string;
  organization_slug: string;
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  organization_id: string;
  is_active: boolean;
  email_verified: boolean;
  last_login: string | null;
  roles: string[];
}

// ─── Auth Context State ───────────────────────────────────────────────────────

export interface AuthContextValue {
  user: UserResponse | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
}
