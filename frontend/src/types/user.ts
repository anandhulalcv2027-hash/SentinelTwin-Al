export interface User {
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

export interface UserCreateRequest {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password?: string;
  role_id: string;
}

export interface UserUpdateRequest {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  is_active?: boolean | null;
  role_id?: string | null;
}

export interface UserListResponse {
  items: User[];
  total: number;
}
