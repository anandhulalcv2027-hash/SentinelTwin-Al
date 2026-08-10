// ─── Auth Schemas (match backend exactly) ────────────────────────────────────

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
}

// ─── Auth Context State ───────────────────────────────────────────────────────

export interface AuthContextValue {
  user: UserResponse | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
}
